import os

root = 'd:\\youph\\Wiki\\shikaku-wiki\\docs'
with open('dirs.txt', 'w', encoding='utf-8') as f:
    for top in os.listdir(root):
        top_path = os.path.join(root, top)
        if os.path.isdir(top_path):
            f.write(f"[{top}]\n")
            for sub in os.listdir(top_path):
                if os.path.isdir(os.path.join(top_path, sub)):
                    f.write(f"{sub}\n")
            f.write("\n")
