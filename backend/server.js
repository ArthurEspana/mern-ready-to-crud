const connect =  require('./connect')
// Import express and cors
const express = require("express")
// CORS (Cross-Origin Resource Sharing) configures resource sharing across different origins.
const cors = require("cors")

// Create the express apliacation, because we only have inported express in our code
const app = express()
// Specify the port number for the server. Port 3000 is commonly used for development.
const PORT = 3000

// app.use(cors()) is a middleware that allows us to make requests to our server from a different origin
app.use(cors())
// tells express to use json as the format for the data we are sending,now we dont have to use json.parse to get a request
app.use(express.json())
// The .listen creates a server that listens to the port we specified, first argument is the port, second is a callback function
app.listen(PORT, () => {
    // usesconnectToServer() function from connect.js to connect
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})