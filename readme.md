[![Build Status](https://travis-ci.org/pubcore/createPackage.svg?branch=master)](https://travis-ci.org/pubcore/createPackage)

## Commandline tool to create new packages

### Prerequisites
* latest version of nodejs
* latest version of npm

### It will create/setup minimum package structure to support
* npm
* git
* eslint
* transpiler for ECS6 with spread operator
* running tests via mocha and chai
* running show code coverage after test run

### Install it global

	npm install -g pubcore-create-package

### How to use
1) create a directory (convention lower case and dash-separated)

		mkdir new-project

2) and change into it

		cd new-project

3) execute

		pubcore-create-package

4) (optional) if your code already exists, copy it into src/index.js.
(Keep the entry point file 'src/index.js' because of config dependencies)
