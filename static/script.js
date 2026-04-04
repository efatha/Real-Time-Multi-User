const socket = io();

socket.on("receive_message", (data) => {
    const box = document.getElementById("chat-box");
    box.innerHTML += `<div><strong>User:</strong> ${data.message}</div>`;
    box.scrollTop = box.scrollHeight;
});

function sendMessage() {
    const input = document.getElementById("chat-input");
    socket.emit("send_message", { message: input.value });
    input.value = "";
}