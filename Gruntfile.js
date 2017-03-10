module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			}
		},
		jshint: {
			files: ['gruntfile.js', 'src/js/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					window: true,
					dw: true,
					L: true
				},
				laxbreak: true
			}
		},
		rev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			assets: {
				files: [{
					src: ['dist/{css,js}/*.{js,css}']
				}]
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		useminPrepare: {
			html: ['src/*.html'],
			options: {
				dest: 'dist/'
			}
		},
		usemin: {
			html: ['dist/**/*.html'],
			css: ['dist/**/*.css'],
			options: {
				dirs: ['dist/']
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'src/',
					dest: 'dist/',
					src: ['*.{ico,txt}', 'img/{,*/}*.{jpg,png,svg,gif}', 'data/*.geojson', 'fonts/*']
				}]
			}
		},
		clean: {
			dist: {
				files: [{
					dot: true,
					src: ['dist/{css,js,img}']
				}]
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/img',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: 'dist/img'
				}]
			}
		},
		jsonmin: {
			dist: {
				options: {
					stripWhitespace: true,
					stripComments: true
				},
				files: [{
					expand: true,
					cwd: 'src/data',
					src: ['**/*.json'],
					dest: 'dist/data',
					ext: '.json'
				}]
			}
		},
		devserver: {
			options: {
				port: 8091
			}
		},
		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		},
    abideCreate: {
      default: { // Target name.
        options: {
          template: 'lang/templates/LC_MESSAGES/messages.pot', // (default: 'locale/templates/LC_MESSAGES/messages.pot')
          languages: ['en', 'fr', 'es', 'nl', 'de'],
          localeDir: 'lang/locale',
        }
      }
    },
    abideExtract: {
      js: {
        src: 'src/js/**/*.js',
        dest: 'lang/templates/LC_MESSAGES/messages.pot',
        options: {
          language: 'JavaScript',
        }
      },
      html: {
        src: 'src/*.html',
        dest: 'lang/templates/LC_MESSAGES/messages.pot',
        options: {
          keyword: '_',
          language: 'swig',
        }
      },
    },
    statici18n: {
      options: {
        localeDir: 'lang/locale'
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '*.html',
          dest: 'dist'
        }]
      }
    }
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jsonmin');
	grunt.loadNpmTasks('grunt-rev');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-devserver');
	grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-i18n-abide');
  grunt.loadNpmTasks('hernanex3-grunt-static-i18n');
	grunt.registerTask('dataupdate', ['jsonmin:dist']);
	grunt.registerTask('build', ['clean:dist', 'useminPrepare', 'imagemin', 'concat', 'cssmin', 'uglify', 'copy:dist','statici18n', 'rev', 'usemin']);
	grunt.registerTask('deploy', ['build', 'gh-pages']);
	grunt.registerTask('default', ['build']);
  grunt.registerTask('i18n-init', ['abideExtract', 'abideCreate']);
  grunt.registerTask('i18n', ['statici18n']);
};
