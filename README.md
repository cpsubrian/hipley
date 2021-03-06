# hipley
A very-specific babel/less/webpack build tool.

## About

Hipley provides a CLI for developing and building react-powered front-ends via webpack, babel, hot-reloading, and less stylesheets. This was built for a very specific workflow, but I'm open to making the tool more extensible to different use-cases.

## Installation

Hipley is a CLI so just install it globally from npm.

```
$ npm install -g hipley
```

## TLDR; Quick Usage

```
$ hipley --init
$ hipley --dev
(open http://localhost:3000 in browser)
(edit a file, such as a component)
(watch it hot reload)
```

## Application Setup

Hipley comes with a utility to quickly set up a new simple React application.
Navigate to a new directory where you'd like your app to be set up and run:

```
$ hipley --init
```

Your directory should now look something like this:

```
myapp/
 ├── .hipleyrc
 ├── package.json
 ├── build/
 ├─┬ public/
 | ├── favicon.ico
 │ └── index.html
 └─┬ src/
   ├─┬ js/
   │ ├── app.js
   │ ├── colors.js
   │ └─┬ components/
   │   ├── App.js
   │   └── Counter.js
   └─┬ less/
     └── app.less
```

Your package.json will include any app-specific dependencies, such as `react`, `redux`, etc.

You can include a `.hipleyrc` file from which settings will be read (and merged into any command line arguments. For example:

```
{
  "cmd": "node server.js -p 8080",
  "proxy": 8080,
  "vendors": [
    "react",
    "redux",
    "react-redux"
  ]
}
```

The `src/` directory is where hipley will create the build from. It'll be looking for a few specific things:

- A `js/` subdirectory with an `app.js` entry point for the webpack build.
- A `less/` subdirectory with an `app.less` entry point for the less build.

## Run the Development Server

With one command you can run a development server that watches your javascript
and styles for changes and applies hot-reloading to any changes.

```
$ hipley --dev
```

## Build for Production

Hipley includes a production build mode that properly sets `NODE_ENV`, minifies
scripts, and builds source maps.

```
$ hipley --build
```

Your built files will be found in `./build/`. You can run a simple 'production'
server that loads these files with:

```
$ hipley --serve
```

This can be useful for deploying to services like Heroku. This server is a simple
express server that hosts the `public/` and `build/` directories and rewrites
ALL urls to `public/index.html`.


## Using with Node.js

You may want to `require()` "front-end" modules in your node application. To
do this you'll need to use the babel-register hook and point it at hipley's
configuration.

First, install and save `babel-register` into your node application.

```
$ npm install --save babel-register
```

Next, somewhere early in your node application's bootstrapping phase, require
the register hook and point it at configuration generated by the hipley CLI.

```
require('babel-register')(
  JSON.parse(require('child_process').execSync('hipley --babel-register'))
)
```

Note: You'll need to **install hipley globally on your production server** in
order for your app to run there.


## CLI

```
$ hipley --help

  Usage: hipley [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -d, --dev            Run a development server
    -b, --build          Build the production bundles
    -s, --serve          Run a production server
    -p, --port [port]    Port to run the dev server on (3000)
    -r, --proxy [port]   Proxy requests to another port
    -c, --cmd [command]  Spawn a command, for example a node server
    --src [dir]          The directory containing the source files (src/)
    --dest [dir]         The directory to use for the build (build/)
    --init               Initialize a new React application
    --babel-register     Output options for babel-register as JSON

  Development Server:

      $ hipley --dev

  Production Build:

      $ hipley --build

  Production Server:

      $ hipley --serve

  Configuration can be specified in a .hipleyrc file. Defaults:

    {
      "port": 3000,
      "proxy": null,
      "cmd": null,
      "src": "src",
      "dest": "build",
      "static": "public",
      "devServer": 3002,
      "browserSync": {
        "ui": 3001
      },
      "vendors": [],
      "copy": [],
      "optional": {
        "react-transform-catch-errors": true
      }
    }
```

Note: Most options pertain to the development or serve modes.

### CLI Options

- `-p, --port`: The port that the primary develpment server (BrowserSync) will run on. This is what you point your browser at.
- `-r, --proxy`: (Optional) A port that the development server should ultimately proxy to. For example, an express server hosting your server-side code.
- `-c, --cmd`: (Optional) A shell command to run before starting the development build. For example, start up your express server `node server.js`.

## Vendors

Hipley build two bundles: `app.js` and `vendors.js`. Vendors will only contain libraries you specify in your `.hipleyrc` config. Simply list them like the example above in "Application Setup".

## Hot Reloading

Hot reload is powered by the methodology shown in https://github.com/gaearon/react-transform-boilerplate. It uses babel react-transforms and middleware inside the dev server.

## Examples and `hipley --init`

The `./examples` directory contains examples of various react applications. The `--init` command
is directly tied to the examples and easily allows you to spin up a copy of one of them. Simply
execute `hipley --init [name of example]` and you'll get an installed clone of the example,
ready to be modified.

```bash
# Spin up the basic example:
$ hipley --init
# or...
$ hipley --init basic

# Spin up a redux app:
$ hipley --init redux
```

- - -

#### Developed by [TerraEclipse](https://github.com/TerraEclipse)

Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.
