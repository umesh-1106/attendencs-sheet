// ======================================
// KMCE Attendance Management System
// attendance.js
// ======================================

const TOTAL_STUDENTS = 56;

let attendance = [];

// ----------------------------
// Initialize
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {

    attendance = new Array(TOTAL_STUDENTS).fill(true);

    createStudents();

    updateCounts();

});

// ----------------------------
// Create Student Boxes
// ----------------------------
function createStudents() {

    const grid = document.getElementById("studentGrid");

    if (!grid) return;

    grid.innerHTML = "";

    for (let i = 1; i <= TOTAL_STUDENTS; i++) {

        const box = document.createElement("div");

        box.className = "student present";

        box.innerHTML = i;

        box.dataset.roll = i;

        box.onclick = function () {
            toggleAttendance(i);
        };

        grid.appendChild(box);

    }

}

// ----------------------------
// Toggle Attendance
// ----------------------------
function toggleAttendance(roll) {

    attendance[roll - 1] = !attendance[roll - 1];

    const boxes = document.querySelectorAll(".student");

    const box = boxes[roll - 1];

    if (attendance[roll - 1]) {

        box.classList.remove("absent");

        box.classList.add("present");

    } else {

        box.classList.remove("present");

        box.classList.add("absent");

    }

    updateCounts();

}

// ----------------------------
// Manual Absent Entry
// Example: 2,5,9
// ----------------------------
function markAbsent() {

    attendance.fill(true);

    const input = document.getElementById("absentInput");

    if (!input) return;

    const boxes = document.querySelectorAll(".student");

    boxes.forEach(box => {

        box.classList.remove("absent");

        box.classList.add("present");

    });

    if (input.value.trim() !== "") {

        const list = input.value.split(",");

        list.forEach(item => {

            const roll = parseInt(item.trim());

            if (roll >= 1 && roll <= TOTAL_STUDENTS) {

                attendance[roll - 1] = false;

                boxes[roll - 1].classList.remove("present");

                boxes[roll - 1].classList.add("absent");

            }

        });

    }

    updateCounts();

}

// ----------------------------
// Update Counters
// ----------------------------
function updateCounts() {

    let present = attendance.filter(x => x).length;

    let absent = TOTAL_STUDENTS - present;

    const p = document.getElementById("presentCount");

    const a = document.getElementById("absentCount");

    if (p) p.innerHTML = present;

    if (a) a.innerHTML = absent;

}

// ----------------------------
// Save Attendance
// ----------------------------
function submitAttendance() {

    const department =
        localStorage.getItem("department") || "";

    const year =
        localStorage.getItem("year") || "";

    const section =
        localStorage.getItem("section") || "";

    const teacher =
        localStorage.getItem("teacher") || "Teacher";

    const absentStudents = [];

    const presentStudents = [];

    attendance.forEach((status, index) => {

        if (status)
            presentStudents.push(index + 1);
        else
            absentStudents.push(index + 1);

    });

    const record = {

        date: new Date().toLocaleDateString(),

        time: new Date().toLocaleTimeString(),

        department,

        year,

        section,

        teacher,

        presentCount: presentStudents.length,

        absentCount: absentStudents.length,

        presentStudents,

        absentStudents

    };

    let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];

    history.push(record);

    localStorage.setItem(
        "attendanceHistory",
        JSON.stringify(history)
    );

    alert("Attendance Saved Successfully.");

}

// ----------------------------
// Reset
// ----------------------------
function resetAttendance() {

    attendance.fill(true);

    document.getElementById("absentInput").value = "";

    createStudents();

    updateCounts();

}
