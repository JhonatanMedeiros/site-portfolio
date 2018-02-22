var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// process JS files and return the stream.
gulp.task('js', function() {
    return gulp.src('app/js/*js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// create a task that ensures the `js` task is complete before 
// reloading browsers
gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['serve']);