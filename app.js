const sendchatbtn = document.querySelector(".chat-input span");
const chatinput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox"); 
const apikey='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';
const chatbotToggler = document.querySelector(".chatbot-toggler");
const inputInitHeight = chatinput.scrollHeight;
let usermessage;
const createmsg = (usermessage, classname) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", classname);
    let childcontent = classname === 'outgoing' ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatli.innerHTML = childcontent;
    chatli.querySelector("p").textContent=usermessage;
    return chatli;
}
const generateresponse=(incomingchatli)=>{
    const msgelement=incomingchatli.querySelector("p");
    const apiurl="https://api.openai.com/v1/chat/completions";
    const requestoptions={
        method:"POST",
        headers:{
            "content-Type":"application/json",
            "Authorization":`Bearer ${apikey}`,

        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
  messages:[{"role": "system", "content": usermessage}]
        })
    }
    const response=fetch(apiurl,requestoptions).then(res=>res.json()).then(data=>{
        msgelement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        msgelement.textContent="oops something went wrong";
        msgelement.classList.add("error");
    }).finally(()=>chatbox.scroll(0,chatbox.scrollHeight));

}
const handlechat = () => {
    usermessage = chatinput.value.trim();
    if (!usermessage)
        return;
        chatinput.value="";
        chatinput.style.height = `${inputInitHeight}px`;
        {chatbox.appendChild(createmsg(usermessage, 'outgoing'));
        chatbox.scroll(0,chatbox.scrollHeight);
        setTimeout(()=>{
            const incomingchatli=createmsg("....thinking", 'incoming');
            chatbox.appendChild(incomingchatli);
            chatbox.scroll(0,chatbox.scrollHeight);
            generateresponse(incomingchatli);
        },600);
    }
}
chatinput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatinput.style.height = `${inputInitHeight}px`;
    chatinput.style.height = `${chatinput.scrollHeight}px`;
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter"&&!event.shiftKey && chatinput.value.trim()) {
        event.preventDefault();
        handlechat();
    }
});
chatinput.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        const cursorPos = chatinput.selectionStart;
        const textBeforeCursor = chatinput.value.substring(0, cursorPos);
        const textAfterCursor = chatinput.value.substring(cursorPos);
        chatinput.value = textBeforeCursor + "\n" + textAfterCursor;
        chatinput.selectionStart = cursorPos + 1;
        chatinput.selectionEnd = cursorPos + 1;
    }});
sendchatbtn.addEventListener("click", handlechat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));