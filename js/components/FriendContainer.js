import { getCurrentUser } from "../utils.js";

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
            cursor: pointer;
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
    constructor(id, name, email, isFriend) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));
        this.$friendName = this.shadowRoot.getElementById('friend-name');
        this.$friendEmail = this.shadowRoot.getElementById('friend-email');
        this.$makeFriend = this.shadowRoot.getElementById('make-friend-btn');

        this.id = id;
        this.setAttribute('name', name);
        this.setAttribute('email', email);
        this.setAttribute('is-friend', isFriend);
    }

    static get observedAttributes() {
        return ['name', 'email', 'is-friend'];
    }

    connectedCallback() {
        this.onclick = () => {
            console.log("chuyển sang chat với" + this.getAttribute('name'));
            
            router.navigate('/chat/' + this.id);
        }

        this.$makeFriend.onclick = async () => {
            this.$makeFriend.disabled = true; // tạm khóa nút
            await this.makeFriend(this.id);
            this.$makeFriend.style.display = "none"; // ẩn nút
        }
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName == 'name') {
            this.$friendName.innerHTML = newValue;
        } else if (attrName == 'email') {
            this.$friendEmail.innerHTML = newValue;
        } else if (attrName == 'is-friend') {
            if (newValue == "true") {
                this.$makeFriend.style.display = "none";
            } else if (newValue == "false") {
                this.$makeFriend.style.display = "block";
            }
        }
    }

    async makeFriend(userId) {
        let currentUser = getCurrentUser();
        await firebase
            .firestore()
            .collection('friends')
            .add({
                relation: [
                    currentUser.id,
                    userId
                ]
            });
    }
}

window.customElements.define('friend-container', FriendContainer);