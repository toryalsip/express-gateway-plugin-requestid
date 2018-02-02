# Request-ID Plugin for Express Gateway
Takes the requestID that Express Gateway already generates and adds it as a custom header to downstream requests as well as adding it to the response that is sent back.  This can be useful for logging and tracing calls through various layers in a multi-tier environment.  This can also give the caller a unique identifier for each request made so it can be referenced later if needed.

You can optionally specify a headerName in the plugin's actionParams to customize the name of the header that is used.  The default value is `x-gateway-request-id`.

Note that Express Gateway does have the ability to pass requestID in a request to a downstream service through the `headers` policy, but it doesn't add anything to the response object.  This plugin will allow you to do both.