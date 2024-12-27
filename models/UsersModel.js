const connection = require('DatabaseConnection');

const registerNewUser = (user) => {
  return new Promise((resolve, reject) => {
    const addUserQuery = 'INSERT INTO users (login, password, email, role) VALUES (?, ?, ?, ?)';
    connection.query(addUserQuery, [user.login, user.password, user.email, user.role], (err, result) => {
      if (err) {
        reject(err);
      }
      
      if (user.role === 'player') {
        const userId = result.insertId;
        const addPlayerQuery = 'INSERT INTO players (id, name, surname, birthdate) VALUES (?, ?, ?, ?)';
        connection.query(addPlayerQuery, [userId, user.name, user.surname, user.birthdate], (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      } else {
        resolve(result);
      }
    });
  });
};