gulp = require('gulp')

testFiles = [
  'node_modules/expect.js/index.js'
  'node_modules/sinon-browser-only/sinon.js'
  'node_modules/angular/angular.js'
  'node_modules/angular-mocks/angular-mocks.js'
  'node_modules/moment/min/moment-with-locales.js'
  'dist/angular-period.min.js'
  'test/**/*.js'
]

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
  karma = require('gulp-karma')
  gulp.src(testFiles)
    .pipe karma(
      configFile: __dirname + '/karma.conf.coffee'
      action: 'watch'
    )

gulp.task 'test', (done) ->
  karma = require('gulp-karma')
  gulp.src(testFiles)
    .pipe karma(
      configFile: __dirname + '/karma.conf.coffee'
      action: 'run'
      browsers: ['PhantomJS']
    )

gulp.task 'coverage', (done) ->
  istanbul = require('gulp-istanbul')
  karma    = require('gulp-karma')
  gulp.src(['src/*.js', 'src/**/*.js'])
    .pipe istanbul({includeUntested: true})
    .on 'finish', () ->
      gulp.src(testFiles)
        .pipe karma(
          configFile: __dirname + '/karma.conf.coffee'
          action:     'run'
          browsers:   ['PhantomJS']
        )
        .pipe istanbul.writeReports()

gulp.task 'watch', ->
  gulp.watch('src/**/*.js', ['build'])

gulp.task 'default', ['watch', 'test-browsers']
