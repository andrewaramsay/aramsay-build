'use strict';

const angularTemplateCache = require('gulp-angular-templatecache');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const orderBy = require('gulp-order');
const path = require('path');
const replace = require('gulp-replace');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const wiredep = require('wiredep').stream;

const IMAGE_OPTIMIZATION_LEVEL = 4;

class Wire {
  constructor(options) {
    const self = this;
    options = options || {};
    options.client = options.client || {};
    options.client.index = options.client.index || 'index.html';

    if (!options.client.path) {
      throw new Error('Client Path must be specified');
    }

    self.options = options;
    self.indexHtmlPath = path.join(self.options.client.path, self.options.client.index);
  }

  wire() {
    const self = this;
    const gulp = self._gulp;
    self._setWiredepOptions();

    let jsOrder = [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js'
    ];

    let jsSource = [
      path.join(self.options.client.path, '**/*.module.js'),
      path.join(self.options.client.path, '**/*.js'),
      `!${path.join(self.options.client.path, `**/*.spec.js`)}`
    ];

    return gulp.src(self.indexHtmlPath)
      .pipe(wiredep(self._wiredepOptions))
      .pipe(self._inject(jsSource, '', jsOrder))
      .pipe(gulp.dest(self.options.client.path));
  }

  wireStyles() {
    const self = this;
    const gulp = self._gulp;

    let cssSource = [
      path.join(self.options.temp, 'styles/**/*.css')
    ];

    return gulp.src(self.indexHtmlPath)
      .pipe(self._inject(cssSource))
      .pipe(gulp.dest(self.options.client.path));
  }

  compileStyles() {
    const self = this;
    const gulp = self._gulp;

    let sassSource = [
      path.join(self.options.client.path, 'styles/app.scss')
    ]

    self.buildImages(path.join(self.options.temp, 'img'));

    return gulp.src(sassSource)
      .pipe(sass())
      .pipe(autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
      .pipe(gulp.dest(path.join(self.options.temp, 'styles')));
  }

  bundleFonts() {
    const self = this;
    const gulp = self._gulp;

    let fontSource = [
      './bower_components/font-awesome/fonts/**/*.*'
    ];

    return gulp.src(fontSource)
      .pipe(gulp.dest('./build/fonts'));
  }

  buildImages(dest) {
    const self = this;
    const gulp = self._gulp;

    dest = dest || './build/img';

    let imgSource = [
      path.join(self.options.client.path, 'img/**/*.*')
    ];

    return gulp.src(imgSource)
      .pipe(imagemin({ optimizationLevel: IMAGE_OPTIMIZATION_LEVEL }))
      .pipe(gulp.dest(dest));
  }

  _setWiredepOptions() {
    const self = this;
    self._wiredepOptions = {
      ignorePath: '../..'
    };
  }

  _inject(src, label, order) {
    const self = this;

    let options = { read: false };
    if (label) {
      options.name = `inject:${label}`;
    }

    return inject(self._orderSrc(src, order), options);
  }

  _orderSrc(src, order) {
    const self = this;
    const gulp = self._gulp;
    return gulp.src(src)
      .pipe(gulpIf(order, orderBy(order)));
  }

  cleanBuild(done) {
    del(['./build/**', '!./build'])
      .then(function () {
        done();
      });
  }

  cleanTemp(done) {
    const self = this;
    del([
      path.join(self.options.temp, '**'),
      `!${self.options.temp}`
    ])
      .then(function () {
        done();
      });
  }

  bundle() {
    const self = this;
    const gulp = self._gulp;


    return self.injectTemplateCache()
      .pipe(useref())
      .pipe(gulpIf('!*.html', rev()))
      .pipe(revReplace())
      .pipe(replace('/src/client/', '/'))
      .pipe(gulp.dest('./build'));
  }


  buildTemplateCache() {
    const self = this;
    const gulp = self._gulp;

    let templates = [
      path.join(self.options.client.path, '**/*.html'),
      `!${path.join(self.options.client.path, 'index.html')}`

    ];
    let absoluteClientPath = self.options.client.path.substring(1);

    return gulp.src(templates)
      // TODO: minify html
      .pipe(angularTemplateCache('templates.js', {
        module: self.options.client.templatesModule,
        root: absoluteClientPath,
        standAlone: false
      }))
      .pipe(gulp.dest(self.options.temp));
  }

  injectTemplateCache() {
    const self = this;
    const gulp = self._gulp;

    let templatesTempFile = path.join(self.options.temp, 'templates.js');

    return gulp.src(self.indexHtmlPath)
      .pipe(self._inject(templatesTempFile, 'templates'));
  }
}

Wire._default = new Wire({
  client: {
    path: './src/client',
    templatesModule: 'app.core'
  },
  temp: './temp'
});

module.exports = Wire;
