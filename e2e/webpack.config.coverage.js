module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
          enforce: 'post',
          include: require('path').join(__dirname, '..', 'src'),
          exclude: [
            /\.(steps|spec)\.ts$/,
            /node_modules/
          ]
        }
      ]
    }
  };