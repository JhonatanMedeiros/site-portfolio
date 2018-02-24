var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var del = require('del');



// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js-watch'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/assets/scss/*.scss", ['sass']);
    gulp.watch("app/assets/css/*.css").on('change', browserSync.reload);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/assets/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(concat('main.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest("app/assets/css"))
        .pipe(notify({ message: 'Styles task complete' }))
        .pipe(browserSync.stream());
});

// process JS files and return the stream.
gulp.task('js', function() {
    return gulp.src('app/js/*js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// create a task that ensures the `js` task is complete before 
// reloading browsers
gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});


gulp.task('images', function() {
    return gulp.src('app/assets/img/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images task complete' }));
});




gulp.task('dist', ['clean'], function (done) {
    gulp.start('dist-sass', 'dist-js', 'images', 'dist-html');

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('dist-sass', function() {
    return gulp.src("app/assets/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"));


});

gulp.task('dist-js', function() {
    return gulp.src('app/assets/js/*js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('dist-html', function () {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('dist/'))
        .pipe(notify({ message: 'Dist Html task complete' }));
});

gulp.task('clean', function() {
    return del(['dist/','dist/css', 'dist/js', 'dist/assets/img']);
});







gulp.task('default', ['serve']);