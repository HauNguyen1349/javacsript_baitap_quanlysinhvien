"use strict";
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

functio
