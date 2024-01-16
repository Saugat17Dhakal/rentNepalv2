const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
// Sass Task
function scssTask(){
  return src('src/scss/main.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('public/css', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('src/js/**/*.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('public/js', { sourcemaps: '.' }));
}

// Image Task
function imageTask() {
	return src('src/img/**', { sourcemaps: true })
		.pipe(imagemin())
		.pipe(dest('public/img'))
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: './'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('*.html', browsersyncReload);
  watch(['src/scss/**/*.scss', 'src/js/**/*.js', 'src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.svg', '/pages/*.html'], series(scssTask, jsTask, imageTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  imageTask,
  browsersyncServe,
  watchTask
);