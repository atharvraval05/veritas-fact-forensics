import os
from supabase import create_client

# Load env variables
env_path = ".env"
with open(env_path, "r") as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ[key.strip()] = val.strip()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

print(f"Connecting to: {url}")
try:
    client = create_client(url, key)
    print("Connection successful.")
    
    # Try querying global_news_feed table
    res = client.table("global_news_feed").select("*").limit(1).execute()
    print("global_news_feed table read success:", res.data)
except Exception as e:
    print("Error querying database:", e)
