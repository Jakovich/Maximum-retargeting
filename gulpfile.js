var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
//var jade = require("gulp-jade");
//var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var imagemin = require("gulp-imagemin");
var csso = require("gulp-csso")
var server = require("browser-sync");
var rename = require("gulp-rename");

gulp.task("style", function(){
  gulp.src("less/style.less")
  
  .pipe(plumber())
  
  .pipe(less())
  
  .pipe(postcss([
    autoprefixer({browsers: [
      "last 1 version",
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Opera versions",
      "last 2 Edge versions"            
    ]})
    
    
  ]))
  
  .pipe(gulp.dest("css"))
  .pipe(csso())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("css"))
  .pipe(server.reload({stream: true}));
});

gulp.task("image", function(){
  return gulp.src("img/**/*.{png,jpg,gif}")
  
  .pipe(imagemin({
    optimizationLevel: 3,
    progressive: true 
  }))
  .pipe(gulp.dest("img"))
});

gulp.task("show", ["style"], function(){
  server.init({
    server: ".",
    notify: false,
    open: true,
    ui: false
  });
  
  gulp.watch("less/**/*.less", ["style"]);
   gulp.watch("*.html")     
     .on("change", server.reload);

  
});
