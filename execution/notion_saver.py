
import os
import sys
import json
import requests
import re

# Since we don't have a package manager command here, we assume requests is available 
# or we use standard library urllib if we want to be super safe, but requests is standard enough in AI envs.
# If requests fails, we will self-anneal.

NOTION_VERSION = "2022-06-28"

def load_env():
    """Simple .env loader"""
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

def get_headers(api_key):
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION
    }

def search_files(api_key):
    url = "https://api.notion.com/v1/search"
    payload = {
        "filter": {
            "value": "page",
            "property": "object"
        },
        "sort": {
            "direction": "descending",
            "timestamp": "last_edited_time"
        }
    }
    response = requests.post(url, json=payload, headers=get_headers(api_key))
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print(f"Error searching: {response.status_code} {response.text}")
        return []

def markdown_to_blocks(markdown_text):
    """
    Very basic Markdown to Notion Blocks converter.
    Handles Headers, Code Blocks, and Bullets.
    """
    blocks = []
    lines = markdown_text.split('\n')
    
    current_code_block = None
    code_language = "plain text"

    for line in lines:
        stripped = line.strip()
        
        # Code Block Start/End
        if line.strip().startswith('```'):
            if current_code_block is not None:
                # End of code block
                blocks.append({
                    "object": "block",
                    "type": "code",
                    "code": {
                        "rich_text": [{"type": "text", "text": {"content": current_code_block}}],
                        "language": code_language
                    }
                })
                current_code_block = None
                code_language = "plain text"
            else:
                # Start of code block
                lang = line.strip().replace('```', '')
                if lang: code_language = lang
                current_code_block = ""
            continue

        if current_code_block is not None:
            current_code_block += line + "\n"
            continue

        # Headers
        if stripped.startswith('# '):
            blocks.append({
                "object": "block",
                "type": "heading_1",
                "heading_1": {"rich_text": [{"type": "text", "text": {"content": stripped[2:]}}]}
            })
        elif stripped.startswith('## '):
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"type": "text", "text": {"content": stripped[3:]}}]}
            })
        elif stripped.startswith('### '):
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": [{"type": "text", "text": {"content": stripped[4:]}}]}
            })
        # Bullets
        elif stripped.startswith('- ') or stripped.startswith('* '):
             blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {"rich_text": [{"type": "text", "text": {"content": stripped[2:]}}]}
            })
        # Empty lines
        elif stripped == "":
            continue
        # Paragraph
        else:
             blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"type": "text", "text": {"content": line}}]}
            })
            
    return blocks

def create_page(api_key, parent_id, title, markdown_content):
    url = "https://api.notion.com/v1/pages"
    
    blocks = markdown_to_blocks(markdown_content)
    
    # Max block limit per request is 100, we might need to paginate if file is huge, 
    # but for now let's assume it fits or simple truncation.
    # The file is small enough.
    
    payload = {
        "parent": {"page_id": parent_id},
        "properties": {
            "title": {
                "title": [
                    {
                        "text": {
                            "content": title
                        }
                    }
                ]
            }
        },
        "children": blocks[:100] # Safe limit
    }
    
    response = requests.post(url, json=payload, headers=get_headers(api_key))
    if response.status_code == 200:
        print("Success! Page created.")
        print(response.json()['url'])
    else:
        print(f"Error creating page: {response.status_code} {response.text}")

if __name__ == "__main__":
    load_env()
    api_key = os.environ.get("NOTION_API_KEY")
    if not api_key:
        print("Please set NOTION_API_KEY environment variable.")
        sys.exit(1)

    command = sys.argv[1] if len(sys.argv) > 1 else "search"
    
    if command == "search":
        print("Searching for accessible pages...")
        results = search_files(api_key)
        if not results:
            print("No accessible pages found. Please add the integration to a page.")
        else:
            print(f"Found {len(results)} pages:")
            for page in results[:5]: # Show top 5
                title = "Untitled"
                # Try to find title in properties
                props = page.get('properties', {})
                for key, val in props.items():
                    if val['id'] == 'title':
                        if val['title']:
                            title = val['title'][0]['plain_text']
                print(f"- [{title}] (ID: {page['id']})")
                
    elif command == "save":
        if len(sys.argv) < 4:
            print("Usage: python notion_saver.py save <parent_page_id> <file_path>")
            sys.exit(1)
        
        parent_id = sys.argv[2]
        file_path = sys.argv[3]
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        create_page(api_key, parent_id, "AI Agent Architecture", content)
