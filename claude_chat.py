import sys
import os
import subprocess
from claude_api import ask_claude

PROJECT_ROOT = '/workspaces/polyglot-v4'
GITHUB_REPO_URL = "https://github.com/olympusmons1256/polyglot-v4"
API_KEY = os.getenv('CLAUDE_API_KEY')

def read_file_content(file_path):
    full_path = os.path.join(PROJECT_ROOT, file_path)
    try:
        with open(full_path, 'r') as file:
            return file.read()
    except FileNotFoundError:
        return f"Error: File '{full_path}' not found."

def write_file_content(file_path, content):
    full_path = os.path.join(PROJECT_ROOT, file_path)
    try:
        with open(full_path, 'w') as file:
            file.write(content)
        return f"File '{file_path}' has been updated successfully."
    except Exception as e:
        return f"Error updating file '{file_path}': {str(e)}"

def get_latest_commit_hash():
    try:
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=PROJECT_ROOT, capture_output=True, text=True)
        return result.stdout.strip()
    except Exception:
        return None

def claude_chat():
    print("Welcome to Claude Chat! Type 'exit' to end the conversation.")
    print("Use '!file <filepath>' to send file contents to Claude.")
    print("Use '!update <filepath>' to update a file with Claude's response.")
    print(f"Current project root: {PROJECT_ROOT}")
    conversation_history = []

    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() == 'exit':
            print("Goodbye!")
            sys.exit()
        
        latest_commit = get_latest_commit_hash()
        repo_link = f"{GITHUB_REPO_URL}/tree/{latest_commit}" if latest_commit else GITHUB_REPO_URL
        
        if user_input.startswith('!file '):
            file_path = user_input.split(' ', 1)[1]
            file_content = read_file_content(file_path)
            user_input = f"Here's the content of the file '{file_path}':\n\n{file_content}\n\nPlease analyze this code.\n\nLatest repo link: {repo_link}"
        elif user_input.startswith('!update '):
            file_path = user_input.split(' ', 1)[1]
            file_content = read_file_content(file_path)
            user_input = f"Here's the content of the file '{file_path}':\n\n{file_content}\n\nPlease provide an updated version of this code.\n\nLatest repo link: {repo_link}"
        else:
            user_input = f"{user_input}\n\nLatest repo link: {repo_link}"

        response = ask_claude(user_input, conversation_history)
        print(f"\nClaude: {response}")

        if user_input.startswith('!update '):
            update_confirmation = input("Do you want to update the file with Claude's response? (yes/no): ")
            if update_confirmation.lower() == 'yes':
                # Extract the code from Claude's response
                # This is a simple extraction and might need to be adjusted based on Claude's response format
                code_start = response.find("```") + 3
                code_end = response.rfind("```")
                if code_start != -1 and code_end != -1:
                    updated_code = response[code_start:code_end].strip()
                    update_result = write_file_content(file_path, updated_code)
                    print(update_result)
                else:
                    print("Couldn't extract code from Claude's response.")

        # Update conversation history
        conversation_history.append({"role": "user", "content": user_input})
        conversation_history.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    claude_chat()