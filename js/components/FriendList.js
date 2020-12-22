import FriendContainer from "./FriendContainer.js";
import InputWrapper from "./InputWrapper.js";
import { getDataFromDoc, getDataFromDocs, getCurrentUser } from "../utils.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <style>
        * {
            background-color: #f1f1f2;
        }
        #title {
            padding: 15px 0px;
            font-family: Arial;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            border-bottom: 1px solid #cccccc;
        }

        #search-friend-form {
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #cccccc;
        }

        #search-friend-btn {
            border: 1px solid #1995ad;
            background-color: #1995ad;
            height: 40px;
            width: 100px;
            color: #fff;
            border-radius: 5px;
        }

        #search-friend-keyword {
            width: calc(100% - 100px - 15px);
        }
    </style>
    <div id="title">
        Bạn bè  
    </div>

    <form id="search-friend-form">
        <input-wrapper id="search-friend-keyword" label="" type="text" error=""></input-wrapper>
        <button id="search-friend-btn">Tìm kiếm</button>
    </form>

    <div id="friend-list"></div>
`;

export default class FriendList extends HTMLElement {
    constructor(data) {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));
        this.$friendList = this.shadowRoot.getElementById('friend-list');

        this.$searchFriendKeyword = this.shadowRoot.getElementById('search-friend-keyword');
        this.$searchFriendForm = this.shadowRoot.getElementById('search-friend-form');

        this.setAttribute('data', JSON.stringify(data));
    }

    connectedCallback() {
        this.$searchFriendForm.onsubmit = async (event) => {
            event.preventDefault();

            let keyword = this.$searchFriendKeyword.value();

            let isPassed = InputWrapper.validate(this.$searchFriendKeyword, (value) => value != '', "Nhập vào tên bạn bè");

            if (isPassed) {
                // lấy ra những người dùng có tên thỏa mãn
                let result = await firebase
                    .firestore()
                    .collection('users')
                    .where('name', '==', keyword)
                    .get();

                let data = getDataFromDocs(result.docs);

                // kiểm tra những người dùng tìm được có phải là bạn của người dùng hiện tại không
                let currentUser = getCurrentUser();

                // lấy ra tất cả người bạn của người dùng hiện tại
                result = await firebase
                    .firestore()
                    .collection('friends')
                    .where('relation', 'array-contains', currentUser.id)
                    .get();

                let existFriends = getDataFromDocs(result.docs);

                // so sánh giữa những người tìm được và những người bạn
                for(let friendData of data) {
                    let exist = existFriends.find(function(existFriend) {
                        let relation = existFriend.relation;
                        return relation[0] == friendData.id || relation[1] == friendData.id;
                    });

                    friendData.isFriend = (exist) ? true : false;
                }
                console.log('hehehe');
                this.setAttribute('data', JSON.stringify(data));
            }
        }
    }

    static get observedAttributes() {
        return ['data'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName == 'data') {
            let friendsData = JSON.parse(newValue);

            this.$friendList.innerHTML = '';
            for (let friendData of friendsData) {
                let $friendContainer = new FriendContainer(friendData.name, friendData.email, friendData.isFriend);
                this.$friendList.appendChild($friendContainer);
            }
        }
    }
}

window.customElements.define('friend-list', FriendList);