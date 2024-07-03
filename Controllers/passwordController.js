const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'livretEtudiants',
});
app.use(bodyParser.urlencoded({ extended: true }));

const password_submit = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Nom d\'utilisateur', username);
    console.log('Mot de passe:', password);

    const [users] = await db.query('SELECT id, password FROM users WHERE LOWER(username) = LOWER(?)', [username]);
    
    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const hashedPasswordFromDatabase = users[0].password;
    console.log(hashedPasswordFromDatabase);
    // Utilisez simplement le mot de passe fourni sans le hacher à nouveau
    if (password === hashedPasswordFromDatabase) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const userId = users[0].id;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    const token = jwt.sign({ username: username , password: password }, 'Michard', { expiresIn: '4h' });
    return res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      token,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};


module.exports = password_submit;

