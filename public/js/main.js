var photo1  = new Img({ public_url : '/img/room-1.jpg'});
var photo2  = new Img({ public_url : '/img/room-2.jpg'});
var photo3  = new Img({ public_url : '/img/room-3.jpg'});
var photos = new Galery([photo1,photo2,photo3]); 

var layout1  = new Img({ public_url : '/img/layout.jpg'});
var layouts = new Galery(layout1);

var map1  = new Img({ public_url : '/img/room-map.jpg'});
var maps = new Galery(map1);

$('#slide_layouts').attr('data-orbit-link','headline-4');
$('#slide_maps').attr('data-orbit-link','headline-5');
