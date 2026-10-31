# LLM Security Testing Framework

An intentionally vulnerable Flask chatbot plus a Python scanner that tests it for
OWASP LLM Top 10 issues (prompt injection, system prompt leakage, sensitive info disclosure).
Output: JSON + HTML report.

> For learning only. Run locally; test only systems you own or are authorized to test.

## Usage
    pip install -r requirements.txt
    python app.py        # terminal 1
    python scanner.py    # terminal 2
    python -m http.server 8000   # view report.html at 127.0.0.1:8000

## Roadmap
- [x] Vulnerable chatbot (mock LLM)
- [x] Payload-driven scanner + HTML report
- [ ] Real LLM integration
- [ ] More OWASP LLM categories
