'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
//var webpack = require('webpack-stream'); //for now use webpack standalone for verbose compilation output

//sass compile
gulp.task('sass', function() {
  return gulp.src('./src/sass/*.s*ss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../dist/assets/css/'));
});
/*
//vue build for now use webpack standalone for verbose compilation output
gulp.task('build', function() {
  return gulp.src('src/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('dist/'));
});
*/
//watch sass
gulp.task('watch', function(){
  gulp.watch('./src/sass/*.s*ss', ['sass']); 
});