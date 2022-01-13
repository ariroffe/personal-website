const gulp = require('gulp');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

gulp.task('js', function () {
   return gulp.src(['scenes/**/*.js', 'index.js'])
      .pipe(terser({
        // ecma: 6,
        // keep_fnames: true,
        // mangle: true,
        // toplevel: true,
        // parse: {bare_returns:true}
      }))
      .pipe(concat('index.min.js'))
      .pipe(gulp.dest('build'));
});
