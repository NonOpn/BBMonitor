# BBMonitor

Simple ReactNative app to monitor rigs

# PreRequisites

Make sure you have the current React Native tools installed (not the Expo one)

# Install

Simply use the following command :
```
npm install
```

Standard way to install dependencies into a NodeJS program.


# Android / iOS

The app is ready to go

```
react-native run-android
```

or

```
react-native run-ios
```


# State

The app currently let you create monitoring points and retrieve the data. It is scheduled to have the claymore/ethminer/ccminer logic extracted to a specific NodeJS library where it will be able to perform TCP request to the monitors.

The UI does not give anymore information than the total hashrate of each monitors. Everything should be available by January, 1st.

# Known issues

When build for release, it is mandatory for now to edit the file at `node_modules/metro-bundler/src/JSTransformer/worker/minify.js` and disable mangle (mangle: false)

# Fork and Pull Request

Pull Requests are welcomed as well as forks, do not forget to make pull request for any feature you'd implemented or open issues for comments or bug reports.
