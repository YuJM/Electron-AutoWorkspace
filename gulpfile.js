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

			if(!targetExt){
				return;
			}

			for (var i=0;i<cvLength;i++){
				if(targetExt === '.'+cvFiles[i].srcForm){
					cvFile=cvFiles[i];
					isCvt=true;
				}
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
	gulp.watch('sapp/**').on('change',generProcess(cvInArr));
    gulp.watch('app/**').on('change',liveReload.changed);
});

gulp.task('run',function  () {
	return exec('electron app/app.js',function(err){
	console.log(err);		
	});
});

gulp.task('default',['watch','run']);