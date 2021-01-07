import ChatScreen from "./screens/ChatScreen.js";
import { getCurrentUser } from "./utils.js";

let $app = document.getElementById('app');

var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);

router.on('/sign-up', function () {
    $app.innerHTML = '<register-form></register-form>';
}).resolve();

router.on('/sign-in', function () {
    $app.innerHTML = '<login-form></login-form>';
}).resolve();

router.on(
    '/chat/:id',

    async function (params) {
        let $chatScreen = document.querySelector('chat-screen');
        if($chatScreen == null) {
            $chatScreen = new ChatScreen();
            $app.innerHTML = '';
            $app.appendChild($chatScreen);
        }

        // $app.innerHTML = '';
        // let $chatScreen = new ChatScreen();
        // $app.appendChild($chatScreen);

        let friendsData = await $chatScreen.loadFriends();
        console.log(friendsData);
        if (friendsData.length == 0) return;
        let firstFriend = friendsData[0];

        if (params.id == 0) {
            router.navigate('/chat/' + firstFriend.id);
            return;
        }

        let $chatContainer = $chatScreen.shadowRoot.querySelector('chat-container');
        $chatContainer.setAttribute('current-chat', params.id);
    },

    {
        before(done, params) {
            let currentUser = getCurrentUser();
            if (currentUser == null) {
                router.navigate('/sign-in');
                return;
            }

            done();
        }
    }
).resolve();

window.router = router;