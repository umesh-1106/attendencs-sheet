/**
 * StudentManager - Complete Student Management & Attendance Utility
 * Covers CRUD, validation, search/filtering, import/export, and persistence.
 */
class StudentManager {
  constructor(storageKey = 'app_students_db') {
    this.storageKey = storageKey;
    this.students = [];
    this.init();
  }

  // ==========================================
  // 1. INITIALIZATION & PERSISTENCE
  // ==========================================

  /** Initialize manager and load existing data from LocalStorage */
  init() {
    this.loadFromStorage();
  }

  /** Load students from LocalStorage */
  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      this.students = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load students from LocalStorage:', error);
      this.students = [];
    }
  }

  /** Save current state to LocalStorage */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.students));
      return true;
    } catch (error) {
      console.error('Failed to save students to LocalStorage:', error);
      return false;
    }
  }

  // ==========================================
  // 2. VALIDATION HELPERS
  // ==========================================

  /**
   * Validates student data before save/update.
   * @param {Object} data - Student details
   * @param {boolean} isEdit - True if updating existing record
   */
  validateStudent(data, isEdit = false) {
    const errors = [];

    if (!data.id || String(data.id).trim() === '') {
      errors.push('Student ID is required.');
    } else if (!isEdit && this.getStudentById(data.id)) {
      errors.push('A student with this ID already exists.');
    }

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Valid full name is required (min 2 characters).');
    }

    if (!data.department || data.department.trim() === '') {
      errors.push('Department is required.');
    }

    if (!data.year || isNaN(data.year) || data.year < 1 || data.year > 5) {
      errors.push('Year must be a number between 1 and 5.');
    }

    if (!data.section || data.section.trim() === '') {
      errors.push('Section is required.');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ==========================================
  // 3. CRUD OPERATIONS
  // ==========================================

  /** Get all students */
  getAll() {
    return [...this.students];
  }

  /** Get single student by ID */
  getStudentById(id) {
    return this.students.find(s => String(s.id) === String(id)) || null;
  }

  /**
   * Add a new student record
   * @param {Object} studentData 
   */
  addStudent(studentData) {
    const validation = this.validateStudent(studentData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const newStudent = {
      id: String(studentData.id).trim(),
      name: studentData.name.trim(),
      department: studentData.department.trim(),
      year: parseInt(studentData.year, 10),
      section: studentData.section.trim().toUpperCase(),
      email: studentData.email ? studentData.email.trim() : '',
      attendance: [], // Stores { date: 'YYYY-MM-DD', status: 'Present'|'Absent' }
      createdAt: new Date().toISOString()
    };

    this.students.push(newStudent);
    this.saveToStorage();
    return { success: true, student: newStudent };
  }

  /**
   * Edit an existing student record
   * @param {string|number} id 
   * @param {Object} updatedFields 
   */
  editStudent(id, updatedFields) {
    const index = this.students.findIndex(s => String(s.id) === String(id));
    if (index === -1) {
      return { success: false, errors: ['Student not found.'] };
    }

    const currentData = this.students[index];
    const mergedData = { ...currentData, ...updatedFields, id: currentData.id };

    const validation = this.validateStudent(mergedData, true);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    this.students[index] = {
      ...mergedData,
      year: parseInt(mergedData.year, 10),
      section: String(mergedData.section).toUpperCase(),
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return { success: true, student: this.students[index] };
  }

  /**
   * Delete a student by ID
   * @param {string|number} id 
   */
  deleteStudent(id) {
    const initialLength = this.students.length;
    this.students = this.students.filter(s => String(s.id) !== String(id));

    if (this.students.length < initialLength) {
      this.saveToStorage();
      return { success: true };
    }
    return { success: false, errors: ['Student not found.'] };
  }

  // ==========================================
  // 4. SEARCH & FILTERING
  // ==========================================

  /**
   * Advanced query engine to search and filter student records.
   * @param {Object} params - { query, department, year, section }
   */
  filterStudents({ query = '', department = '', year = '', section = '' } = {}) {
    const q = query.toLowerCase().trim();
    const dept = department.toLowerCase().trim();
    const yr = String(year).trim();
    const sec = section.toLowerCase().trim();

    return this.students.filter(student => {
      // Free text search across Name, ID, Email
      const matchesQuery = !q || 
        student.name.toLowerCase().includes(q) ||
        student.id.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q);

      // Specific dropdown filters
      const matchesDept = !dept || student.department.toLowerCase() === dept;
      const matchesYear = !yr || String(student.year) === yr;
      const matchesSection = !sec || student.section.toLowerCase() === sec;

      return matchesQuery && matchesDept && matchesYear && matchesSection;
    });
  }

  // ==========================================
  // 5. ATTENDANCE INTEGRATION
  // ==========================================

  /**
   * Record or update attendance for a specific student.
   * @param {string|number} id 
   * @param {string} date - Format 'YYYY-MM-DD'
   * @param {string} status - 'Present', 'Absent', or 'Late'
   */
  markAttendance(id, date, status) {
    const student = this.getStudentById(id);
    if (!student) return { success: false, error: 'Student not found.' };

    if (!student.attendance) student.attendance = [];

    const existingIndex = student.attendance.findIndex(a => a.date === date);
    if (existingIndex > -1) {
      student.attendance[existingIndex].status = status;
    } else {
      student.attendance.push({ date, status });
    }

    this.saveToStorage();
    return { success: true, student };
  }

  /** Calculate overall attendance percentage for a student */
  getAttendancePercentage(id) {
    const student = this.getStudentById(id);
    if (!student || !student.attendance || student.attendance.length === 0) return 0;

    const presentCount = student.attendance.filter(a => a.status === 'Present').length;
    return Math.round((presentCount / student.attendance.length) * 100);
  }

  // ==========================================
  // 6. CSV IMPORT & EXPORT
  // ==========================================

  /** Export student records to CSV format */
  exportToCSV() {
    if (this.students.length === 0) return '';

    const headers = ['ID', 'Name', 'Department', 'Year', 'Section', 'Email', 'AttendanceRate(%)'];
    const rows = this.students.map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      s.year,
      `"${s.section}"`,
      `"${s.email || ''}"`,
      this.getAttendancePercentage(s.id)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  }

  /** Trigger browser download for CSV file */
  downloadCSV(filename = 'students_export.csv') {
    const csvData = this.exportToCSV();
    if (!csvData) return false;

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  /**
   * Import students from raw CSV text
   * Expected Header: ID,Name,Department,Year,Section,Email
   */
  importFromCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length <= 1) return { success: false, imported: 0, errors: ['CSV file is empty or missing data.'] };

    let importedCount = 0;
    const errors = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(val => val.replace(/^"|"$/g, '').trim());
      const [id, name, department, year, section, email] = row;

      const result = this.addStudent({ id, name, department, year, section, email });
      if (result.success) {
        importedCount++;
      } else {
        errors.push(`Line ${i + 1} (${id || 'Unknown ID'}): ${result.errors.join(' ')}`);
      }
    }

    return { success: importedCount > 0, imported: importedCount, errors };
  }

  // ==========================================
  // 7. UI HELPER / DOM RENDERING
  // ==========================================

  /**
   * Populate a standard HTML `<table>` tbody element with student records.
   * @param {string|HTMLElement} container - The tbody ID or element
   * @param {Array} list - Optional array of students to render (defaults to all)
   * @param {Function} actionCallbacks - Hooks for edit/delete buttons `{ onEdit, onDelete, onSelect }`
   */
  renderTable(container, list = null, actionCallbacks = {}) {
    const tbody = typeof container === 'string' ? document.getElementById(container) : container;
    if (!tbody) return;

    const dataToRender = list || this.students;
    tbody.innerHTML = '';

    if (dataToRender.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No student records found.</td></tr>`;
      return;
    }

    dataToRender.forEach(student => {
      const tr = document.createElement('tr');
      const attendancePct = this.getAttendancePercentage(student.id);

      tr.innerHTML = `
        <td>${student.id}</td>
        <td><strong>${student.name}</strong></td>
        <td>${student.department}</td>
        <td>Year ${student.year}</td>
        <td>${student.section}</td>
        <td>${student.email || 'N/A'}</td>
        <td>${attendancePct}%</td>
        <td>
          <button data-action="edit" data-id="${student.id}">Edit</button>
          <button data-action="delete" data-id="${student.id}">Delete</button>
          <button data-action="attendance" data-id="${student.id}">Select</button>
        </td>
      `;

      // Attach button events
      tr.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const id = e.target.getAttribute('data-id');
        if (!action || !id) return;

        if (action === 'edit' && actionCallbacks.onEdit) actionCallbacks.onEdit(this.getStudentById(id));
        if (action === 'delete' && actionCallbacks.onDelete) actionCallbacks.onDelete(id);
        if (action === 'attendance' && actionCallbacks.onSelect) actionCallbacks.onSelect(this.getStudentById(id));
      });

      tbody.appendChild(tr);
    });
  }
}

// Export module for browser global or ES6 imports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StudentManager;
} else {
  window.StudentManager = StudentManager;
}
