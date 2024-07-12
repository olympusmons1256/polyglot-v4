import requests
import os

API_KEY = os.environ.get('CLAUDE_API_KEY')
API_URL = "https://api.anthropic.com/v1/messages"

headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01"
}

def ask_claude(prompt, conversation_history=[]):
    data = {
        "model": "claude-3-opus-20240229",
        "max_tokens": 1000,
        "messages": conversation_history + [{"role": "user", "content": prompt}]
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()['content'][0]['text']
    else:
        return f"Error: {response.status_code}, {response.text}"

# Test the API connection
if __name__ == "__main__":
    test_prompt = "Hello Claude, can you hear me?"
    response = ask_claude(test_prompt)
    print(f"Claude's response: {response}")