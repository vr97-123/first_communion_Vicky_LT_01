import { Application } from '@nativescript/core';

Application.run({ moduleName: 'app-root' });

// Log any uncaught errors
Application.on(Application.uncaughtErrorEvent, function (args) {
    if (global.isAndroid) {
        console.error('Android error:', args.android);
    } else if (global.isIOS) {
        console.error('iOS error:', args.ios);
    }
});