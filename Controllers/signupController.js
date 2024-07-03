const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
        host:'localhost',
        user:'root',
        password:'',
        database:'livretEtudiants',
});

const signupSubmit = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    // Vérifiez si l'utilisateur existe déjà
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log(existingUser);
    if (existingUser.length > 0) {
      // Utilisateur déjà inscrit
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }
    // Vérifiez si les mots de passe correspondent
    if (password !== confirmPassword) {
      // Les mots de passe ne correspondent pas
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }
    // Hachez le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insérez le nouvel utilisateur dans la base de données
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    // Inscription réussie
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    // Erreur lors de l'inscription
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};
module.exports = {
  signupSubmit,
};


