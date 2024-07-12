import requests
import os
import subprocess
import sys
from typing import List, Dict, Optional

API_KEY = os.getenv('CLAUDE_API_KEY')
API_URL = "https://api.anthropic.com/v1/messages"
PROJECT_ROOT = '/workspaces/polyglot-v4'
GITHUB_REPO_URL = "https://github.com/yourusername/polyglot-v4"  # Replace with your actual GitHub repo URL

def ask_claude(prompt: str, conversation_history: List[Dict[str, str]] = []) -> str:
    if not API_KEY:
        raise ValueError("CLAUDE_API_KEY environment variable is not set")
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
    }
    
    data = {
        "model": "claude-3-sonnet-20240229",
        "max_tokens": 4096,
        "messages": conversation_history + [{"role": "user", "content": prompt}]
    }
    
    print(f"Request payload: {data}")  # Debug print
    
    try:
        response = requests.post(API_URL, json=data, headers=headers)
        response.raise_for_status()
        return response.json()['content'][0]['text']
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response status code: {e.response.status_code}")
            print(f"Response text: {e.response.text}")
        return f"Error: {e}"

def update_file(file_path: str, new_content: str) -> None:
    try:
        with open(file_path, 'w') as file:
            file.write(new_content)
    except IOError as e:
        print(f"Error writing to file: {e}")

def git_push(file_path: str, commit_message: str) -> str:
    try:
        print(f"Adding file: {file_path}")
        subprocess.run(['git', 'add', file_path], cwd=PROJECT_ROOT, check=True, capture_output=True, text=True)
        print(f"Committing with message: {commit_message}")
        subprocess.run(['git', 'commit', '-m', commit_message], cwd=PROJECT_ROOT, check=True, capture_output=True, text=True)
        print("Pushing changes")
        subprocess.run(['git', 'push'], cwd=PROJECT_ROOT, check=True, capture_output=True, text=True)
        return "Changes pushed to repository successfully."
    except subprocess.CalledProcessError as e:
        return f"Error pushing to repository: {e.stderr}"

def get_current_path() -> str:
    return os.getcwd()

def get_latest_commit_hash() -> Optional[str]:
    try:
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=PROJECT_ROOT, check=True, capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None

def get_file_structure(path: str = PROJECT_ROOT) -> str:
    structure = []
    for root, dirs, files in os.walk(path):
        level = root.replace(path, '').count(os.sep)
        indent = ' ' * 4 * level
        structure.append(f"{indent}{os.path.basename(root)}/")
        sub_indent = ' ' * 4 * (level + 1)
        for file in files:
            structure.append(f"{sub_indent}{file}")
    return '\n'.join(structure)

def read_file_content(file_path: str) -> str:
    try:
        with open(os.path.join(PROJECT_ROOT, file_path), 'r') as file:
            return file.read()
    except IOError as e:
        return f"Error reading file: {e}"

def claude_chat():
    print("Welcome to Claude Chat! Type 'exit' to end the conversation.")
    print("Use '!file <filepath>' to send file contents to Claude and get update suggestions.")
    print("Use '!update <filepath>' to get code suggestions for direct implementation.")
    print(f"Current project root: {PROJECT_ROOT}")
    
    conversation_history: List[Dict[str, str]] = []
    
    while True:
        try:
            current_path = get_current_path()
            print(f"\nCurrent location: {current_path}")
            user_input = input("You: ")
            
            if user_input.lower() == 'exit':
                print("Goodbye!")
                return
            
            latest_commit = get_latest_commit_hash()
            repo_link = f"{GITHUB_REPO_URL}/tree/{latest_commit}" if latest_commit else GITHUB_REPO_URL
            
            if user_input.startswith('!file ') or user_input.startswith('!update '):
                file_path = user_input.split(' ', 1)[1]
                file_content = read_file_content(file_path)
                if "Error reading file" in file_content:
                    print(file_content)
                    continue
                
                if user_input.startswith('!file '):
                    user_input = f"Here's the content of the file '{file_path}':\n\n{file_content}\n\nPlease suggest improvements or updates to this code."
                else:
                    user_input = f"""Here's the content of the file '{file_path}':\n\n{file_content}\n\n
Please provide an updated version of this code with improvements or new features.
Format your response as follows:
1. Brief explanation of the changes or improvements.
2. The complete updated code wrapped in triple backticks and prefixed with the language (e.g., ```python).
3. On a new line after the closing triple backticks, provide a short commit message prefixed with 'Commit message:'.
Example format:
I've made the following improvements to the code:
1. Added error handling for network requests
2. Optimized the data processing function
Here's the updated code:
```python
# Updated code goes here
Commit message: Add error handling and optimize data processing"""

            file_structure = get_file_structure()
            user_input += f"\n\nProject structure:\n{file_structure}\n\nCurrent location: {current_path}\n\nLatest repo link: {repo_link}\n\nPlease ensure your response is based on the actual content and structure of the project. If you're unsure about any details, please state so explicitly."
            
            response = ask_claude(user_input, conversation_history)
            print(f"\nClaude: {response}")
            
            if user_input.startswith('!update '):
                implement = input("Do you want to implement these changes? (y/n): ").lower()
                if implement == 'y':
                    code_start = response.find("```") + 3
                    code_end = response.rfind("```")
                    if code_start != -1 and code_end != -1:
                        new_code = response[code_start:code_end].strip()
                        print(f"Updating file: {file_path}")
                        update_file(os.path.join(PROJECT_ROOT, file_path), new_code)
                        
                        commit_message_start = response.rfind("Commit message:") + 16
                        commit_message = response[commit_message_start:].strip()
                        print(f"Extracted commit message: {commit_message}")
                        
                        push_result = git_push(file_path, commit_message)
                        print(push_result)
                    else:
                        print("Couldn't extract code from Claude's response.")
            
            conversation_history.append({"role": "user", "content": user_input})
            conversation_history.append({"role": "assistant", "content": response})
        
        except KeyboardInterrupt:
            print("\nExiting due to keyboard interrupt.")
            return
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    claude_chat()