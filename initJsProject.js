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
	packageJson = `
{
	"scripts":{
		"test":"mocha --watch --require babel-register --recursive",
		"build":"babel src --out-dir js",
		"prepublish":"npm run build"
	},
	"license":"MIT",
	"babel": {
        "presets": [
            "env"
        ],
        "plugins": [
            "transform-object-rest-spread"
        ]
    }
}
`

fs.writeFileSync('.gitignore', gitigore)
fs.writeFileSync('.npmignore', npmignore)
fs.writeFileSync('readme.md', '')
fs.writeFileSync('package.json', packageJson)
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
	console.log('install packages for transpiler, unit-tests and linter ...')
	var result = spawnSync(
		'npm',
		['install', '--save-dev', 'babel-cli', 'babel-preset-env', 'babel-plugin-transform-object-rest-spread', 'mocha', 'chai', 'eslint']
	)
	console.log(result.stdout.toString())
	result.stderr && console.log(result.stderr.toString())

	child = spawn('./node_modules/.bin/eslint', ['--init'])
	child.stdout.pipe(process.stdout)
	process.stdin.pipe(child.stdin)
	child.on('exit', (code) => {
		console.log(`exit creation of .eslintrc.js (exit code ${code})`)
		console.log('eslint: add mocha plugin ...')
		result = spawnSync('npm', ['install', '--save-dev', 'eslint-plugin-mocha'])
		console.log(result.stdout.toString())
		result.stderr && console.log(result.stderr.toString())

		console.log('add "mocha" to toplevel "plugins" array of .eslintrc.js file')
		console.log('add "mocha":true to toplevel "env" object of .eslintrc.js file')
		process.exit()
	})
}
