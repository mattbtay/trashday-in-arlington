var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gulpLoadPlugins = require('gulp-load-plugins');
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
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('css', function(){
  gulp.src('css/main.css')
  .pipe(gulp.dest('./dist/css'));
  // Other watchers
});

gulp.task('html', function(){
  gulp.src('index.html')
  .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
  gulp.watch('js//**/*.js', ['scripts']);
});

gulp.task('build', ['scripts', 'css', 'html'], () => {
  return gulp.src('dist/**/*');
});
