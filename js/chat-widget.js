// Expose the logic globally so app.js can call it AFTER the HTML is injected
window.initializeChatLogic = function() {
    const fab = document.getElementById("chat-fab");
    const container = document.getElementById("doom-chat-container");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const transmitBtn = document.getElementById("chat-transmit-btn");

    // Safety check: ensure elements exist before attaching listeners
    if (!fab || !container) {
        console.error(">> ERR: Chat DOM elements missing. Injection failed.");
        return;
    }

    // 1. Initialize State
    let chatHistory = [];
    const API_URL = "https://choppedcheese-platodoomcave.hf.space/chat";
    let isAwaitingResponse = false;

    // 2. UI Toggling Logic
    function toggleChat() {
        container.classList.toggle("active");
        if (container.classList.contains("active")) {
            chatInput.focus();
            scrollToBottom();
        }
    }

    fab.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", () => container.classList.remove("active"));

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