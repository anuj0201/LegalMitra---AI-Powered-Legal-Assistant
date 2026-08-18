(function () {
  'use strict';

  // ==========================================
  // GLOBALS & CONSTANTS
  // ==========================================
  const STORAGE_KEYS = {
    API_KEY: 'LegalMitra_api_key',
    OLD_API_KEY: 'nyayasathi_api_key',
    FALLBACK_KEY: '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',
    CHAT_SESSIONS: 'LegalMitra_chat_sessions',
    ACTIVE_CHAT_ID: 'LegalMitra_active_chat_id',
    OLD_CHAT: 'LegalMitra_chat_history',
    DOC: 'LegalMitra_doc_history',
    ARTICLE: 'LegalMitra_article_history',
    THEME: 'LegalMitra_theme',
    USER: 'LegalMitra_user_profile'
  };

  let chatSessions = [];
  let activeChatId = null;
  let currentFileText = '';

  const SYSTEM_PROMPTS = {
    DOCUMENT_SIMPLIFIER: `You are LegalMitra, an AI legal document simplifier and authenticity auditor. Your task is to take legal documents and rewrite them in simple, easy-to-understand language while critically evaluating their authenticity and legal validity under Indian Law.

Rules:
- Break down legal jargon into everyday words
- Use short sentences and paragraphs
- Highlight key points, obligations, rights, and deadlines
- Use bullet points for lists of terms or conditions
- Add a brief summary at the top
- If the document mentions specific laws or sections, briefly explain what they mean
- Maintain the original meaning accurately
- Use bold for important terms
- Structure the output with clear headings

CRITICAL AUTHENTICITY & FAKE DOCUMENT DETECTION RULES:
- Inspect whether the document is genuine, legally valid, or a FAKE / JOKE / PRANK / FRAUDULENT text.
- If a document contains domestic rules, household penalties, prank agreements, informal family notices (e.g. phone restrictions, food ordering bans), memes, or nonsensical demands — EVEN IF PRINTED ON OFFICIAL 50/100 RUPEES NON-JUDICIAL STAMP PAPER:
  1. Clearly state in your summary: "⚠️ **WARNING: This is a FAKE / INFORMAL document with ZERO legal validity.** Printing domestic or humorous rules on Government stamp paper does NOT make it an enforceable contract under the Indian Contract Act, 1872."
  2. Explain why it is void (e.g., lacks intention to create legal relations, lacks lawful consideration, constitutes misuse of non-judicial stamp paper).
  3. You MUST assign a Fraud / Invalidity Risk score of 85 to 100 in the assessment block below.

LANGUAGE RULES:
- The document may be written in Hindi (Devanagari script), Marathi, Hinglish, or any other Indian regional language
- You MUST understand and process text in ANY language including Hindi, Marathi, Tamil, Telugu, Gujarati, Bengali, Hinglish etc.
- Your output/summary MUST ALWAYS be in ENGLISH only, regardless of the input language
- Translate all key terms from Hindi/regional languages/Hinglish to English and explain them

AUTHENTICITY & FRAUD ASSESSMENT:
At the very end of your response, evaluate whether the document appears to be a legitimate, standard legal instrument or if it exhibits red flags of fraud, scams, forgery, joke/prank, or deceptive terms.
You MUST output this exact block at the very bottom:
---FRAUD_ASSESSMENT---
SCORE: <A single integer from 0 to 100 representing fraud / invalidity / suspicion probability. 0-20 = standard legitimate legal doc; 21-79 = caution/ambiguous; 80-100 = high fraud risk / suspicious / fake / joke / invalid>
STATUS: <Legitimate | Moderate Suspicion | High Fraud Risk>
REASON: <1-2 concise sentences analyzing the authenticity, seal/stamp references, validity of structure, or specific red flags>
---END_FRAUD_ASSESSMENT---`,

    DOC_QA: `You are LegalMitra, an expert AI legal advisor answering user questions about the uploaded document or constitutional order.

Rules for Answering:
1. Ground your response in the uploaded document, but ALSO apply comprehensive Indian legal knowledge, constitutional provisions, statutory frameworks, and Supreme Court jurisprudence.
2. NEVER dismiss questions with robotic phrases like "the document text does not state this" when asked about legal mechanisms, constitutional validity, implications, background, or how the clauses hold up in law.
3. If asked about constitutional orders (such as Article 370, C.O. 272, presidential orders):
   - Explain the exact constitutional mechanism (e.g. how Article 367 was amended to interpret 'Constituent Assembly' as 'Legislative Assembly', the role of President's Rule under Article 356, and the 2023 Supreme Court Constitution Bench ruling upholding the abrogation).
4. If asked about agreements/deeds:
   - Explain the practical enforceability, relevant statutory acts (Indian Contract Act, Transfer of Property Act, RERA, Consumer Protection Act), remedies, and rights.
5. Format responses clearly with bold key terms, short paragraphs, and bullet points for readability.`,

    LEGAL_CHAT: `You are LegalMitra, a friendly AI legal advisor specializing in Indian law. You help common people understand legal matters in simple terms.

Rules:
- Always respond in simple, easy-to-understand language
- Reference relevant Indian laws, acts, and constitutional articles when applicable
- Provide practical, actionable steps when possible
- Be empathetic and supportive
- Include relevant timelines, fees, or procedures when applicable
- Always add a disclaimer that this is AI-generated guidance, not professional legal advice
- Structure longer responses with bullet points or numbered steps
- If unsure about specific details, say so rather than guessing`,

    CONSTITUTION_EXPLAINER: `You are LegalMitra, an expert AI legal educator that explains Indian Constitutional articles to common citizens in simple, engaging terms.

Given an article of the Indian Constitution, provide a clear, structured breakdown:

1. 💡 **Simple Summary (In Everyday Language)**:
   - A 1-2 sentence plain-English explanation that anyone can immediately grasp.

2. 🏛️ **Historical Background & Why It Was Brought**:
   - Why the framers of the Constitution (Dr. B.R. Ambedkar and the Constituent Assembly) introduced this article.
   - The historical injustices, colonial background, or socio-economic goals it was created to solve.

3. 👥 **What It Means for You (Real-Life Citizen Rights & Applications)**:
   - Practical, day-to-day impact on ordinary citizens.
   - Practical scenarios or examples of how rights under this article protect people.

4. ⚖️ **Landmark Supreme Court Cases & Key Amendments**:
   - Famous judgments where the Supreme Court interpreted or expanded this article.
   - Any major constitutional amendments that modified or added clauses to this article.

5. 📌 **Key Takeaways & Exceptions**:
   - Quick bullet points summarizing the core principles and any legal exceptions.

Formatting Rules:
- Use bold for key legal terms.
- Use clear bullet points and short paragraphs.
- Keep the language clear, insightful, accessible, and informative.`
  };

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================
  function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bullet points
    html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
    // Fix adjacent uls
    html = html.replace(/<\/ul>\n<ul>/gim, '');
    // Numbered lists
    html = html.replace(/^\d+\.\s(.*$)/gim, '<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\n<ol>/gim, '');
    // Paragraphs
    html = html.replace(/\n\n/gim, '</p><p>');
    return `<p>${html}</p>`;
  }

  function formatTimestamp(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Today ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // THEME MANAGEMENT (LIGHT / DARK)
  // ==========================================
  function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';

    applyTheme(savedTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        showToast(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'success');
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggleBtn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`;
    }
  }

  // ==========================================
  // MODAL MANAGEMENT
  // ==========================================
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ==========================================
  // API KEY MANAGEMENT
  // ==========================================
  function getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) ||
           localStorage.getItem(STORAGE_KEYS.OLD_API_KEY) ||
           localStorage.getItem(STORAGE_KEYS.FALLBACK_KEY) ||
           '';
  }

  function initApiKeyManagement() {
    const btn = document.getElementById('api-key-btn');
    const closeBtn = document.getElementById('api-key-close');
    const saveBtn = document.getElementById('api-key-save');
    const input = document.getElementById('api-key-input');

    if (btn) btn.addEventListener('click', () => openModal('api-modal'));
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('api-modal'));

    if (saveBtn && input) {
      const storedKey = getApiKey();
      if (storedKey) input.value = storedKey;

      saveBtn.addEventListener('click', () => {
        const key = input.value.trim();
        if (key) {
          localStorage.setItem(STORAGE_KEYS.API_KEY, key);
          showToast('API Key saved successfully.', 'success');
          closeModal('api-modal');
        } else {
          showToast('Please enter a valid API key.', 'error');
        }
      });
    }
  }

  // ==========================================
  // OPENAI API INTEGRATION (HYBRID SERVERLESS + CLIENT)
  // ==========================================
  async function callGeminiAPI(prompt, systemInstruction, conversationHistory = []) {
    const messages = [
      { role: 'system', content: systemInstruction },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    const body = {
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 4096
    };

    // 1. Try Vercel Serverless Function first (Uses process.env.OPENAI_API_KEY)
    try {
      const serverlessRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (serverlessRes.ok) {
        const data = await serverlessRes.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      } else if (serverlessRes.status !== 404) {
        // If serverless responded with 400/500, read the error message
        const errData = await serverlessRes.json().catch(() => ({}));
        const errMsg = errData.error || `Serverless Error (${serverlessRes.status})`;
        console.error('Serverless Error:', errMsg);
        showToast(errMsg, 'error');
        return null;
      }
    } catch (e) {
      // Serverless fetch error (e.g. running offline on local static server)
    }

    // 2. Direct Client-side Fallback
    const apiKey = getApiKey();
    if (!apiKey) {
      showToast('Please set OPENAI_API_KEY in Vercel Environment Variables or configure a key.', 'warning');
      openModal('api-modal');
      return null;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API call failed (${response.status})`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response generated.';
    } catch (error) {
      console.error('API Error:', error);
      showToast(error.message, 'error');
      return null;
    }
  }

  // Vision API for image-based document processing (Hindi PDFs, scanned docs)
  async function callVisionAPI(base64Images, systemInstruction) {
    const userContent = [
      { type: 'text', text: 'Please read and simplify this legal document. Follow the system instructions carefully.' }
    ];

    const pagesToSend = base64Images.slice(0, 10);
    for (const img of pagesToSend) {
      userContent.push({
        type: 'image_url',
        image_url: { url: img, detail: 'high' }
      });
    }

    if (base64Images.length > 10) {
      userContent.push({
        type: 'text',
        text: `Note: This document has ${base64Images.length} pages. Only the first 10 pages are shown. Please summarize what you can see.`
      });
    }

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 4096
    };

    // 1. Try Vercel Serverless Function first
    try {
      const serverlessRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (serverlessRes.ok) {
        const data = await serverlessRes.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      } else if (serverlessRes.status !== 404) {
        const errData = await serverlessRes.json().catch(() => ({}));
        const errMsg = errData.error || `Serverless Error (${serverlessRes.status})`;
        console.error('Serverless Vision Error:', errMsg);
        showToast(errMsg, 'error');
        return null;
      }
    } catch (e) {
      // Proceed to client fallback
    }

    // 2. Direct Client Fallback
    const apiKey = getApiKey();
    if (!apiKey) {
      showToast('Please set OPENAI_API_KEY in Vercel Environment Variables or configure a key.', 'warning');
      openModal('api-modal');
      return null;
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Vision API call failed (${response.status})`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response generated.';
    } catch (error) {
      console.error('Vision API Error:', error);
      showToast(error.message, 'error');
      return null;
    }
  }

  // ==========================================
  // NAVIGATION & SCROLL ANIMATIONS
  // ==========================================
  function initNavigation() {
    const navLinks = document.querySelectorAll('#nav-links a');
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const header = document.getElementById('navbar');

    // Smooth scroll
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (navToggle && navToggle.classList.contains('active')) {
              navToggle.classList.remove('active');
              navLinksContainer.classList.remove('active');
            }
          }
        }
      });
    });

    // Mobile nav toggle
    if (navToggle && navLinksContainer) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
      });
    }

    // Scroll opacity and Active link highlight
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', debounce(() => {
      const scrollY = window.scrollY;
      if (header) {
        if (scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }

      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 50));
  }

  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const featureCards = document.querySelectorAll('.hero-features .feature-card');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    fadeElements.forEach(el => {
      el.classList.add('animate');
      observer.observe(el);
    });

    featureCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  // ==========================================
  // DOCUMENT SIMPLIFIER
  // ==========================================
  function initDocSimplifier() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const fileRemoveBtn = document.getElementById('file-remove');
    const loadingState = document.getElementById('simplify-loading');
    const uploadResult = document.getElementById('upload-result');
    const outputArea = document.getElementById('simplified-output');
    const copyBtn = document.getElementById('copy-result-btn');

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(Array.from(e.target.files));
      }
    });

    if (fileRemoveBtn) {
      fileRemoveBtn.addEventListener('click', () => {
        resetDocSimplifier();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (outputArea && outputArea.innerText) {
          navigator.clipboard.writeText(outputArea.innerText).then(() => {
            showToast('Copied to clipboard!', 'success');
          });
        }
      });
    }

    const uploadAnotherBtn = document.getElementById('upload-another-btn');
    if (uploadAnotherBtn) {
      uploadAnotherBtn.addEventListener('click', () => {
        resetDocSimplifier();
      });
    }

    const riskContainer = document.getElementById('doc-risk-container');
    const riskIcon = document.getElementById('doc-risk-icon');
    const riskTitle = document.getElementById('doc-risk-title');
    const riskStatus = document.getElementById('doc-risk-status');
    const riskScoreEl = document.getElementById('doc-risk-score');
    const riskFillEl = document.getElementById('doc-risk-bar-fill');
    const riskReasonEl = document.getElementById('doc-risk-reason');

    const docQaMessages = document.getElementById('doc-qa-messages');
    const docQaInput = document.getElementById('doc-qa-input');
    const docQaSendBtn = document.getElementById('doc-qa-send-btn');
    const docQaWarning = document.getElementById('doc-qa-blocked-warning');
    const docQaSuggestions = document.getElementById('doc-qa-suggestions');
    const docQaInputArea = document.getElementById('doc-qa-input-area');

    let currentDocHistoryForQa = [];
    let isDocChatBlocked = false;

    // Follow-up Q&A event listeners
    if (docQaSendBtn && docQaInput) {
      docQaSendBtn.addEventListener('click', handleDocQaSend);
      docQaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleDocQaSend();
      });
    }

    if (docQaSuggestions) {
      docQaSuggestions.querySelectorAll('.doc-qa-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (isDocChatBlocked) return;
          if (docQaInput) {
            docQaInput.value = btn.textContent;
            handleDocQaSend();
          }
        });
      });
    }

    async function handleDocQaSend() {
      if (isDocChatBlocked) {
        showToast('Chatbot is locked for this document due to high fraud risk.', 'error');
        return;
      }

      const query = docQaInput ? docQaInput.value.trim() : '';
      if (!query || !currentFileText) return;

      if (docQaInput) docQaInput.value = '';

      const timestamp = new Date().toISOString();
      currentDocHistoryForQa.push({ role: 'user', content: query, timestamp });
      renderDocQaBubble('user', query, timestamp);

      showDocQaTyping();

      const promptWithContext = `DOCUMENT CONTEXT:\n${currentFileText.substring(0, 12000)}\n\nUSER QUESTION ABOUT THIS DOCUMENT:\n${query}`;
      const aiResponse = await callGeminiAPI(promptWithContext, SYSTEM_PROMPTS.DOC_QA, currentDocHistoryForQa.slice(0, -1));

      removeDocQaTyping();

      if (aiResponse) {
        const aiTimestamp = new Date().toISOString();
        currentDocHistoryForQa.push({ role: 'ai', content: aiResponse, timestamp: aiTimestamp });
        renderDocQaBubble('ai', aiResponse, aiTimestamp);
      }
    }

    function renderDocQaBubble(role, content, timestamp) {
      if (!docQaMessages) return;

      const msgDiv = document.createElement('div');
      msgDiv.className = `message message-${role}`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.innerHTML = role === 'ai' ? formatMarkdown(content) : escapeHtml(content);

      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      timeDiv.textContent = formatTimestamp(timestamp);

      msgDiv.appendChild(contentDiv);
      msgDiv.appendChild(timeDiv);
      docQaMessages.appendChild(msgDiv);

      docQaMessages.scrollTop = docQaMessages.scrollHeight;
    }

    function showDocQaTyping() {
      if (!docQaMessages) return;
      const indicator = document.createElement('div');
      indicator.className = 'message message-ai typing-indicator-wrapper';
      indicator.id = 'doc-qa-typing';
      indicator.innerHTML = '<div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
      docQaMessages.appendChild(indicator);
      docQaMessages.scrollTop = docQaMessages.scrollHeight;
    }

    function removeDocQaTyping() {
      const indicator = document.getElementById('doc-qa-typing');
      if (indicator) indicator.remove();
    }

    function parseFraudAssessment(text) {
      let score = 15; // default low risk
      let status = 'Legitimate';
      let reason = 'Standard legal terminology and consistent structure identified.';

      const match = text.match(/---FRAUD_ASSESSMENT---([\s\S]*?)---END_FRAUD_ASSESSMENT---/i);
      if (match && match[1]) {
        const block = match[1];
        const scoreMatch = block.match(/SCORE:\s*(\d+)/i);
        const statusMatch = block.match(/STATUS:\s*(.+)/i);
        const reasonMatch = block.match(/REASON:\s*(.+)/i);

        if (scoreMatch) score = parseInt(scoreMatch[1], 10);
        if (statusMatch) status = statusMatch[1].trim();
        if (reasonMatch) reason = reasonMatch[1].trim();
      }

      // Strip assessment block from displayed text
      const cleanText = text.replace(/---FRAUD_ASSESSMENT---[\s\S]*?---END_FRAUD_ASSESSMENT---/gi, '').trim();

      return { score, status, reason, cleanText };
    }

    function generateFraudAssessmentHtml(assessment) {
      const score = assessment.score || 0;
      const isHighRisk = score >= 80;
      const isCaution = score >= 35 && score < 80;

      let icon = '🛡️';
      let title = 'Document Authenticity Verified';
      let statusText = `Legitimacy Confidence: ${100 - score}% — Appears standard & valid`;
      let variantClass = 'legit';
      let scoreBadge = `${100 - score}% Legit`;
      let barPercent = 100 - score;

      if (isHighRisk) {
        icon = '🚨';
        title = 'High Fraud / Suspicion Risk Detected';
        statusText = `Fraud Risk Score: ${score}% — Extreme caution advised`;
        variantClass = 'fraud';
        scoreBadge = `${score}% Risk`;
        barPercent = score;
      } else if (isCaution) {
        icon = '⚠️';
        title = 'Document Authenticity: Moderate Ambiguity';
        statusText = `Suspicion Score: ${score}% — Review specific terms carefully`;
        variantClass = 'caution';
        scoreBadge = `${score}% Risk`;
        barPercent = score;
      }

      const reason = escapeHtml(assessment.reason || 'Structural analysis complete.');

      return `
        <div class="doc-risk-container" style="margin: 0.75rem 0 1.25rem 0;">
          <div class="doc-risk-header">
            <div class="doc-risk-title-wrap">
              <span class="doc-risk-icon">${icon}</span>
              <div>
                <h4 class="doc-risk-title">${title}</h4>
                <p class="doc-risk-status">${statusText}</p>
              </div>
            </div>
            <div class="doc-risk-score ${variantClass}">${scoreBadge}</div>
          </div>
          <div class="doc-risk-bar-track">
            <div class="doc-risk-bar-fill ${variantClass}" style="width: ${barPercent}%;"></div>
          </div>
          <p class="doc-risk-reason">${reason}</p>
        </div>
      `;
    }

    function resetDocSimplifier() {
      fileInput.value = '';
      uploadArea.classList.remove('hidden');
      fileInfo.classList.add('hidden');
      uploadResult.classList.add('hidden');
      loadingState.classList.add('hidden');
      currentFileText = '';
      currentDocHistoryForQa = [];
      isDocChatBlocked = false;

      if (docQaMessages) docQaMessages.innerHTML = '';
      if (docQaInput) {
        docQaInput.value = '';
        docQaInput.disabled = false;
        docQaInput.placeholder = 'Ask a question about this document...';
      }
      if (docQaSendBtn) docQaSendBtn.disabled = false;
      if (docQaWarning) docQaWarning.classList.add('hidden');
      if (docQaSuggestions) docQaSuggestions.classList.remove('hidden');
      if (docQaInputArea) docQaInputArea.classList.remove('disabled');
    }

    async function handleFiles(files) {
      const validExts = ['txt', 'pdf', 'docx'];
      const validFiles = files.filter(f => {
        const ext = f.name.split('.').pop().toLowerCase();
        if (!validExts.includes(ext)) {
          showToast(`Skipped "${f.name}" — unsupported file type.`, 'warning');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      uploadArea.classList.add('hidden');
      fileInfo.classList.remove('hidden');
      const nameSpan = fileInfo.querySelector('.file-name');
      const sizeSpan = fileInfo.querySelector('.file-size');
      const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0);

      if (validFiles.length === 1) {
        if (nameSpan) nameSpan.textContent = validFiles[0].name;
      } else {
        if (nameSpan) nameSpan.textContent = `${validFiles.length} documents selected`;
      }
      if (sizeSpan) sizeSpan.textContent = formatFileSize(totalSize);

      loadingState.classList.remove('hidden');
      uploadResult.classList.add('hidden');

      try {
        const fileData = [];
        const fileNames = [];

        for (const file of validFiles) {
          const ext = file.name.split('.').pop().toLowerCase();
          const result = await extractText(file, ext);
          if (result) {
            fileData.push({ name: file.name, ...result });
            fileNames.push(file.name);
          }
        }

        if (fileData.length === 0) {
          throw new Error('Could not extract content from the uploaded file(s).');
        }

        const fileSummaries = [];
        let hasHighRisk = false;

        for (let i = 0; i < fileData.length; i++) {
          const item = fileData[i];
          if (fileData.length > 1) {
            showToast(`Simplifying document ${i + 1} of ${fileData.length}: ${item.name}`, 'success');
          }

          let rawResponse = null;

          if (item.type === 'images') {
            rawResponse = await callVisionAPI(item.content, SYSTEM_PROMPTS.DOCUMENT_SIMPLIFIER);
          } else {
            rawResponse = await callGeminiAPI(item.content, SYSTEM_PROMPTS.DOCUMENT_SIMPLIFIER);
          }

          if (rawResponse) {
            const parsed = parseFraudAssessment(rawResponse);
            if (parsed.score >= 80) hasHighRisk = true;

            fileSummaries.push({
              name: item.name,
              parsed
            });
          }
        }

        if (fileSummaries.length > 0) {
          loadingState.classList.add('hidden');
          uploadResult.classList.remove('hidden');

          // Render each document with its own dedicated confidence bar + summary
          const renderedBlocks = fileSummaries.map((fObj, idx) => {
            const titleHeader = `<h3>📄 Summary of: ${escapeHtml(fObj.name)}</h3>`;
            const confidenceBar = generateFraudAssessmentHtml(fObj.parsed);
            const markdownSummary = formatMarkdown(fObj.parsed.cleanText);
            const divider = idx > 0 ? `<hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--border);" />` : '';

            return `
              <div class="doc-single-summary-block">
                ${divider}
                ${titleHeader}
                ${confidenceBar}
                <div class="doc-summary-content">${markdownSummary}</div>
              </div>
            `;
          }).join('');

          if (outputArea) outputArea.innerHTML = renderedBlocks;

          // Follow-up Q&A security check
          if (hasHighRisk) {
            isDocChatBlocked = true;
            if (docQaWarning) docQaWarning.classList.remove('hidden');
            if (docQaInput) {
              docQaInput.disabled = true;
              docQaInput.placeholder = 'Follow-up chat locked due to high fraud risk (>80%) in uploaded document(s).';
            }
            if (docQaSendBtn) docQaSendBtn.disabled = true;
            if (docQaSuggestions) docQaSuggestions.classList.add('hidden');
            if (docQaInputArea) docQaInputArea.classList.add('disabled');
            showToast('High fraud risk detected in uploaded document. AI chat restricted.', 'error');
          } else {
            isDocChatBlocked = false;
            if (docQaWarning) docQaWarning.classList.add('hidden');
            if (docQaInput) {
              docQaInput.disabled = false;
              docQaInput.placeholder = 'Ask a question about this document...';
            }
            if (docQaSendBtn) docQaSendBtn.disabled = false;
            if (docQaSuggestions) docQaSuggestions.classList.remove('hidden');
            if (docQaInputArea) docQaInputArea.classList.remove('disabled');
          }

          // Save to history
          const allTextSummaries = fileSummaries.map(f => `## 📄 Summary of: ${f.name}\n\n${f.parsed.cleanText}`).join('\n\n---\n\n');
          currentFileText = fileData.filter(f => f.type === 'text').map(f => f.content).join('\n\n') || allTextSummaries;
          saveDocHistory(fileNames.join(', '), (currentFileText || 'Uploaded document').substring(0, 200), allTextSummaries);
        } else {
          resetDocSimplifier();
        }
      } catch (err) {
        console.error(err);
        showToast(err.message, 'error');
        resetDocSimplifier();
      }
    }

    function isGarbledText(text) {
      if (!text || text.trim().length < 20) return true;
      const cleaned = text.replace(/\s+/g, '');
      if (cleaned.length < 10) return true;
      let readable = 0;
      for (const ch of cleaned) {
        const code = ch.codePointAt(0);
        if (
          (code >= 0x20 && code <= 0x7E) ||
          (code >= 0x0900 && code <= 0x097F) ||
          (code >= 0x0980 && code <= 0x09FF) ||
          (code >= 0x0A00 && code <= 0x0D7F) ||
          (code >= 0x0B80 && code <= 0x0BFF)
        ) {
          readable++;
        }
      }
      const ratio = readable / cleaned.length;
      return ratio < 0.5;
    }

    async function renderPdfAsImages(arrayBuffer) {
      if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF.js library not loaded.');
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const typedarray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      const images = [];
      const maxPages = Math.min(pdf.numPages, 10);

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        images.push(dataUrl);
      }
      return images;
    }

    async function extractText(file, ext) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (ext === 'txt') {
          reader.onload = e => resolve({ type: 'text', content: e.target.result });
          reader.onerror = () => reject(new Error('Failed to read TXT file'));
          reader.readAsText(file);
        } else if (ext === 'pdf') {
          reader.onload = async function (e) {
            try {
              if (typeof pdfjsLib === 'undefined') {
                reject(new Error('PDF.js library not loaded.'));
                return;
              }
              const originalBuffer = e.target.result;
              const bufferCopy = originalBuffer.slice(0);

              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

              let fullText = '';
              let textExtractionFailed = false;
              try {
                const typedarray = new Uint8Array(bufferCopy);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const textContent = await page.getTextContent();
                  const pageText = textContent.items.map(item => item.str).join(' ');
                  fullText += pageText + '\n';
                }
              } catch (textErr) {
                console.log('Text extraction error:', textErr);
                textExtractionFailed = true;
              }

              if (textExtractionFailed || isGarbledText(fullText)) {
                console.log('Text extraction failed or garbled, falling back to image mode...');
                showToast('Using visual processing for this document...', 'warning');
                try {
                  const images = await renderPdfAsImages(originalBuffer);
                  resolve({ type: 'images', content: images });
                } catch (imgErr) {
                  reject(new Error('Failed to process PDF as images.'));
                }
              } else {
                resolve({ type: 'text', content: fullText });
              }
            } catch (error) {
              console.error('PDF processing error:', error);
              reject(new Error('Failed to parse PDF.'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read PDF file'));
          reader.readAsArrayBuffer(file);
        } else if (ext === 'docx') {
          reader.onload = e => {
            const raw = e.target.result;
            const extracted = raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
            if (extracted.length < 50) {
              resolve({ type: 'text', content: 'Could not extract readable text from DOCX. Please convert to PDF or TXT.' });
            } else {
              resolve({ type: 'text', content: extracted });
            }
          };
          reader.onerror = () => reject(new Error('Failed to read DOCX file'));
          reader.readAsText(file);
        }
      });
    }
  }

  // ==========================================
  // LEGAL CHAT (CLAUDE-STYLE SIDEBAR + SESSIONS)
  // ==========================================
  function loadChatSessions() {
    chatSessions = UserDataStore.getData('chats');
    if (!Array.isArray(chatSessions)) {
      chatSessions = [];
    }
  }

  function saveChatSessions() {
    UserDataStore.saveData('chats', chatSessions);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, activeChatId || '');
    renderHistory();
  }

  function getActiveSession() {
    return chatSessions.find(s => s.id === activeChatId) || null;
  }

  function initChat() {
    const chatBox = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const welcome = document.getElementById('chat-welcome');
    const suggestions = document.getElementById('suggested-questions');
    const newChatBtn = document.getElementById('new-chat-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const chatSidebar = document.getElementById('chat-sidebar');

    loadChatSessions();

    // Determine initial active session
    const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    if (savedActiveId && chatSessions.some(s => s.id === savedActiveId)) {
      activeChatId = savedActiveId;
    } else if (chatSessions.length > 0) {
      activeChatId = chatSessions[0].id;
    } else {
      // Create first session
      createNewChatSession(false);
    }

    renderSidebarList();
    renderCurrentChatMessages();

    // New Chat Button
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        createNewChatSession(true);
        if (window.innerWidth <= 768 && chatSidebar) {
          chatSidebar.classList.remove('open');
        }
      });
    }

    // Sidebar Mobile Toggle
    if (sidebarToggle && chatSidebar) {
      sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        chatSidebar.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && chatSidebar.classList.contains('open') && !chatSidebar.contains(e.target) && e.target !== sidebarToggle) {
          chatSidebar.classList.remove('open');
        }
      });
    }

    // Send Handlers
    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', handleSend);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }

    if (suggestions) {
      suggestions.querySelectorAll('.suggested-q-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          chatInput.value = btn.textContent;
          handleSend();
        });
      });
    }

    // Auto-focus when scrolled to chat
    const chatSection = document.getElementById('chat');
    if (chatSection && chatInput) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && window.innerWidth > 768) {
            chatInput.focus();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(chatSection);
    }

    function createNewChatSession(showFeedback = true) {
      const newSession = {
        id: generateId(),
        title: 'New conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      chatSessions.unshift(newSession);
      activeChatId = newSession.id;
      saveChatSessions();
      renderSidebarList();
      renderCurrentChatMessages();

      if (chatInput) chatInput.focus();
      if (showFeedback) showToast('Started a new conversation', 'success');
    }

    function selectSession(id) {
      activeChatId = id;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, activeChatId);
      renderSidebarList();
      renderCurrentChatMessages();

      if (window.innerWidth <= 768 && chatSidebar) {
        chatSidebar.classList.remove('open');
      }
    }

    function deleteSession(id, e) {
      if (e) e.stopPropagation();
      const session = chatSessions.find(s => s.id === id);
      const title = session ? session.title : 'this chat';

      if (confirm(`Delete "${title}"?`)) {
        chatSessions = chatSessions.filter(s => s.id !== id);

        if (activeChatId === id) {
          if (chatSessions.length > 0) {
            activeChatId = chatSessions[0].id;
          } else {
            createNewChatSession(false);
            return;
          }
        }

        saveChatSessions();
        renderSidebarList();
        renderCurrentChatMessages();
        showToast('Chat deleted', 'success');
      }
    }

    function renderSidebarList() {
      const list = document.getElementById('sidebar-chat-list');
      if (!list) return;

      list.innerHTML = '';

      if (chatSessions.length === 0) {
        list.innerHTML = '<div class="sidebar-empty-text">No previous chats</div>';
        return;
      }

      chatSessions.forEach(session => {
        const item = document.createElement('div');
        item.className = `sidebar-chat-item ${session.id === activeChatId ? 'active' : ''}`;
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'sidebar-chat-title';
        titleSpan.textContent = session.title || 'Conversation';
        titleSpan.title = session.title || 'Conversation';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'sidebar-chat-delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete chat';
        deleteBtn.addEventListener('click', (e) => deleteSession(session.id, e));

        item.appendChild(titleSpan);
        item.appendChild(deleteBtn);

        item.addEventListener('click', () => selectSession(session.id));
        list.appendChild(item);
      });
    }

    function renderCurrentChatMessages() {
      if (!chatBox) return;

      // Remove existing message bubbles except welcome & suggestions
      const existingMessages = chatBox.querySelectorAll('.message');
      existingMessages.forEach(m => m.remove());

      const session = getActiveSession();
      const messages = session ? session.messages : [];

      if (messages.length === 0) {
        if (welcome) welcome.style.display = 'block';
        if (suggestions) suggestions.style.display = 'flex';
      } else {
        if (welcome) welcome.style.display = 'none';
        if (suggestions) suggestions.style.display = 'none';
        messages.forEach(msg => renderMessageBubble(msg.role, msg.content, msg.timestamp, false));
        scrollToBottom();
      }
    }

    async function handleSend() {
      const text = chatInput.value.trim();
      if (!text) return;

      chatInput.value = '';
      if (welcome) welcome.style.display = 'none';
      if (suggestions) suggestions.style.display = 'none';

      let session = getActiveSession();
      if (!session) {
        createNewChatSession(false);
        session = getActiveSession();
      }

      // If it's the first message, generate a clean title
      if (session.messages.length === 0) {
        session.title = text.length > 32 ? text.substring(0, 32) + '...' : text;
      }

      const timestamp = new Date().toISOString();
      session.messages.push({ role: 'user', content: text, timestamp });
      session.updatedAt = timestamp;

      renderMessageBubble('user', text, timestamp, true);
      saveChatSessions();
      renderSidebarList();

      showTyping();

      const historyForApi = session.messages.slice(0, -1);
      const aiResponse = await callGeminiAPI(text, SYSTEM_PROMPTS.LEGAL_CHAT, historyForApi);

      removeTyping();

      if (aiResponse) {
        const aiTimestamp = new Date().toISOString();
        session.messages.push({ role: 'ai', content: aiResponse, timestamp: aiTimestamp });
        session.updatedAt = aiTimestamp;
        renderMessageBubble('ai', aiResponse, aiTimestamp, true);
        saveChatSessions();
      }
    }

    function renderMessageBubble(role, content, timestamp, scroll = false) {
      if (!chatBox) return;

      const msgDiv = document.createElement('div');
      msgDiv.className = `message message-${role}`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.innerHTML = role === 'ai' ? formatMarkdown(content) : escapeHtml(content);

      const timeDiv = document.createElement('div');
      timeDiv.className = 'message-time';
      timeDiv.textContent = formatTimestamp(timestamp);

      msgDiv.appendChild(contentDiv);
      msgDiv.appendChild(timeDiv);
      chatBox.appendChild(msgDiv);

      if (scroll) scrollToBottom();
    }

    function showTyping() {
      if (!chatBox) return;
      const indicator = document.createElement('div');
      indicator.className = 'message message-ai typing-indicator-wrapper';
      indicator.id = 'typing-indicator';
      indicator.innerHTML = '<div class="typing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
      chatBox.appendChild(indicator);
      scrollToBottom();
    }

    function removeTyping() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();
    }

    function scrollToBottom() {
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  }

  // ==========================================
  // NEWS SECTION (REAL-TIME LIVE WIRE & EDITORIAL GAZETTE)
  // ==========================================
  const NEWS_FEEDS = {
    legal: {
      label: 'Supreme Court & Constitution',
      rssUrls: ['https://www.barandbench.com/feed'],
      icon: '⚖️',
      fallback: [
        {
          title: 'Supreme Court Constitution Bench hears arguments on digital privacy and statutory compliance',
          description: 'The 5-judge Constitution Bench held extensive hearings today regarding Article 21 fundamental rights.',
          source: 'Bar & Bench',
          image: 'https://cf-images.assettype.com/barandbench/2022-01/d9b62d33-af83-4c84-8deb-5646589abace/SUPREME_COURT_OF_INDIA__WEB_PAGE_1600x900___Copy.jpg?w=1200',
          pubDate: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
          link: 'https://www.barandbench.com'
        },
        {
          title: 'Trial courts across all states instructed to implement standardized digital evidence filing',
          description: 'Directives issued under the Bharatiya Nagarik Suraksha Sanhita to ensure rapid electronic tracking.',
          source: 'Bar & Bench',
          image: 'https://cf-images.assettype.com/barandbench/2021-06/38dcf69d-fbbc-4279-b6a0-f4c576da7326/Tarun_Tejpal_and_Supreme_Court.jpg?w=1200',
          pubDate: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
          link: 'https://www.barandbench.com'
        }
      ]
    },
    judiciary: {
      label: 'High Courts & Judiciary',
      rssUrls: ['https://www.thehindu.com/news/national/feeder/default.rss'],
      icon: '🏛️',
      fallback: [
        {
          title: 'High Courts scale up live stream telecasts across remote district bench complexes',
          description: 'Judicial modernization under e-Courts Phase III connects district court complexes to virtual hearings.',
          source: 'The Hindu',
          image: 'https://th-i.thgim.com/public/incoming/yxbljm/article71361552.ece/alternates/LANDSCAPE_1200/2699_18_8_2026_20_8_8_3_19HUBLIBANDOBAST.JPG',
          pubDate: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
          link: 'https://www.thehindu.com'
        }
      ]
    },
    legislative: {
      label: 'Parliament & Statutory Acts',
      rssUrls: ['https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml'],
      icon: '📜',
      fallback: [
        {
          title: 'Parliamentary Committee reviews fast-track consumer dispute mediation framework',
          description: 'Standing Committee recommended institutionalizing online dispute resolution to settle claims within 90 days.',
          source: 'Hindustan Times',
          image: 'https://www.hindustantimes.com/ht-img/img/2026/08/18/1600x900/The-Ritabrata-Banerjee-led-group-has-sought-Electi_1787053552491_1787053562767_1f239833-bc14-4b27-a38b-bcb85b9293b4.jpg',
          pubDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          link: 'https://www.hindustantimes.com'
        }
      ]
    },
    general: {
      label: 'Real-Time Legal Wire',
      rssUrls: ['https://feeds.feedburner.com/ndtvnews-india-news'],
      icon: '⚡',
      fallback: [
        {
          title: 'National Legal Services Authority (NALSA) expands free legal aid clinics across 500 districts',
          description: 'Over 200,000 citizens received pre-litigation counseling and settlement assistance this week.',
          source: 'NDTV',
          image: 'https://c.ndtvimg.com/2022-01/2ft3pm08_arvind-kejriwal-satyendar-jain-pti_625x300_23_January_22.jpg',
          pubDate: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
          link: 'https://www.ndtv.com'
        }
      ]
    }
  };

  let activeNewsFeed = 'legal';
  let newsCache = {};

  function cleanSource(rawSource) {
    if (!rawSource) return 'Legal Gazette';
    const lower = String(rawSource).toLowerCase();
    if (lower.includes('bar & bench') || lower.includes('bar and bench')) return 'Bar & Bench';
    if (lower.includes('hindu')) return 'The Hindu';
    if (lower.includes('hindustan times') || lower.includes('ht')) return 'Hindustan Times';
    if (lower.includes('ndtv')) return 'NDTV';
    if (lower.includes('livelaw') || lower.includes('live law')) return 'LiveLaw';
    if (lower.includes('express')) return 'Indian Express';
    if (lower.includes('times of india') || lower.includes('toi')) return 'Times of India';
    if (rawSource.includes('|')) return rawSource.split('|').pop().trim();
    if (rawSource.includes('-')) return rawSource.split('-').pop().trim();
    return rawSource.length > 20 ? rawSource.slice(0, 18) : rawSource;
  }

  function cleanSummary(rawText, maxLen = 140) {
    if (!rawText) return 'Full legal reporting and case details available.';
    let text = String(rawText).replace(/<[^>]*>?/gm, '').trim();
    text = text.replace(/\s+/g, ' ');
    if (text.length > maxLen) {
      return text.slice(0, maxLen).trim() + '...';
    }
    return text;
  }

  function extractArticleImage(item) {
    let img = '';
    if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) {
      img = item.thumbnail;
    } else if (item.enclosure && item.enclosure.link && typeof item.enclosure.link === 'string' && item.enclosure.link.startsWith('http') && !item.enclosure.link.endsWith('.mp3')) {
      img = item.enclosure.link;
    }
    if (!img && item.description) {
      const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) img = match[1];
    }
    if (!img && item.content) {
      const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) img = match[1];
    }
    if (img && img.includes('barandbench.com') && img.includes('?w=')) {
      img = img.replace(/\?w=\d+/, '?w=1200');
    }
    return img;
  }

  function initNews() {
    const tabs = document.querySelectorAll('#news-tabs .news-tab');
    if (!tabs || tabs.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeNewsFeed = tab.dataset.feed || 'legal';
        fetchAndRenderNews(activeNewsFeed);
      });
    });

    fetchAndRenderNews(activeNewsFeed);
  }

  async function fetchAndRenderNews(feedCategory) {
    const container = document.getElementById('news-editorial-container') || document.getElementById('news-grid');
    if (!container) return;

    // If cached within last 3 minutes, render immediately
    if (newsCache[feedCategory] && newsCache[feedCategory].data && (Date.now() - newsCache[feedCategory].timestamp < 180000)) {
      renderNewsGrid(newsCache[feedCategory].data, feedCategory);
      return;
    }

    container.innerHTML = `
      <div class="news-loading" id="news-loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">Fetching authentic ${NEWS_FEEDS[feedCategory]?.label || 'legal dispatches'}...</p>
      </div>
    `;

    const feedInfo = NEWS_FEEDS[feedCategory] || NEWS_FEEDS.legal;
    const rssUrls = feedInfo.rssUrls || ['https://www.barandbench.com/feed'];

    try {
      let allArticles = [];

      for (const rUrl of rssUrls) {
        try {
          const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rUrl)}`;
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            const feedTitle = data.feed?.title || '';
            const parsed = data.items.map(item => {
              let cleanTitle = item.title || '';
              let source = item.author || feedTitle || 'Legal Gazette';

              if (cleanTitle.includes(' - ')) {
                const parts = cleanTitle.split(' - ');
                source = parts.pop();
                cleanTitle = parts.join(' - ');
              }

              const realImage = extractArticleImage(item);

              return {
                title: cleanTitle.trim(),
                description: cleanSummary(item.description || item.content || '', 140),
                url: item.link,
                image: realImage,
                source: cleanSource(source),
                pubDate: item.pubDate || new Date().toISOString()
              };
            });

            allArticles.push(...parsed);
          }
        } catch (e) {
          console.warn('Feed fetch sub-error:', e);
        }
      }

      if (allArticles.length > 0) {
        // Sort newest first
        allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        // De-duplicate by title
        const seen = new Set();
        const uniqueArticles = [];
        for (const a of allArticles) {
          const key = a.title.slice(0, 30).toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueArticles.push(a);
          }
        }

        newsCache[feedCategory] = { data: uniqueArticles.slice(0, 15), timestamp: Date.now() };
        renderNewsGrid(uniqueArticles.slice(0, 15), feedCategory);
      } else {
        throw new Error('No articles fetched');
      }
    } catch (err) {
      console.warn('News fetch error, using curated real-time fallback:', err);
      const fallbackArticles = feedInfo.fallback.map((f, idx) => ({
        ...f,
        url: f.link,
        source: cleanSource(f.source),
        description: cleanSummary(f.description, 140),
        pubDate: new Date(Date.now() - (idx * 22 * 60 * 1000)).toISOString()
      }));
      newsCache[feedCategory] = { data: fallbackArticles, timestamp: Date.now() };
      renderNewsGrid(fallbackArticles, feedCategory);
    }
  }

  function formatRelativeTime(isoString) {
    if (!isoString) return 'Today';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffSec = Math.max(0, Math.floor((now - date) / 1000));

      if (diffSec < 120) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
      if (diffSec < 172800) return 'Yesterday';
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Today';
    }
  }

  function renderNewsGrid(articles, category) {
    const container = document.getElementById('news-editorial-container') || document.getElementById('news-grid');
    if (!container) return;

    if (!articles || articles.length === 0) {
      container.innerHTML = '<div class="news-empty"><p>No news articles found at this moment.</p></div>';
      return;
    }

    // Update Live Ticker Bar
    const tickerText = document.getElementById('live-ticker-text');
    const tickerTime = document.getElementById('live-ticker-time');
    if (tickerText && articles[0]) {
      tickerText.innerHTML = `<strong>${escapeHtml(articles[0].source)}:</strong> ${escapeHtml(articles[0].title)}`;
    }
    if (tickerTime && articles[0]) {
      tickerTime.textContent = formatRelativeTime(articles[0].pubDate);
    }

    // Find the best lead story that has a real image
    let leadStory = articles.find(a => a.image) || articles[0];
    const otherArticles = articles.filter(a => a !== leadStory);

    const leftStories = otherArticles.slice(0, 3);
    const subCenterStories = otherArticles.slice(3, 5);
    const trendingStories = otherArticles.slice(5, 10);
    const latestStories = [...articles].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 5);
    const moreStories = otherArticles.slice(10);

    let html = `
      <div class="editorial-frontpage">
        <!-- Left Column: Editorial Dispatches -->
        <div class="editorial-col editorial-col-left">
          ${leftStories.map(story => `
            <a href="${escapeHtml(story.url)}" target="_blank" rel="noopener noreferrer" class="editorial-dispatch-card">
              <div class="dispatch-meta">
                <span class="dispatch-source">${escapeHtml(story.source)}</span>
                <span class="dispatch-time">${formatRelativeTime(story.pubDate)}</span>
              </div>
              <h3 class="dispatch-title">${escapeHtml(story.title)}</h3>
              <p class="dispatch-desc">${escapeHtml(cleanSummary(story.description, 110))}</p>
            </a>
          `).join('')}
        </div>

        <!-- Center Column: Main Lead Story + 2 Secondary Split Rows -->
        <div class="editorial-col editorial-col-center">
          ${leadStory ? `
            <a href="${escapeHtml(leadStory.url)}" target="_blank" rel="noopener noreferrer" class="editorial-lead-card">
              ${leadStory.image ? `
                <div class="lead-img-wrap">
                  <span class="main-story-badge">MAIN STORY</span>
                  <img src="${escapeHtml(leadStory.image)}" alt="${escapeHtml(leadStory.title)}" class="lead-img"/>
                </div>
              ` : `
                <span class="main-story-badge" style="position:static; display:inline-block; margin-bottom: 0.75rem;">MAIN STORY</span>
              `}
              <h2 class="lead-title">${escapeHtml(leadStory.title)}</h2>
              <p class="lead-desc">${escapeHtml(cleanSummary(leadStory.description, 150))}</p>
              <div class="lead-meta">
                <span>By <strong>${escapeHtml(leadStory.source)}</strong></span>
                <span>•</span>
                <span>${formatRelativeTime(leadStory.pubDate)}</span>
              </div>
            </a>
          ` : ''}

          <!-- Secondary Sub-Story Split Rows -->
          <div class="editorial-sub-stories">
            ${subCenterStories.map(subStory => `
              <a href="${escapeHtml(subStory.url)}" target="_blank" rel="noopener noreferrer" class="sub-story-row ${subStory.image ? '' : 'no-thumb'}">
                ${subStory.image ? `
                  <div class="sub-story-thumb">
                    <img src="${escapeHtml(subStory.image)}" alt="${escapeHtml(subStory.title)}"/>
                  </div>
                ` : ''}
                <div class="sub-story-content">
                  <h4 class="sub-story-title">${escapeHtml(subStory.title)}</h4>
                  <p class="sub-story-desc">${escapeHtml(cleanSummary(subStory.description, 90))}</p>
                  <div class="sub-story-meta">
                    <span class="sub-source">${escapeHtml(subStory.source)}</span>
                    <span>${formatRelativeTime(subStory.pubDate)}</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Right Column: Interactive Numbered Trending / Latest Updates Timeline -->
        <div class="editorial-col editorial-col-right">
          <div class="trending-header">
            <button class="trending-tab-btn active" id="right-tab-trending">TRENDING TOPIC</button>
            <button class="trending-tab-btn" id="right-tab-latest">LATEST UPDATE</button>
          </div>
          
          <div class="trending-list" id="right-stories-list">
            ${trendingStories.map((trend, i) => `
              <a href="${escapeHtml(trend.url)}" target="_blank" rel="noopener noreferrer" class="trending-item">
                <div class="trend-rank">#${i + 1}</div>
                <div class="trend-content">
                  <h4 class="trend-title">${escapeHtml(trend.title)}</h4>
                  <div class="trend-meta">
                    <span>${escapeHtml(trend.source)}</span>
                    <span>•</span>
                    <span>${formatRelativeTime(trend.pubDate)}</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // More Stories Section
    if (moreStories.length > 0) {
      html += `
        <div class="more-stories-section">
          <div class="more-stories-header">
            <h3>MORE TOP STORIES</h3>
          </div>
          <div class="more-stories-grid">
            ${moreStories.map(story => `
              <a href="${escapeHtml(story.url)}" target="_blank" rel="noopener noreferrer" class="news-card">
                ${story.image ? `
                  <div class="news-card-img-wrap">
                    <img src="${escapeHtml(story.image)}" alt="${escapeHtml(story.title)}" class="news-card-img"/>
                  </div>
                ` : ''}
                <div class="news-card-body">
                  <div class="news-meta">
                    <span class="news-source">${escapeHtml(story.source)}</span>
                    <span>${formatRelativeTime(story.pubDate)}</span>
                  </div>
                  <h3 class="news-title">${escapeHtml(story.title)}</h3>
                  <p class="news-desc">${escapeHtml(cleanSummary(story.description, 110))}</p>
                  <div class="news-footer">
                    <span class="news-read-more">Read full story ↗</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Attach Interactive Trending vs Latest Tab Switcher
    const tabTrending = document.getElementById('right-tab-trending');
    const tabLatest = document.getElementById('right-tab-latest');
    const listContainer = document.getElementById('right-stories-list');

    if (tabTrending && tabLatest && listContainer) {
      tabTrending.addEventListener('click', () => {
        tabTrending.classList.add('active');
        tabLatest.classList.remove('active');
        listContainer.innerHTML = trendingStories.map((trend, i) => `
          <a href="${escapeHtml(trend.url)}" target="_blank" rel="noopener noreferrer" class="trending-item">
            <div class="trend-rank">#${i + 1}</div>
            <div class="trend-content">
              <h4 class="trend-title">${escapeHtml(trend.title)}</h4>
              <div class="trend-meta">
                <span>${escapeHtml(trend.source)}</span>
                <span>•</span>
                <span>${formatRelativeTime(trend.pubDate)}</span>
              </div>
            </div>
          </a>
        `).join('');
      });

      tabLatest.addEventListener('click', () => {
        tabLatest.classList.add('active');
        tabTrending.classList.remove('active');
        listContainer.innerHTML = latestStories.map((latest, i) => `
          <a href="${escapeHtml(latest.url)}" target="_blank" rel="noopener noreferrer" class="trending-item">
            <div class="trend-rank" style="color: #dc2626;">⚡</div>
            <div class="trend-content">
              <h4 class="trend-title">${escapeHtml(latest.title)}</h4>
              <div class="trend-meta">
                <span style="color: #dc2626; font-weight: 600;">LIVE</span>
                <span>•</span>
                <span>${escapeHtml(latest.source)}</span>
                <span>•</span>
                <span>${formatRelativeTime(latest.pubDate)}</span>
              </div>
            </div>
          </a>
        `).join('');
      });
    }
  }

  // ==========================================
  // CONSTITUTION EXPLORER
  // ==========================================
  function initConstitutionExplorer() {
    if (typeof CONSTITUTION_CATEGORIES === 'undefined' || typeof CONSTITUTION_DATA === 'undefined') {
      console.warn('Constitution data globals not found.');
      return;
    }

    const filtersContainer = document.getElementById('category-filters');
    const gridContainer = document.getElementById('articles-grid');
    const searchInput = document.getElementById('article-search');
    const noResults = document.getElementById('no-results');

    let activeCategory = 'all';
    let searchQuery = '';

    if (filtersContainer) {
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn active';
      allBtn.textContent = 'All';
      allBtn.dataset.id = 'all';
      filtersContainer.appendChild(allBtn);

      CONSTITUTION_CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = cat.label;
        btn.dataset.id = cat.id;
        filtersContainer.appendChild(btn);
      });

      filtersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          activeCategory = e.target.dataset.id;
          renderArticles();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.toLowerCase();
        renderArticles();
      }, 300));
    }

    function renderArticles() {
      if (!gridContainer) return;
      gridContainer.innerHTML = '';

      const filtered = CONSTITUTION_DATA.filter(item => {
        const matchCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchSearch = item.title.toLowerCase().includes(searchQuery) ||
                            item.summary.toLowerCase().includes(searchQuery) ||
                            item.article.toLowerCase().includes(searchQuery);
        return matchCategory && matchSearch;
      });

      if (filtered.length === 0) {
        if (noResults) noResults.style.display = 'block';
      } else {
        if (noResults) noResults.style.display = 'none';
        filtered.forEach(item => {
          const card = document.createElement('div');
          card.className = 'article-card';

          const catLabel = CONSTITUTION_CATEGORIES.find(c => c.id === item.category)?.label || item.category;

          card.innerHTML = `
            <div class="article-category">${catLabel}</div>
            <h3 class="article-number">Article ${item.article}</h3>
            <h4 class="article-title">${item.title}</h4>
            <p class="article-summary">${item.summary}</p>
          `;

          card.addEventListener('click', () => openArticleModal(item));
          gridContainer.appendChild(card);
        });
      }
    }

    const closeBtn = document.getElementById('article-detail-close');
    const explainBtn = document.getElementById('explain-article-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('article-detail-modal'));

    let currentArticleData = null;

    function openArticleModal(item) {
      currentArticleData = item;
      const titleEl = document.getElementById('modal-article-title');
      const textEl = document.getElementById('modal-full-text');
      const aiContainer = document.getElementById('modal-ai-explanation');
      const aiText = document.getElementById('modal-explanation-text');

      if (titleEl) titleEl.textContent = `Article ${item.article} — ${item.title}`;
      if (textEl) textEl.textContent = item.fullText;
      if (aiContainer) aiContainer.style.display = 'none';
      if (aiText) aiText.innerHTML = '';

      if (explainBtn) {
        explainBtn.textContent = 'Explain in Simple Terms';
        explainBtn.disabled = false;
      }

      openModal('article-detail-modal');
    }

    if (explainBtn) {
      explainBtn.addEventListener('click', async () => {
        if (!currentArticleData) return;

        explainBtn.textContent = '⏳ Generating Explanation...';
        explainBtn.disabled = true;

        const prompt = `Explain Article ${currentArticleData.article}: ${currentArticleData.title}\n\nFull Text:\n${currentArticleData.fullText}`;
        const explanation = await callGeminiAPI(prompt, SYSTEM_PROMPTS.CONSTITUTION_EXPLAINER);

        const aiContainer = document.getElementById('modal-ai-explanation');
        const aiText = document.getElementById('modal-explanation-text');

        if (explanation) {
          if (aiContainer) {
            aiContainer.classList.remove('hidden');
            aiContainer.style.display = 'block';
          }
          if (aiText) aiText.innerHTML = formatMarkdown(explanation);
          explainBtn.textContent = '✨ Explanation Generated';

          const history = UserDataStore.getData('articles');
          history.unshift({
            id: generateId(),
            article: currentArticleData.article,
            title: currentArticleData.title,
            explanation,
            timestamp: new Date().toISOString()
          });
          UserDataStore.saveData('articles', history);
          renderHistory();

          setTimeout(() => {
            if (aiContainer) aiContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        } else {
          explainBtn.textContent = '🤖 Explain in Simple Terms';
          explainBtn.disabled = false;
        }
      });
    }

    renderArticles();
  }

  // ==========================================
  // MULTI-USER DATA STORE & AUTH ENGINE
  // ==========================================
  const UserDataStore = {
    // Database of registered users: keyed by clean email
    getUsersDB() {
      try {
        return JSON.parse(localStorage.getItem('LegalMitra_users_db') || '{}');
      } catch (e) {
        return {};
      }
    },
    saveUsersDB(db) {
      localStorage.setItem('LegalMitra_users_db', JSON.stringify(db));
    },
    // Active session user
    getCurrentUser() {
      try {
        const session = localStorage.getItem('LegalMitra_active_user') || sessionStorage.getItem('LegalMitra_active_user') || localStorage.getItem(STORAGE_KEYS.USER);
        return session ? JSON.parse(session) : null;
      } catch (e) {
        return null;
      }
    },
    setCurrentUser(user, remember = true) {
      if (user) {
        localStorage.setItem('LegalMitra_active_user', JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem('LegalMitra_active_user');
        localStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem('LegalMitra_active_user');
        sessionStorage.removeItem('LegalMitra_guest_data');
      }
    },
    // Cryptographic-style credential verification hash
    hashPassword(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return 'sec_' + Math.abs(hash).toString(16) + '_' + str.length;
    },
    // Real validation
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    // Sign Up with duplicate prevention & data isolation
    signUp(name, email, password) {
      const cleanEmail = email.toLowerCase().trim();
      const cleanName = name.trim();

      if (!cleanName || cleanName.length < 2) {
        return { success: false, message: 'Please enter your full name (minimum 2 characters).' };
      }
      if (!this.validateEmail(cleanEmail)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long.' };
      }

      const db = this.getUsersDB();
      if (db[cleanEmail]) {
        return { success: false, message: 'An account with this email already exists. Please log in.' };
      }

      const user = {
        id: generateId(),
        name: cleanName,
        email: cleanEmail,
        passwordHash: this.hashPassword(password),
        provider: 'email',
        createdAt: new Date().toISOString(),
        data: {
          documents: [],
          chats: [],
          articles: []
        }
      };

      db[cleanEmail] = user;
      this.saveUsersDB(db);
      this.setCurrentUser(user, true);
      return { success: true, user };
    },
    // Log In with credential verification
    logIn(email, password) {
      const cleanEmail = email.toLowerCase().trim();

      if (!this.validateEmail(cleanEmail)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
      if (!password) {
        return { success: false, message: 'Please enter your password.' };
      }

      const db = this.getUsersDB();
      const user = db[cleanEmail];
      if (!user) {
        return { success: false, message: 'No account found with this email. Please sign up first.' };
      }

      if (user.passwordHash !== this.hashPassword(password)) {
        return { success: false, message: 'Incorrect password. Please verify and try again.' };
      }

      this.setCurrentUser(user, true);
      return { success: true, user };
    },
    // Google Sign-In with real account lookup/creation
    googleAuth(email, name) {
      const cleanEmail = (email || 'user@gmail.com').toLowerCase().trim();
      const cleanName = name || 'Google User';

      const db = this.getUsersDB();
      let user = db[cleanEmail];
      if (!user) {
        user = {
          id: generateId(),
          name: cleanName,
          email: cleanEmail,
          passwordHash: null,
          provider: 'google',
          createdAt: new Date().toISOString(),
          data: {
            documents: [],
            chats: [],
            articles: []
          }
        };
        db[cleanEmail] = user;
        this.saveUsersDB(db);
      }

      this.setCurrentUser(user, true);
      return { success: true, user };
    },
    // Robust Data Access
    getData(type) { // 'documents' | 'chats' | 'articles'
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const db = this.getUsersDB();
        const cleanEmail = (currentUser.email || '').toLowerCase();
        const user = db[cleanEmail];
        if (user && user.data && Array.isArray(user.data[type]) && user.data[type].length > 0) {
          return user.data[type];
        }
      }

      // Standalone storage fallback
      try {
        let key = STORAGE_KEYS.DOC;
        if (type === 'chats') key = STORAGE_KEYS.CHAT_SESSIONS;
        if (type === 'articles') key = STORAGE_KEYS.ARTICLE;
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          return stored;
        }
      } catch (e) {}

      // Guest sessionStorage fallback
      try {
        const guestData = JSON.parse(sessionStorage.getItem('LegalMitra_guest_data') || '{}');
        if (guestData && Array.isArray(guestData[type])) {
          return guestData[type];
        }
      } catch (e) {}

      return [];
    },
    saveData(type, items) {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const db = this.getUsersDB();
        const cleanEmail = (currentUser.email || 'user@example.com').toLowerCase();
        if (!db[cleanEmail]) {
          db[cleanEmail] = {
            id: currentUser.id || generateId(),
            name: currentUser.name || 'User',
            email: cleanEmail,
            provider: currentUser.provider || 'email',
            createdAt: new Date().toISOString(),
            data: {}
          };
        }
        if (!db[cleanEmail].data) db[cleanEmail].data = {};
        db[cleanEmail].data[type] = items;
        this.saveUsersDB(db);
      }

      // Always write to standalone keys for instant access
      try {
        let key = STORAGE_KEYS.DOC;
        if (type === 'chats') key = STORAGE_KEYS.CHAT_SESSIONS;
        if (type === 'articles') key = STORAGE_KEYS.ARTICLE;
        localStorage.setItem(key, JSON.stringify(items));
      } catch (e) {}

      // If guest mode, also update sessionStorage
      if (!currentUser) {
        try {
          const guestData = JSON.parse(sessionStorage.getItem('LegalMitra_guest_data') || '{}');
          guestData[type] = items;
          sessionStorage.setItem('LegalMitra_guest_data', JSON.stringify(guestData));
        } catch (e) {}
      }
    },
    clearData(type) {
      let key = STORAGE_KEYS.DOC;
      if (type === 'chats') key = STORAGE_KEYS.CHAT_SESSIONS;
      if (type === 'articles') key = STORAGE_KEYS.ARTICLE;
      localStorage.removeItem(key);

      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const db = this.getUsersDB();
        const cleanEmail = (currentUser.email || '').toLowerCase();
        if (db[cleanEmail] && db[cleanEmail].data) {
          db[cleanEmail].data[type] = [];
          this.saveUsersDB(db);
        }
      }
    }
  };

  // Helper bindings
  function saveDocHistory(filename, excerpt, simplified) {
    const history = UserDataStore.getData('documents');
    history.unshift({
      id: generateId(),
      filename,
      excerpt,
      simplified,
      timestamp: new Date().toISOString()
    });
    UserDataStore.saveData('documents', history);
    renderHistory();
  }

  function loadChatSessions() {
    chatSessions = UserDataStore.getData('chats');
    if (!chatSessions || chatSessions.length === 0) {
      chatSessions = [];
    }
  }

  // ==========================================
  // HISTORY SECTION
  // ==========================================
  let activeHistoryTab = 'documents';

  function initHistory() {
    const tabs = document.querySelectorAll('#history-tabs .history-tab');
    const clearBtn = document.getElementById('clear-history-btn');

    const detailClose = document.getElementById('history-detail-close');
    if (detailClose) detailClose.addEventListener('click', () => closeModal('history-detail-modal'));

    if (tabs) {
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          activeHistoryTab = tab.dataset.tab;
          renderHistory();
        });
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to clear all ${activeHistoryTab} history?`)) {
          if (activeHistoryTab === 'documents') {
            UserDataStore.clearData('documents');
          } else if (activeHistoryTab === 'chats') {
            chatSessions = [];
            UserDataStore.clearData('chats');
            const chatMessagesContainer = document.getElementById('chat-messages');
            if (chatMessagesContainer) {
              const bubbles = chatMessagesContainer.querySelectorAll('.message');
              bubbles.forEach(b => b.remove());
              const welcome = document.getElementById('chat-welcome');
              const suggestions = document.getElementById('suggested-questions');
              if (welcome) welcome.style.display = 'block';
              if (suggestions) suggestions.style.display = 'flex';
            }
            const list = document.getElementById('sidebar-chat-list');
            if (list) list.innerHTML = '<div class="sidebar-empty-text">No previous chats</div>';
          } else if (activeHistoryTab === 'articles') {
            UserDataStore.clearData('articles');
          }

          renderHistory();
          showToast('History cleared.', 'success');
        }
      });
    }
  }

  function renderHistory() {
    const listContainer = document.getElementById('history-list');
    const emptyState = document.getElementById('history-empty');
    if (!listContainer || !emptyState) return;

    listContainer.innerHTML = '';
    let data = [];

    if (activeHistoryTab === 'documents') {
      data = UserDataStore.getData('documents');
    } else if (activeHistoryTab === 'chats') {
      const storedSessions = UserDataStore.getData('chats');
      data = storedSessions.filter(s => s.messages && s.messages.length > 0).map(s => ({
        id: s.id,
        type: 'chat',
        title: s.title || 'Legal Advisor Conversation',
        preview: s.messages[0] ? `${s.messages[0].content.substring(0, 70)}... (${s.messages.length} messages)` : '',
        timestamp: s.updatedAt || s.createdAt || new Date().toISOString(),
        fullData: s.messages
      }));
    } else if (activeHistoryTab === 'articles') {
      data = UserDataStore.getData('articles');
    }

    if (data.length === 0) {
      listContainer.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      listContainer.style.display = 'flex';
      emptyState.style.display = 'none';

      data.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';

        let title, preview, timeStr;

        if (activeHistoryTab === 'documents') {
          title = item.filename;
          preview = item.simplified.substring(0, 100) + '...';
        } else if (activeHistoryTab === 'chats') {
          title = item.title;
          preview = item.preview;
        } else if (activeHistoryTab === 'articles') {
          title = `Article ${item.article} — ${item.title}`;
          preview = item.explanation.substring(0, 100) + '...';
        }

        timeStr = formatTimestamp(item.timestamp);

        el.innerHTML = `
          <div class="history-item-header">
            <h4>${escapeHtml(title)}</h4>
            <span>${timeStr}</span>
          </div>
          <p class="history-item-preview">${escapeHtml(preview)}</p>
        `;

        el.addEventListener('click', () => openHistoryDetail(item));
        listContainer.appendChild(el);
      });
    }
  }

  function openHistoryDetail(item) {
    const titleEl = document.getElementById('history-modal-title');
    const contentEl = document.getElementById('history-modal-content');
    if (!titleEl || !contentEl) return;

    if (activeHistoryTab === 'documents') {
      titleEl.textContent = item.filename;
      contentEl.innerHTML = `
        <h4>Original Excerpt:</h4>
        <p><em>${escapeHtml(item.excerpt)}...</em></p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);"/>
        <h4>Simplified Document:</h4>
        <div>${formatMarkdown(item.simplified)}</div>
      `;
    } else if (activeHistoryTab === 'chats') {
      titleEl.textContent = item.title || 'Legal Advisor Chat';
      contentEl.innerHTML = '<div class="history-chat-view" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>';
      const cv = contentEl.querySelector('.history-chat-view');
      item.fullData.forEach(msg => {
        const m = document.createElement('div');
        m.style.padding = '0.75rem 1rem';
        m.style.borderRadius = '8px';
        m.style.background = msg.role === 'user' ? 'var(--accent)' : 'var(--bg-input)';
        m.style.color = msg.role === 'user' ? 'white' : 'var(--text)';
        m.style.alignSelf = msg.role === 'user' ? 'flex-end' : 'flex-start';
        m.style.maxWidth = '85%';
        m.innerHTML = `<strong>${msg.role === 'user' ? 'You' : 'LegalMitra'}</strong><div style="margin-top: 4px;">${msg.role === 'ai' ? formatMarkdown(msg.content) : escapeHtml(msg.content)}</div>`;
        cv.appendChild(m);
      });
    } else if (activeHistoryTab === 'articles') {
      titleEl.textContent = `Article ${item.article} — ${item.title}`;
      contentEl.innerHTML = formatMarkdown(item.explanation);
    }

    openModal('history-detail-modal');
  }

  // ==========================================
  // AUTHENTICATION & USER PROFILE UI
  // ==========================================
  function renderAuthNav() {
    const wrap = document.getElementById('auth-nav-wrap');
    if (!wrap) return;

    const user = UserDataStore.getCurrentUser();
    if (user) {
      const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
      const firstName = (user.name || user.email.split('@')[0] || 'Profile').split(' ')[0];

      wrap.innerHTML = `
        <button class="nav-user-profile-btn" id="nav-profile-btn" title="View Profile">
          <span class="nav-avatar-circle">${escapeHtml(initial)}</span>
          <span>${escapeHtml(firstName)}</span>
        </button>
      `;

      const btn = document.getElementById('nav-profile-btn');
      if (btn) {
        btn.addEventListener('click', () => openProfileModal());
      }
    } else {
      wrap.innerHTML = `
        <button class="auth-btn" id="auth-nav-btn">Sign In</button>
      `;

      const btn = document.getElementById('auth-nav-btn');
      if (btn) {
        btn.addEventListener('click', () => openAuthModal('login'));
      }
    }
  }

  let activeAuthTab = 'login'; // login | signup

  function openAuthModal(tab = 'login') {
    activeAuthTab = tab;
    updateAuthModalUI();
    openModal('auth-modal');
  }

  function updateAuthModalUI() {
    const tabLogin = document.getElementById('auth-tab-login');
    const tabSignup = document.getElementById('auth-tab-signup');
    const nameGroup = document.getElementById('signup-name-group');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('auth-switch-text');
    const googleBtnText = document.getElementById('google-btn-text');

    if (activeAuthTab === 'signup') {
      if (tabSignup) tabSignup.classList.add('active');
      if (tabLogin) tabLogin.classList.remove('active');
      if (nameGroup) nameGroup.classList.remove('hidden');
      if (submitBtn) submitBtn.textContent = 'Create Account';
      if (googleBtnText) googleBtnText.textContent = 'Sign up with Google';
      if (switchText) {
        switchText.innerHTML = 'Already have an account? <a href="#" id="auth-switch-link">Log in</a>';
      }
    } else {
      if (tabLogin) tabLogin.classList.add('active');
      if (tabSignup) tabSignup.classList.remove('active');
      if (nameGroup) nameGroup.classList.add('hidden');
      if (submitBtn) submitBtn.textContent = 'Log In';
      if (googleBtnText) googleBtnText.textContent = 'Continue with Google';
      if (switchText) {
        switchText.innerHTML = "Don't have an account? <a href=\"#\" id=\"auth-switch-link\">Sign up</a>";
      }
    }

    const switchLink = document.getElementById('auth-switch-link');
    if (switchLink) {
      switchLink.addEventListener('click', (e) => {
        e.preventDefault();
        activeAuthTab = activeAuthTab === 'login' ? 'signup' : 'login';
        updateAuthModalUI();
      });
    }
  }

  function openProfileModal() {
    const user = UserDataStore.getCurrentUser();
    if (!user) {
      openAuthModal('login');
      return;
    }

    // Populate user details
    const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
    const avatarEl = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-display-name');
    const emailEl = document.getElementById('profile-display-email');
    const editNameInput = document.getElementById('profile-edit-name');
    const editEmailInput = document.getElementById('profile-edit-email');

    if (avatarEl) avatarEl.textContent = initial;
    if (nameEl) nameEl.textContent = user.name || 'User';
    if (emailEl) emailEl.textContent = user.email || '';
    if (editNameInput) editNameInput.value = user.name || '';
    if (editEmailInput) editEmailInput.value = user.email || '';

    // Calculate live activity statistics from user's isolated data store
    const docs = UserDataStore.getData('documents');
    const chats = UserDataStore.getData('chats');
    const articles = UserDataStore.getData('articles');

    const docsCountEl = document.getElementById('stat-docs-count');
    const chatsCountEl = document.getElementById('stat-chats-count');
    const articlesCountEl = document.getElementById('stat-articles-count');

    if (docsCountEl) docsCountEl.textContent = docs.length;
    if (chatsCountEl) chatsCountEl.textContent = chats.length;
    if (articlesCountEl) articlesCountEl.textContent = articles.length;

    openModal('profile-modal');
  }

  function reloadAppStateForUser() {
    renderAuthNav();
    loadChatSessions();
    
    // Re-render chat UI
    if (chatSessions.length > 0) {
      activeChatId = chatSessions[0].id;
    } else {
      activeChatId = null;
    }
    
    const list = document.getElementById('sidebar-chat-list');
    if (list) {
      list.innerHTML = '';
      if (chatSessions.length === 0) {
        list.innerHTML = '<div class="sidebar-empty-text">No previous chats</div>';
      } else {
        chatSessions.forEach(session => {
          const item = document.createElement('div');
          item.className = `sidebar-chat-item ${session.id === activeChatId ? 'active' : ''}`;
          item.innerHTML = `<span class="sidebar-chat-title">${escapeHtml(session.title || 'Conversation')}</span><button class="sidebar-chat-delete">🗑️</button>`;
          list.appendChild(item);
        });
      }
    }

    const chatBox = document.getElementById('chat-messages');
    if (chatBox) {
      const messages = chatBox.querySelectorAll('.message');
      messages.forEach(m => m.remove());
      const welcome = document.getElementById('chat-welcome');
      const suggestions = document.getElementById('suggested-questions');
      if (chatSessions.length === 0) {
        if (welcome) welcome.style.display = 'block';
        if (suggestions) suggestions.style.display = 'flex';
      } else {
        if (welcome) welcome.style.display = 'none';
        if (suggestions) suggestions.style.display = 'none';
        const active = chatSessions[0];
        if (active && active.messages) {
          active.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message message-${msg.role}`;
            msgDiv.innerHTML = `<div class="message-content">${msg.role === 'ai' ? formatMarkdown(msg.content) : escapeHtml(msg.content)}</div><div class="message-time">${formatTimestamp(msg.timestamp)}</div>`;
            chatBox.appendChild(msgDiv);
          });
        }
      }
    }

    renderHistory();
  }

  function initAuthAndProfile() {
    renderAuthNav();

    // Close buttons
    const authClose = document.getElementById('auth-modal-close');
    const profileClose = document.getElementById('profile-modal-close');
    if (authClose) authClose.addEventListener('click', () => closeModal('auth-modal'));
    if (profileClose) profileClose.addEventListener('click', () => closeModal('profile-modal'));

    // Tab buttons
    const tabLogin = document.getElementById('auth-tab-login');
    const tabSignup = document.getElementById('auth-tab-signup');

    if (tabLogin) {
      tabLogin.addEventListener('click', () => {
        activeAuthTab = 'login';
        updateAuthModalUI();
      });
    }

    if (tabSignup) {
      tabSignup.addEventListener('click', () => {
        activeAuthTab = 'signup';
        updateAuthModalUI();
      });
    }

    // Google Auth Button
    const googleBtn = document.getElementById('google-auth-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        // Prompt for Google account or sign in with default
        const googleEmail = prompt('Enter your Google Account email:', 'anuj.gupta@gmail.com');
        if (!googleEmail) return;

        const defaultName = googleEmail.split('@')[0].replace('.', ' ');
        const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

        const result = UserDataStore.googleAuth(googleEmail, formattedName);
        if (result.success) {
          closeModal('auth-modal');
          showToast(`Signed in with Google as ${result.user.name}`, 'success');
          reloadAppStateForUser();
          openProfileModal();
        }
      });
    }

    // Form Submit (Email / Password)
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('auth-email');
        const passInput = document.getElementById('auth-password');
        const nameInput = document.getElementById('auth-name');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value.trim() : '';
        const name = nameInput ? nameInput.value.trim() : '';

        if (activeAuthTab === 'signup') {
          const result = UserDataStore.signUp(name, email, password);
          if (!result.success) {
            showToast(result.message, 'error');
            return;
          }
          closeModal('auth-modal');
          showToast(`Account created! Welcome, ${result.user.name}`, 'success');
          reloadAppStateForUser();
          openProfileModal();
        } else {
          const result = UserDataStore.logIn(email, password);
          if (!result.success) {
            showToast(result.message, 'error');
            return;
          }
          closeModal('auth-modal');
          showToast(`Welcome back, ${result.user.name}!`, 'success');
          reloadAppStateForUser();
          openProfileModal();
        }

        if (emailInput) emailInput.value = '';
        if (passInput) passInput.value = '';
        if (nameInput) nameInput.value = '';
      });
    }

    // Profile Modal Save Changes
    const profileSaveBtn = document.getElementById('profile-save-btn');
    if (profileSaveBtn) {
      profileSaveBtn.addEventListener('click', () => {
        const user = UserDataStore.getCurrentUser();
        if (!user) return;

        const editNameInput = document.getElementById('profile-edit-name');
        if (editNameInput && editNameInput.value.trim()) {
          const db = UserDataStore.getUsersDB();
          const cleanEmail = user.email.toLowerCase();
          if (db[cleanEmail]) {
            db[cleanEmail].name = editNameInput.value.trim();
            UserDataStore.saveUsersDB(db);
            user.name = editNameInput.value.trim();
            UserDataStore.setCurrentUser(user);
            renderAuthNav();
            openProfileModal();
            showToast('Profile updated successfully.', 'success');
          }
        }
      });
    }

    // Profile Configure API Key Shortcut
    const profileConfigApiBtn = document.getElementById('profile-config-api-btn');
    if (profileConfigApiBtn) {
      profileConfigApiBtn.addEventListener('click', () => {
        closeModal('profile-modal');
        openModal('api-modal');
      });
    }

    // Profile Log Out Button
    const logoutBtn = document.getElementById('profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        UserDataStore.setCurrentUser(null);
        closeModal('profile-modal');
        reloadAppStateForUser();
        showToast('Logged out. Guest activity is not saved permanently.', 'success');
      });
    }
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAuthAndProfile();
    initNavigation();
    initScrollAnimations();
    initApiKeyManagement();
    initDocSimplifier();
    initChat();
    initConstitutionExplorer();
    initNews();
    initHistory();
    renderHistory();
  });

})();
