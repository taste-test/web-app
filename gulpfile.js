const chalk = require('chalk');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const glog = require('fancy-log');
const sourcemaps = require('gulp-sourcemaps');
const embedTemplates = require('gulp-angular-embed-templates');
const browserSync = require('browser-sync').create();
const runSeq = require('run-sequence');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const stripJsComments = require("gulp-strip-comments");
const removeEmptyLines = require("gulp-remove-empty-lines");
const notify = require('gulp-notify');

var esLintRules = {
    "eqeqeq": 0,
    "no-use-before-define": 0,
    "es6": 0
};

var esLintParserOpts = {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
}

var esLintServer = {
    "parserOptions": esLintParserOpts,
    "rules": esLintRules
};

var esLintBrowser = {
    "parserOptions": esLintParserOpts,
    "rules": esLintRules,
    "globals": [
        "$",
        "d3",
        "React",
        "Router",
        "Link",
        "Main",
    ]
};

var browserJs = 'browser/js/**/*.js';
var browserSass = 'browser/scss/**/*.scss';
var browserFonts = 'browser/fonts/**';
var browserAssets = 'browser/assets/*.svg';
var browserHTML = 'browser/**/*.html';

var serverJs = 'server/**/*.js';
var serverHTML = 'server/app/views/*.html';

/*
BROWSER SYNC
 */

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        open: false
    });
});

const reload = browserSync.reload;

/*
TASKS
 */
gulp.task('sass', function() {
    return gulp.src(browserSass)
        .pipe(sass())
        .pipe(gulp.dest("public/style"))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('fonts', function() {
    return gulp.src(browserFonts)
        .pipe(gulp.dest("public/fonts"));
});

gulp.task('assets', function() {
    return gulp.src(browserAssets)
        .pipe(gulp.dest("public/assets"));
});

gulp.task('build-js', function() {
    return gulp.src(browserJs)
        .pipe(sourcemaps.init())
        .pipe(embedTemplates())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public"))
        .pipe(reload({
            stream: true
        }))
});


gulp.task('build-dependencies', function() {
    var packageJson = require("./package.json");
    if (packageJson && packageJson.CORE && packageJson.CORE.clientPackages) {
        packageJson.CORE.clientPackages.forEach(function(dependency) {
            gulp.src(dependency.files)
                .pipe(stripJsComments({
                    safe: true
                }))
                .pipe(removeEmptyLines())
                .pipe(concat(dependency.name))
                .pipe(gulp.dest("./public"))
        });
    }
})


gulp.task('lint-browser-js', function() {
    return gulp.src(browserJs)
        .pipe(plumber({
            errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
        }))
        .pipe(eslint(esLintBrowser))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('lint-server-js', function() {
    return gulp.src(serverJs)
        .pipe(plumber({
            errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
        }))
        .pipe(eslint(esLintServer))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});


/*
SEQUENCES
 */
gulp.task('build', function() {
    if (process.env.NODE_ENV === 'production') {
        glog(chalk.magenta("Running in production"));
        runSeq(['build-dependencies', 'build-js', 'fonts', 'assets', 'sass']);
    } else {
        glog(chalk.yellow("Running in development"));
        runSeq(['build-dependencies', 'build-js', 'fonts', 'assets', 'sass']);
    }
});

/*
WATCH/RUN
 */
gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch(browserSass, ['sass']);
    // Other watchers
    gulp.watch(serverHTML, browserSync.reload);
    gulp.watch(browserJs, browserSync.reload);
});

gulp.task('default', function() {
    glog(chalk.green("Gulp is running!"));
    gulp.start('build');
    gulp.start('lint-browser-js');
    gulp.start('lint-server-js');

    // Other watchers
    gulp.watch(browserJs, ['lint-browser-js']);
    gulp.watch(serverJs, ['lint-server-js']);

    gulp.watch([serverHTML], browserSync.reload);
    gulp.watch(browserJs, ['build-js']);
    gulp.watch(browserSass, ['sass']);
});
