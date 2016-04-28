module.exports = function (options) {
  return {
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0')
    ],
    env: {
      development: {
        plugins: [
          [require.resolve('babel-plugin-transform-runtime')],
          [require.resolve('babel-plugin-transform-decorators-legacy')],
          [require.resolve('babel-plugin-add-module-exports')],
          [require.resolve('babel-plugin-react-transform'), {
            'transforms': [
              {
                'transform': require.resolve('react-transform-hmr'),
                'imports': ['react'],
                'locals': ['module']
              }
            ]
          }]
        ]
      },
      production: {
        plugins: [
          [require.resolve('babel-plugin-transform-runtime')],
          [require.resolve('babel-plugin-transform-decorators-legacy')],
          [require.resolve('babel-plugin-add-module-exports')],
          [require.resolve('babel-plugin-transform-react-constant-elements')],
          [require.resolve('babel-plugin-transform-react-inline-elements')]
        ]
      }
    }
  }
}
