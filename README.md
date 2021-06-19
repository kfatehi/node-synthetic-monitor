# synthetic monitoring

you can think of this as a system that polls multiple inputs (checks, which are just a promise) to produce a single output (api request to pagerduty) if any of the checks fail.

the app expects, in checks.js, a series of checks (async promises that return an array like [<boolean: health>, <string: message>]).
a check should have a unique identity in the checks hash (e.g. monitoringServerStatus: {...}) and this can be used to prevent other
checks from executing if another is already down (e.g. monitoringServerAlerting: { dependsOn: 'monitoringServerStatus' })
