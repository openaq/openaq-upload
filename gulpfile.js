'use strict';

const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-uglify-es': 'uglify'
  },
  postRequireTransforms: {
    'uglify': function (uglify) {
      return uglify.default;
    }
  }
});
const del = require('del');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const historyApiFallback = require('connect-history-api-fallback');
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const log = require('fancy-log');
const SassString = require('node-sass').types.String;
const notifier = require('node-notifier');
const runSequence = require('run-sequence');
const through2 = require('through2');
const { compile } = require('collecticons-processor');

const OPENAQ_ADDONS = require('openaq-design-system/gulp-addons');

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

// The package.json
var pkg;
var pkgDependencies;

// Environment
// Set the correct environment, which controls what happens in config.js
if (!process.env.NODE_ENV) {
  if (!process.env.TRAVIS_BRANCH || process.env.TRAVIS_BRANCH !== process.env.PRODUCTION_BRANCH) {
    process.env.NODE_ENV = 'staging';
  } else {
    process.env.NODE_ENV = 'production';
  }
}

var prodBuild = false;

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Helper functions --------------------------------//
// ---------------------------------------------------------------------------//

function readPackage () {
  pkg = JSON.parse(fs.readFileSync('package.json'));
  pkgDependencies = Object.assign({}, pkg.dependencies);
  delete pkgDependencies['tachyons-flexbox'];
}
readPackage();

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Callable tasks ----------------------------------//
// ---------------------------------------------------------------------------//

gulp.task('default', ['clean'], function () {
  prodBuild = true;
  gulp.start('build');
});

gulp.task('serve', ['vendorScripts', 'javascript', 'collecticons', 'styles'], function () {
  browserSync({
    port: 3000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': './node_modules'
      }
    },
    middleware: [
      historyApiFallback(),
      OPENAQ_ADDONS.graphicsMiddleware(fs)
    ]
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/assets/graphics/**/*'
  ]).on('change', reload);

  gulp.watch('app/assets/styles/**/*.scss', ['styles']);
  gulp.watch('package.json', ['vendorScripts']);
});

gulp.task('clean', function () {
  return del(['.tmp', 'dist']);
});

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Browserify tasks --------------------------------//
// ------------------- (Not to be called directly) ---------------------------//
// ---------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// main.js
gulp.task('javascript', function () {
  var watcher = watchify(browserify({
    entries: ['./app/assets/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }), { poll: true });

  function bundler () {
    if (pkgDependencies) {
      watcher.external(Object.keys(pkgDependencies));
    }
    return watcher.bundle()
      .on('error', function (e) {
        notifier.notify({
          title: 'Oops! Browserify errored:',
          message: e.message
        });
        console.log('Javascript error:', e); // eslint-disable-line
        if (prodBuild) {
          process.exit(1);
        }
        // Allows the watch to continue.
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // Source maps.
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/assets/scripts'))
      .pipe(reload({ stream: true }));
  }

  watcher
    .on('log', log)
    .on('update', bundler);

  return bundler();
});

gulp.task('collecticons', function () {
  return compile({
    dirPath: 'app/assets/icons/collecticons/',
    fontName: 'Collecticons',
    styleDest: 'app/assets/styles/',
    styleName: '_collecticons',
    preview: false
  });
});

// Vendor scripts. Basically all the dependencies in the package.js.
// Therefore be careful and keep the dependencies clean.
gulp.task('vendorScripts', function () {
  // Ensure package is updated.
  readPackage();
  var vb = browserify({
    debug: true,
    require: pkgDependencies ? Object.keys(pkgDependencies) : []
  });
  return vb.bundle()
    .on('error', log.bind(log, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/assets/scripts/'))
    .pipe(reload({ stream: true }));
});

// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Helper tasks -----------------------------------//
// ----------------------------------------------------------------------------//

gulp.task('build', function () {
  runSequence(['vendorScripts', 'javascript', 'collecticons', 'styles'], ['html', 'images', 'extras'], function () {
    return gulp.src('dist/**/*')
      .pipe($.size({ title: 'build', gzip: true }))
      .pipe($.exit());
  });
});

gulp.task('styles', function () {
  return gulp.src('app/assets/styles/main.scss')
    .pipe($.plumber(function (e) {
      notifier.notify({
        title: 'Oops! Sass errored:',
        message: e.message
      });
      console.log('Sass error:', e.toString()); // eslint-disable-line
      if (prodBuild) {
        process.exit(1);
      }
      // Allows the watch to continue.
      this.emit('end');
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      functions: {
        'urlencode($url)': function (url) {
          var v = new SassString();
          v.setValue(encodeURIComponent(url.getValue()));
          return v;
        }
      },
      includePaths: require('node-bourbon').with('node_modules/jeet/scss', require('openaq-design-system/gulp-addons').scssPath)
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/styles'))
    .pipe(reload({ stream: true }));
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe(cacheUseref())
    // Do not compress comparisons, to avoid MapboxGLJS minification issue
    // https://github.com/mapbox/mapbox-gl-js/issues/4359#issuecomment-286277540
    .pipe($.if('*.js', $.uglify({ compress: { comparisons: false } })))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(/\.(css|js)$/, $.rev()))
    .pipe($.revRewrite())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src(['app/assets/graphics/**/*', OPENAQ_ADDONS.graphicsPath + '/**/*'])
    .pipe($.imagemin([
      $.imagemin.gifsicle({ interlaced: true }),
      $.imagemin.jpegtran({ progressive: true }),
      $.imagemin.optipng({ optimizationLevel: 5 }),
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      $.imagemin.svgo({ plugins: [{ cleanupIDs: false }] })
    ]))
    .pipe(gulp.dest('dist/assets/graphics'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/**/*',
    '!app/*.html',
    '!app/assets/graphics/**',
    '!app/assets/vendor/**',
    '!app/assets/styles/**',
    '!app/assets/scripts/**'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

/**
 * Caches the useref files.
 * Avoid sending repeated js and css files through the minification pipeline.
 * This happens when there are multiple html pages to process.
 */
function cacheUseref () {
  let files = {
    // path: content
  };
  return through2.obj(function (file, enc, cb) {
    const path = file.relative;
    if (files[path]) {
      // There's a file in cache. Check if it's the same.
      const prev = files[path];
      if (Buffer.compare(file.contents, prev) !== 0) {
        this.push(file);
      }
    } else {
      files[path] = file.contents;
      this.push(file);
    }
    cb();
  });
}
