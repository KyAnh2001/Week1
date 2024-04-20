function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username === "" || password === "") {
        document.getElementById('warning').textContent = 'Điền thông tin đăng nhập';
    }
    else if (username === "john" && password === "1234") {
        window.location.href = "dashboard.html"
        sessionStorage.setItem('john', '1234');
    }
    else {
        document.getElementById('warning').textContent = 'Sai tài khoản hoặc mật khẩu';
    }
}

var value = sessionStorage.getItem('john');
if (value !== '1234') {
    window.location.href = "index.html";
}