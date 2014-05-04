/******************
 * wrapper function
 ******************/
module.exports = function(grunt) {
	grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			concurrent: {
				target: {
					tasks: ['nodemon', 'watch'],
					options: {
						logConcurrentOutput: true
					}
				}
			},
			sass: {
				dist: {
					files: {
						'public/css/style.css': 'public/sass/style.scss'
					}
				}
			},
			watch: {
				css: {
					files: '**/*.scss',
					tasks: ['sass']
				},
				js: {
					files: 'public/js/*.js',
					tasks: ['uglify']
				}
			},
			nodemon: {
				dev: {
					script: 'app.js'
				}
			},
			uglify: {
				min: {
					files: {
						'public/js/min/helpers.min.js': ['public/js/*.js']
					}
				}
			}	
			}); 
	grunt.loadNpmTasks('grunt-contrib-sass'); 
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon'); 
	grunt.loadNpmTasks('grunt-concurrent'); 
	grunt.loadNpmTasks('grunt-contrib-uglify'); 
	grunt.registerTask('default', ['concurrent:target']);
	} // End wrapper function