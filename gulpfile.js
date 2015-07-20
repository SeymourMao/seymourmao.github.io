require('colors');
var del = require('del');
var gulp = require('gulp');
var code = require('gulp-code');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var path = require('path');
var pkg = require(path.join(process.cwd(), 'package.json'));
var execSync = require('child_process').execSync;
var fmt = require('util').format;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var argv = require('yargs').argv;

var version, msg, shellCfg, isBuild = true;
function initParam(cb) {
    console.log(argv);
    version = argv.v;
    msg = argv.m ? argv.m : 'rebuild';
    shellCfg = {
        env: process.env,
        cwd: path.resolve('.'),
        stdio: 'inherit'
    };

    if (!version) {
        var child = exec("git status|sed -n '1p' $path_tlog|sed 's/On branch//g'");
        child.stdout.on('data', function (data) {
            version = data.trim();
            cb();
        });
    } else {
        cb();
    }
}

function err(error) {
    console.error('[ERROR]'.red + error.message);
    this.emit('end');
}

function printLog(msg) {
    console.log("[log] " + msg);
}

gulp.task('clean', function(cb) {
    isBuild ? del(['build'], cb) : cb();
});

var ifless = function(file) {
    var extname = path.extname(file.path);
    return extname === '.less' ? true : false;
};

gulp.task('css', ['clean'], function() {
    return gulp.src(['css/**/*.css', 'css/**/*.less'])
        .pipe(gulpif(!isBuild, plumber(err)))
        .pipe(gulpif(ifless, less()))
        .pipe(gulpif(isBuild, code.lint()))
        .pipe(gulpif(isBuild, code.minify()))
        .pipe(gulp.dest('build'));
});

gulp.task('js', ['clean'], function() {
    return gulp.src(['js/**/*.js'])
        .pipe(gulpif(!isBuild, plumber(err)))
        .pipe(gulpif(isBuild, code.lint()))
        .pipe(gulpif(isBuild, code.minify()))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['css', 'js']);

gulp.task("watch", ["default"], function() {
    isBuild = false;
    gulp.watch(['js/**/*.js'], ["js"]);
    gulp.watch(['css/**/*.css', 'css/**/*.less'], ["css"]);
});


/**
 * usage: gulp push origin master
 * 默认是提交当前分支
 * */
gulp.task('push', ['default'], function (done) {
    initParam(function () {
        var psAdd = spawn('git', ['add', '-A'], shellCfg);
        printLog("git add .");

        psAdd.on('close', function () {
            var psCi = spawn('git', ['commit', '-am', msg], shellCfg);
            printLog('git commit -am ' + msg);

            psCi.on('close', function () {
                var psPush = spawn('git', ['push', 'origin', 'master'], shellCfg);
                printLog('git push');
                psPush.on('close', function () {
                    done();
                });
            });
        });
    });
});