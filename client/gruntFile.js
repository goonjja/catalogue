module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');

    // Default task.
    grunt.registerTask('default', ['jshint', 'build', 'karma:unit']);
    grunt.registerTask('build', ['clean', 'html2js', 'concat', 'recess:build', 'copy:assets']);
    grunt.registerTask('release', ['clean', 'html2js', 'uglify', 'jshint', 'karma:unit', 'concat:index', 'recess:min', 'copy:assets']);
    grunt.registerTask('test-watch', ['karma:watch']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });

    var karmaConfig = function (configFile, customOptions) {
        var options = {
            configFile: configFile,
            keepalive: true
        };
        var travisOptions = process.env.TRAVIS && {
            browsers: ['Chrome'],
            reporters: 'dots'
        };
        return grunt.util._.extend(options, customOptions, travisOptions);
    };

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' + '*/\n',
        src: {
            js: ['src/**/*.js', '<%= distdir %>/templates/**/*.js'],
            specs: ['test/**/*.spec.js'],
            scenarios: ['test/**/*.scenario.js'],
            html: ['src/index.html'],
            tpl: {
                app: ['src/app/**/*.tpl.html'],
                common: ['src/common/**/*.tpl.html']
            },
            less: ['src/less/style.less'], // recess:build doesn't accept ** in its file patterns
            lessWatch: ['src/less/**/*.less']
        },
        clean: ['<%= distdir %>/*'],
        copy: {
            assets: {
                files: [{
                        dest: '<%= distdir %>',
                        src: '**',
                        expand: true,
                        cwd: 'src/assets/'
                    }]
            }
        },
        karma: {
            unit: {
                options: karmaConfig('test/config/unit.js')
            },
            watch: {
                options: karmaConfig('test/config/unit.js', {
                    singleRun: false,
                    autoWatch: true
                })
            }
        },
        // converts all templates to one angular module as js file
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= distdir %>/templates/app.js',
                module: 'templates.app'
            },
            common: {
                options: {
                    base: 'src/common'
                },
                src: ['<%= src.tpl.common %>'],
                dest: '<%= distdir %>/templates/common.js',
                module: 'templates.common'
            }
        },
        concat: {
            dist: {
                options: {
                    banner: "<%= banner %>"
                },
                src: ['<%= src.js %>'],
                dest: '<%= distdir %>/js/<%= pkg.name %>.js'
            },
            index: {
                src: ['src/index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            },
            angular: {
                src: ['lib/angular/angular.js', 'lib/angular/angular-resource.js', 'lib/angular/restangular.js'],
                dest: '<%= distdir %>/js/angular.js'
            },
            underscode: {
                src: ['lib/angular/underscore-min.js'],
                dest: '<%= distdir %>/js/underscore.js'
            },
            bootstrap: {
                src: ['lib/bootstrap/*.js'],
                dest: '<%= distdir %>/js/bootstrap.js'
            },
            jquery: {
                src: ['lib/jquery/*.js'],
                dest: '<%= distdir %>/js/jquery.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: "<%= banner %>"
                },
                src: ['<%= src.js %>'],
                dest: '<%= distdir %>/js/<%= pkg.name %>.js'
            },
            angular: {
                src: ['lib/angular/angular.js', 'lib/angular/angular-resource.js', 'lib/angular/restangular.js'],
                dest: '<%= distdir %>/js/angular.js'
            },
            underscode: {
                src: ['lib/angular/underscore-min.js'],
                dest: '<%= distdir %>/js/underscore.js'
            },
            bootstrap: {
                src: ['lib/bootstrap/bootstrap/*.js'],
                dest: '<%= distdir %>/js/bootstrap.js'
            },
            jquery: {
                src: ['lib/jquery/*.js'],
                dest: '<%= distdir %>/js/jquery.js'
            }
        },
        // compiles less to css
        recess: {
            build: {
                files: {
                    '<%= distdir %>/css/<%= pkg.name %>.css': ['<%= src.less %>']
                },
                options: {
                    compile: true
                }
            },
            min: {
                files: {
                    '<%= distdir %>/css/<%= pkg.name %>.css': ['<%= src.less %>']
                },
                options: {
                    compress: true
                }
            }
        },
        watch: {
            all: {
                files: ['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
                tasks: ['default', 'timestamp']
            },
            build: {
                files: ['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
                tasks: ['build', 'timestamp']
            }
        },
        jshint: {
            files: ['gruntFile.js', '<%= src.js %>', '<%= src.specs %>', '<%= src.scenarios %>'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                globals: {}
            }
        }
    });

};