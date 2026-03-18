// Expose the logic globally so app.js can call it AFTER the HTML is injected
window.initializeChatLogic = function() {
    const fab = document.getElementById("chat-fab");
    const container = document.getElementById("doom-chat-container");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const transmitBtn = document.getElementById("chat-transmit-btn");
    const callout = document.getElementById("chat-callout");
    const widgetContainer = document.getElementById("chat-widget-container");

    // Safety check: ensure elements exist before attaching listeners
    if (!fab || !container) {
        console.error(">> ERR: Chat DOM elements missing. Injection failed.");
        return;
    }

    // --- NEW: HORIZONTAL SVG INJECTION ---
    // Remove any existing module to prevent duplicates on hot-reload
    const existingModule = document.getElementById("follow-module");
    if (existingModule) existingModule.remove();

    const followHTML = `
        <div id="follow-module" class="follow-module">
            <span class="follow-label">[SYS_LINKS] >></span>
            
            <a href="https://x.com/PLATODOOM" target="_blank" class="follow-link">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                X
            </a>
            
            <a href="https://www.linkedin.com/in/plato-doom-b06b603b7/" target="_blank" class="follow-link">
                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LINKEDIN
            </a>
        </div>
    `;
    
    // Inject immediately before the FAB inside the container
    if (widgetContainer) {
        fab.insertAdjacentHTML('beforebegin', followHTML);
    }
    const followModule = document.getElementById("follow-module");
    // ----------------------------------------------------------------

    // 1. Initialize State
    let chatHistory = [];
    const API_URL = "https://choppedcheese-platodoomcave.hf.space/chat";
    let isAwaitingResponse = false;
    let isCalloutDismissed = false; // Callout state tracking

    // 2. UI Toggling Logic
    function toggleChat() {
        // Dismiss callout on first interaction
        if (callout && !isCalloutDismissed) {
            callout.classList.add('hidden');
            isCalloutDismissed = true;
            console.log(">> SYS_MSG: Callout permanently dismissed for session.");
        }

        // Toggle the main chat container
        container.classList.toggle("active");
        
        // Toggle the slide-out follow module
        if (followModule) {
            followModule.classList.toggle("revealed");
        }

        if (container.classList.contains("active")) {
            chatInput.focus();
            scrollToBottom();
        }
    }

    fab.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat); // Ensure closing retracts the menu too

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 3. DOM Message Appenders
    function appendMessage(role, text) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-msg", role);
        
        let prefix = "";
        if (role === "user") prefix = "USR_> ";
        else if (role === "villain") prefix = "DOOM_> ";
        else if (role === "system" || role === "error") prefix = "SYS_> ";

        // Securely add text and convert line breaks
        msgDiv.innerHTML = `<span style="font-weight:bold; opacity:0.7;">${prefix}</span>${text.replace(/\n/g, '<br>')}`;
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    let typingElement = null;
    function showTypingIndicator() {
        typingElement = document.createElement("div");
        typingElement.classList.add("chat-msg", "villain", "typing-indicator");
        typingElement.innerText = "DOOM_> COMPILING_RESPONSE...";
        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        if (typingElement && typingElement.parentNode) {
            typingElement.parentNode.removeChild(typingElement);
            typingElement = null;
        }
    }

    // 4. API Integration & Transmission
    async function handleTransmit() {
        const userText = chatInput.value.trim();
        if (!userText || isAwaitingResponse) return;

        // UI Updates for User Turn
        isAwaitingResponse = true;
        chatInput.value = "";
        appendMessage("user", userText);
        showTypingIndicator();

        try {
            // Send POST request matching the FastAPI Pydantic Model
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: userText,
                    history: chatHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            const villainReply = data.response;

            // UI Updates for Villain Turn
            removeTypingIndicator();
            appendMessage("villain", villainReply);

            // Update Global State context for the next turn
            chatHistory.push({ role: "user", content: userText });
            chatHistory.push({ role: "assistant", content: villainReply });

        } catch (error) {
            console.error("DOOM Chat API Error:", error);
            removeTypingIndicator();
            appendMessage("error", `CONNECTION SEVERED. [${error.message}]`);
        } finally {
            isAwaitingResponse = false;
            chatInput.focus();
        }
    }

    // 5. Event Listeners
    transmitBtn.addEventListener("click", handleTransmit);
    
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleTransmit();
        }
    });

    console.log("%c >> VILLAIN_OS LOGIC INITIALIZED ", "color: #ff3c00; font-weight: bold;");
};