/**
 * PetController
 *
 * @description :: Server-side logic for managing Pets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	tx: function (req, res) {
        if(!db) db = pgp(cn);
        db.tx(function (t) {
            // `t` and `this` here are the same;
            // creating a sequence of transaction queries:
            var data = req.body;
            var q1 = this.none('INSERT INTO pet (name, age) VALUES(\'' + data.name + '\', ' + data.age + ')');
            //var strQ = 'INSERT INTO table(${table~}) VALUES (${values^})';
            // var q1 = this.none(strQ, {table: 'Users', values:[null, "John", 23, null, null]});
            //var q2 = this.one(strQ, {table: 'Pet', values:[null, "Scot", 22, null, null]});

            // returning a promise that determines a successful transaction:
            return this.batch([q1]); // all of the queries are to be resolved;
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
            return res.json(500, error)
        });
    },
    fail: function (req, res) {
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
            return res.json(500, error)
        });
    },
    owner: function (req, res) {
        if(!db) db = pgp(cn);
        var owner = req.body;
        db.tx(function (t) {
            // `t` and `this` here are the same;
            // creating a sequence of transaction queries:
            var queries = [
                this.any('select * from pet  where id = \'' + req.params.petId + '\';'),
            ];
            queries.push(
                this.tx(function (t1) {
                    return this.oneOrNone('INSERT INTO owner (name, city) VALUES(\'' + owner.name + '\', \'' + owner.city +'\')');
                })
            );
            return this.batch(queries);
        })
        .then(function (data) {
            // success;
            Owner.findOne({name: owner.name})
            .populateAll()
            .exec(function (err, owner) {
                if(err) return res.json(500, err)
                db.tx(function (t) {
                    var q = this.oneOrNone('UPDATE pet SET owner=' + owner.id +' where id = ' + req.params.petId + '');
                    return this.batch([q]);
                }).then(function (data) {
                    Pet.findOne({id:req.params.petId})
                    .populateAll()
                    .exec(function (err, pet) {
                        return res.json(201, pet)  
                    })
                }).catch(function (error) {
                    // error;
                    return res.json(500, error)
                }); 
            })
        })
        .catch(function (error) {
            // error;
            return res.json(500, error)
        });
    },
    ownerFail: function (req, res) {
        if(!db) db = pgp(cn);
        var owner = req.body;
        db.tx(function (t) {
            // `t` and `this` here are the same;
            // creating a sequence of transaction queries:
            var queries = [
                this.any('select * from pet  where id = \'' + req.params.petId + '\';'),
            ];
            queries.push(
                this.tx(function (t1) {
                    return this.oneOrNone('INSERT INTO owner (name, city) VALUES(\'' + owner.name + '\', \'' + owner.city +'\')');
                })
            );
            return this.batch(queries);
        })
        .then(function (data) {
            // success;
            Owner.findOne({name: owner.name})
            .populateAll()
            .exec(function (err, owner) {
                if(err) return res.json(500, err)
                db.tx(function (t) {
                    var q = this.oneOrNone('UPDATE pet SET owner ' + owner.id +' where id = ' + req.params.petId + '');
                    return this.batch([q]);
                }).then(function (data) {
                    Pet.findOne({id:req.params.petId})
                    .populateAll()
                    .exec(function (err, pet) {
                        return res.json(201, pet)  
                    })
                }).catch(function (error) {
                    // error;
                    return res.json(500, error)
                }); 
            })
        })
        .catch(function (error) {
            // error;
            return res.json(500, error)
        });
    }
};

