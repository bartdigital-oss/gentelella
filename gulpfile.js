var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    ejs = require('gulp-ejs'),
    util = require('gulp-util');
    browserSync = require('browser-sync').create();

var DEST = 'build/';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js',
      ])
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
    return gulp.src('src/scss/gentelella.scss')
        .pipe(sass(options).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', { verbose: true });
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed'});
});

gulp.task('ejs', function() {
    gulp.src('./production/**/*.ejs')
        .pipe(ejs({}, {}, {ext: '.html'}).on('error', util.log))
        .pipe(gulp.dest(DEST))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './build/index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('build/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
  // Watch .ejs files
  gulp.watch('production/**/*.ejs', ['ejs']);
});

// Default Task
gulp.task('default', ['browser-sync', 'watch']);