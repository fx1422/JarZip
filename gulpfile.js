var gulp = require('gulp'),
    htmlMin = require('gulp-htmlmin'),//html压缩
    jsMin = require('gulp-jshint'),//js检查
    uglify = require('gulp-uglify'),//js压缩
    cssMin = require('gulp-minify-css'),//css压缩
	tinypng = require('gulp-tinypng');//熊猫压图
	

    imgMin = require('gulp-imagemin'),//图片压缩
    pngquant = require('imagemin-pngquant'),//图片深入压缩
    imageminOptipng = require('imagemin-optipng'),
    imageminSvgo = require('imagemin-svgo'),
    imageminGifsicle = require('imagemin-gifsicle'),
    imageminJpegtran = require('imagemin-jpegtran'),
	
	cache = require('gulp-cache'),//图片压缩缓存
    Replace = require('gulp-replace'),
    clean = require('gulp-clean'),//清空文件夹
    plumber = require('gulp-plumber')//检测错误

	
	
	
	var date = new Date();

//清除任务

gulp.task('clean', function () {
    return gulp.src('dist/**', {read: false}).pipe(clean())
})

//压缩HTML
gulp.task('htmlMin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['project/*.htm','project/**/*.html'])
        .pipe(Replace(/_VERSION_/gi, date))
        .pipe(htmlMin(options))
        .pipe(gulp.dest('dist/html'));
})


//压缩js
gulp.task('jsMin', function () {
    gulp.src(['project/js/*.js'])
        .pipe(uglify({
            mangle: {except: ['require', 'exports', 'module', '$']},//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'false' //保留所有注释
        }))
        .pipe(gulp.dest('dist/js'));
})

//压缩css
gulp.task('cssMin', function () {
    gulp.src(['project/css/*.css','project/**/*.css'])
        .pipe(cssMin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('dist/css'));
})

//压缩图片
gulp.task('imgMin', function () {
   gulp.src(['project/img/*.{png,jpg,gif,ico}','project/**/*.{png,jpg,gif,ico}'])
        .pipe(cache(imgMin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant(),imageminJpegtran({progressive: true})
                , imageminGifsicle({interlaced: true}),imageminOptipng({optimizationLevel:3}), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest('dist/img'));
});
gulp.task('tinypng', function () {
    gulp.src(['project/img/*.{png,jpg,gif,ico}','project/**/*.{png,jpg,gif,ico}'])
        .pipe(tinypng(config.tinypngapi))
        .pipe(gulp.dest('dist/img'));
});

//默认任务

gulp.task('default',['clean'], function () {
    gulp.start('cssMin', 'htmlMin', 'jsMin', 'imgMin');
});







