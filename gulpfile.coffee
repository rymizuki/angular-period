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

gulp.task 'test-browsers', (done) ->
  karma = require('karma')
  new karma.Server({
    configFile: __dirname + '/karma.conf.coffee'
  }, done).start()

gulp.task 'test', (done) ->
  karma = require('karma')
  new karma.Server({
    configFile: __dirname + '/karma.conf.coffee'
    singleRun: true
    browsers: ['PhantomJS']
  }, done).start()

gulp.task 'watch', ->
  gulp.watch('src/**/*.js', ['build'])

gulp.task 'default', ['watch', 'test-browsers']
