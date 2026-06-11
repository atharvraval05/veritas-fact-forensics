import os
import urllib.request
import zipfile
import sys

NODE_URL = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip"
ZIP_PATH = "node.zip"
EXTRACT_DIR = "node"

def download_node():
    print(f"Downloading Node.js from {NODE_URL}...")
    try:
        urllib.request.urlretrieve(NODE_URL, ZIP_PATH)
        print("Download complete.")
    except Exception as e:
        print(f"Failed to download: {e}")
        sys.exit(1)

def extract_node():
    print(f"Extracting Node.js to {EXTRACT_DIR}...")
    try:
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(EXTRACT_DIR)
        print("Extraction complete.")
    except Exception as e:
        print(f"Failed to extract: {e}")
        sys.exit(1)

def cleanup():
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
        print("Cleaned up zip file.")

if __name__ == "__main__":
    download_node()
    extract_node()
    cleanup()
    print("Node.js portable setup successfully completed.")
