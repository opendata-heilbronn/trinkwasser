(function () {
  'use strict'

  var app = require('connect')()
  var http = require('http')
  var path = require('path')
  var swaggerTools = require('swagger-tools')
  var jsyaml = require('js-yaml')
  var fs = require('fs')
  var serverPort = 8080
  var serveStatic = require('serve-static')
    // swaggerRouter configuration
  var options = {
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
  }

    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
  var spec = fs.readFileSync('./api/swagger.yaml', 'utf8')
  var swaggerDoc = jsyaml.safeLoad(spec)

    // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata())

        // Validate Swagger requests
    app.use(middleware.swaggerValidator())

        // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options))

        // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi())
        // Serve the client
    app.use(serveStatic(path.join(__dirname, 'client')))
        // Start the server
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort)
      console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort)
    })
  })
}())
