
// get admin by email
export const getAdminByEmail = "SELECT * FROM admin WHERE email = $1";

// get customer by email
export const getCustomerByEmail = "SELECT * FROM customers WHERE email = $1";

// get admin profile
export const getAdminProfile = "SELECT fullname, email, role FROM admin WHERE id = $1";

// get admin by id
export const getAdminById = "SELECT * FROM admin WHERE id = $1";

// update admin password
export const updateAdminPassword = "UPDATE admin SET password = $1 WHERE id = $2 RETURNING *";

// register new admin
export const registerNewAdmin = "INSERT INTO admin ( fullname, email, password ) VALUES($1, $2, $3) RETURNING *";