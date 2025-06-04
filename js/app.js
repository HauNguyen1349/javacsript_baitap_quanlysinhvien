// Employee management app
// Define Employee class
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
        if (this.role === 'Giám đốc') {
            this.total = this.salary * 3;
        } else if (this.role === 'Trưởng phòng') {
            this.total = this.salary * 2;
        } else {
            this.total = this.salary;
        }
    }

    classify() {
        if (this.hours >= 192) {
            this.type = 'Xuất sắc';
        } else if (this.hours >= 176) {
            this.type = 'Giỏi';
        } else if (this.hours >= 160) {
            this.type = 'Khá';
        } else {
            this.type = 'Trung bình';
        }
    }
}

// helpers for validation
function isRequired(value) {
    return String(value).trim() !== '';
}

function isAccount(value) {
    return /^\d{4,6}$/.test(value);
}

function isName(value) {
    return /^[a-zA-Z\s]+$/.test(value);
}

function isEmail(value) {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPassword(value) {
    return /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,10}$/.test(value);
}

function isDate(value) {
    return /^(0?[1-9]|1[0-2])\/([0-2]?\d|3[01])\/\d{4}$/.test(value);
}

function isSalary(value) {
    var s = Number(value);
    return s >= 1000000 && s <= 20000000;
}

function isRole(value) {
    return ['Giám đốc', 'Trưởng phòng', 'Nhân viên'].indexOf(value) !== -1;
}

function isHours(value) {
    var h = Number(value);
    return h >= 80 && h <= 200;
}

function showError(selector, message) {
    var span = document.getElementById(selector);
    span.style.display = 'block';
    span.innerText = message;
}

function hideError(selector) {
    var span = document.getElementById(selector);
    span.style.display = 'none';
}

function validateForm(emp) {
    var valid = true;
    if (!isRequired(emp.account) || !isAccount(emp.account)) {
        showError('tbTKNV', 'Tài khoản 4-6 ký số');
        valid = false;
    } else {
        hideError('tbTKNV');
    }

    if (!isRequired(emp.name) || !isName(emp.name)) {
        showError('tbTen', 'Tên phải là chữ');
        valid = false;
    } else {
        hideError('tbTen');
    }

    if (!isRequired(emp.email) || !isEmail(emp.email)) {
        showError('tbEmail', 'Email không hợp lệ');
        valid = false;
    } else {
        hideError('tbEmail');
    }

    if (!isRequired(emp.password) || !isPassword(emp.password)) {
        showError('tbMatKhau', 'Mật khẩu 6-10 ký tự, 1 số, 1 hoa, 1 đặc biệt');
        valid = false;
    } else {
        hideError('tbMatKhau');
    }

    if (!isRequired(emp.date) || !isDate(emp.date)) {
        showError('tbNgay', 'Ngày làm mm/dd/yyyy');
        valid = false;
    } else {
        hideError('tbNgay');
    }

    if (!isRequired(emp.salary) || !isSalary(emp.salary)) {
        showError('tbLuongCB', 'Lương 1 000 000 - 20 000 000');
        valid = false;
    } else {
        hideError('tbLuongCB');
    }

    if (!isRole(emp.role)) {
        showError('tbChucVu', 'Chọn chức vụ hợp lệ');
        valid = false;
    } else {
        hideError('tbChucVu');
    }

    if (!isRequired(emp.hours) || !isHours(emp.hours)) {
        showError('tbGiolam', 'Giờ làm 80 - 200');
        valid = false;
    } else {
        hideError('tbGiolam');
    }

    return valid;
}

var employees = [];

function renderTable(list) {
    var tbody = document.getElementById('tableDanhSach');
    tbody.innerHTML = '';
    list.forEach(function(emp) {
        emp.calcTotal();
        emp.classify();
        var tr = document.createElement('tr');
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
    var account = document.getElementById('tknv').value;
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var date = document.getElementById('datepicker').value;
    var salary = document.getElementById('luongCB').value;
    var role = document.getElementById('chucvu').value;
    var hours = document.getElementById('gioLam').value;
    return new Employee(account, name, email, password, date, salary, role, hours);
}

function addEmployee() {
    var emp = getFormData();
    if (!validateForm(emp)) return;
    employees.push(emp);
    renderTable(employees);
    $('#myModal').modal('hide');
}

function deleteEmployee(account) {
    employees = employees.filter(function(e) {
        return e.account !== account;
    });
    renderTable(employees);
}

var currentEdit = null;

function editEmployee(account) {
    var emp = employees.find(function(e) { return e.account === account; });
    if (!emp) return;
    currentEdit = emp;
    document.getElementById('tknv').value = emp.account;
    document.getElementById('name').value = emp.name;
    document.getElementById('email').value = emp.email;
    document.getElementById('password').value = emp.password;
    document.getElementById('datepicker').value = emp.date;
    document.getElementById('luongCB').value = emp.salary;
    document.getElementById('chucvu').value = emp.role;
    document.getElementById('gioLam').value = emp.hours;
    document.getElementById('tknv').disabled = true;
    document.getElementById('btnThemNV').style.display = 'none';
    document.getElementById('btnCapNhat').style.display = 'inline-block';
    $('#myModal').modal('show');
}

function updateEmployee() {
    if (!currentEdit) return;
    var emp = getFormData();
    if (!validateForm(emp)) return;
    currentEdit.name = emp.name;
    currentEdit.email = emp.email;
    currentEdit.password = emp.password;
    currentEdit.date = emp.date;
    currentEdit.salary = Number(emp.salary);
    currentEdit.role = emp.role;
    currentEdit.hours = Number(emp.hours);
    renderTable(employees);
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
    var errors = document.querySelectorAll('.sp-thongbao');
    errors.forEach(function(sp) {
        sp.style.display = 'none';
    });
}

function normalize(str) {
    return str
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function searchByType() {
    var keyword = normalize(document.getElementById('searchName').value);
    var filtered = employees.filter(function(emp) {
        emp.classify();
        return normalize(emp.type).includes(keyword);
    });
    renderTable(filtered);
}

// attach event handlers regardless of script load timing
function init() {
    document.getElementById('btnThem').addEventListener('click', resetForm);
    document.getElementById('btnThemNV').addEventListener('click', addEmployee);
    document.getElementById('btnCapNhat').addEventListener('click', updateEmployee);
    document.getElementById('btnTimNV').addEventListener('click', searchByType);
    document.getElementById('searchName').addEventListener('keyup', searchByType);
}

if (document.readyState !== 'loading') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
