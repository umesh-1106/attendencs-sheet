// =====================================
// KMCE Attendance Management System
// Login Database (Demo)
// =====================================

// User Database
const users = [
    {
        role: "admin",
        username: "UMESH1106",
        password: "UMesh1106@",
        redirect: "admin-dashboard.html"
    },
    {
        role: "teacher",
        username: "jagadesh54",
        password: "12345678900",
        redirect: "departments.html"
    }
];

// =====================================
// Login Function
// =====================================
function login(role) {

    let username, password;

    if (role === "admin") {
        username = document.getElementById("adminId").value.trim();
        password = document.getElementById("adminPassword").value.trim();
    } else {
        username = document.getElementById("teacherId").value.trim();
        password = document.getElementById("teacherPassword").value.trim();
    }

    const user = users.find(
        u =>
            u.role === role &&
            u.username === username &&
            u.password === password
    );

    if (user) {

        localStorage.setItem("loggedInUser", user.username);
        localStorage.setItem("userRole", user.role);

        alert("Login Successful!");

        window.location.href = user.redirect;

    } else {

        alert("Invalid Username or Password.");

    }
}

// =====================================
// Logout
// =====================================
function logout() {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");

    alert("Logged Out Successfully");

    window.location.href = "index.html";
}

// =====================================
// Check Login
// =====================================
function checkAdmin() {

    if (
        localStorage.getItem("userRole") !== "admin"
    ) {
        window.location.href = "admin-login.html";
    }

}

function checkTeacher() {

    if (
        localStorage.getItem("userRole") !== "teacher"
    ) {
        window.location.href = "teacher-login.html";
    }

}
