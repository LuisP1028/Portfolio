// Expose the logic globally so app.js can call it AFTER the HTML is injected
window.initializeChatLogic = function() {
    const fab = document.getElementById("chat-fab");
    const container = document.getElementById("doom-chat-container");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const transmitBtn = document.getElementById("chat-transmit-btn");
    const callout = document.getElementById("chat-callout");

    // Safety check: ensure elements exist before attaching listeners
    if (!fab || !container) {
        console.error(">> ERR: Chat DOM elements missing. Injection failed.");
        return;
    }

    // --- NEW: Dynamically Inject the Follow Module behind the FAB ---
    if (!document.getElementById("follow-module")) {
        const followHTML = `
            <div id="follow-module" class="follow-module">
                <div id="follow-panel" class="follow-panel">
                    <div class="panel-header">FOLLOW DOOM</div>
                    <a href="https://x.com/PLATODOOM" target="_blank" class="follow-link">
                        <span style="font-family: sans-serif; font-weight: bold; margin-right: 8px;">𝕏</span> x
                    </a>
                    <a href="https://www.linkedin.com/in/plato-doom-b06b603b7/" target="_blank" class="follow-link">[LINKEDIN]</a>
                </div>
                <button id="follow-trigger-btn" class="follow-trigger">follow doom</button>
            </div>
        `;
        // Injects right before the FAB inside the container
        fab.insertAdjacentHTML('beforebegin', followHTML);
    }

    const followModule = document.getElementById("follow-module");
    const followTrigger = document.getElementById("follow-trigger-btn");
    const followPanel = document.getElementById("follow-panel");
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
            // If we are closing the chat, also hide the link panel if it's open
            if (!container.classList.contains("active") && followPanel) {
                followPanel.classList.remove("active");
            }
        }

        if (container.classList.contains("active")) {
            chatInput.focus();
            scrollToBottom();
        }
    }

    fab.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat); // Ensure closing retracts the menu too

    // Event Listener for the slide-out follow button
    if (followTrigger && followPanel) {
        followTrigger.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents click from bubbling 
            followPanel.classList.toggle("active");
        });
    }

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