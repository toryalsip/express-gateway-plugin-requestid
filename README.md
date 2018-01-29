# Request-ID Plugin for Express Gateway
Adds a GUID header to request and response objects, which can be useful for logging and tracing calls through various layers in a multi-tier environment.  This can also give the caller a unique identifier for each request made so it can be referenced later if needed.

You can optionally specify a headerName in the plugin's actionParams to customize the name of the header that is used.  The default value is `x-gateway-request-id`.

making a change here
