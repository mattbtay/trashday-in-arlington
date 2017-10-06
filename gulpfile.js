var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gulpLoadPlugins = require('gulp-load-plugins');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

var $ = gulpLoadPlugins();

// Basic usage
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('js/main.js')
        .pipe(babel({
          presets: ['env']
        }))
        .pipe(browserify({
          insertGlobals : true,
          debug : true
        }))
        .pipe(rename('js/bundle.js'))
        .pipe(gulp.dest('.'))
});

// gulp task for js prod
gulp.task('js', function() {
    // Single entry point to browserify
    gulp.src('js/bundle.js')
        .pipe(babel({
          presets: ['env']
        }))
        .pipe(browserify({
          insertGlobals : true,
          debug : false
        }))
        .pipe(gulp.dest('./docs/js'))
});


// sass functions for dev and prod
gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('buildsass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./docs/css'));
});


// move index to docs
gulp.task('html', function(){
  gulp.src('index.html')
  .pipe(gulp.dest('./docs/'));
});

// js task for prod
gulp.task('watch', function(){
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('build', ['js', 'buildsass', 'html'], () => {
  return gulp.src('docs/**/*');
});
