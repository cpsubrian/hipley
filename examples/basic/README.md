Example App - Basic
===================

This is a simple react app that you can test hipley and hot-reloading with.

Run Development Server
----------------------

```
$ hipley --dev
```

Now if you visit [http://localhost:3000](http://localhost:3000) you should see
some counters. If you edit `colors.js` or `Counter.js`, you should see the
changes live-update. You can also edit `app.less` and see those changes
auto-inject also.

Build for Production
--------------------

```
$ hipley --build
```

Now the `/build` directory contains the production js and css bundles.

To serve the example you can use hipley's server:

```
$ hipley --serve
```

Or, just look at what `server.js` does and replicate that in your node app.

