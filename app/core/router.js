var express = require('express');
var fs = require('fs');

var main_controller = {};
var controllersPath = process.cwd() + '/app/controllers';
fs.readdirSync(controllersPath).forEach(function (file) {
  if (file.match(/\.js$/)) {
    main_controller[file.split('.')[0].toLowerCase()] =
      require(controllersPath + '/' + file);
  }
});

var eksi_controllers = {};
var eksi_controllersPath = process.cwd() + '/app/controllers/eksi';
fs.readdirSync(eksi_controllersPath).forEach(function (file) {
  if (file.match(/\.js$/)) {
    eksi_controllers[file.split('.')[0].toLowerCase()] =
      require(eksi_controllersPath + '/' + file);
  }
});
module.exports = function (app) {
  var router = express.Router();
  router.route('/').get(main_controller.main.index);
  router.route('/eksi/popular').get(eksi_controllers.popular.popular);
  router.route('/eksi/detail').get(eksi_controllers.detail.detail);
  router.route('/eksi').get(eksi_controllers.category.category);
  router.route('/eksi/categorylist').get(eksi_controllers.category.categorylist);
  app.use(router);
};
