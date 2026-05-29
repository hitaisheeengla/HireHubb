// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://fa3f0d4ac7fd55cab014d6ef16ed15c4@o4511161090965504.ingest.us.sentry.io/4511463498776576",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],
  // Tracing
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: 'trace',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
Sentry.startSpan({
  name: "My Span",
}, () => {
  // The code executed here will be profiled
});






// // Import with `import * as Sentry from "@sentry/node"` if you are using ESM
// import * as Sentry from "@sentry/node"
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Sentry.init({
//   dsn: "",
//   integrations: [
//     nodeProfilingIntegration(),
//     Sentry.mongooseIntegration()
//   ],
//   // Tracing
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
// });
// // Manually call startProfiler and stopProfiler
// // to profile the code in between
// Sentry.profiler.startProfiler();

// // Starts a transaction that will also be profiled
// Sentry.startSpan({
//   name: "My First Transaction",
// }, () => {
//   // the code executing inside the transaction will be wrapped in a span and profiled
// });

// // Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// // your application until the process exits or stopProfiling is called.
// Sentry.profiler.stopProfiler();