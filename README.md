# LLM Security Testing Framework

**Live demo (real AI, rate-limited):** https://llm-sec-lab-1.onrender.com (may take ~1 min to wake up)
**Live stats dashboard:** https://llm-sec-lab-1.onrender.com/stats (password-protected; shows attempt counts, defense on/off split, blocked/leaked — resets on redeploy or sleep)


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
- [x] Real LLM integration (Groq, with model fallback)
- [x] OWASP LLM Top 10 mapping (10 payloads; not full coverage of every category)

## Results (openai/gpt-oss-20b via Groq, 10 payloads x 3 runs)

**Before defense:** 0 real `FLAG{` leaks, but 1 confirmed system-prompt leakage
(translation trick, LLM07) and 1 behavior hijack (roleplay, LLM01, no data leaked).

**After defense:** 0/10 leaked; benign control still answered normally.










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

## Detection: keyword vs LLM-as-judge (`scanner_judge.py`)
Keyword matching can flag fake data and miss paraphrases, so every reply is also scored by a judge model
(LEAKED / PARTIAL / COMPLIED / REFUSED / OK + one-line reason). Obvious cases use fixed rules first
(`FLAG{` = LEAKED, short refusal = REFUSED).

- 10 payloads x 3 runs: keyword and judge agree on **29/30 runs (96%)**.
- The one disagreement was a keyword false positive: a made-up config containing "acme" was flagged PARTIAL, the judge correctly said COMPLIED.
- Judge verdict: 0/10 payloads leaked the secret in this run. An earlier scan saw 1 of 3 runs leak the system prompt structure via the translation trick, so results vary between runs.
- Caveat: most runs were easy cases where both methods are rule-based, and the judge is the same model family it is judging. Grey cases need human review.
- Building the judge took iterations: my first prompt scored 3/5 on a hand-labelled sample set (it mislabelled refusals and greetings); after fixing the prompt it reached 4/5, and the remaining difference is a real grey area.
