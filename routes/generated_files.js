const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const router = express.Router();
const connection = require('../config/db');

router.get('/pdf', (req, res) => {
  connection.query('SELECT * FROM etudiants', (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête SQL : ' + err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    const doc = new PDFDocument();
    try {
      const timestamp = Date.now();
      const filename = `etudiants_${timestamp}.pdf`;
      doc.pipe(fs.createWriteStream(filename));
    let yPosition = 100;
    // Générez le contenu du PDF à partir des données récupérées depuis la base de données
    for (const etudiant of results) {
        doc.fontSize(16).text(`fullname: ${etudiant.fullname}`, 100, yPosition);
        doc.fontSize(16).text(`lastname: ${etudiant.lastname}`, 100, yPosition + 20);
        doc.fontSize(16).text(`datenais: ${etudiant.datenais}`, 100, yPosition + 40);
        doc.fontSize(16).text(`sexe: ${etudiant.sexe}`, 100, yPosition + 60);
        doc.fontSize(16).text(`email: ${etudiant.email}`, 100, yPosition + 60);
        doc.fontSize(16).text(`numeroMat: ${etudiant.numeroMat}`, 100, yPosition + 80);
        doc.fontSize(16).text(`niveau: ${etudiant.niveau}`, 100, yPosition + 100);
        doc.fontSize(16).text(`parcours: ${etudiant.parcours}`, 100,yPosition + 120);
        yPosition += 60;
    }

    // Finalisez le document PDF
    doc.end();
    res.download(filename, () => {
      // Supprimez le fichier PDF temporaire une fois le téléchargement terminé
      fs.unlinkSync(filename);
    });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF : ' + error.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }

  });
});

  

module.exports = router;
