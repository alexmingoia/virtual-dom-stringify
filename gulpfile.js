var Browserify = require('browserify')
  , clean = require('gulp-clean')
  , gulp = require('gulp')
  , instrument = require('gulp-instrument')
  , jshint = require('gulp-jshint')
  , mochaPhantomJS = require('gulp-mocha-phantomjs')
  , rename = require('gulp-rename')
  , source = require('vinyl-source-stream')
  , stylish = require('jshint-stylish')
  , spawn = require('child_process').spawn;

gulp.task('coverage', ['instrument'], function() {
  process.env.JSCOV=1;

  return spawn('node_modules/gulp-mocha-phantomjs/node_modules/mocha-phantomjs/node_modules/mocha/bin/mocha', [
    'test', '--reporter', 'html-cov'
  ]).stdout
    .pipe(source('coverage.html'))
    .pipe(gulp.dest('./'));
});

gulp.task('instrument', function() {
  return gulp.src('lib/**.js')
    .pipe(instrument())
    .pipe(gulp.dest('lib-cov'));
});

gulp.task('standalone', function() {
  var bundler = new Browserify({
    standalone: 'vtreeStringify'
  });
  bundler.add('./lib/stringify.js');
  bundler.exclude('./lib-cov/stringify');
  return bundler.bundle()
    .pipe(source('virtual-dom-stringify.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify-tests', function() {
  var bundler = new Browserify();
  bundler.add('./test/stringify.js');
  bundler.exclude('./lib-cov/stringify');
  return bundler.bundle()
    .pipe(source('tests.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('mocha-phantomjs', ['browserify-tests'], function() {
  return gulp.src('test/stringify.html')
    .pipe(mochaPhantomJS({
      mocha: {
        timeout: 6000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      }
    }));
});

gulp.task('test', ['mocha-phantomjs'], function () {
  return gulp.src('dist/tests.js').pipe(clean());
});

gulp.task('jshint', function () {
  return gulp.src(['lib/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('clean', function() {
  return gulp.src([
    'coverage.html',
    'lib-cov',
    'npm-debug.log',
    'dist/tests.js'
  ], {
    read: false
  })
  .pipe(clean());
});

gulp.task('default', ['jshint', 'test', 'watch']);
