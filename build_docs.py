import json
import os
import argparse
from itertools import islice
import cutlet

# Initialize cutlet with the unidic-lite dictionary
katsu = cutlet.Cutlet()

def build_docs(start_line, end_line):
    """
    Processes a batch of certifications from the certifications.jsonl file
    to build the documentation. It reads each line within the specified range,
    creates categorized directories using ASCII slugs, and generates a
    markdown file for each certification.
    """
    with open('notes/certifications.jsonl', 'r', encoding='utf-8') as f:
        for line in islice(f, start_line, end_line):
            try:
                cert = json.loads(line)

                # Generate URL-safe slugs for categories
                category_slugs = [katsu.slug(part) for part in cert['category'].split('/')]
                main_category = category_slugs[0]
                sub_category = category_slugs[1] if len(category_slugs) > 1 else 'general'

                # Clean and slugify the exam name for the filename
                exam_name_slug = katsu.slug(cert['exam'].replace('（', '_').replace('）', '').replace('/', '_').replace(' ', '_'))

                # Create the directory path
                dir_path = os.path.join('docs', main_category, sub_category)
                os.makedirs(dir_path, exist_ok=True)

                # Define the full file path for the markdown file
                file_path = os.path.join(dir_path, f"{exam_name_slug}.md")

                # Prepare the content for the markdown file
                content = f"""---
title: "{cert['exam']}"
---

# {cert['exam']}

## 概要

{cert['tweet']}

## 公式情報

- [公式サイト]({cert['official_url']})

## ハッシュタグ

- {cert['hashtags']}
"""
                # Write the content to the markdown file
                with open(file_path, 'w', encoding='utf-8') as md_file:
                    md_file.write(content)

            except json.JSONDecodeError:
                print(f"Skipping invalid JSON line: {line.strip()}")
            except KeyError:
                print(f"Skipping line with missing data: {line.strip()}")
            except Exception as e:
                print(f"An unexpected error occurred with line: {line.strip()}: {e}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Build certification docs in batches.")
    parser.add_argument("start_line", type=int, help="Starting line number (0-indexed).")
    parser.add_argument("end_line", type=int, help="Ending line number (exclusive).")
    args = parser.parse_args()
    build_docs(args.start_line, args.end_line)
