import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import del from 'del';
import Pageres from 'pageres';
import sourcemaps from 'gulp-sourcemaps';
//import spritesmith from 'gulp.spritesmith';
//import gulpif from 'gulp-if';

const server = browserSync.create();

const paths = {
    scripts: {
        src: [
            // Add own scripts
            'src/js/main.js'
        ],
        dest: 'build/js/'
    },
    styles: {
        src: [
            // Add own css
            'src/sass/*.scss'
        ],
        dest: 'build/css/'
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
    },
};

// Tasks
const clean = () => del(['build']);

const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.init())
        //.pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(paths.scripts.dest));
};

const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
        }).on('error', sass.logError))
        .pipe(sourcemaps.write(''))
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

// const sprites = () => {
//     return gulp.src('src/images/sprite/*.png')
//         .pipe(spritesmith({
//             imgName: 'icons.png',
//             imgPath: '../images/icons.png',
//             cssName: '_sprite.scss',
//             cssFormat: 'sass',
//         }))
//         .pipe(gulpif('*.png', gulp.dest('build/images/')))
//         .pipe(gulpif('*.scss', gulp.dest('src/sass/')));
// };

const screenshot = async (done) => {
    await new Pageres({
        delay: 2,
        filename: 'screenshot',
        format: 'png',
        crop: true,
    })
        .src(
            './build/home.html',
            ['1420x900'],
        )
        .dest(__dirname)
        .run();
    done();
};

const watch = () => {
    gulp.watch(paths.scripts.src, gulp.series([scripts], reload));
    gulp.watch(paths.styles.src, gulp.series([styles], reload));
    gulp.watch(paths.images.src, gulp.series([images], reload));
    gulp.watch(paths.fonts.src, gulp.series([fonts], reload));
    gulp.watch(paths.templates.src, gulp.series([templates], reload));
};

const builder = gulp.series(scripts, images, styles, fonts, templates);

const build = gulp.series(clean, builder, screenshot);

const dev = gulp.series(clean, builder, serve, watch);

exports.clean = clean;
exports.templates = templates;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.screenshot = screenshot;
exports.build = build;

export default dev;

