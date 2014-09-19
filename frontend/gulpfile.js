var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var connect = require('gulp-connect');

/**
 * build tasks
 */
gulp.task('compile-less', function () {
    return gulp.src('src/css/*.less')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(less())
        .pipe(plumber.stop())
        .pipe(gulp.dest('src/css'));
});
gulp.task('build-src', ['compile-less']);

/**
 * development server
 */
gulp.task('serve', function () {
    connect.server({
        root: 'src',
        livereload: true,
        port: 8081,
        middleware: function () {
            return [ (function () {
                var url = require('url');
                var proxy = require('proxy-middleware');
                var options = url.parse('http://localhost:8080/api');
                options.route = '/api';
                return proxy(options);
            })() ];
        }
    });
});

/**
 * livereload
 */
gulp.task('watch-files', function () {
    gulp.watch(['./src/css/**/*.less'], ['compile-less'], function () {
        gulp.src('./src/css/*.css').pipe(connect.reload());
    });
    gulp.watch(['./src/**/*.html', './src/css/*.css', './src/js/**/*.js'], function (event) {
        gulp.src(event.path).pipe(connect.reload());
    });
});

/**
 * task groups
 */
gulp.task('watch', ['build-src', 'serve', 'watch-files']);
gulp.task('default', ['watch']);
