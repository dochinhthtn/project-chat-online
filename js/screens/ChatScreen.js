import { getCurrentUser, getDataFromDoc, getDataFromDocs } from "../utils.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <friend-list></friend-list>
    <chat-contaner></chat-container>
`;

export default class ChatScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));

        this.$friendList = this.shadowRoot.querySelector('friend-list');
        this.$chatContainer = this.shadowRoot.querySelector('chat-container');

    }

    async connectedCallback() {
        let friendsData = await this.loadFriends();
        console.log(friendsData);

        // thay đổi giá trị thuộc tính data của friend-list
        this.$friendList.setAttribute('data', JSON.stringify(friendsData));
    }

    async loadFriends() {
        let currentUser = getCurrentUser();

        // lấy các relations
        let result = await firebase
            .firestore()
            .collection('friends')
            .where('relation', 'array-contains', currentUser.id)
            .get();
        let existFriends = getDataFromDocs(result.docs);

        let friendsData = [];

        // lặp qua từng relation
        for (let existFriend of existFriends) {
            let relation = existFriend.relation;
            let friendId = "";

            // tìm xem đâu là id của friend
            if (relation[0] == currentUser.id) {
                friendId = relation[1];
            } else if (relation[1] == currentUser.id) {
                friendId = relation[0];
            }

            // lấy thông tin của người bạn khi biết id
            let result = await firebase
                .firestore()
                .collection('users')
                .doc(friendId)
                .get();
            
            let friendData = getDataFromDoc(result);
            friendData.isFriend = true;

            friendsData.push(friendData);
        }

        return friendsData;
    }
}

window.customElements.define('chat-screen', ChatScreen);