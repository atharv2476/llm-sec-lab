# LLM Security Testing Framework

**Live demo (real AI, rate-limited):** https://llm-sec-lab-1.onrender.com (may take ~1 min to wake up)
**Playground (simulated):** https://claude.ai/artifact/C9mqgnZiUaV2VbpkqBZjff

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

## Results (openai/gpt-oss-20b via Groq, 10 payloads x 3 runs)

**Before defense:** 0 real `FLAG{` leaks, but 1 confirmed system-prompt leakage
(translation trick, LLM07) and 1 behavior hijack (roleplay, LLM01, no data leaked).

**After defense:** 0/10 leaked; benign control still answered normally.



![Before](before.jpg)




![After](after.jpg)



## Defense layers (`DEFENSE=on python app.py`)
1. Hardened system prompt
2. Input filter (regex)
3. Output filter (blocks secret/prompt fragments, incl. base64-decoded text)

## Limitations
- Regex filters are keyword-based and can be bypassed (other phrasing/languages).
- Detection is keyword-based; a Marathi reply can slip past it.
- Small payload set; LLM output is non-deterministic.

## Recommendations
- Never store secrets in the system prompt.
- Add a classifier (e.g. a prompt-guard model) and an LLM-as-judge for detection.
