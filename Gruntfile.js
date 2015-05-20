module.exports = function(grunt) {

  grunt.initConfig({

  jshint: {
    all: {
      src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        node: true,
        mocha: true,
        expr: true
      }
    }
  },

  simplemocha: {
     src: ['test/**/*.js']
  },

jscs: {
    src: 'src/**/*.js',
    options: {
        config: ".jscsrc"
    }
}

});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-simple-mocha');
grunt.loadNpmTasks('grunt-jscs');

grunt.registerTask('default', ['jshint', 'simplemocha', 'jscs']);
grunt.registerTask('test', ['simplemocha']);

};
