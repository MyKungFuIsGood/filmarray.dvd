// Include gulp
var gulp = require('gulp');

// Gulp plugins loads almost all our dependency from package.json
var plugins = require('gulp-load-plugins')();
var pkg = require ('./package.json');

// Unsure how to get these to work with gulp-load-plugins
var autoprefixer = require('autoprefixer-core');
var mqpacker     = require('css-mqpacker');
var focus 			 = require('postcss-focus');

// Defining path variables
var dirs = {
	"src": "src",
	"assets": "public/assets",
	"views": "public",
	"media": "public/media"
};

var paths = {
	sass: [
		dirs.src + '/sass/**/*.scss'
	],
	script: [
		dirs.src + '/js/scripts/*.js',
		dirs.src + '/js/*.js'
	],
	watch: [
		dirs.views + '/**/*.html'
	]
};

// Tasks
//---

// Concatenate & Minify JS
gulp.task('script', function() {
	return gulp.src( paths.script )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+ error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+ error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.babel())
	.pipe(plugins.concat('main.js'))
	.pipe(gulp.dest( dirs.assets + '/js/' ))
	.pipe(plugins.uglify())
	.pipe(plugins.rename('main.min.js'))
	.pipe(gulp.dest( dirs.assets + '/js/' ))
	.pipe(plugins.livereload());
});


// Compile our less
gulp.task('sass', function() {
	// Make sure our css is compatible with the last two versions of all browsers
	// For all ::hover styles duplicate a ::focus style
	// Condense mediaquery calls
	var processors = [
		autoprefixer({browsers: ['last 2 version']}),
		focus,
		mqpacker,
	];

	return gulp.src( 'src/sass/main.scss' )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.sass())
	.pipe(plugins.postcss( processors ))
	.pipe(plugins.minifyCss())
	.pipe(plugins.rename('main.min.css'))
	.pipe(gulp.dest( dirs.assets + '/css/' ))
	.pipe(plugins.livereload());
});


// Bower Update Task
gulp.task('bower', function() {
	return plugins.bower();
});


// Migrate Vendor Dependencies 
gulp.task('vendor',['bower'], function() {

	// materialize js
	gulp.src( 'src/vendor/materialize/dist/js/materialize.min.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

	// materialize fonts - roboto
	gulp.src( 'src/vendor/materialize/dist/font/**/*')
	.pipe(gulp.dest( dirs.assets + '/font' ));

	// materialize sass
	gulp.src( 'src/vendor/materialize/sass/components/**/*')
	.pipe(gulp.dest( dirs.src + '/sass/materialize' ));

	// jquery
	gulp.src( 'src/vendor/jquery/dist/jquery.min.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

	// media element assets
	gulp.src( 'src/vendor/mediaelement/build/*.{png,svg,gif}' )
	.pipe(gulp.dest( dirs.assets + '/css'));

	// media element css
	gulp.src( 'src/vendor/mediaelement/build/mediaelementplayer.css' )
	.pipe(plugins.rename( 'mediaelementplayer.scss' ))
	.pipe(gulp.dest( dirs.src + '/sass' ));

	// media element js
	gulp.src( 'src/vendor/mediaelement/build/mediaelement-and-player.min.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

	// reactjs
	gulp.src( 'src/vendor/react/react.min.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

	// jsx for reactjs
	gulp.src( 'src/vendor/react/JSXTransformer.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

});

// Watch Files For Changes
gulp.task('watch', function() {
	plugins.livereload.listen(45678);
	gulp.watch( paths.script , ['script']);
	gulp.watch( paths.sass, ['sass']);
	gulp.watch( paths.watch ).on('change', function (event) {
		plugins.livereload.changed(event.path);
	});
});

gulp.task('init', ['vendor'], function() {
 gulp.run('sass');
 gulp.run('script');
});

gulp.task('build', ['script', 'sass', 'cachebust']);