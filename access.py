import os
import ollama

# Pin directory to sandbox the model
SAFE_BASE_DIR = os.path.abspath("./workspace")

def read_local_file(filepath: str) -> str:
    """Reads a file from the local workspace directory."""
    full_path = os.path.abspath(os.path.join(SAFE_BASE_DIR, filepath))
    
    # Security check: ensure path is still inside SAFE_BASE_DIR
    if not full_path.startswith(SAFE_BASE_DIR):
        return "Access denied: File is outside the allowed directory."
        
    try:
        with open(full_path, 'r') as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {e}"

def write_local_file(filepath: str, content: str) -> str:
    """Writes content to a file in the local workspace directory."""
    full_path = os.path.abspath(os.path.join(SAFE_BASE_DIR, filepath))
    
    if not full_path.startswith(SAFE_BASE_DIR):
        return "Access denied: Cannot write outside the allowed directory."
        
    try:
        with open(full_path, 'w') as file:
            file.write(content)
        return f"Successfully written to {filepath}"
    except Exception as e:
        return f"Error writing file: {e}"
