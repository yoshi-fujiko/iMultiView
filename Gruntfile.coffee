module.exports = (grunt)->
  pkg: grunt.file.readJSON 'package.json'
  grunt.initConfig({

    compass:
      production:
        options:
          config: 'config.rb'

  })

  grunt.loadNpmTasks('grunt-contrib-compass')
  grunt.loadNpmTasks('grunt-typescript')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-imageoptim')

  grunt.registerTask('default', ['compass'])
  grunt.registerTask('optim', ['imageoptim'])
