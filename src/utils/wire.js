'use strict';

const path = require(`path`);
const wiredep = require(`wiredep`).stream;
const gulpIf = require(`gulp-if`);
const orderBy = require(`gulp-order`);
const inject = require(`gulp-inject`);
const useref = require(`gulp-useref`);
const rev = require(`gulp-rev`);
const revReplace = require(`gulp-rev-replace`);

class Wire {
  constructor(options) {
    const self = this;
    options = options || {};
    options.client = options.client || {};
    options.client.index = options.client.index || `index.html`;

    if (!options.client.path) {
      throw new Error(`Client Path must be specified`);
    }

    self.options = options;
  }

  wire() {
    const self = this;
    const gulp = self._gulp;
    self._setWiredepOptions();

    let indexHtmlPath = path.join(self.options.client.path, self.options.client.index);

    let jsOrder = [
      `**/app.module.js`,
      `**/*.module.js`,
      `**/*.js`
    ];

    let jsSource = [
      path.join(self.options.client.path, `**/*.module.js`),
      path.join(self.options.client.path, `**/*.js`),
      `!${path.join(self.options.client.path, `**/*.spec.js`)}`
    ];

    return gulp.src(indexHtmlPath)
      .pipe(wiredep(self._wiredepOptions))
      .pipe(self._inject(jsSource, ``, jsOrder))
      .pipe(gulp.dest(self.options.client.path));
  }

  _setWiredepOptions() {
    const self = this;
    self._wiredepOptions = {
      ignorePath: `../..`
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


  bundle() {
    const self = this;
    const gulp = self._gulp;

    let indexHtmlPath = path.join(self.options.client.path, self.options.client.index);

    return gulp.src(indexHtmlPath)
      .pipe(useref())
      .pipe(gulpIf(`!*.html`, rev()))
      .pipe(revReplace())
      .pipe(gulp.dest(`./build`));
  }
}

Wire._default = new Wire({
  client: {
    path: `./src/client`
  }
});

module.exports = Wire;
