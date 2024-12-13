const chatInput = document.querySelector(".chat-input textarea");
const sendChatButton = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chat-toggler");

let userMessage;

const createChatLi = (message, classname) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", classname);
  let chatContent =
    classname === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-icons">smart_toy</span><p>${message}</p>`;

  chatLi.innerHTML = chatContent;
  return chatLi;
};

// Function to generate the response by calling the backend
const generateResponse = (incomingChatLi) => {
  const API_URL = "http://localhost:3000/generate"; // Your backend API endpoint
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.response;
      scrollToBottom();
    })
    .catch((error) => {
      messageElement.textContent =
        "Oops, something went wrong. Please try again later.";
      scrollToBottom();
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  scrollToBottom();

  setTimeout(() => {
    const incomingChatLi = createChatLi("waiting...", "incoming");
    chatbox.appendChild(incomingChatLi);
    scrollToBottom();
    generateResponse(incomingChatLi);
  }, 600);
};

const scrollToBottom = () => {
  chatbox.scrollTop = chatbox.scrollHeight;
};

sendChatButton.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
