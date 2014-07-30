/******************
 * wrapper function
 ******************/
module.exports = function(grunt) {
	grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			concurrent: {
				target: {
					tasks: ['nodemon','compass'],
					options: {
						logConcurrentOutput: true
					}
				}
			},
            compass: {
                dist: {
                  options: {
                    config: 'public/config.rb',
                    basePath : 'public/',
                    watch : true  
                  }
                }
            },
			nodemon: {
				dev: {
					script: 'app.js'
				}
			}
    }); 
	
	grunt.loadNpmTasks('grunt-nodemon'); 
	grunt.loadNpmTasks('grunt-concurrent'); 
	grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.registerTask('default', ['concurrent:target']);
} // End wrapper function