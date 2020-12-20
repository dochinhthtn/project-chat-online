import InputWrapper from "./InputWrapper.js";
import { validateEmail } from "../utils.js";

const $template = document.createElement('template');
$template.innerHTML = /*html*/ `
    <link rel="stylesheet" href="../../css/login-form.css">
    <form id="login-form">
        <h2>Đăng nhập tài khoản</h2>
        <input-wrapper id="email" label="Email" type="email" error="" value=""></input-wrapper>
        <input-wrapper id="password" label="Mật khẩu" type="password" error="" value=""></input-wrapper>
        <button id="login-btn">Đăng nhập</button>

        <div id="to-register">
            Bạn chưa có tài khoản? <b><a href="#!/sign-up">Đăng kí</a></b>
        </div>
    </form>
`;

export default class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild($template.content.cloneNode(true));
        this.$form = this.shadowRoot.getElementById('login-form');

        this.$email = this.shadowRoot.getElementById('email');
        this.$password = this.shadowRoot.getElementById('password');
    }

    connectedCallback() {
        this.$form.onsubmit = async (event) => {
            event.preventDefault();
            let email = this.$email.value();
            let password = this.$password.value();

            let isPassed =
                InputWrapper.validate(this.$email, (value) => value != '', "Nhập vào email") &
                InputWrapper.validate(this.$password, (value) => value != '', 'Nhập vào mật khẩu');

            if (isPassed) {
                let result = await firebase
                    .firestore()
                    .collection('users')
                    .where('email', '==', email)
                    .where('password', '==', CryptoJS.MD5(password).toString())
                    .get();

                if(result.empty) {
                    alert("Email hoặc mật khẩu không chính xác");
                } else {
                    router.navigate('/chat');
                }
            }

        }
    }
}

window.customElements.define('login-form', LoginForm);