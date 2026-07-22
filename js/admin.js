// ===========================================
// KMCE Attendance Management System
// admin.js
// ===========================================

let attendanceHistory = [];

// -----------------------------
// Load Dashboard
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

    loadAttendance();

});

// -----------------------------
// Load Attendance
// -----------------------------
function loadAttendance() {

    attendanceHistory =
        JSON.parse(localStorage.getItem("attendanceHistory")) || [];

    updateStatistics();

    displayAttendance(attendanceHistory);

}

// -----------------------------
// Statistics
// -----------------------------
function updateStatistics() {

    let totalPresent = 0;
    let totalAbsent = 0;

    attendanceHistory.forEach(record => {

        totalPresent += record.presentCount;
        totalAbsent += record.absentCount;

    });

    document.getElementById("totalRecords").textContent =
        attendanceHistory.length;

    document.getElementById("totalPresent").textContent =
        totalPresent;

    document.getElementById("totalAbsent").textContent =
        totalAbsent;

}

// -----------------------------
// Display Table
// -----------------------------
function displayAttendance(data) {

    const table = document.getElementById("attendanceTable");

    if (!table) return;

    table.innerHTML = "";

    data.forEach((record, index) => {

        table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td>${record.department}</td>
            <td>${record.year}</td>
            <td>${record.section}</td>
            <td>${record.teacher}</td>
            <td>${record.presentCount}</td>
            <td>${record.absentCount}</td>
            <td>${record.absentStudents.join(", ")}</td>
            <td>
                <button onclick="deleteRecord(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

// -----------------------------
// Search
// -----------------------------
function searchAttendance() {

    const keyword =
        document.getElementById("searchBox").value
        .toLowerCase();

    const filtered = attendanceHistory.filter(record => {

        return (
            record.department.toLowerCase().includes(keyword) ||
            record.teacher.toLowerCase().includes(keyword) ||
            record.year.toLowerCase().includes(keyword) ||
            record.section.toLowerCase().includes(keyword)
        );

    });

    displayAttendance(filtered);

}

// -----------------------------
// Delete Record
// -----------------------------
function deleteRecord(index) {

    if (!confirm("Delete this attendance record?"))
        return;

    attendanceHistory.splice(index, 1);

    localStorage.setItem(
        "attendanceHistory",
        JSON.stringify(attendanceHistory)
    );

    loadAttendance();

}

// -----------------------------
// Clear All
// -----------------------------
function clearAttendance() {

    if (!confirm("Delete ALL attendance records?"))
        return;

    localStorage.removeItem("attendanceHistory");

    attendanceHistory = [];

    loadAttendance();

}

// -----------------------------
// Export CSV
// -----------------------------
function exportCSV() {

    if (attendanceHistory.length === 0) {

        alert("No attendance records found.");

        return;

    }

    let csv =
"Date,Time,Department,Year,Section,Teacher,Present,Absent,Absent Students\n";

    attendanceHistory.forEach(record => {

        csv +=
`${record.date},
${record.time},
${record.department},
${record.year},
${record.section},
${record.teacher},
${record.presentCount},
${record.absentCount},
"${record.absentStudents.join(", ")}"\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Attendance_Report.csv";

    link.click();

    URL.revokeObjectURL(url);

}

// -----------------------------
// Print Dashboard
// -----------------------------
function printReport() {

    window.print();

}

// -----------------------------
// Logout
// -----------------------------
function logout() {

    localStorage.removeItem("admin");

    window.location.href = "admin-login.html";

}
