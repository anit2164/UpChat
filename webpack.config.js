const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const deps = require('./package.json').dependencies;
module.exports = (_, argv) => ({
	output: {
		publicPath: 'http://localhost:3001/',
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src/'), // Configure the alias and specify the path to your source code
			'@Layout': path.resolve(__dirname, 'src/layout'),
			'@Components': path.resolve(__dirname, 'src/components'),
			'@SVG': path.resolve(__dirname, 'src/assets/svg'),
		},
	},

	devServer: {
		port: 3001,
		historyApiFallback: true,
	},

	module: {
		rules: [
			{
				test: /\.m?js/,
				type: 'javascript/auto',
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.(css|s[ac]ss)$/i,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(ts|tsx|js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			// {
			// 	test: /\.(gif|svg|jpg|png)$/,
			// 	loader: 'file-loader',
			// },
			{
				test: /\.svg$/,
				use: ['@svgr/webpack', 'file-loader'],
			},
		],
	},

	plugins: [
		new ModuleFederationPlugin({
			name: 'upchat',
			filename: 'remoteEntry.js',
			remotes: {},
			exposes: {},
			shared: {
				...deps,
				react: {
					singleton: true,
					requiredVersion: deps.react,
				},
				'react-dom': {
					singleton: true,
					requiredVersion: deps['react-dom'],
				},
			},
		}),
		new HtmlWebPackPlugin({
			template: './src/index.html',
		}),
	],
});
