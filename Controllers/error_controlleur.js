// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err); // Affichez l'erreur dans la console à des fins de débogage
    res.status(err.status || 500);
    res.render('error', {
      message: err.message, // Assurez-vous que "message" est défini dans l'erreur
      error: {}
    });
  });
  
  // Dans votre route ou middleware
const err = new Error("Une erreur s'est produite.");
err.status = 500;
next(err);


