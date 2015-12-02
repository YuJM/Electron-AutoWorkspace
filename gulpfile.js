var gulp  = require('gulp'),
	exec = require('child_process').exec,
	less = require('gulp-less'),
	ts = require('gulp-tsc'),
	liveReload= require('gulp-livereload')
	path= require('path'),
	del= require('del')
	;

var paths={
	src:{
		less:'sapp/css/*.less',
		ts:'sapp/js/*.ts',
		html:'sapp/**/*.html',
		js:'sapp/**/*.js',
		css:'sapp/**/*.css'
	},
	dst:{
		css:'app/css',
		js:'app/js',
		origin:'app'
	}
};

var basicPath =[paths.src.html,paths.src.js,paths.src.css];

gulp.task('compile-less',function (){
	return gulp.src(paths.src.less)
		   .pipe(less())
		   .pipe(gulp.dest(paths.dst.css));
});
gulp.task('compile-ts',function(){
      return gulp.src(paths.src.ts)
		   .pipe(ts())
		   .pipe(gulp.dest(paths.dst.js));

});
gulp.task('copy-file',function(){
	 return gulp.src(basicPath,{base:'sapp'})
	        .pipe(gulp.dest(paths.dst.origin));	 		
});

function autoRemove(inExt){	
    function remove(event){    	
    	if (event.type === 'deleted') {
		var target = path.relative(path.resolve('sapp'),event.path);
			if(inExt){
			var dump=path.parse(target);
			dump.base=dump.name+inExt;
		    dump.ext=inExt;
		     target= path.format(dump);	     
			}
		var targetPath = path.resolve('app',target);
		del.sync(targetPath);
		}
    }
	return remove;
}

gulp.task('watch',function(){
	liveReload.listen();
	gulp.watch(paths.src.less,['compile-less']).on('change',autoRemove(".css"));
	gulp.watch(paths.src.ts,['compile-ts']).on('change',autoRemove(".js"));
	gulp.watch(basicPath,['copy-file']).on('change',autoRemove());
    gulp.watch(paths.dst.origin+'/**').on('change',liveReload.changed);
});

gulp.task('run',function  () {
	return exec('electron app/app.js',function(err){		
	});
});gulp.task('default',['copy-file','compile-ts','compile-less','watch','run']);