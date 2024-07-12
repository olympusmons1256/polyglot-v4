import sys
import os
import subprocess
from claude_api import ask_claude, update_file, git_push

PROJECT_ROOT = '/workspaces/polyglot-v4'
GITHUB_REPO_URL = "https://github.com/olympusmons1256/polyglot-v4"

def read_file_content(file_path):
    full_path = os.path.join(PROJECT_ROOT, file_path)
    try:
        with open(full_path, 'r') as file:
            return file.read()
    except FileNotFoundError:
        return f"Error: File '{full_path}' not found."

def get_latest_commit_hash():
    try:
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=PROJECT_ROOT, capture_output=True, text=True)
        return result.stdout.strip()
    except Exception:
        return None

def get_file_structure():
    structure = []
    for root, dirs, files in os.walk(PROJECT_ROOT):
        level = root.replace(PROJECT_ROOT, '').count(os.sep)
        indent = ' ' * 4 * (level)
        structure.append(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            structure.append(f"{subindent}{f}")
    return '\n'.join(structure)

def get_current_path():
    return os.getcwd().replace(PROJECT_ROOT, '')

def claude_chat():
    print("Welcome to Claude Chat! Type 'exit' to end the conversation.")
    print("Use '!file <filepath>' to send file contents to Claude and get update suggestions.")
    print("Use '!update <filepath>' to get code suggestions for direct implementation.")
    print(f"Current project root: {PROJECT_ROOT}")
    conversation_history = []

    while True:
        current_path = get_current_path()
        print(f"\nCurrent location: {current_path}")
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            print("Goodbye!")
            sys.exit()
        
        latest_commit = get_latest_commit_hash()
        repo_link = f"{GITHUB_REPO_URL}/tree/{latest_commit}" if latest_commit else GITHUB_REPO_URL
        
        if user_input.startswith('!file '):
            file_path = user_input.split(' ', 1)[1]
            file_content = read_file_content(file_path)
            user_input = f"Here's the content of the file '{file_path}':\n\n{file_content}\n\nPlease suggest improvements or updates to this code."
        
        if user_input.startswith('!update '):
            implement = input("Do you want to implement these changes? (y/n): ").lower()
            if implement == 'y':
                code_start = response.find("```jsx") + 7  # Changed to jsx for React components
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
            
Please provide an updated version of this code with improvements or new features.
Format your response as follows:
1. Brief explanation of the changes or improvements.
2. The complete updated code wrapped in triple backticks and prefixed with the language (e.g., ```python).
3. A short commit message describing the changes.

Example format:
I've made the following improvements to the code:
1. Added error handling for network requests
2. Optimized the data processing function

Here's the updated code:

```python
# Updated code goes here