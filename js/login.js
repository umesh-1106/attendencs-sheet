// ======================================
// KMCE Attendance Management System
// login.js
// ======================================

// Demo Credentials
const teacherID = "teacher";
const teacherPassword = "1234";

const adminID = "admin";
const adminPassword = "admin123";

// ------------------------------
// Teacher Login
// ------------------------------
function teacherLogin() {

    const id = document.getElementById("teacherId").value.trim();
    const password = document.getElementById("teacherPassword").value.trim();

    if (id === "" || password === "") {
        alert("Please enter Teacher ID and Password.");
        return;
    }

    if (id === teacherID && password === teacherPassword) {

        localStorage.setItem("teacher", id);

        alert("Teacher Login Successful!");

        window.location.href = "departments.html";

    } else {

        alert("Invalid Teacher ID or Password.");

    }

}

// ------------------------------
// Admin Login
// ------------------------------
function adminLogin() {

    const id = document.getElementById("adminId").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (id === "" || password === "") {
        alert("Please enter Admin ID and Password.");
        return;
    }

    if (id === adminID && password === adminPassword) {

        localStorage.setItem("admin", id);

        alert("Admin Login Successful!");

        window.location.href = "admin-dashboard.html";

    } else {

        alert("Invalid Admin ID or Password.");

    }

}

// ------------------------------
// Show / Hide Password
// ------------------------------
function togglePassword(inputId) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }

}

// ------------------------------
// Logout
// ------------------------------
function logout() {

    localStorage.removeItem("teacher");
    localStorage.removeItem("admin");

    alert("Logged Out Successfully");

    window.location.href = "index.html";

}

// ------------------------------
// Check Login
// ------------------------------
function checkTeacherLogin() {

    if (!localStorage.getItem("teacher")) {
        window.location.href = "teacher-login.html";
    }

}

function checkAdminLogin() {

    if (!localStorage.getItem("admin")) {
        window.location.href = "admin-login.html";
    }

}
