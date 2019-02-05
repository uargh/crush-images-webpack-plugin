const compress = require('compress-images');
const path = require('path');

class CrushImagesWebpackPlugin {
  constructor(opts) {
    this.opts = opts;
    this.opts.quality = this.opts.quality || 80;
  }

  apply(compiler) {
    // compiler.context
    // compiler.options.mode === 'production' || compiler.options.optimization.minimize
    // compiler.options.output.path

    const inputPath = path.join(compiler.context, (this.opts.entry || './**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}'));
    const outputPath = path.join(compiler.options.output.path, (this.opts.output || './**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}'));

    var originalSize = 0;
    var optimizedSize = 0;

    console.log('-----------------------------------');
    console.log('');
    console.log('CrushImagesWebpackPlugin');
    console.log('');
    console.log('inputPath', inputPath);
    console.log('');
    console.log('outputPath', outputPath);
    console.log('');

    compiler.plugin('emit', (compilation, cb) => {
      compress(
        inputPath,
        outputPath,
        {
          compress_force: false,
          statistic: true,
          autoupdate: true
        },
        false,
        {
          jpg: {
            engine: 'mozjpeg',
            command: ['-quality', `${this.opts.quality}`]
          }
        },
        {
          png: {
            engine: 'pngquant',
            command: [`--quality=${this.opts.quality}`]
          }
        },
        {
          svg: {
            engine: 'svgo', command: '--multipass'
          }
        },
        {
          gif: {
            engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']
          }
        },
        (err, completed, statistic) => {
          if (err) {
            console.log(err);
          }

          originalSize += statistic.size_in;
          optimizedSize += statistic.size_output;

          if (completed) {
            console.log('originalSize', this.humanFileSize(originalSize, false));
            console.log('optimizedSize', this.humanFileSize(optimizedSize, false));
            console.log('reduced by', this.humanFileSize(originalSize - optimizedSize, false));
            console.log('reduced by ', Math.round((originalSize - optimizedSize) / originalSize * 100), '%');
            console.log('');
            console.log('-----------------------------------');
            cb();
          }
        }
      );
    });
  }

  humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);

    return bytes.toFixed(1)+' '+units[u];
  }
}

module.exports = CrushImagesWebpackPlugin;
