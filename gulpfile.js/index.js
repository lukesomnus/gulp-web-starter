const gulp = require('gulp');
const config = require('./config');
const path = require('path');
const gulpSequence = require('gulp-sequence');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const size = require('gulp-size');
const notify = require('gulp-notify');
const cssMinify = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const del = require('del');
const changed = require('gulp-changed');
const sizereport = require('gulp-sizereport');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

let NODE_ENV = process.env.NODE_ENV;

const ISPRO = NODE_ENV === 'production';
const ISDEV = NODE_ENV === 'development';

/*---------------------------- html -----------------------------------*/
const htmlPath = {
    src: [path.join(config.root.src, config.tasks.html.src, '*.pug')],
    dev: path.join(config.root.dev),
    dist: path.join(config.root.dist)
};

// html处理
const htmlTaskDev = function () {
    return gulp.src(htmlPath.src)
        .pipe(plumber({
            errorHandler: handleErrors
        }))
        .pipe(gulpif(config.tasks.html.pug, gulpif('*.pug', pug({
            pretty: true,
            data: {
                dev: ISDEV,
                pro: ISPRO
            }
        }))))
        .pipe(gulp.dest(htmlPath.dev))
        .pipe(reload({
            stream: true
        }));
};

const htmlTaskDist = () => {
    return gulp.src(htmlPath.src)
        .pipe(gulpif(config.tasks.html.pug, gulpif('*.pug', pug({
            pretty: true,
            data: {
                dev: ISDEV,
                pro: ISPRO
            }
        }))))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true
        }))
        .pipe(gulp.dest(htmlPath.dist))
        .pipe(size({
            title: 'html',
            showFiles: true
        }));
};


gulp.task('html:dev', htmlTaskDev);

gulp.task('html:dist', htmlTaskDist);

/*---------------------------- css -----------------------------------*/
const cssPaths = {
    vendors: {
        src: config.tasks.css.vendors.src,
        dev: path.join(config.root.dev, config.tasks.css.vendors.dest),
        dist: path.join(config.root.dist, config.tasks.css.vendors.dest),
    },
    bundle: {
        src: path.join(config.root.src, config.tasks.css.bundle.src, "/**/**/*.{" + config.tasks.css.bundle.extensions + "}"),
        dev: path.join(config.root.dev, config.tasks.css.bundle.dest),
        dist: path.join(config.root.dist, config.tasks.css.bundle.dest)
    }
};

// 打包css库文件
const cssVendorsTaskDev = function () {
    const s = size();
    return gulp.src(cssPaths.vendors.src)
        .pipe(concat('vendors.css'))
        .pipe(s)
        .pipe(gulp.dest(cssPaths.vendors.dev))
        .pipe(notify({
            onLast: true,
            message: () => `css library : ${s.prettySize}`
        }));
};

var cssVendorsTaskDist = function () {
    return gulp.src(cssPaths.vendors.src)
        .pipe(cssMinify())
        .pipe(concat('vendors.min.css'))
        .pipe(gulp.dest(cssPaths.vendors.dist))
        .pipe(size({
            title: 'vendors.min.css size:'
        }));
};

//预编译，合并本地css
const cssBundleTaskDev = function () {
    const s = size();
    return gulp.src(cssPaths.bundle.src)
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: handleErrors
        }))
        .pipe(sass(config.tasks.css.sass))
        .pipe(sourcemaps.write())
        .pipe(concat('bundle.css'))
        .pipe(s)
        .pipe(gulp.dest(cssPaths.bundle.dev))
        .pipe(notify({
            onLast: true,
            message: () => `css bundle : ${s.prettySize}`
        }))
        .pipe(reload({
            stream: true
        }));
};

// 压缩、加浏览器前缀、合并
const cssBundleTaskDist = () => {
    return gulp.src(cssPaths.bundle.src)
        .pipe(sass(config.tasks.css.sass))
        .pipe(autoprefixer([
            'ie >= 8',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ]))
        .pipe(cssMinify())
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest(cssPaths.bundle.dist))
        .pipe(size({
            title: 'bundl.min.css'
        }));
};

gulp.task('cssBundle:dev', cssBundleTaskDev);
gulp.task('cssBundle:dist', cssBundleTaskDist);
gulp.task('cssVendors:dev', cssVendorsTaskDev);
gulp.task('cssVendors:dist', cssVendorsTaskDist);



/*---------------------------- images -----------------------------------*/

// gulp.task('css',gulpSequence('cssBundle'));
const imagePath = {
    src: path.join(config.root.src, config.tasks.images.src, "/*.{" + config.tasks.images.extensions + "}"),
    dev: path.join(config.root.dev, config.tasks.images.dest),
    dist: path.join(config.root.dist, config.tasks.images.dest)
};

const imageTaskDev = function () {
    const s = size();
    return gulp.src(imagePath.src)
        .pipe(changed(imagePath.dev))
        .pipe(s)
        .pipe(gulp.dest(imagePath.dev));
};
// 压缩
const imageTaskDist = function () {
    return gulp.src(imagePath.src)
        .pipe(imagemin())
        .pipe(gulp.dest(imagePath.dist));
};

gulp.task('image:dev', imageTaskDev);
gulp.task('image:dist', imageTaskDist);



/*---------------------------- js -----------------------------------*/
const jsPaths = {
    bundle: {
        src: path.join(config.root.src, config.tasks.js.bundle.src, "/*.js"),
        dev: path.join(config.root.dev, config.tasks.js.bundle.dest),
        dist: path.join(config.root.dist, config.tasks.js.bundle.dest)
    },
    vendors: {
        dev: path.join(config.root.dev, config.tasks.js.vendors.dest),
        dist: path.join(config.root.dist, config.tasks.js.vendors.dest)
    }
};


const jsBundleTaskDev = function () {
    const s = size();
    return gulp.src(jsPaths.bundle.src)
        .pipe(sourcemaps.init())
        // 如果使用es6语法
        .pipe(babel(config.tasks.js.babel))
        .on('error', handleErrors)
        .pipe(s)
        .pipe(concat("bundle.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(jsPaths.bundle.dev))
        .pipe(notify({
            onLast: true,
            message: () => `js bundle : ${s.prettySize}`
        }))
        .pipe(reload({
            stream: true
        }));
};
// 压缩、合并
const jsBundleTaskDist = function () {
    return gulp.src(jsPaths.bundle.src)
        .pipe(babel(config.tasks.js.babel))
        .pipe(uglify())
        .pipe(concat("bundle.min.js"))
        .pipe(gulp.dest(jsPaths.bundle.dist));
};

gulp.task('jsBundle:dev', jsBundleTaskDev);
gulp.task('jsBundle:dist', jsBundleTaskDist);

const vendorsTaskDev = function () {
    return gulp.src(config.tasks.js.vendors.src)
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(jsPaths.vendors.dev));
};

const vendorsTaskDist = function () {
    return gulp.src(config.tasks.js.vendors.src)
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest(jsPaths.vendors.dist));
};

gulp.task('jsVendors:dev', vendorsTaskDev);
gulp.task('jsVendors:dist', vendorsTaskDist);

/*---------------------------- fonts -----------------------------------*/

const fontPath = {
    src: path.join(config.root.src, config.tasks.fonts.src, "/*.{" + config.tasks.fonts.extensions + "}"),
    dev: path.join(config.root.dev, config.tasks.fonts.dest),
    dist: path.join(config.root.dist, config.tasks.fonts.dest)
};

const fontTaskDev = function () {
    return gulp.src(fontPath.src)
        // .pipe(changed(paths.dev)) // Ignore unchanged files
        .pipe(gulp.dest(fontPath.dev));
};

const fontTaskDist = function () {
    return gulp.src(fontPath.src)
        .pipe(gulp.dest(fontPath.dist));
};
gulp.task('font:dev', fontTaskDev);
gulp.task('font:dist', fontTaskDist);

/*---------------------------- clean -----------------------------------*/

const cleanTaskDev = function () {
    del(config.root.dev);
};
const cleanTaskDist = function () {
    del(config.root.dist);
};
gulp.task('clean:dev', cleanTaskDev);
gulp.task('clean:dist', cleanTaskDist);

/*---------------------------- server-----------------------------------*/

// 静态服务器
gulp.task('server:dev', ['dev'], function () {
    browserSync.init({
        server: {
            baseDir: "./dev"
        },
        browser: "google chrome"
    });
    gulp.watch(['src/styles/**/*'], ['cssBundle:dev']);
    gulp.watch('src/javascript/*.js', ['jsBundle:dev']);
    gulp.watch('src/images/*', ['images:dev']);
    gulp.watch('src/fonts/*', ['font:dev']);
    gulp.watch(config.root.src + '/' + config.tasks.html.src + '/**/*', ['html:dev']).on('change', reload);
});

gulp.task('server:dist', ['dist'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        browser: "google chrome"
    });
});


/*---------------------------- size report -----------------------------------*/

gulp.task('sizereport', function () {
    return gulp.src('./dist/**/*')
        .pipe(sizereport({
            title: 'whaley项目生产报告',
            gzip: true,
            '*': {
                'maxSize': 100000
            }
        }));
});

/*---------------------------- task Sequence -----------------------------------*/

gulp.task('css:dev', gulpSequence('cssVendors:dev', 'cssBundle:dev'));
gulp.task('css:dist', gulpSequence('cssVendors:dist', 'cssBundle:dist'));

gulp.task('js:dev', gulpSequence('jsBundle:dev', 'jsVendors:dev'));
gulp.task('js:dist', gulpSequence('jsBundle:dist', 'jsVendors:dist'));

gulp.task('dev', ['clean:dev'], gulpSequence('html:dev', 'css:dev', 'js:dev', 'image:dev', 'font:dev'));

gulp.task('dist', ['clean:dist'], gulpSequence('html:dist', 'css:dist', 'js:dist', 'image:dist', 'font:dist', 'sizereport'));



/*---------------------------- private function -----------------------------------*/
function handleErrors(errorObject, callback) {
    notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') this.emit('end');
}