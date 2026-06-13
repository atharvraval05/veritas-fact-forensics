import os
import sys

def setup_database():
    print("=" * 60)
    print(" SUPABASE DATABASE TABLE INITIALIZATION FOR VERITAS")
    print("=" * 60)
    
    # Load env variables
    env_path = ".env"
    supabase_url = None
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    if key.strip() == "NEXT_PUBLIC_SUPABASE_URL":
                        supabase_url = val.strip()
    
    if not supabase_url:
        print("[Error] NEXT_PUBLIC_SUPABASE_URL not found in .env file.")
        sys.exit(1)
        
    # Extract project ID
    # e.g., https://mlkiekyfofrtzaikjkdn.supabase.co -> mlkiekyfofrtzaikjkdn
    project_id = supabase_url.replace("https://", "").split(".")[0]
    db_host = f"db.{project_id}.supabase.co"
    
    print(f"Database Host: {db_host}")
    print("Database Name: postgres")
    print("Database User: postgres")
    print("-" * 60)
    
    password = input("Enter your Supabase Database Password (from your project settings): ").strip()
    if not password:
        print("[Error] Password cannot be empty.")
        sys.exit(1)
        
    try:
        import psycopg2
    except ImportError:
        print("\n[Notice] psycopg2 library is not installed. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
        import psycopg2

    print("\nConnecting to Supabase Database...")
    try:
        conn = psycopg2.connect(
            host=db_host,
            database="postgres",
            user="postgres",
            password=password,
            port="5432"
        )
        cursor = conn.cursor()
        
        # Read schema.sql
        schema_path = "schema.sql"
        if not os.path.exists(schema_path):
            print(f"[Error] {schema_path} file not found.")
            sys.exit(1)
            
        print(f"Reading {schema_path}...")
        with open(schema_path, "r", encoding="utf-8") as f:
            sql_script = f.read()
            
        print("Executing SQL Schema setup...")
        cursor.execute(sql_script)
        conn.commit()
        
        print("\n[Success] All tables and seed data have been initialized successfully on your Supabase project!")
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n[Error] Failed to connect or execute SQL: {e}")
        print("Make sure your database password is correct and your local IP is allowed in Supabase network settings.")

if __name__ == "__main__":
    setup_database()
