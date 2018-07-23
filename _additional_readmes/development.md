# Developing the starter

## Using local builds

The starter is the unofficial testing ground to test core.js, the mean library build, the automator, and bootstrap all together.

### Building dependencies locally

1. Run `gulp` from the `libraries` folder to build and watch for changes on all the front-end libraries here except for `mean-lib`.
2. Run `gulp` from the `libraries/npm/@ttcorestudio/mean-lib` to build and watch for changes for the front-end mean library JS file.

The following steps will allow you to use the above locally built copies of everything (and reversing these steps should get you back to the normal production version of the starter):

### package.json

Remove these lines from package.json's `CORE.clientPackages.files` before gulping:

```
"./node_modules/@ttcorestudio/core/.dist/core.js",
"./node_modules/@ttcorestudio/bootstrap/.dist/bootstrap.js",
"./node_modules/@ttcorestudio/mean-lib/.dist/browser/app.js"
```

This will prevent the installed production node modules builds of these files from being a part of your package.js file.


### index.html

In `starter/server/app/views/index.html`, enable these 3 lines of HTML:

```
<script src="/@ttcorestudio/core/.temp-builds/core.js"></script>
<script src="/@ttcorestudio/bootstrap/.temp-builds/bootstrap.js"></script>
<script src="/@ttcorestudio/mean-lib/.dist/browser/app.js"></script>
```

The MEAN library's default gulp makes a distribution file, bypassing temporary development versions. If this changes in the future, use the `.temp-builds` folder for mean-lib instead.


### Gulpfile

In the starter, use the local version of these lines and comment out the other:
```
// var automator = require("@ttcorestudio/automator")(automatorOpts);
var automator = require("../libraries/npm/@ttcorestudio/automator")(automatorOpts);
```

### main.scss

In `browser/scss/main.scss`, use the local version of these two lines:
```
// @import "../../node_modules/@ttcorestudio/bootstrap/css/main";
@import "../../../libraries/npm/@ttcorestudio/bootstrap/css/main";
```

### Running
Run with `npm run start-local` instead of `npm start`.

# Documenting the Starter

From the `starter` folder, run `gulp automator-document`.
