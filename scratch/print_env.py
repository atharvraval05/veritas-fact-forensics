import os
for k, v in os.environ.items():
    if "SUPABASE" in k or "DATABASE" in k or "KEY" in k or "PASS" in k:
        print(f"{k} = {v}")
