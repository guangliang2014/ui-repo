
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.room_slide = function(req, res){
  res.render('room_slide', { title: 'Express' });
};