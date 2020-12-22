const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        * {
            font-family: Arial;
        }

        #friend-container {
            padding: 15px;
            border-bottom: 1px solid #cccccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #friend-email {
            font-size: 13px;
        }
    </style>

    <div id="friend-container">
        <div id="friend-info">
            <div id="friend-name">Chinh</div>
            <div id="friend-email">someone@gmail.com</div>
        </div>
        <button id="make-friend-btn">+</button>
    </div>
`;

export default class FriendContainer extends HTMLElement {
    constructor(name, email, isFriend) {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild($template.content.cloneNode(true));
        this.$friendName = this.shadowRoot.getElementById('friend-name');
        this.$friendEmail = this.shadowRoot.getElementById('friend-email');
        this.$makeFriend = this.shadowRoot.getElementById('make-friend-btn');

        this.setAttribute('name', name);
        this.setAttribute('email', email);
        this.setAttribute('is-friend', isFriend);
    }

    static get observedAttributes() {
        return ['name', 'email', 'is-friend'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if(attrName == 'name') {
            this.$friendName.innerHTML = newValue;
        } else if(attrName == 'email') {
            this.$friendEmail.innerHTML = newValue;
        } else if(attrName == 'is-friend') {
            if(newValue == "true") {
                this.$makeFriend.style.display = "none";
            } else if(newValue == "false"){
                this.$makeFriend.style.display = "block";
            }
        }
    }
}

window.customElements.define('friend-container', FriendContainer);