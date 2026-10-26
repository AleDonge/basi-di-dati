"""Read-only inventory. Requires pypdf; never extracts Book.pdf text.

Writes a review report only; it does not promote or overwrite the content manifest.
"""
import hashlib
import json
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]

def inventory():
    result = []
    for path in sorted((ROOT / 'source-material').glob('*')):
        if not path.is_file():
            continue
        data = path.read_bytes()
        row = {'file': path.name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
        if path.suffix.lower() == '.pdf':
            reader = PdfReader(path)
            row['pages'] = len(reader.pages)
            if path.name != 'Book.pdf':
                row['firstPageSample'] = (reader.pages[0].extract_text() or '')[:600]
        else:
            row['lines'] = len(data.decode('utf-8-sig').splitlines())
        result.append(row)
    return result

if __name__ == '__main__':
    rows = inventory()
    output = ROOT / 'docs/source-audit.json'
    output.parent.mkdir(exist_ok=True)
    output.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(rows, ensure_ascii=False, indent=2))
