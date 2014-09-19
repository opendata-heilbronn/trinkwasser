// load modules
var gulp = require('gulp');
var connect = require('gulp-connect');

/**
 * development http server
 */
var buildServerMiddlewares = function (backendUrl) {
    return function () {
        return [ (function () {
            var url = require('url');
            var proxy = require('proxy-middleware');
            var options = url.parse(backendUrl);
            options.route = '/api';
            return proxy(options);
        })() ];
    };
};

var serve = function (backendUrl) {
    return function () {
        connect.server({
            root: 'src',
            livereload: true,
            port: 8081,
            middleware: buildServerMiddlewares(backendUrl)
        });
    };
};

gulp.task('serve', serve('http://localhost:8080/api'));

/**
 * watch configuration - enables livereload, which speeds up development
 */
gulp.task('watch-files', function () {
    gulp.watch(['./src/**/*.html', './src/css/*.css', './src/js/**/*.js'], function (event) {
        gulp.src(event.path).pipe(connect.reload());
    });
});

gulp.task('watch', ['serve', 'watch-files']);
gulp.task('default', ['watch']);
