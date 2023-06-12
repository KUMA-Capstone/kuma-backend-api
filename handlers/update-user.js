const bcrypt = require('bcryptjs');
const sql = require('../config/database');

const User = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = '${email}'`;
      sql.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  updateName: (userId, name) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET name = '${name}' WHERE userId = '${userId}'`;
      sql.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  updatePassword: (userId, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          const query = `UPDATE users SET password = '${hash}' WHERE userId = '${userId}'`;
          sql.query(query, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  }
};

const updateUser = async (req, res) => {
    const { userId, name, password } = req.body;
  
    try {
      if (name) {
        await User.updateName(userId, name);
      }
      if (password) {
        await User.updatePassword(userId, password);
      }
  
      res.status(200).send({ error: false, message: "User updated successfully" });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).send({ error: true, message: "Internal Server Error" });
    }
  };

module.exports = {
  updateUser
};
