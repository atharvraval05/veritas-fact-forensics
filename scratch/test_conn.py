try:
    import psycopg2
    print("psycopg2 is installed")
except ImportError:
    print("psycopg2 is NOT installed")

try:
    import pg8000
    print("pg8000 is installed")
except ImportError:
    print("pg8000 is NOT installed")
