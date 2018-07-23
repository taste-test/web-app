// All used modules.
var gulp = require('gulp');
var babel = require('gulp-babel');
var runSeq = require('run-sequence');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var karma = require('karma').server;
var istanbul = require('gulp-istanbul');
var notify = require('gulp-notify');
var path = require("path");

/*
 ██████  ██████  ████████ ██  ██████  ███    ██ ███████
██    ██ ██   ██    ██    ██ ██    ██ ████   ██ ██
██    ██ ██████     ██    ██ ██    ██ ██ ██  ██ ███████
██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
 ██████  ██         ██    ██  ██████  ██   ████ ███████
*/

var esLintRules = {
    "eqeqeq": 0,
    "no-use-before-define": 0
};

// -----------------------------------------------------------------------------
// Sources
//
// Not ALL options have been extracted to out here, just the simplest and most
// reused ones.
// -----------------------------------------------------------------------------

// Server

var serverJsSrc = ['./server/**/*.js'];

var esLintServer = {
    "rules": esLintRules
};

// Browser

var browserJsSrc = ['./browser/js/app.js', './browser/js/**/*.js'];

var browserCssSrc = ['./browser/scss/**', './browser/scss/**/*.scss'];

var esLintBrowser = {
    "rules": esLintRules,
    "env": {
        "jquery": true
    },
    "globals": {
        "CORE": true
    }
};

// -----------------------------------------------------------------------------
// automator
// -----------------------------------------------------------------------------

var automatorOpts = {
    gulp: gulp,
    documentation: {
        markdowns: [{
            src: "./readme.md",
            dest: "CORE.WebLibrary/starter/"
        }, {
            srcFolder: "./_additional_readmes",
            dest: "CORE.WebLibrary/starter/"
        }],
        ngdocs: [{
            name: "Mean Starter Angular",
            src: ["./browser/**/*.js"],
            dest: "CORE.WebLibrary/starter/code/browser/ng"
        }],
        jsdocs: [{
            name: "MEAN Starter Server JsDoc",
            src: ["./server/readme.md", "server/", "tests/"],
            dest: "CORE.WebLibrary/starter/code/server"
        }],
        apidocs: [{
            name: "MEAN Starter APIDoc",
            // Single string pointing to source folder
            // ***IMPORTANT***
            // Do not use the **/*.js gulp pattern for apidoc. Include the folders only.
            src: "./server/app/routes/",
            packageDir: "./",
            dest: "CORE.WebLibrary/starter/code/server/api"
        }]
    }
};

// -----------------------------------------------------------------------------
// automator execution
// -----------------------------------------------------------------------------

var automator = require("@ttcorestudio/automator")(automatorOpts);
// var automator = require("../libraries/npm/@ttcorestudio/automator")(automatorOpts);

var coreWebLibDir = automator.coreWebLibDir;

/*
██████  ███████ ██    ██ ████████  █████  ███████ ██   ██ ███████
██   ██ ██      ██    ██    ██    ██   ██ ██      ██  ██  ██
██   ██ █████   ██    ██    ██    ███████ ███████ █████   ███████
██   ██ ██       ██  ██     ██    ██   ██      ██ ██  ██       ██
██████  ███████   ████      ██    ██   ██ ███████ ██   ██ ███████
*/

// Live reload business.
gulp.task('reload', function() {
    livereload.reload();
});

gulp.task('reloadCSS', function() {
    return gulp.src('./public/style.css').pipe(livereload());
});

// -----------------------------------------------------------------------------
// Linting
// -----------------------------------------------------------------------------
gulp.task('lintServerJS', function() {
    return gulp.src(serverJsSrc)
        .pipe(plumber({
            errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
        }))
        .pipe(eslint(esLintServer))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('lintBrowserJS', function() {
    return gulp.src(browserJsSrc)
        .pipe(plumber({
            errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
        }))
        .pipe(eslint(esLintBrowser))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// -----------------------------------------------------------------------------
// building
// -----------------------------------------------------------------------------

gulp.task('buildJS', ['lintBrowserJS'], function() {
    return gulp.src(browserJsSrc)
        .pipe(automator.pipes.jsBuildDev("main.js"))
        .pipe(gulp.dest('./public'));
});

gulp.task('buildCSS', function() {
    return gulp.src('./browser/scss/main.scss')
        .pipe(automator.pipes.cssBuildDev("style.css"))
        .pipe(gulp.dest('./public'));
});

// -----------------------------------------------------------------------------
// testing
// -----------------------------------------------------------------------------
gulp.task('testServerJS', function() {
    require('babel-register');
    return gulp.src('./tests/server/**/*.js', {
        read: false
    }).pipe(mocha({
        reporter: 'spec'
    }));
});

gulp.task('testServerJSWithCoverage', function(done) {
    gulp.src('./server/**/*.js')
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src('./tests/server/**/*.js', {
                    read: false
                })
                .pipe(mocha({
                    reporter: 'spec'
                }))
                .pipe(istanbul.writeReports({
                    dir: './coverage/server/',
                    reporters: ['html', 'text']
                }))
                .on('end', done);
        });
});

gulp.task('testBrowserJS', function(done) {
    karma.start({
        configFile: __dirname + '/tests/browser/karma.conf.js',
        singleRun: true
    }, done);
});

/*
██████  ██████   ██████  ██████  ██    ██  ██████ ████████ ██  ██████  ███    ██
██   ██ ██   ██ ██    ██ ██   ██ ██    ██ ██         ██    ██ ██    ██ ████   ██
██████  ██████  ██    ██ ██   ██ ██    ██ ██         ██    ██ ██    ██ ██ ██  ██
██      ██   ██ ██    ██ ██   ██ ██    ██ ██         ██    ██ ██    ██ ██  ██ ██
██      ██   ██  ██████  ██████   ██████   ██████    ██    ██  ██████  ██   ████
*/

gulp.task('buildCSSProduction', function() {
    return gulp.src('./browser/scss/main.scss')
        .pipe(automator.pipes.cssBuildProduction("style.css"))
        .pipe(gulp.dest('./public'))
});

gulp.task('buildJSProduction', function() {
    return gulp.src(browserJsSrc)
        .pipe(automator.pipes.jsBuildProduction("main.js"))
        .pipe(gulp.dest('./public'));
});

gulp.task('buildProduction', ['buildCSSProduction', 'buildJSProduction']);

gulp.task('jsBrowserDependencies', function() {
    var pJson = require("./package.json");
    if(pJson && pJson.CORE && pJson.CORE.clientPackages) {
        pJson.CORE.clientPackages.forEach(function(dependency) {
            gulp.src(dependency.files)
                .pipe(automator.pipes.jsBuildProduction(dependency.name, {
                    skipBabel: true
                }))
                .pipe(gulp.dest('./public'));
        });
    } else {
        return;
    }
});

/*
 ██████  ██████  ███    ███ ██████   ██████  ███████
██      ██    ██ ████  ████ ██   ██ ██    ██ ██
██      ██    ██ ██ ████ ██ ██████  ██    ██ ███████
██      ██    ██ ██  ██  ██ ██   ██ ██    ██      ██
 ██████  ██████  ██      ██ ██████   ██████  ███████
*/

gulp.task('build', function() {

    gulp.start("automator-document-clean-tempfiles");

    if(process.env.NODE_ENV === 'production') {
        runSeq(['jsBrowserDependencies', 'buildJSProduction', 'buildCSSProduction']);
    } else {
        runSeq(['jsBrowserDependencies', 'buildJS', 'buildCSS']);
    }

});

gulp.task('default', function() {

    gulp.start('build');

    gulp.start('lintServerJS');

    // Run when anything inside of browser/js changes.
    gulp.watch(browserJsSrc, function() {
        runSeq('buildJS', 'reload');
    });

    // Run when anything inside of browser/scss changes.
    gulp.watch(browserCssSrc, function() {
        runSeq('buildCSS', 'reloadCSS');
    });

    // Lint on changes
    gulp.watch(serverJsSrc, ['lintServerJS']);

    gulp.watch(browserJsSrc, ['lintBrowserJS']);

    // Reload when a template (.html) file changes.
    gulp.watch(['browser/**/*.html', 'server/app/views/*.html'], ['reload']);

    // Run server tests when a server file or server test file changes.
    gulp.watch(['tests/server/**/*.js'], ['testServerJS']);

    // Run browser testing when a browser test file changes.
    gulp.watch('tests/browser/**/*', ['testBrowserJS']);

    livereload.listen();

});
