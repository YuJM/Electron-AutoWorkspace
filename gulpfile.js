var gulp  = require('gulp'),
	exec = require('child_process').exec,
	less = require('gulp-less'),
	ts = require('gulp-tsc'),
	liveReload= require('gulp-livereload')
	path= require('path'),
	del= require('del')
	;

var cvInArr =[
		{srcForm:'less',
		 destForm:'css',
		 cvFunc:'less'		
		},
		{srcForm:'ts',
		 destForm:'js',
		 cvFunc:'ts'		
		},			
	];

var paths={
	src:{
		less:'sapp/**/*.less',
		ts:'sapp/**/*.ts',
		html:'sapp/**/*.html',
		js:'sapp/**/*.js',
		css:'sapp/**/*.css'
	},
	dst:'app'
};

var basicPath =[paths.src.html,paths.src.js,paths.src.css];

gulp.task('compile-less',function (){
	 	gulp.src(paths.src.less,{base:'sapp'})
		   .pipe(less())
		   .pipe(gulp.dest(paths.dst))
});
gulp.task('compile-ts',function(){
       gulp.src(paths.src.ts,{base:'sapp'})
		   .pipe(ts())
		   .pipe(gulp.dest(paths.dst))

});
gulp.task('copy-file',function(){
	  	gulp.src(basicPath,{base:'sapp'})
	        .pipe(gulp.dest(paths.dst)) 		
});


function removeFile(sPath,cvFile){
			var target = path.relative(path.resolve('sapp'),sPath);			
			if(cvFile){
			var cvExt='.'+cvFile.destForm;
			var dump=path.parse(target);
			dump.base=dump.name+cvExt;
		    dump.ext=cvExt;
		     target= path.format(dump);	     
			}
		var targetPath = path.resolve('app',target);
		del.sync(targetPath);

}
function generProcess(cvArr){
	function workingP(event){
		//added , changed, deleted
	    	var eType = event.type;
	    	var srcPath =event.path;
			var dstPath =  path.dirname(path.resolve('app',path.relative(path.resolve('sapp'),srcPath)));
			var targetExt = path.extname(srcPath);				
			var coPipe = gulp.src(srcPath);
			var delFile=null;

			var cvFile = null;
			var cvFiles=cvArr;
			var cvLength= cvFiles.length;
			var isCvt=false;

			for (var i=0;i<cvLength;i++){
				if(targetExt === '.'+cvFiles[i].srcForm){
					cvFile=cvFiles[i];
					isCvt=true;
				}
			}
			if(!targetExt){
				return;
			}
			// console.log('srcPath:',srcPath);   
			// console.log('dstPath:',dstPath);
			// console.log('cvFile:',cvFile);          
			if( eType != 'deleted'){			
				if (isCvt){	
						coPipe.pipe(eval(cvFile.cvFunc)()).pipe(gulp.dest(dstPath));
					}else{
						coPipe.pipe(gulp.dest(dstPath));
					}			
			}else{
				removeFile(srcPath,cvFile);
				
			}
	}

	return workingP;
}

gulp.task('watch',function(){
	liveReload.listen();
	// console.log(gulp.watch('sapp/**'));
	gulp.watch('sapp/**').on('change',generProcess(cvInArr));
    gulp.watch('app/**').on('change',liveReload.changed);
});

gulp.task('run',function  () {
	return exec('electron app/app.js',function(err){		
	});
});

gulp.task('default',['copy-file','compile-ts','compile-less','watch','run']);