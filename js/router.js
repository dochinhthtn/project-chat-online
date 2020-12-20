var root = null;
var useHash = true; // Defaults to: false
var hash = '#!'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);

router.on('/sign-up', function() {
    document.getElementById('app').innerHTML = '<register-form></register-form>';
}).resolve();

router.on('/sign-in', function() {
    document.getElementById('app').innerHTML = '<login-form></login-form>';
}).resolve();

router.on('/chat', function() {
    document.getElementById('app').innerHTML = '<h1>bạn đã vào màn hình chat</h1>';
}).resolve();

window.router = router;