// =====================================
// KMCE Attendance Management System
// settings.js
// =====================================

const DEFAULT_SETTINGS = {
    collegeName: "KESHAVA MEMORIAL COLLEGE OF ENGINEERING",
    collegeAddress: "Ranga Reddy, Abdullapurmet, Chinthapalli Guda",
    collegeLogo: ""
};

// ---------------------------
// Load Settings
// ---------------------------
document.addEventListener("DOMContentLoaded", loadSettings);

function loadSettings() {

    document.getElementById("collegeName").value =
        localStorage.getItem("collegeName") ||
        DEFAULT_SETTINGS.collegeName;

    document.getElementById("collegeAddress").value =
        localStorage.getItem("collegeAddress") ||
        DEFAULT_SETTINGS.collegeAddress;

    const savedLogo = localStorage.getItem("collegeLogo");

    if (savedLogo) {
        document.getElementById("logoPreview").src = savedLogo;
    }

}

// ---------------------------
// Save Settings
// ---------------------------
function saveSettings() {

    const name =
        document.getElementById("collegeName").value.trim();

    const address =
        document.getElementById("collegeAddress").value.trim();

    localStorage.setItem("collegeName", name);
    localStorage.setItem("collegeAddress", address);

    alert("Settings saved successfully.");

}

// ---------------------------
// Upload Logo
// ---------------------------
function uploadLogo(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        localStorage.setItem(
            "collegeLogo",
            e.target.result
        );

        document.getElementById("logoPreview").src =
            e.target.result;

    };

    reader.readAsDataURL(file);

}

// ---------------------------
// Reset Settings
// ---------------------------
function resetSettings() {

    if (!confirm("Reset all settings?"))
        return;

    localStorage.removeItem("collegeName");
    localStorage.removeItem("collegeAddress");
    localStorage.removeItem("collegeLogo");

    document.getElementById("collegeName").value =
        DEFAULT_SETTINGS.collegeName;

    document.getElementById("collegeAddress").value =
        DEFAULT_SETTINGS.collegeAddress;

    document.getElementById("logoPreview").src = "";

    alert("Settings reset successfully.");

}

// ---------------------------
// Back to Dashboard
// ---------------------------
function backDashboard() {

    window.location.href = "admin-dashboard.html";

}
