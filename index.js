var fs = require("fs");
var hapi = require("hapi");
var handlebars = require("handlebars");
var server = new hapi.Server();
server.connection({port:8000});
server.start();

server.views({
  path:"templates",
  engines:{
    html:require("handlebars")
  },
  isCached:false,
  layoutPath:"layouts",
  //layout:"default",
  //partialsPath:"templates/partials"
});

server.route({
  method:"GET",
  path:"/",
  handler: function(req, reply){
    fs.readFile("movies.json","utf8",function(err, data){
      var movieList = JSON.parse(data);
      reply.view("index", {
        title:"Rosie's Movies",
        movies: movieList
      });
    })
  }
});

server.route({
  method:"GET",
  path:"/posters/{name?}",
  handler:function(req, reply){
    fs.readFile("movies.json","utf8",function(err, data){
    var movieList = JSON.parse(data);
    var name = req.params.name;
    for(var i=0; i<movieList.length; i++){
        if(name == movieList[i].url){
          reply.view("posters.html", {
            title: movieList[i].title,
            starring: movieList[i].starring,
            poster: movieList[i].poster,
            length: movieList[i].long,
          });
        }
      }
  })
}
});
//to access css and images
server.route({
  method:"GET",
  path:"/assets/{param*}",
  handler:{
    directory: {
      path: "public"
    }
  }
});
