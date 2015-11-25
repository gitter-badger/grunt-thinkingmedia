var path = require('path');
var _ = require('lodash');

/**
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-sass');

    /**
     * @type {ThinkingMedia.Common}
     */
    var c = require('./lib/common').init(grunt);
    c.renameTask('sass', 'sassy');

    grunt.config('sass', {
        dev: {},
        build: {}
    });

    grunt.task.registerMultiTask('sass', '', function () {

        function rewrite(dest, src) {
            dest = path.resolve(dest);
            src = path.resolve(src);

            var base = _.find(c.config().src, function (dir) {
                return _.startsWith(src, dir);
            });

            if (!base) {
                grunt.fail.fatal('Could not resolve source for: ' + src);
            }

            var parse = path.parse(dest + src.substr(base.length));
            var outfile = parse.dir + path.sep + parse.name + ".css";

            grunt.log.verbose.writeln("Rename: " + outfile);

            return outfile;
        }

        var files = {
            expand: true,
            src: c.toSASS(c.config().files),
            dest: null,
            rename: rewrite
        };

        var options = {
            compass: true
        };

        switch (this.target) {
            case 'dev':
                files.dest = c.config().webroot + path.sep + 'css';
                options.lineNumbers = true;
                break;
            case 'build':
                files.dest = c.config().build + path.sep + 'css';
                options.sourcemap = 'none';
                options.style = 'compressed';
                break;
        }

        grunt.config('sassy', {
            build: {
                options: options,
                files: [files]
            }
        });

        grunt.task.run(['sassy:build']);
    });
};