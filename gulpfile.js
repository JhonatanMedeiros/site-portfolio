var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var del = require('del');

var pkg = require('./package.json');


// Set the banner content
var banner = ['/*!\n',
    ' * Jhonatan Medeiros - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * License <%= pkg.license %>)\n',
    ' */\n',
    ''
].join('');

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('app/assets/scss/*.scss')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('sass', function () {
    return gulp.src('app/assets/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src([
        'app/assets/js/*.js'
    ])
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy:vendor', function() {
    gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(gulp.dest('dist/assets/vendor/bootstrap'));

    gulp.src([
        'node_modules/jquery/dist/jquery.min.js'
    ])
        .pipe(gulp.dest('dist/assets/vendor/jquery'));

    gulp.src([
        'node_modules/font-awesome/**',
        '!node_modules/font-awesome/css/font-awesome.css',
        '!node_modules/font-awesome/less/**/**',
        '!node_modules/font-awesome/scss/**/*',
        '!node_modules/font-awesome/**/*.map',
        '!node_modules/font-awesome/.npmignore',
        '!node_modules/font-awesome/*.txt',
        '!node_modules/font-awesome/*.md',
        '!node_modules/font-awesome/*.json'
    ])
        .pipe(gulp.dest('dist/assets/vendor/font-awesome'));

    gulp.src('app/mail/*')
        .pipe(gulp.dest('dist/mail'));

    gulp.src('app/assets/img/*')
        .pipe(gulp.dest('dist/assets/img'));

    gulp.src([,
        'app/index.html',
        'app/manifest.json',
        'app/sw.js'
    ])
        .pipe(gulp.dest('dist/'));

});

// Run reload index
gulp.task('html', function () {

    gulp.src('app/index.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));

});

// Run everything
gulp.task('default', ['dev']);

// Configure the browserSync task
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    })
});

// Dev task with browserSync
gulp.task('dev', function() {

    gulp.start('serve', 'sass', 'minify-js', 'copy:vendor');

    gulp.watch('app/assets/scss/*.scss', ['sass']);
    gulp.watch('app/assets/js/*.js', ['minify-js']);
    gulp.watch('app/*.html', ['html'], browserSync.reload);
});

gulp.task('dist', ['clean'], function () {

    gulp.start('sass', 'minify-js', 'copy:vendor');

});

//Delete folder dist
gulp.task('clean', function() {
    return del('dist');
});