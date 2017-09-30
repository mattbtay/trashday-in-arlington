var gulp = require('gulp');
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

gulp.task('js', function() {
    // Single entry point to browserify
    gulp.src('js/main.js')
        .pipe(babel({
          presets: ['env']
        }))
        .pipe(browserify({
          insertGlobals : true,
          debug : gulp.env.production
        }))
        .pipe(gulp.dest('./docs/js'))
});

gulp.task('css', function(){
  gulp.src('css/main.css')
  .pipe(gulp.dest('./docs/css'));
  // Other watchers
});

gulp.task('html', function(){
  gulp.src('index.html')
  .pipe(gulp.dest('./docs/'));
});

gulp.task('watch', function(){
  gulp.watch('js//**/*.js', ['scripts']);
});

gulp.task('build', ['js', 'css', 'html'], () => {
  return gulp.src('docs/**/*');
});
