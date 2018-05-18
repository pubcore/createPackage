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
`,
	npmignore = `\
src
dist
`,
	eslintignore = `\
js
`

fs.writeFileSync('.gitignore', gitigore)
fs.writeFileSync('.npmignore', npmignore)
fs.writeFileSync('.eslintignore', eslintignore)
fs.writeFileSync('readme.md', '')
fs.copyFileSync(__dirname + '/js-packageJson', './package.json')
fs.copyFileSync(__dirname + '/js-webpack-config', './webpack.config.js')
fs.copyFileSync(__dirname + '/js-travis.yml', './.travis.yml')
if(!fs.existsSync('src')){
	fs.mkdirSync('src')
}
fs.writeFileSync('src/index.js', '')

child = spawn('npm', ['init'])
child.stdout.pipe(process.stdout)
process.stdin.pipe(child.stdin)
child.on('exit', (code) => {
	console.log(`creation of package.json (exit code ${code})`)
	installPackages()
})

function installPackages(){
	console.log('install packages for transpiler, unit-tests, linter and webpack (used for testing) ...')
	var result = spawnSync(
		'npm',
		['install', '--save-dev', 'babel-cli', 'babel-preset-env', 'babel-plugin-transform-object-rest-spread', 'mocha', 'chai', 'eslint', 'webpack-cli', 'webpack']
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
