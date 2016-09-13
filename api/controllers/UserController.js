var pgp = require('pg-promise')({
    // Initialization Options
});
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'testeMP',
    user: 'postgres',
    password: '#71528860#'
};
db = pgp(cn);
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	tx: function (req, res) {
        if(!db) db = pgp(cn);
        db.tx(function (t) {
            // `t` and `this` here are the same;
            // creating a sequence of transaction queries:
            var q1 = this.none('INSERT INTO pet (name, age) VALUES(\'Micke\', 23)');
            var strQ = 'INSERT INTO table(${table~}) VALUES (${values^})';
            // var q1 = this.none(strQ, {table: 'Users', values:[null, "John", 23, null, null]});
            var q2 = this.one(strQ, {table: 'Pet', values:[null, "Scot", 22, null, null]});

            // returning a promise that determines a successful transaction:
            return this.batch([q1, q2]); // all of the queries are to be resolved;
        })
        .then(function (data) {
            // success;
            Pet.find()
            .populateAll()
            .exec(function (err, results) {
                if(err) return res.json(500, JSON.stringify(err))
                return res.json(201, results)   
            })
        })
        .catch(function (error) {
            // error;
            return res.json(500, JSON.stringify(error))
        });
    }
};

