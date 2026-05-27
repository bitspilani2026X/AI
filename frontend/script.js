const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
 
async function sendMessage() {
 
  const message = userInput.value.trim();
 
  if (message === "") return;
 
  /* =========================
     REMOVE WELCOME SCREEN
  ========================= */
 
  const welcomeScreen =
    document.getElementById("welcomeScreen");
 
  if (welcomeScreen) {
    welcomeScreen.remove();
  }
 
  /* =========================
     USER MESSAGE
  ========================= */
 
  const userMessageDiv =
    document.createElement("div");
 
  userMessageDiv.classList.add("user-message");
 
  userMessageDiv.innerHTML = `
 
    <div class="user-bubble">
      ${message}
    </div>
 
  `;
 
  chatContainer.appendChild(userMessageDiv);
 
  userInput.value = "";
 
  chatContainer.scrollTop =
    chatContainer.scrollHeight;
 
  /* =========================
     BOT TYPING
  ========================= */
 
  const typingDiv =
    document.createElement("div");
 
  typingDiv.classList.add("bot-message-box");
 
  typingDiv.innerHTML = `
 
    <div class="typing-animation">
      <span></span>
      <span></span>
      <span></span>
    </div>
 
  `;
 
  chatContainer.appendChild(typingDiv);
 
  chatContainer.scrollTop =
    chatContainer.scrollHeight;
 
  try {
 
    /* =========================
       RASA API CALL
    ========================= */
 
    const response = await fetch(
  "https://ai-g1jw.onrender.com/webhooks/rest/webhook",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      sender: "user",
      message: message
    })
  }
);
 
    const data = await response.json();
 
    typingDiv.remove();
 
    /* =========================
       BOT RESPONSE
    ========================= */
 
    // if (data.length > 0) {
 
    //   data.forEach((item) => {
 
    //     const botReply =
    //       document.createElement("div");
 
    //     botReply.classList.add("bot-message-box");
 
    //     botReply.innerHTML = `
       
    //       <div class="bot-reply">
 
    //         <div class="bot-title">
    //           BOT
    //         </div>
 
    //         <div class="bot-text">
    //           ${item.text}
    //         </div>
 
    //       </div>
 
    //     `;
 
    //     chatContainer.appendChild(botReply);
 
    //   });
 
    // } 

    // CODE FOR ONE BOT RESPONSE
//     if (data.length > 0) {

//   // Combine all bot messages
//   let combinedMessage = "";

//   data.forEach((item) => {

//     if (item.text) {
//       combinedMessage += item.text + "<br><br>";
//     }

//   });

//   // Create ONE bubble
//   const botReply =
//     document.createElement("div");

//   botReply.classList.add("bot-message-box");

//   botReply.innerHTML = `
 
//     <div class="bot-reply">

//       <div class="bot-title">
//         BOT
//       </div>

//       <div class="bot-text">
//         ${combinedMessage}
//       </div>

//     </div>

//   `;

//   chatContainer.appendChild(botReply);

// }

if (data.length > 0) {

  let combinedQuestion = "";

  let optionText = "";

  data.forEach((item) => {

    if (!item.text) return;

    const text = item.text;

    // Separate feedback messages
    if (
      text.includes("Correct") ||
      text.includes("Incorrect")
    ) {

      const feedbackBubble =
        document.createElement("div");

      feedbackBubble.classList.add("bot-message-box");

      feedbackBubble.innerHTML = `
      
        <div class="bot-reply">

          <div class="bot-title">
            BOT
          </div>

          <div class="bot-text">
            ${text}
          </div>

        </div>

      `;

      chatContainer.appendChild(feedbackBubble);

      return;
    }

    // Detect options
    if (
      text.includes("A)") &&
      text.includes("B)") &&
      text.includes("C)")
    ) {

      optionText = text;

    } else {

      combinedQuestion += text + "<br>";
    }

  });

  // Create buttons if options exist
  let buttonsHTML = "";

  const optionRegex =
    /A\)\s(.*?)\nB\)\s(.*?)\nC\)\s(.*)/s;

  const match =
    optionText.match(optionRegex);

  if (match) {

    const optionA = match[1];
    const optionB = match[2];
    const optionC = match[3];

    buttonsHTML = `
    
      <div class="quiz-buttons">

        <button onclick="sendOption('A')">
          A. ${optionA}
        </button>

        <button onclick="sendOption('B')">
          B. ${optionB}
        </button>

        <button onclick="sendOption('C')">
          C. ${optionC}
        </button>

      </div>

    `;
  }

  // ONE combined question bubble
  if (combinedQuestion || buttonsHTML) {

    const questionBubble =
      document.createElement("div");

    questionBubble.classList.add("bot-message-box");

    questionBubble.innerHTML = `
    
      <div class="bot-reply">

        <div class="bot-title">
          BOT
        </div>

        <div class="bot-text">
          ${combinedQuestion}
        </div>

        ${buttonsHTML}

      </div>

    `;

    chatContainer.appendChild(questionBubble);
  }
}
    else {
 
      const botReply =
        document.createElement("div");
 
      botReply.classList.add("bot-message-box");
 
      botReply.innerHTML = `
     
        <div class="bot-reply">
 
          <div class="bot-title">
            BOT
          </div>
 
          <div class="bot-text">
            Sorry, I could not understand that.
          </div>
 
        </div>
 
      `;
 
      chatContainer.appendChild(botReply);
    }
 
    chatContainer.scrollTop =
      chatContainer.scrollHeight;
 
  } catch (error) {
 
    typingDiv.remove();
 
    const errorReply =
      document.createElement("div");
 
    errorReply.classList.add("bot-message-box");
 
    errorReply.innerHTML = `
   
      <div class="bot-reply error">
 
        <div class="bot-title">
          BOT
        </div>
 
        <div class="bot-text">
          Unable to connect with Rasa server.
        </div>
 
      </div>
 
    `;
 
    chatContainer.appendChild(errorReply);
 
    console.error(error);
  }
}
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
 
function sendOption(option) {

  userInput.value = option;

  sendMessage();
}

function resetChat() {
  chatContainer.innerHTML = `
 
   <div class="welcome-screen" id="welcomeScreen">
 
  <div class="welcome-icon">
    <i class="fa-regular fa-comments"></i>
  </div>
 
  <h1>How can I help you?</h1>
 
  <p>
    let your questions find their answers in our chat.
  </p>
 
</div>
 
  `;
}
/* ===========================
   Voice To Text
=========================== */
 
const voiceBtn = document.getElementById("voiceBtn");
 
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
 
if (SpeechRecognition) {
 
  const recognition = new SpeechRecognition();
 
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
 
  voiceBtn.addEventListener("click", () => {
 
    recognition.start();
 
    voiceBtn.classList.add("listening");
 
    voiceBtn.innerHTML =
      '<i class="fa-solid fa-wave-square"></i>';
  });
 
  recognition.onresult = (event) => {
 
    const transcript = event.results[0][0].transcript;
 
    userInput.value = transcript;
  };
 
  recognition.onend = () => {
 
    voiceBtn.classList.remove("listening");
 
    voiceBtn.innerHTML =
      '<i class="fa-solid fa-microphone"></i>';
  };
 
} else {
 
  alert("Speech Recognition not supported in this browser.");
 
}
 
 
 
 
