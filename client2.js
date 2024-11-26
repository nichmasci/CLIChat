import * as readline from 'node:readline'
import {stdin, stdout} from 'node:process'
import * as net from "node:net"

// Function to print incoming messages from other clients
let print_data = function(data)
{
    console.log(data.toString('utf-8'))
}

// Allows user I/O to be read and written via command line
const command_line = readline.createInterface({ input: stdin, output: stdout })

// Define my own IP address. This must be changed manually
let me = "10.26.11.206"

// Connect to a host IP address on port 8096. This IP must also be changed manually
const connection = net.connect({host: "10.26.38.141", port: 8096})

// Prompt user to type a message, then send the message to the host.
// Recursively run this method to allow continuous chatting.
let messageQuestion = function(name){
    command_line.question("Type a message: ", (line) => {
        connection.write(Buffer.from(name + ': ' + line))
        messageQuestion(name)
    })
}

// Upon first connection, prompt user for their name. Then announce their arrival
// Then, move to messageQuestion
command_line.question("Your name, please: ", (name) => {
    connection.write(">> " + name + " has joined the chatroom.", 'utf-8')
    messageQuestion(name)
})

// Any incoming messages from other clients via server will be printed on the command line via print_data
connection.on('data', print_data)

//connection.on('error', () => console.log('Disconnected from server.'))
