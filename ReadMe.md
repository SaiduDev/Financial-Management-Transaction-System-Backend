Banking Management System

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
