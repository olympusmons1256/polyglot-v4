import os
import json
import requests
import sqlite3
import numpy as np
from scipy.sparse import vstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
from typing import List, Dict, Tuple
import subprocess
import re

# Constants
API_KEY = os.getenv('CLAUDE_API_KEY')
API_URL = "https://api.anthropic.com/v1/messages"
GITHUB_REPO_URL = "https://github.com/olympusmons1256/polyglot-v4"
DB_PATH = "conversation_notebook.db"
CONTEXT_CHECK_INTERVAL = 3  # Number of turns before reminding Claude to check history

class ProjectContext:
    def __init__(self, project_name):
        self.project_name = project_name
        self.history_file = f"{project_name}_history.json"
        self.history = self.load_history()
        self.connected_projects = set()

    def load_history(self):
        try:
            with open(self.history_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def save_history(self):
        with open(self.history_file, 'w') as f:
            json.dump(self.history, f)

    def add_entry(self, entry):
        self.history.append(entry)
        self.save_history()

    def connect_project(self, other_project):
        self.connected_projects.add(other_project)

    def get_relevant_history(self, query, n=5):
        # TODO: Implement more sophisticated relevance scoring
        return self.history[-n:]

class VectorNotebook:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.cursor = self.conn.cursor()
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS entries
                              (id INTEGER PRIMARY KEY, timestamp TEXT, content TEXT, tags TEXT, vector BLOB)''')
        self.vectorizer = TfidfVectorizer()
        self.vectors = None
        self.load_vectors()

    def load_vectors(self):
        self.cursor.execute("SELECT content FROM entries")
        contents = [row[0] for row in self.cursor.fetchall()]
        if contents:
            self.vectors = self.vectorizer.fit_transform(contents)
        else:
            self.vectors = None

    def add_entry(self, content: str, tags: List[str]):
        timestamp = datetime.now().isoformat()
        if self.vectors is None:
            self.vectors = self.vectorizer.fit_transform([content])
        else:
            new_vector = self.vectorizer.transform([content])
            self.vectors = vstack([self.vectors, new_vector])
        
        vector = self.vectors[-1].toarray()[0]
        tags_str = ",".join(tags)
        self.cursor.execute("INSERT INTO entries (timestamp, content, tags, vector) VALUES (?, ?, ?, ?)",
                            (timestamp, content, tags_str, vector.tobytes()))
        self.conn.commit()

    def get_relevant_entries(self, query: str, n: int = 5) -> List[Dict]:
        if self.vectors is None or self.vectors.shape[0] == 0:
            return []
        query_vector = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vector, self.vectors)[0]
        top_indices = similarities.argsort()[-n:][::-1]
        
        relevant_entries = []
        for index in top_indices:
            self.cursor.execute("SELECT id, timestamp, content, tags FROM entries LIMIT 1 OFFSET ?", (int(index),))
            entry = self.cursor.fetchone()
            if entry:
                relevant_entries.append({
                    "id": entry[0],
                    "timestamp": entry[1],
                    "content": entry[2],
                    "tags": entry[3].split(","),
                    "similarity": similarities[index]
                })
        return relevant_entries

    def close(self):
        self.conn.close()

def generate_instruction(project_context: ProjectContext, user_input: str) -> str:
    relevant_history = project_context.get_relevant_history(user_input)
    instruction = f"Refer to the project at {GITHUB_REPO_URL}. "
    instruction += "Based on the following context and the current query, provide assistance:\n\n"
    for entry in relevant_history:
        instruction += f"Previous interaction:\n"
        instruction += f"User: {entry['user']}\n"
        instruction += f"Claude: {entry['claude']}\n\n"
    instruction += f"Current query: {user_input}\n"
    instruction += "\nIf you suggest code changes, please format your response as follows:\n"
    instruction += "1. Explain the changes.\n"
    instruction += "2. Specify the file path like this: File: `path/to/file.ext`\n"
    instruction += "3. Provide the complete updated code wrapped in triple backticks.\n"
    return instruction

def ask_claude(prompt: str, conversation_history: List[Dict[str, str]] = []) -> str:
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
    
    try:
        response = requests.post(API_URL, json=data, headers=headers)
        response.raise_for_status()
        return response.json()['content'][0]['text']
    except requests.RequestException as e:
        return f"Error: {e}"

def get_multi_line_input() -> str:
    print("Enter your message (type '###' on a new line to finish):")
    lines = []
    while True:
        line = input()
        if line.strip() == '###':
            break
        lines.append(line)
    return '\n'.join(lines)

def git_push(file_path: str, commit_message: str) -> str:
    try:
        subprocess.run(['git', 'add', file_path], check=True)
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        subprocess.run(['git', 'push'], check=True)
        return "Changes pushed to repository successfully."
    except subprocess.CalledProcessError as e:
        return f"Error pushing to repository: {str(e)}"

def update_file(file_path: str, new_content: str) -> None:
    # Ensure the directory exists
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

    try:
        with open(file_path, 'w') as file:
            file.write(new_content)
        print(f"File updated successfully: {file_path}")
    except IOError as e:
        print(f"Error writing to file: {e}")

def extract_code_and_file_path(response: str) -> List[Tuple[str, str]]:
    # Multiple code block patterns
    code_block_patterns = [
        r"```[\w]*\n([\s\S]*?)```",  # Standard markdown
        r"~~~[\w]*\n([\s\S]*?)~~~",  # Alternative markdown
        r"<code>([\s\S]*?)</code>"   # HTML code tags
    ]
    
    # Expanded file path patterns
    file_path_patterns = [
        r"File:?\s*[`\"'](.*?)[`\"']",
        r"File path:?\s*[`\"'](.*?)[`\"']",
        r"In\s+file\s+[`\"'](.*?)[`\"']",
        r"Update\s+[`\"'](.*?)[`\"']",
        r"Modify\s+[`\"'](.*?)[`\"']"
    ]
    
    code_blocks = []
    for pattern in code_block_patterns:
        code_blocks.extend(re.findall(pattern, response))
    
    file_paths = []
    for pattern in file_path_patterns:
        file_paths.extend(re.findall(pattern, response))
    
    # Contextual code extraction (fallback)
    if not code_blocks:
        potential_code = re.findall(r"((?:^|\n)[\w\s]+\([^)]*\)\s*{[^}]*})", response)
        code_blocks.extend(potential_code)
    
    # Combine code blocks and file paths
    results = []
    for i, code in enumerate(code_blocks):
        file_path = file_paths[i] if i < len(file_paths) else None
        results.append((code.strip(), file_path))
    
    print("Debugging extract_code_and_file_path:")
    print(f"Code blocks found: {len(code_blocks)}")
    print(f"File paths found: {len(file_paths)}")
    
    return results

def claude_chat():
    print("Enter project name:")
    project_name = input().strip()
    project_context = ProjectContext(project_name)
    
    print(f"Welcome to Claude Chat for project: {project_name}")
    print("Type 'exit' to end the conversation.")
    print("Type 'connect <project_name>' to connect to another project's context.")
    print("To input multi-line messages or code blocks, use '###' on a new line to finish your input.")
    
    turn_counter = 0
    while True:
        user_input = get_multi_line_input()
        
        if user_input.lower().strip() == 'exit':
            print("Goodbye!")
            return
        
        if user_input.lower().startswith('connect '):
            other_project = user_input.split(maxsplit=1)[1]
            project_context.connect_project(other_project)
            print(f"Connected to project: {other_project}")
            continue
        
        instruction = generate_instruction(project_context, user_input)
        
        if turn_counter % CONTEXT_CHECK_INTERVAL == 0:
            instruction += "\nReminder: Please check the provided conversation history for relevant context before responding."
        
        response = ask_claude(instruction)
        print(f"\nClaude: {response}")
        
        project_context.add_entry({"user": user_input, "claude": response})
        
        # Check if the response contains code rewrite suggestions
        code_file_pairs = extract_code_and_file_path(response)
        if code_file_pairs:
            for code, file_path in code_file_pairs:
                print("\n" + "="*50)
                print("Code change detected!")
                if file_path:
                    print(f"File: {file_path}")
                else:
                    print("File path not detected. Please provide the file path:")
                    file_path = input().strip()
                print("Suggested code:")
                print(code)
                print("="*50)
                
                user_choice = input("\nDo you want to apply these changes? (y/n): ").lower()
                if user_choice == 'y':
                    try:
                        update_file(file_path, code)
                        print(f"Changes applied to {file_path}")
                        
                        push_choice = input("Do you want to push these changes to git? (y/n): ").lower()
                        if push_choice == 'y':
                            commit_message = input("Enter commit message: ")
                            result = git_push(file_path, commit_message)
                            print(result)
                        else:
                            print("Changes applied locally but not pushed to git.")
                    except Exception as e:
                        print(f"Error applying changes: {e}")
                        print("Changes were not applied.")
                else:
                    print("Changes not applied.")
        else:
            print("\nNo code changes detected in Claude's response.")

        
        turn_counter += 1

if __name__ == "__main__":
    claude_chat()