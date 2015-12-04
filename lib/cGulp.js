"use strict"

class Gulp{
    constructor(){
        this.gulp = require('gulp')
        this.babel=require('gulp-babel')
        this.stylus = require('gulp-stylus')
        this.rename = require("gulp-rename")
        this.autoprefixer = require('gulp-autoprefixer')
        this.uglify = require('gulp-uglify')
        this.minifyCss = require('gulp-minify-css')
        this.browserify = require('gulp-browserify')
        this.plumber = require('gulp-plumber')
    }
    start(){
        return [
            this.gulp.src(['./dynamic/predist/*.jsx']).pipe(this.plumber())
                .pipe(this.babel({presets:['es2015']}))
                .pipe(this.browserify())
                .pipe(this.uglify())
                .pipe(this.rename({extname:'.js'}))
                .pipe(this.gulp.dest('./static/js')),
            this.gulp.src(['./dynamic/predist/*.js']).pipe(this.plumber())
                .pipe(this.babel({presets:['es2015']}))
                .pipe(this.uglify())
                .pipe(this.gulp.dest('./static/js')),
            this.gulp.src(['./dynamic/predist/*.styl']).pipe(this.plumber())
                .pipe(this.stylus())
                .pipe(this.autoprefixer())
                .pipe(this.minifyCss())
                .pipe(this.gulp.dest('./static/css'))
        ]
    }
}

module.exports=Gulp
