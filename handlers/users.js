const sql = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const User = {
  findById: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE userId = '${userId}'`;
      sql.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
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
  }
};

const signInEmail = async (req, res) => {
  const params = req.body;
  const { email, password } = params;

  try {
    const result = await User.findByEmail(email);

    if (result.length === 0) {
      res.status(404).send({ error: true, message: "Email not found" });
    } else {
      bcrypt.compare(password, result[0].password, (err, check) => {
        if (err) {
          res.status(500).send({ error: true, message: err });
        } else if (!check) {
          res.status(404).send({ error: true, message: "Invalid password" });
        } else {
          const user = {
            userId: result[0].userId,
            email: result[0].email,
            name: result[0].name
          };

          const token = jwt.sign(user, 'secret_key'); 

          res.status(200).send({
            error: false,
            message: "success",
            signinResult: {
              userId: user.userId,
              email: user.email,
              name: user.name,
              token: token
            }
          });
        }
      });
    }
  } catch (err) {
    console.error('Error retrieving user from database:', err);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};


const signUpEmail = (req, res) => {
  const { name, email, password } = req.body;
  const userId = uuidv4(); 

  sql.query(
    `SELECT email FROM users WHERE email = '${email}'`,
    (err, result) => {
      if (err) {
        res.status(500).send({ error: true, message: "Server Error" });
      } else {
        if (result.length > 0)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   {
          res.status(409).send({ error: true, message: "Email Already Exist" });
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              console.error('Error hashing password:', err);
              res.status(500).send({ error: true, message: "Internal Server Error" });
            } else {
              const query = `INSERT INTO users (userId, email, name, password) VALUES ('${userId}', '${email}', '${name}', '${hash}')`;
              sql.query(query, (err, result) => {
                if (err) {
                  res.status(500).send({ error: true, message: "Server Error" });
                } else {
                  res.status(200).send({ error: false, message: "Registration Successful" });
                }
              });
            }
          });
        }
      }
    }
  );
};

module.exports = {
  signInEmail,
  signUpEmail
};