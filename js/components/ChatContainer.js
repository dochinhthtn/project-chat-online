const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        * {
            font-family: Arial;
        }

        #chat-container {
            background-color: #f1f1f2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        #chat-info {
            font-size: 20px;
            padding: 15px;
            border-bottom: 1px solid #cccccc;
        }

        #send-message-form {
            padding: 0px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #message-content {
            width: calc(100% - 100px - 20px);
        }

        #send-message-btn {
            height: 40px;
            width: 100px;
            border: 1px solid #1995ad;
            background-color: #1995ad;
            border-radius: 5px;
            color: #ffffff;
        }
    </style>


    <div id="chat-container">
        <div id="chat-info">Nguyễn Văn A</div>
        <message-list></message-list>
        <form id="send-message-form">
            <input-wrapper id="message-content" label="" error="" type="text"></input-wrapper>
            <button id="send-message-btn">Gửi</button>
        </form>
    </div>
`;

export default class ChatContainer extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$chatInfo = this.shadowRoot.getElementById('chat-info');
        this.$messageList = this.shadowRoot.querySelector('message-list');
        this.$sendMessageForm = this.shadowRoot.getElementById('send-message-form');
        this.$messageContent = this.shadowRoot.getElementById('message-content');
    }

}

window.customElements.define('chat-container', ChatContainer);