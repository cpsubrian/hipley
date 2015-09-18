# hipley
A very-specific babel/less/webpack build tool.

## About

Hipley provides a CLI for developing and building react-powered front-ends via webpack, babel, hot-reloading, and less stylesheets. This was built for a very specific workflow, but I'm open to making the tool more extensible to different use-cases.

## Installation

Hipley is a CLI so just install it globally from npm.

```
$ npm install -g hipley
```

## Application Setup

Your app directory should look something like this:

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


## CLI

```
$ hipley --help

  Usage: hipley [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -d, --dev            Run a development server, rather than build
    -p, --port [port]    Port to run the dev server on (3000)
    -r, --proxy [port]   Proxy requests to another port
    -c, --cmd [command]  Spawn a command, for example a node server
    --src [dir]          The directory containing the source files (src/)
    --dest [dir]         The directory to use for the build (build/)
    --static [dir]       The directory to use for static resources (public/)

  Production Build:

      $ hipley

  Development Server:

      $ hipley --dev

  Configuration can be specified in a .hipleyrc file. Defaults:

    {
      "port": 3000,
      "proxy": null,
      "cmd": null,
      "src": "src",
      "dest": "build",
      "static": "public",
      "browserSync": {
        "ui": 3001
      },
      "devServer": 3002,
      "vendors": []
    }
```

Note: Most options pertain only to development mode `--dev`. When building the production copy hipley just builds all the javascript, css, and copies the public files over to build. You'll then host that however you see fit.

### CLI Options

- `-d, --dev`: Run hipley in development mode.
- `-p, --port`: The port that the primary develpment server (BrowserSync) will run on. This is what you point your browser at.
- `-r, --proxy`: (Optional) A port that the development server should ultimately proxy to. For example, an express server hosting your server-side code.
- `-c, --cmd`: (Optional) A shell command to run before starting the development build. For example, start up your express server `node server.js`.

## Vendors

Hipley build two bundles: `app.js` and `vendors.js`. Vendors will only contain libraries you specify in your `.hipleyrc` config. Simply list them like the example above in "Application Setup".

## Hot Reloading

Hot reload is powered by the methodology shown in https://github.com/gaearon/react-transform-boilerplate. It uses babel react-transforms and middleware inside the dev server.

- - -

#### Developed by [TerraEclipse](https://github.com/TerraEclipse)

Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.
