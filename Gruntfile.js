'use strict';

module.exports = (grunt)=>  {

    grunt.initConfig({
        eslint : {
            target: ['index.js','Gruntfile.js','src/**/*.js','tests/**/*.js']
        },

        jasmine_nodejs : {
            options : {
                specNameSuffix: '.spec.js'
            },

            unit : {
                specs : [ 'tests/unit/**' ]
            }
        },

        watch : {
            options: {
                atBegin : true,
                debounceDelay : 1000,
                event : [ 'added', 'changed' ],
                forever : true
            },
            scripts : {
                files : [ 'index.js', 'Gruntfile.js', 'src/**/*.js',
                            'tests/unit/**' ],
                tasks : [ 'eslint', 'test:unit'  ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test:unit', [
        'eslint',
        'jasmine_nodejs:unit'
    ]);
    
};
