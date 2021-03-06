"use strict";
var gulp = require("gulp");
var sass = require("gulp-sass");
var rigger = require("gulp-rigger");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var autoprefix = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");
var imagemin = require('gulp-imagemin');
var source = {
    scssAll: "app/src/styles/**/*.scss",
    scss: "app/src/styles/main.scss",
    html: "app/src/*.html",
    htmlAll: "app/src/**/*.html",
    image: "app/src/img/*.{jpg,jpeg,png,gif}",
    font: "app/src/font/*",
    jsFolder: "app/src/js/*.js"
}
var dist = {
    css: "app/dist/styles",
    html: "app/dist",
    image: "app/dist/img",
    font: "app/dist/font",
    jsFolder: "app/dist/js",
    vendorFolder: "app/dist/vendor"
}

//
//task for move vendors to static folder
//

gulp.task("move", ['move:bootstrap', 'move:jquery'], function() {})

gulp.task("move:jquery", function() {
    gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(dist.vendorFolder));
})

gulp.task("move:bootstrap", function() {
    gulp.src('bower_components/bootstrap/dist/**/*')
        .pipe(gulp.dest(dist.vendorFolder +
            '/bootstrap'));
})

//
//taks for all style
//compile scss to css
//autoprefix
//
gulp.task("css", function() {
    gulp.src(source.scss).pipe(sass().on('error', sass.logError)).pipe(autoprefix({
        browsers: 'last 3 version',
        cascade: false
    })).pipe(gulp.dest(dist.css)).pipe(reload({
        stream: true
    }));
})
//
//task for html
//rigger
//
gulp.task("html:build", function() {
    gulp.src(source.html).pipe(rigger()).pipe(gulp.dest(dist.html)).pipe(reload({
        stream: true
    }))
})
//
//task for js
//uglify
//
gulp.task("js", function() {
    gulp.src(source.jsFolder).pipe(uglify()).pipe(gulp.dest(dist.jsFolder));
})
//
//task for images
//imagemin
//
gulp.task("image:build", function() {
    gulp.src(source.image)
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(dist.image))
})
//
//task for fonts
//
gulp.task("font:build", function() {
    gulp.src(source.font).pipe(gulp.dest(dist.font))
})
//
//task for combine all fron tasks in one and watch for them
//
gulp.task("serve", function() {
    browserSync({
        server: dist.html
    });
    gulp.watch(source.scssAll, ["css"]);
    gulp.watch(source.jsFolder, ["js"]);
    gulp.watch(source.htmlAll, ["html:build"]).on("change", reload);
})
gulp.task("default", ["serve", "css", "html:build", "font:build", "image:build", "js"], function() {});