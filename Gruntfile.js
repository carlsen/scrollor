module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({
	
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				globals: {
					jQuery: false,
					window: false
				}
			},
			files: [
				'js/*.js'
			]
		},

		copy: {
			files: {
				src: 'js/scrollor.js',
				dest: 'dist/scrollor.js'
			}
		},

		uglify: {
			dist: {
				src: 'js/scrollor.js',
				dest: 'dist/scrollor.<%= pkg.version %>.min.js'
			}
		}

	});	

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'copy', 'uglify']);
	grunt.registerTask('dev', ['jshint', 'copy']);

};
