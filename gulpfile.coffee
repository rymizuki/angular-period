gulp = require('gulp')
gulp.task 'build', ->
  jshint    = require('gulp-jshint')
  stylish   = require('jshint-stylish')
  uglify    = require('gulp-uglify')
  rename    = require('gulp-rename')
  annotate  = require('gulp-ng-annotate')

  gulp.src('src/index.js')
    .pipe jshint()
    .pipe jshint.reporter(stylish)
    .pipe annotate()
    .pipe rename('angular-period.js')
    .pipe gulp.dest('dist')
    .pipe uglify()
    .pipe rename({suffix: '.min'})
    .pipe gulp.dest('dist')

gulp.task 'watch', ->
  gulp.watch('src/**/*.js', ['build'])

gulp.task 'default', ['watch']
