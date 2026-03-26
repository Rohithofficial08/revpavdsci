import os
path = r'c:\mcpantigrav\ai-cyber-forensics\frontend\pages\analysis'
for name in os.listdir(path):
    print(f"Name: {name}, Bytes: {[ord(c) for c in name]}")
