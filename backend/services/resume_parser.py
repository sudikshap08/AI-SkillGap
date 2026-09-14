import fitz

def extract_pdf_text(content: bytes) -> str:
    doc = fitz.open(stream=content, filetype="pdf")
    text = "\n".join(page.get_text() for page in doc).strip()
    doc.close()
    if not text:
        raise ValueError("No readable text found in the PDF.")
    return text
