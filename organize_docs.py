import os
import shutil

# Mapping of Old Dir -> Target New Dir (Primary guess)
# If a file exists in ANY New Dir, it is considered a duplicate and deleted.
# If it is unique, it is moved to the Primary Target.

MAPPING = {
    "docs/business": "docs/business-finance",
    "docs/technology": "docs/it-creative", # or manufacturing-engineering
    "docs/industry": "docs/construction-real-estate", # or manufacturing-engineering
    "docs/creative": "docs/it-creative",
    "docs/lifestyle": "docs/food-lifestyle",
    "docs/safety-environment": "docs/environment-safety",
    "docs/etc": "docs/others",
    # "docs/legal-accounting" seems to be a target itself, or is it old?
    # The user said "Legal/Accounting" categories should be kept separate.
    # In the file list, I see docs/legal-accounting/General/...
    # but also docs/business-finance has some legal stuff.
    # I will leave legal-accounting alone for now as it seems structured.
    # Same for medical-welfare.
}

ALL_NEW_DIRS = [
    "docs/business-finance",
    "docs/it-creative",
    "docs/manufacturing-engineering",
    "docs/construction-real-estate",
    "docs/food-lifestyle",
    "docs/environment-safety",
    "docs/others",
    "docs/legal-accounting",
    "docs/medical-welfare"
]

def is_duplicate(filename):
    for new_dir in ALL_NEW_DIRS:
        if os.path.exists(os.path.join(new_dir, filename)):
            return True
    return False

def process_directory(old_dir, primary_target):
    if not os.path.exists(old_dir):
        print(f"Directory not found: {old_dir}")
        return

    print(f"Processing {old_dir} -> {primary_target}")

    for root, dirs, files in os.walk(old_dir):
        for file in files:
            if not file.endswith(".md"):
                continue

            src_path = os.path.join(root, file)
            
            if is_duplicate(file):
                print(f"  Duplicate: {file} (Removing source)")
                os.remove(src_path)
            else:
                # Move to primary target
                dest_path = os.path.join(primary_target, file)
                if os.path.exists(dest_path):
                    print(f"  Collision in target: {file} (Removing source)")
                    os.remove(src_path)
                else:
                    print(f"  Unique: {file} -> Moving to {primary_target}")
                    if not os.path.exists(primary_target):
                        os.makedirs(primary_target)
                    shutil.move(src_path, dest_path)

    # Clean up empty directories
    for root, dirs, files in os.walk(old_dir, topdown=False):
        for name in dirs:
            try:
                os.rmdir(os.path.join(root, name))
            except OSError:
                pass
    try:
        os.rmdir(old_dir)
        print(f"Removed directory: {old_dir}")
    except OSError:
        print(f"Could not remove {old_dir} (not empty?)")

# Execute
process_directory("docs/business", "docs/business-finance")
process_directory("docs/creative", "docs/it-creative")
process_directory("docs/lifestyle", "docs/food-lifestyle")
process_directory("docs/safety-environment", "docs/environment-safety")
process_directory("docs/etc", "docs/others")

# Technology and Industry are trickier as they split.
# I will move unique technology files to it-creative by default, but some might be engineering.
# I'll check if they look like IT or Engineering.
# Actually, let's move technology to it-creative for now, as it-creative seems to hold most.
process_directory("docs/technology", "docs/it-creative")

# Industry -> Construction/Real Estate seems to match 56 files.
process_directory("docs/industry", "docs/construction-real-estate")

