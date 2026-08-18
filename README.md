# ⚖️ LegalMitra — AI-Powered Legal Assistant

> **Live Demo:** [LegalMitra](https://legal-mitra-ai-powered-legal-assist.vercel.app/)

**LegalMitra** is a full-stack, enterprise-grade AI legal intelligence platform tailored for Indian jurisprudence. It democratizes legal access by simplifying complex legal documents, providing intelligent multi-turn advisory grounded in statutory law, exploring the Constitution of India, and delivering an editorial real-time legal dispatch wire.

---

## 🌟 Key Features

### 1. 📄 AI Document Simplifier & Multi-Format Extractor
- **Multi-Format Ingestion**: Upload `.pdf`, `.docx`, `.txt`, `.rtf`, `.odt`, or image scans (`.png`, `.jpg`, `.jpeg`).
- **Client-Side OCR**: Integrated **Tesseract.js** client-side Optical Character Recognition to extract text from scanned agreements, court summons, and handwritten contracts without external servers.
- **Client-Side PDF & DOCX Parsing**: Zero-backend document extraction powered by `pdf.js` and `mammoth.js`.
- **Structured Legal Analysis**: Generates Plain English Summaries, Identified Risks & Hidden Clauses, Actionable Next Steps, and Clause-by-Clause breakdowns with severity ratings.

### 2. 🏛️ Institutional Legal Advisor (Interactive Conversational AI)
- **Specialized Jurisdictions**: Civil Law, Criminal Law (BNS/BNSS/BSA), Corporate & Tax, Constitutional, Family & Matrimonial, Consumer Protection, Labor, and Cyber Law.
- **Context-Aware Sessions**: Multi-turn chat persistence with split-view session management, quick action prompts, and legal citation references.
- **Export Capabilities**: Export structured legal advice to **PDF** (via `html2pdf.js`) and plain text markdown.

### 3. 📜 Interactive Constitution of India Explorer
- **Searchable Repository**: Explore Indian Constitutional Articles (Preamble, Fundamental Rights, Directive Principles, Fundamental Duties, Judiciary, Union Executive).
- **AI Judicial Explainer**: Deep AI breakdowns of constitutional articles covering:
  - Plain-English Meaning & Citizen Rights
  - Historical Drafting Origin & Constituent Assembly Debates (Dr. B.R. Ambedkar)
  - Landmark Supreme Court Precedents (*Kesavananda Bharati*, *Maneka Gandhi*, *Indra Sawhney*, etc.)
  - Scope of Reasonable Restrictions & Exceptions.

### 4. 📰 Real-Time Editorial News Gazette & Live Legal Wire
- **Broadside Newspaper Architecture**: Designed with a 3-column frontpage layout inspired by modern legal publications.
- **Real-Time Live Wire**: Breaking legal ticker with real-time minute timestamps (`🔴 LIVE WIRE`).
- **Dedicated Feeds**:
  - `⚖️ Supreme Court & Constitution`: Bar & Bench live litigation stream.
  - `🏛️ High Courts & Judiciary`: The Hindu National & Court rulings.
  - `📜 Parliament & Statutory Acts`: Hindustan Times legislative & statutory acts feed.
  - `⚡ Real-Time Legal Wire`: NDTV Breaking national legal wire.
- **Authentic Publisher Photos**: Direct integration with verified media enclosures for real high-resolution article photography.

### 5. 🛡️ Secure Serverless API Proxy
- Built-in **Vercel Serverless Function** (`/api/chat.js`) with server-side environment variable masking, shielding OpenAI API keys from client browsers and public GitHub repositories.
- Zero-exposure authentication workflow with CORS protection.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────┐
                       │     Client Browser      │
                       │ (HTML5, Vanilla CSS3,   │
                       │   ES6+ Modular JS)      │
                       └────────────┬────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
           ▼                        ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Client-Side Engines │  │ Secure Vercel API   │  │ Real-Time RSS Feeds │
│ • Tesseract.js (OCR)│  │ • /api/chat.js      │  │ • Bar & Bench       │
│ • PDF.js (Parser)   │  │ • Process.env Key   │  │ • The Hindu         │
│ • Mammoth (DOCX)    │  │ • Rate-Limit & CORS │  │ • Hindustan Times   │
│ • html2pdf (Export) │  └──────────┬──────────┘  │ • NDTV Live Wire    │
└─────────────────────┘             │             └─────────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │   OpenAI GPT API    │
                         │ (Structured Legal   │
                         │  System Prompts)    │
                         └─────────────────────┘
```

---

## 💻 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System with HSL Color Tokens), Modern ES6+ JavaScript.
- **Typography & Theme**: Google Fonts (*Newsreader* serif & *Plus Jakarta Sans*), Light/Dark institutional theme engine.
- **Document Processing**: `pdf.js` (PDF parsing), `mammoth.js` (DOCX parsing), `tesseract.js` (Client-side OCR).
- **Export & Utility**: `html2pdf.js`, `marked.js` (Markdown renderer), `canvas-confetti`.
- **Backend / Serverless**: Node.js Vercel Serverless Runtime (`api/chat.js`).
- **AI Intelligence**: OpenAI GPT-4o / GPT-3.5-Turbo with tailored legal system prompts.
- **Data & Feeds**: RSS2JSON API, Bar & Bench, The Hindu, Hindustan Times, NDTV RSS feeds.

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher) or Python 3.x for running a local HTTP server.
- An [OpenAI API Key](https://platform.openai.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anuj0201/LegalMitra---AI-Powered-Legal-Assistant.git
   cd LegalMitra---AI-Powered-Legal-Assistant
   ```

2. **Serve locally**:
   Using Python:
   ```bash
   python -m http.server 8080
   ```
   Or using Node (`npx serve`):
   ```bash
   npx serve .
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 🌐 Deployment (Vercel)

1. Push your code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project** → Import your GitHub repository.
3. In the project settings, navigate to **Environment Variables** and add:
   - **Key**: `OPENAI_API_KEY` (or `open_ai_key`)
   - **Value**: `sk-proj-your-openai-api-key-here`
4. Click **Deploy**. Vercel will automatically configure the serverless proxy (`api/chat.js`) and host your frontend globally with SSL.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

- **Anuj** — [GitHub Profile](https://github.com/anuj0201)
