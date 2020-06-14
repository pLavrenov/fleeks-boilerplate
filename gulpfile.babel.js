import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import browserSync from 'browser-sync';
import babel from 'gulp-babel';
import pleeease from 'gulp-pleeease';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import del from 'del';

const server = browserSync.create();

const paths = {
    styles: {
        src: ['src/sass/*.scss', '!src/sass/_*.ejs'],
        dest: 'build/css/'
    },
    scripts: {
        src: 'src/js/main.js',
        dest: 'build/js/'
    },
    images: {
        src: 'src/images/**/*.{png,jpg,gif,svg}',
        dest: 'build/images/'
    },
    fonts: {
        src: 'src/fonts/**/*.{eot,woff,ttf,svg}',
        dest: 'build/fonts/'
    },
    templates: {
        src: ['src/templates/*.ejs', '!src/templates/_*.ejs'],
        dest: 'build/'
    }
};

// Tasks
const clean = () => del(['./build']);

const scripts = () => {
    return gulp.src(paths.scripts.src, {sourcemaps: true})
        .pipe(plumber())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
};

const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(pleeease({
            sass: true,
            out: 'main.min.css',
        }))
        .pipe(gulp.dest(paths.styles.dest));
};

const images = () => {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(imagemin({optimizationLevel: 7}))
        .pipe(gulp.dest(paths.images.dest));
};

const fonts = () => {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
};

const templates = () => {
    return gulp.src(paths.templates.src)
        .pipe(plumber())
        .pipe(ejs({}))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(paths.templates.dest))
};

const reload = (done) => {
    server.reload();
    done();
};

const serve = (done) => {
    server.init({
        server: {
            baseDir: './build/',
            index: 'home.html'
        }
    });
    done();
};

const watch = () => {
    gulp.watch(paths.scripts.src, gulp.series([scripts], reload));
    gulp.watch(paths.styles.src, gulp.series([styles], reload));
    gulp.watch(paths.images.src, gulp.series([images], reload));
    gulp.watch(paths.fonts.src, gulp.series([fonts], reload));
    gulp.watch(paths.templates.src, gulp.series([templates], reload));
};

const dev = gulp.series(clean, scripts, styles, images, fonts, templates, serve, watch);

export default dev;

