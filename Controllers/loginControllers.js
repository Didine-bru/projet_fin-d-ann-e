const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'livretEtudiants',
});

app.use(bodyParser.urlencoded({ extended: true }));

const loginSubmit = async (req, res) => {
  try {
    const { username, password, remember } = req.body;
    // Recherchez l'utilisateur dans la base de données
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (remember) {
      res.cookie('user', username, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    if (user.length === 0) {
      return res.status(401).json({ success: false, message: 'Nom d\'utilisateur incorrect' });
      // Nom d'utilisateur incorrect
    }
    // Vérifiez le mot de passe
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      // Mot de passe incorrect
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }
    // Connexion réussie
    // Générez un jeton JWT
    const token = jwt.sign({ username: user[0].username }, 'Michard', { expiresIn: '4h' });
    if (token) {
      // Retournez la réponse JSON avec les valeurs de username et password
      return res.json({
        success: true,
        message: "Connexion réussie",
        data: {
          username: user[0].username,
          password: user[0].password // À des fins de démonstration seulement, ne stockez jamais les mots de passe côté client
        },
        token
      });
    }
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    // Erreur lors de la connexion
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

module.exports = {
  loginSubmit
};
