const path = require('path');

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          // Replaces existing CSS rules to support PostCSS
          {
            test: /\.(scss|css)$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 1 },
              },
              {
                // Gets options from `postcss.config.js` in your project root
                loader: 'postcss-loader',
                options: { implementation: require.resolve('postcss') },
              },
            ],
          },
        ],
      },
    },
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules'];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../'),
    };

    return config;
  },

  docs: {
    autodocs: true,
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: () => true,
    },
  },
};
