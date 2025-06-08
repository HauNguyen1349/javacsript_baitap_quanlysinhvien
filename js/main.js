"use strict";

// Employee class
class Employee {
    constructor(account, name, email, password, date, salary, role, hours) {
        this.account = account;
        this.name = name;
        this.email = email;
        this.password = password;
        this.date = date;
        this.salary = Number(salary);
        this.role = role;
        this.hours = Number(hours);
        this.total = 0;
        this.type = '';
    }

    calcTotal() {
        if (this.role === 'Giám đốc') this.total = this.salary * 3;
        else if (this.role === 'Trưởng phòng') this.total = this.salary * 2;
        else this.total = this.salary;
    }

    classify() {
        if (this.hours >= 192) this.type = 'Xuất sắc';
        else if (this.hours >= 176) this.type = 'Giỏi';
        else if (this.hours >= 160) this.type = 'Khá';
        else this.type = 'Trung bình';
    }
}

// Validation helpers
function isRequired(value) {
    return String(value).trim() !== '';
}
function isAccount(value) {
    return /^\d{4,6}$/.test(value);
}
function isName(value) {
    return /^[a-zA-ZÀ-ỹ\s]+$/.test(value);
}
function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isPassword(value) {
    return /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,10}$/.test(value);
}
function isDate(value) {
    return /^(0?[1-9]|1[0-2])\/([0-2]?\d|3[01])\/\d{4}$/.test(value);
}
function isSalary(value) {
    const s = Number(value);
    return s >= 1000000 && s <= 20000000;
}
function isRole(value) {
    return ['Giám đốc', 'Trưởng phòng', 'Nhân viên'].includes(value);
}
function isHours(value) {
    const h = Number(value);
    return h >= 80 && h <= 200;
}

function showError(selector, message) {
    const span = document.getElementById(selector);
    span.style.display = 'block';
    span.innerText = message;
}
function hideError(selector) {
    const span = document.getElementById(selector);
    span.style.display = 'none';
}

function validateForm(emp) {
    let valid = true;

    if (!isRequired(emp.account) || !isAccount(emp.account)) {
        showError('tbTKNV', 'Tài khoản 4-6 ký số');
        valid = false;
    } else hideError('tbTKNV');

    if (!isRequired(emp.name) || !isName(emp.name)) {
        showError('tbTen', 'Tên phải là chữ');
        valid = false;
    } else hideError('tbTen');

    if (!isRequired(emp.email) || !isEmail(emp.email)) {
        showError('tbEmail', 'Email không hợp lệ');
        valid = false;
    } else hideError('tbEmail');

    if (!isRequired(emp.password) || !isPassword(emp.password)) {
        showError('tbMatKhau', 'Mật khẩu 6-10 ký tự, 1 số, 1 hoa, 1 đặc biệt');
        valid = false;
    } else hideError('tbMatKhau');

    if (!isRequired(emp.date) || !isDate(emp.date)) {
        showError('tbNgay', 'Ngày làm mm/dd/yyyy');
        valid = false;
    } else hideError('tbNgay');

    if (!isRequired(emp.salary) || !isSalary(emp.salary)) {
        showError('tbLuongCB', 'Lương 1 000 000 - 20 000 000');
        valid = false;
    } else hideError('tbLuongCB');

    if (!isRole(emp.role)) {
        showError('tbChucVu', 'Chọn chức vụ hợp lệ');
        valid = false;
    } else hideError('tbChucVu');

    if (!isRequired(emp.hours) || !isHours(emp.hours)) {
        showError('tbGiolam', 'Giờ làm 80 - 200');
        valid = false;
    } else hideError('tbGiolam');

    return valid;
}

// Core logic
let employees = [];

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

function loadEmployees() {
    const data = localStorage.getItem('employees');
    if (!data) return;

    try {
        const arr = JSON.parse(data);
        employees = arr.map((e) => new Employee(
            e.account, e.name, e.email, e.password,
            e.date, e.salary, e.role, e.hours
        ));
    } catch (err) {
        console.error('Failed to load employees:', err);
        employees = [];
        localStorage.removeItem('employees');
    }
}

function isUniqueAccount(account) {
    return !employees.some((e) => e.account === account);
}

function renderTable(list) {
    const tbody = document.getElementById('tableDanhSach');
    tbody.innerHTML = '';
    list.forEach((emp) => {
        emp.calcTotal();
        emp.classify();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.account}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.date}</td>
            <td>${emp.role}</td>
            <td>${emp.total}</td>
            <td>${emp.type}</td>
            <td>
                <button class="btn btn-info" onclick="editEmployee('${emp.account}')">Sửa</button>
                <button class="btn btn-danger" onclick="deleteEmployee('${emp.account}')">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getFormData() {
    const account = document.getElementById('tknv').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const date = document.getElementById('datepicker').value;
    const salary = document.getElementById('luongCB').value;
    const role = document.getElementById('chucvu').value;
    const hours = document.getElementById('gioLam').value;

    return new Employee(account, name, email, password, date, salary, role, hours);
}

function addEmployee() {
    const emp = getFormData();
    if (!validateForm(emp)) return;

    if (!isUniqueAccount(emp.account)) {
        showError('tbTKNV', 'Tài khoản đã tồn tại');
        return;
    }

    employees.push(emp);
    hideError('tbTKNV');
    saveEmployees();
    filterEmployees();
    $('#myModal').modal('hide');
}

function deleteEmployee(account) {
    employees = employees.filter(e => e.account !== account);
    saveEmployees();
    filterEmployees();
}

let currentEdit = null;

function editEmployee(account) {
    const emp = employees.find(e => e.account === account);
    if (!emp) return;
    currentEdit = emp;

    document.getElementById('tknv').value = emp.account;
    document.getElementById('name').value = emp.name;
    document.getElementById('email').value = emp.email;
    document.getElementById('password').value = emp.password;
    document.getElementById('luongCB').value = emp.salary;
    document.getElementById('chucvu').value = emp.role;
    document.getElementById('gioLam').value = emp.hours;
    document.getElementById('tknv').disabled = true;

    renderAntdDatepicker(emp.date);

    document.getElementById('btnThemNV').style.display = 'none';
    document.getElementById('btnCapNhat').style.display = 'inline-block';
    $('#myModal').modal('show');
}

function updateEmployee() {
    if (!currentEdit) return;
    const emp = getFormData();
    if (!validateForm(emp)) return;

    currentEdit.name = emp.name;
    currentEdit.email = emp.email;
    currentEdit.password = emp.password;
    currentEdit.date = emp.date;
    currentEdit.salary = Number(emp.salary);
    currentEdit.role = emp.role;
    currentEdit.hours = Number(emp.hours);

    saveEmployees();
    filterEmployees();
    $('#myModal').modal('hide');

    document.getElementById('tknv').disabled = false;
    document.getElementById('btnThemNV').style.display = 'inline-block';
    document.getElementById('btnCapNhat').style.display = 'none';
    currentEdit = null;
}

function resetForm() {
    document.querySelector('#myModal form').reset();
    document.getElementById('tknv').disabled = false;
    document.getElementById('btnCapNhat').style.display = 'none';
    document.getElementById('btnThemNV').style.display = 'inline-block';

    document.querySelectorAll('.sp-thongbao').forEach(sp => sp.style.display = 'none');

    renderAntdDatepicker(moment().format('MM/DD/YYYY'));
}

function normalize(str) {
    return str.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function filterEmployees() {
    const nameKey = normalize(document.getElementById('searchName').value);
    const typeKey = normalize(document.getElementById('filterType').value);

    const filtered = employees.filter(emp => {
        emp.classify();
        const matchName = normalize(emp.name).includes(nameKey);
        const matchType = !typeKey || normalize(emp.type) === typeKey;
        return matchName && matchType;
    });

    renderTable(filtered);
}

function init() {
    document.getElementById('btnThem').addEventListener('click', function () {
        resetForm();
    });

    document.getElementById('btnThemNV').addEventListener('click', addEmployee);
    document.getElementById('btnCapNhat').addEventListener('click', updateEmployee);
    document.getElementById('btnTimNV').addEventListener('click', filterEmployees);
    document.getElementById('searchName').addEventListener('keyup', filterEmployees);
    document.getElementById('filterType').addEventListener('change', filterEmployees);

    loadEmployees();
    filterEmployees();

    // Đảm bảo date picker luôn render đúng sau khi DOM xong
    setTimeout(() => {
        renderAntdDatepicker(moment().format('MM/DD/YYYY'));
    }, 0);
}

if (document.readyState !== 'loading') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
