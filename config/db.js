var mysql = require('mysql');
var connection =({
        host:'localhost',
        user:'root',
        password:'',
        database:'livretEtudiants',
});
var db;
function connectDB(){
    if(!db){
        db = mysql.createConnection(connection);
        db.connect(function(err){
            if(!err){
                console.log("Connection reussie avec la base donnee!");
                console.log(connection);
            }
            else{
                console.log("Erreur lors de la connection a la base de donnee!");
            }
        });
    }
    return db;
}
module.exports = connectDB();