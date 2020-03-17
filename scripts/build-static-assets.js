const gulp = require('gulp')

return gulp.src([
    './src/img/**/*.*',
    './src/service-worker.js',
    './src/manifest.json',
])
    .pipe(gulp.dest('./static/'))