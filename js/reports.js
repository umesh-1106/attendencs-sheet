// =========================================
// KMCE Attendance Management System
// reports.js
// =========================================

let reports = [];

// -----------------------------
// Initialize
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadReports();
});

// -----------------------------
// Load Reports
// -----------------------------
function loadReports() {

    reports = JSON.parse(localStorage.getItem("attendanceHistory")) || [];

    updateSummary();

    displayReports(reports);

}

// -----------------------------
// Summary Cards
// -----------------------------
function updateSummary() {

    let totalPresent = 0;
    let totalAbsent = 0;

    reports.forEach(record => {
        totalPresent += record.presentCount;
        totalAbsent += record.absentCount;
    });

    const totalStudents = totalPresent + totalAbsent;

    const percentage =
        totalStudents === 0
            ? 0
            : ((totalPresent / totalStudents) * 100).toFixed(2);

    document.getElementById("reportCount").textContent =
        reports.length;

    document.getElementById("presentTotal").textContent =
        totalPresent;

    document.getElementById("absentTotal").textContent =
        totalAbsent;

    document.getElementById("attendancePercentage").textContent =
        percentage + "%";

}

// -----------------------------
// Display Table
// -----------------------------
function displayReports(data) {

    const table = document.getElementById("reportTable");

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
        </tr>
        `;

    });

}

// -----------------------------
// Search Reports
// -----------------------------
function searchReports() {

    const keyword =
        document.getElementById("searchReport")
        .value
        .toLowerCase();

    const filtered = reports.filter(record =>

        record.department.toLowerCase().includes(keyword) ||

        record.teacher.toLowerCase().includes(keyword) ||

        record.year.toLowerCase().includes(keyword) ||

        record.section.toLowerCase().includes(keyword)

    );

    displayReports(filtered);

}

// -----------------------------
// Export CSV
// -----------------------------
function exportReport() {

    if (reports.length === 0) {

        alert("No reports available.");

        return;

    }

    let csv =
"Date,Time,Department,Year,Section,Teacher,Present,Absent,Absent Students\n";

    reports.forEach(record => {

        csv += `${record.date},
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

    link.download = "Attendance_Reports.csv";

    link.click();

    URL.revokeObjectURL(url);

}

// -----------------------------
// Print Report
// -----------------------------
function printReports() {

    window.print();

}

// -----------------------------
// Back to Dashboard
// -----------------------------
function goDashboard() {

    window.location.href = "admin-dashboard.html";

}
