var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch('./src/assets/scss/**/*.scss', ['sass']);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
});

// creation d'une nouvelle tache : 'sass'
gulp.task('sass', function () {
    // définition de la tache
    return gulp.src('./src/assets/scss/**/*.scss') // définition du répertoire source
        .pipe(sass().on('error', sass.logError)) // exéc Sass
        .pipe(gulp.dest('./src/assets/css')) // écriture dans destination
        .pipe(browserSync.stream());
});

// creation d'une nouvelle tache : 'sass:watch'
gulp.task('sass:watch', function () {
  gulp.watch('./src/assets/scss/**/*.scss', ['sass']);
});

// ici la tache par default
gulp.task('default', function() {
  // place code for your default task here
});
