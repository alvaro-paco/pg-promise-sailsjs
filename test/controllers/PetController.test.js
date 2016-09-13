var request = require('supertest')
  , sails = require('sails')
  , assert = require('chai').assert;

describe('PetController', function () {
  describe('should', function () {
    it('create a new Pet successfuly', function (done) {
      var pet = {
        name: 'Scott',
        age: 1
      }
      request(sails.hooks.http.app)
        .post('/pet/transaction')
        .send(pet)
        .expect(201)
        .end(function (err, res) {
          if (err) throw err;
          assert.equal(Object.keys(res.body).length, 1);
          done();
        });
    });
    it('create a new Pet, but fail and Roll-back successfuly', function (done) {
      var pet = {
        name: 'Smart',
        age: 2
      }
      request(sails.hooks.http.app)
        .post('/pet/transaction/fail')
        .send(pet)
        .expect(500)
        .end(function (err, res) {
          if (err) throw err;
          Pet.find()
            .exec(function (err, pets) {
              if (err) throw err;
              assert.equal(pets.length, 1);
              done();
            })
        });
    });
    it('Scott should have a new Owner', function (done) {
      var martin = {
        name: 'Jose',
        city: 'Sao Paulo'
      };
      request(sails.hooks.http.app)
        .post('/pet/' + 1 + '/owner')
        .send(martin)
        .expect(201)
        .end(function (err, res) {
          if (err) throw err;
          var martin = res.data;
          done();
        });
    });
    it('Scott should have a new Owner, bu fail and Rollback partial', function (done) {
      var gustavo = {
        name: 'Gustavo',
        city: 'Araraquara'
      }
      request(sails.hooks.http.app)
        .post('/pet/' + 1 + '/owner/fail')
        .send(gustavo)
        .expect(500)
        .end(function (err, res) {
          if (err) throw err;
          Owner.findOne({name:gustavo.name})
          .exec(function (err, owner) {
            assert.isOk(owner);
            assert.equal(owner.name, gustavo.name);
            assert.equal(owner.city, gustavo.city);
            done();
          })
        });
    });
  });

});