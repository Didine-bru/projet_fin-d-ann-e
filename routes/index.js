var express = require('express');
var router = express.Router();
var connection = require('../config/db');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Livrets_Etudiants_app' });
});

// getDataEtudiant
router.get('/getDataEtudiant', function (req, res, next) {
  connection.query('SELECT * FROM etudiants ORDER BY id_user ASC', function (err, row) {
    if (err) {
      console.log('err loading data');
    } else {
      console.log('Chargement Reussi!');
      console.log(row);
      res.send(row);
    }
  });
});
//create etudiant
router.post('/saveFormData', function (req, res) {

  const userData = {
    fullname: req.body.txt_full_name,
    lastname: req.body.txt_last_name,
    datenais: req.body.dates_nais,
    sexe: req.body.sexeEt,
    email: req.body.txt_email,
    numeroMat: req.body.numero_mat,
    niveau: req.body.niveauEt,
    parcours: req.body.parcoursEt,
    isactive: 1,
  };
  console.log(userData);
  connection.query("INSERT INTO etudiants SET ?", userData, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Erreur interne!", status: 500 });
    } else {
      console.log('Enregistrement avec succès!');
      res.status(200).json({ message: "Enregistrement avec succès!", status: 200 });
    }
  });
});
router.post('/getData/:id', function (req, res) {
  var dataID = req.params.id;
  connection.query("SELECT * FROM etudiants WHERE id_user = ?", dataID, function (err, row) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "data load failed", status: 500 });
    } else {
      console.log("===================================================");
      console.log("selected is => " + dataID);
      console.log("===================================================");
      res.status(200).json({ message: "data load success", status: 200, data: row });
    }
  });
});
//mise à jour de la table
router.put('/updateData/:id_user', function (req, res) {
  var id_user = req.params.id_user; // Récupérez l'id_user à partir des paramètres d'URL
  var fullname = req.body.fullname; // Utilisez req.body pour récupérer les données du formulaire
  var lastname = req.body.lastname;
  var datenais = req.body.datenais;
  var sexe = req.body.sexe;
  var email = req.body.email;
  var numeroMat = req.body.numeroMat;
  var niveau = req.body.niveau;
  var parcours = req.body.parcours;
  var updateID = req.body.txt_for_id;

  connection.query("UPDATE etudiants SET fullname = ?, lastname = ?, datenais = ?, sexe = ?, email = ?, numeroMat = ?, niveau = ?, parcours = ? WHERE id_user = ?", [fullname, lastname, datenais, sexe, email, numeroMat, niveau, parcours, id_user], function (err, response) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Échec de la mise à jour", status: 500 });
    } else {
      console.log('Mise à jour avec succès!');
      console.log(updateID, fullname, lastname, datenais, sexe, email, numeroMat, niveau, parcours, id_user);
      res.status(200).json({ message: "Mise à jour avec succès!", status: 200 });
    }
  });
});

// Supprimer des données par ID
router.delete('/deleteData/:id_user', function (req, res) {
  var id_user = req.params.id_user;
  connection.query("DELETE FROM etudiants WHERE id_user = ?", id_user, function (err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur interne. Impossible de supprimer", status: 500 });
    } else {
      console.log("ID supprimé : " + id_user);
      res.status(200).json({ message: "Suppression réussie!", status: 200 });
    }
  });
});




module.exports = router;
