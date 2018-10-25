var fs = require('fs'),
	spawn = require('cross-spawn'),
	spawnSync = spawn.sync,
	child,
	gitigore = `\
npm-debug.log*
yarn-debug.log*
yarn-error.log*
node_modules/
.npm
.nyc_output
js/
dist/
`,
	npmignore = `\
src
!dist/
.nyc_output
`,
	eslintignore = `\
/js
`,
	updateNotifier = require('update-notifier'),
	pkg = require('./package.json')

updateNotifier({pkg}).notify()

fs.writeFileSync('.gitignore', gitigore)
fs.writeFileSync('.npmignore', npmignore)
fs.writeFileSync('.eslintignore', eslintignore)
fs.writeFileSync('README.md', '')
fs.writeFileSync('CHANGELOG.md', '')
fs.copyFileSync(__dirname + '/js-packageJson', './package.json')
fs.copyFileSync(__dirname + '/js-webpack-config', './webpack.config.js')
fs.copyFileSync(__dirname + '/js-travis.yml', './.travis.yml')
if(!fs.existsSync('src')){
	fs.mkdirSync('src')
}
if(!fs.existsSync('test')){
	fs.mkdirSync('test')
}
fs.copyFileSync(__dirname + '/js-index-spec-js', './test/index.spec.js')
fs.writeFileSync('src/index.js', 'export default () => {}')

child = spawn('npm', ['init'])
child.stdout.pipe(process.stdout)
process.stdin.pipe(child.stdin)
child.on('exit', (code) => {
	console.log(`creation of package.json (exit code ${code})`)
	installPackages()
})

function installPackages(){
	console.log('install packages for transpiler, unit-tests, code-coverage, linter and webpack (used for online-test) ...')
	var result = spawnSync(
		'npm',
		['install', '--save-dev', 'babel-cli', 'babel-preset-env', 'babel-plugin-transform-object-rest-spread', 'mocha', 'chai', 'eslint', 'nyc', 'webpack-cli', 'webpack']
	)
	console.log(result.stdout.toString())
	result.stderr && console.log(result.stderr.toString())

	console.log('eslint: add mocha plugin ...')
	result = spawnSync('npm', ['install', '--save-dev', 'eslint-plugin-mocha'])
	console.log(result.stdout.toString())
	result.stderr && console.log(result.stderr.toString())
	fs.copyFileSync(__dirname + '/js-eslintrc', './.eslintrc.js')
	console.log('package prepared successfully')
	process.exit()
}
