
// get admin by email
export const getAdminByEmail = "SELECT * FROM admin WHERE email = $1";

// get customer by email
export const getCustomerByEmail = "SELECT * FROM customers WHERE email = $1";

// get admin profile
export const getAdminProfile = "SELECT fullname, email, role FROM admin WHERE id = $1";