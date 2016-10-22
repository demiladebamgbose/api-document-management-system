var models = require('./../models/index');
var auth = require('./auth');

var Document = {};
//call validatetoken 4 this guy
Document.createDocument = function (req, res) {
  models.Documents.create({
    title: req.body.title,
    content: req.body.content,
    RoleId: req.decoded.RoleId,
    OwnerId: req.decoded.UserId
  }).then(function (document) {
    res.json(document);
  }).catch(function (error) {
    res.json(error);
  });
};



module.exports = document;
