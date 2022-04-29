const { series, src, dest, watch } = require("gulp");
const browserSync = require("browser-sync");
const header = require("gulp-header");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const del = require("del");

const pkg = require("./package.json");

const server = browserSync.create();

// Set the banner content
const banner = ["/*!\n",
  " * Jhonatan Medeiros - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n",
  " * Copyright 2018-" + (new Date()).getFullYear(), " <%= pkg.author %>\n",
  " * License <%= pkg.license %>)\n",
  " */\n",
  ""
].join("");

const paths = {
  scripts: {
    src: "app/assets/js/*.js"
  },
  styles: {
    src: "app/assets/scss/*.scss"
  },
  html: {
    src: "app/*.html"
  }
  // watch('app/assets/scss/*.scss', series('sass'));
  // watch('app/assets/js/*.js', series('minify-js'));
  // watch('app/*.html', series('html', () => server.reload));
};

function reload (done) {
  server.reload();
  done();
}

function serve (done) {
  server.init({ server: { baseDir: "dist/" } });
  done();
}

// Minify compiled CSS
exports.minifyCss = () => {
  return src("app/assets/scss/*.scss")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/assets/css"))
    .pipe(browserSync.reload({ stream: true }));
};

exports.sass = () => {
  return src("app/assets/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/assets/css"))
    .pipe(server.reload({ stream: true }));
};

// Minify JS
exports.minifyJs = () => {
  return src(["app/assets/js/*.js"])
    .pipe(uglify())
    .pipe(header(banner, { pkg }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/assets/js"))
    .pipe(server.reload({
      stream: true
    }));
};

// Copy vendor libraries from /node_modules into /vendor
exports.copyVendor = () => {
  return src([
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "node_modules/bootstrap/dist/js/bootstrap.min.js"
  ])
    .pipe(dest("dist/assets/vendor/bootstrap"))
    .pipe(src(["node_modules/jquery/dist/jquery.min.js"]))
    .pipe(dest("dist/assets/vendor/jquery"))
    .pipe(src([
      "node_modules/font-awesome/**",
      "!node_modules/font-awesome/css/font-awesome.css",
      "!node_modules/font-awesome/less/**/**",
      "!node_modules/font-awesome/scss/**/*",
      "!node_modules/font-awesome/**/*.map",
      "!node_modules/font-awesome/.npmignore",
      "!node_modules/font-awesome/*.txt",
      "!node_modules/font-awesome/*.md",
      "!node_modules/font-awesome/*.json"
    ]))
    .pipe(dest("dist/assets/vendor/font-awesome"))
    .pipe(src("app/assets/img/*"))
    .pipe(dest("dist/assets/img"))
    .pipe(src([
      "app/index.html",
      "app/manifest.json"
    ]))
    .pipe(dest("dist/"));
};

// Run reload index
exports.html = () => {
  return src("app/index.html")
    .pipe(dest("dist/"))
    .pipe(server.reload({ stream: true }));
};

// Configure the browserSync task
// exports.serve = () => server.init({ server: { baseDir: 'dist/' } });

// Delete folder dist
exports.clean = async () => await del("dist");

exports.watch = () => {
  watch(paths.scripts.src, series("minifyJs", reload));
  watch(paths.styles.src, series("sass", reload));
  watch(paths.html.src, series("html", reload));
};

// Dev task with browserSync
exports.dev = (done) => {
  // watch('app/assets/scss/*.scss', series('sass'));
  // watch('app/assets/js/*.js', series('minify-js'));
  // watch('app/*.html', series('html', () => server.reload));

  // gulp.start('serve', 'sass', 'minify-js', 'copy:vendor');
  return series("sass", "minifyJs", "copyVendor", serve, "watch")(done);
};

exports.dist = (done) => series("clean", "sass", "minifyJs", "copyVendor")(done);

// Run everything
exports.default = (done) => series("dev")(done);
