import * as net from "node:net"

// Function to priint incoming messages from clients
let print_data = function(data)
{
    console.log(data.toString('utf-8'))
}

// Store all ongoing connections in a list
let connections = []

// Function to print incoming messages to all connected clients
let notify_everyone = function(data){
    for(let connection of connections){
        connection.write(data.toString('utf-8'))
    }
}

// Function to handle client connections/disconnections
let clientConnected = function(client_connection)
{
    // Adds new client to the list and announces their arrival to the host
    connections.push(client_connection)
    console.log("A client has connected!")

    // Prints incoming messages to both the host's command line...
    client_connection.on('data', print_data)
    // And all connected clients'
    client_connection.on('data', notify_everyone) 
    // If a client disconnects intentnionally, display this:
    client_connection.on('end', () => console.log('A client disconnected from server. (Connection ended)'))
    // Otherwise, if a client disconnects via an error, display this:
    client_connection.on('error', () => console.log('A client disconnected from server. (Error)'))
}

// Open the server to be connected to
let server = net.createServer()

// Listen for connections on port 8096
server.on('connection', clientConnected)
server.listen(8096)

