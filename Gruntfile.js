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
          src: ['build/{css,js}/*.{js,css}']
        }]
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    useminPrepare: {
      html: ['build/**/index.html'],
      options: {
        dest: 'build/'
      }
    },
    usemin: {
      html: ['build/**/*.html'],
      css: ['build/**/*.css'],
      options: {
        dirs: ['build/']
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/',
          dest: 'build/',
          src: ['*.{ico,txt}', 'img/{,*/}*.{jpg,png,svg,gif}', 'data/*.geojson', 'fonts/*', 'css/*', 'js/*', 'lib/*']
        }]
      },
      redirect: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/',
          dest: 'build/',
          src: ['redirect.html'],
          rename: function(dest, src) {
            return dest + 'index.html';
          }
        }]
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['build/{css,js,img}']
        }]
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: 'build/img'
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
          dest: 'data',
          ext: '.json'
        }]
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
          localeDir: 'lang/locale'
        }
      }
    },
    abideExtract: {
      js: {
        src: 'src/js/**/*.js',
        dest: 'lang/templates/LC_MESSAGES/messages.pot',
        options: {
          language: 'JavaScript'
        }
      },
      html: {
        src: 'src/index.html',
        dest: 'lang/templates/LC_MESSAGES/messages.pot',
        options: {
          keyword: '_',
          language: 'swig'
        }
      }
    },
    statici18n: {
      options: {
        localeDir: 'lang/locale'
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: 'index.html',
          dest: 'build'
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
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-i18n-abide');
  grunt.loadNpmTasks('hernanex3-grunt-static-i18n');
  grunt.registerTask('dataupdate', ['jsonmin:dist']);
  grunt.registerTask('build', ['clean:dist', 'i18n', 'imagemin', 'uglify', 'copy:dist', 'copy:redirect']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('i18n', ['abideCreate', 'abideExtract', 'statici18n']);
};
