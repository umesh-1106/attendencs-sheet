// ===============================
// KMCE Attendance Management System
// main.js
// ===============================

// Default College Details
const APP = {
    college: "KESHAVA MEMORIAL COLLEGE OF ENGINEERING",
    address: "Ranga Reddy, Abdullapurmet, Chinthapalli Guda"
};

// ---------- Initialization ----------
document.addEventListener("DOMContentLoaded", () => {
    loadCollegeInfo();
    updateDateTime();

    // Update clock every second
    setInterval(updateDateTime, 1000);
});

// ---------- College Information ----------
function loadCollegeInfo() {

    const name =
        localStorage.getItem("collegeName") || APP.college;

    const address =
        localStorage.getItem("collegeAddress") || APP.address;

    const logo =
        localStorage.getItem("collegeLogo");

    const collegeName = document.getElementById("collegeName");
    const collegeAddress = document.getElementById("collegeAddress");
    const collegeLogo = document.getElementById("collegeLogo");

    if (collegeName) collegeName.textContent = name;

    if (collegeAddress) collegeAddress.textContent = address;

    if (collegeLogo && logo) {
        collegeLogo.src = logo;
    }
}

// ---------- Date & Time ----------
function updateDateTime() {

    const now = new Date();

    const date = now.toLocaleDateString();

    const time = now.toLocaleTimeString();

    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");

    if (dateElement)
        dateElement.textContent = date;

    if (timeElement)
        timeElement.textContent = time;
}

// ---------- Navigation ----------
function goTo(page) {
    window.location.href = page;
}

// ---------- Logout ----------
function logout() {

    if (confirm("Do you want to logout?")) {

        localStorage.removeItem("teacher");

        window.location.href = "index.html";

    }

}

// ---------- Local Storage ----------
function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}

function getData(key) {

    return JSON.parse(
        localStorage.getItem(key)
    ) || [];

}

// ---------- Notification ----------
function showMessage(message) {

    alert(message);

}

// ---------- Attendance History ----------
function saveAttendance(record) {

    let history = getData("attendanceHistory");

    history.push(record);

    saveData("attendanceHistory", history);

}

// ---------- Export CSV ----------
function exportCSV() {

    const history = getData("attendanceHistory");

    if (history.length === 0) {

        alert("No attendance records found.");

        return;

    }

    let csv =
        "Date,Time,Department,Year,Section,Teacher,Present,Absent\n";

    history.forEach(item => {

        csv += `${item.date},${item.time},${item.department},${item.year},${item.section},${item.teacher},${item.presentCount},${item.absentCount}\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Attendance_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

}

// ---------- Print ----------
function printPage() {

    window.print();

}
