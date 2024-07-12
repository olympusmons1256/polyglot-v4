import requests
import os
import subprocess

API_KEY = os.getenv('CLAUDE_API_KEY')
API_URL = "https://api.anthropic.com/v1/messages"
PROJECT_ROOT = '/workspaces/polyglot-v4'

def ask_claude(prompt, conversation_history=[]):
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
    
    response = requests.post(API_URL, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json()['content'][0]['text']
    else:
        return f"Error: {response.status_code}, {response.text}"

def update_file(file_path, new_content):
    with open(file_path, 'w') as file:
        file.write(new_content)

def git_push(file_path, commit_message):
    try:
        print(f"Adding file: {file_path}")
        subprocess.run(['git', 'add', file_path], cwd=PROJECT_ROOT, check=True)
        print(f"Committing with message: {commit_message}")
        subprocess.run(['git', 'commit', '-m', commit_message], cwd=PROJECT_ROOT, check=True)
        print("Pushing changes")
        subprocess.run(['git', 'push'], cwd=PROJECT_ROOT, check=True)
        return "Changes pushed to repository successfully."
    except subprocess.CalledProcessError as e:
        return f"Error pushing to repository: {str(e)}"

if __name__ == "__main__":
    # Test the function
    print(ask_claude("Hello, Claude!"))