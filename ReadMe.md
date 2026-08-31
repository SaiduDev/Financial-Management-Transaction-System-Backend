Finance and transaction Management System

A backend-focused Banking Management System designed to simulate real-world banking operations. The system allows bank staff to manage customer accounts and perform financial transactions securely.

Key Features
* Customer account registration and management
* Secure authentication and authorization
* Deposit and withdrawal transactions
* Money transfers between accounts
* Account balance management
* Transaction history
* Database transactions for financial operations
* Input validation and error handling
* Role-based access control
* Purpose

This project is designed to demonstrate the implementation of a secure and reliable banking backend using Node.js, Express.js, and PostgreSQL, with a focus on authentication, authorization, database relationships, transaction processing, data consistency, and secure financial operations.



For your **Enterprise Banking Management System**, I recommend keeping the RBAC roles simple but realistic:

### 1. Admin

The admin manages the entire banking system.

**Permissions:**

* Manage bank workers
* Manage customers
* Manage roles and permissions
* Approve/suspend bank workers
* View all accounts
* View all transactions
* View audit logs
* Generate system-wide reports

### 2. Bank Worker

Bank workers handle the actual banking operations at the branch.

**Permissions:**

* Register customers
* Create/approve bank account applications
* View customer accounts
* Process deposits
* Process withdrawals
* Process transfers
* View customer transaction history
* Generate transaction reports

You can later divide bank workers into **Teller** and **Manager** if you want approval workflows.

### 3. Customer

Customers own bank accounts but **do not perform transactions directly through the system**.

**Permissions:**

* Register/login
* Manage their profile
* Apply for a bank account
* View their account
* View their balance
* View their transaction history

**Important:** A customer can **request** a transaction, but the **bank worker performs it**.

### RBAC structure

```text
ADMIN
  │
  ├── Manage Bank Workers
  ├── Manage Customers
  ├── View Everything
  └── System Administration
          │
          ↓
    BANK WORKER
          │
          ├── Manage Accounts
          ├── Deposits
          ├── Withdrawals
          └── Transfers
          │
          ↓
       CUSTOMER
          │
          ├── Own Account
          ├── Balance
          └── Transaction History
```

For the first version, **3 roles are enough**. We can introduce `TELLER`, `MANAGER`, and `AUDITOR` later when we implement more advanced RBAC.



create table admin(
id serial primary key,
fullname varchar(255) not null,
email varchar(100) not null,
password text not null,
role varchar(255) not null default 'admin',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table employees(
id serial primary key,
fullname varchar(255) not null,
email varchar(100) not null,
password text not null,
role varchar(255) not null default 'employee',
employee_id integer not null unique,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table customers(
id serial primary key,
fullname varchar(255) not null,
email varchar(100) not null,
password text not null,
nationality varchar(255) not null,
role varchar(255) not null default 'customer',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table accounts(
id serial primary key,
customer_id integer REFERENCES customers(id),
account_number varchar(10) not null unique,
password TEXT not null,
balance varchar(255) not null,
accout_type varchar(20) NOT NULL,
status varchar(255) not null default 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



create table transactions(
id serial primary key,
transaction_id varchar(255) not null,
type varchar(100) not null,
employee_id integer REFERENCES employees(employee_id),
amount varchar(255) not null,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);