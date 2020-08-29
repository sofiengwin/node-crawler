const Sentry = require('@sentry/node');
// or use es6 import statements
// import * as Sentry from '@sentry/node';

Sentry.init({ dsn: 'https://3c181982692a483e8694101a43cb7043@o397957.ingest.sentry.io/5355539' });

module.exports = Sentry;