// Web Monitor error tracking: server errors are grouped with file, line and stack trace and reported to
// Web Monitor (Advanced → Errors), with alerts for new errors and error spikes.
export { register, onRequestError } from '@ruyalab/webmonitor-nextjs/instrumentation';
