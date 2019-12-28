const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class p2pServer{
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen(){
        //every host/clients will create a webscoket server on different ports, e.g. 5001
        const server = new Websocket.Server({port:P2P_PORT});
        //the "event listener"-on will let server/client listen to new connections and call the connectScocket function, 'connection' is the event listening for
        server.on('connection', socket=>this.connectSocket(socket));
        
        //new client will connect to existing host/clients
        this.connectToPeers();
        console.log(`server up and listen to the port ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer=>{
            //on new client side, create socket for every existing host/clients, and establish connection
            const socket = new Websocket(peer);
            //for sockets already open or are not open yet, wait until they are open and trigger coonectSocket()
            socket.on('open',()=>this.connectSocket(socket));
        });
    }
    
    connectSocket(socket){
        //push new socket to local socket array
        this.sockets.push(socket);
        console.log('socket connect');
        
        this.messageHandler(socket);

        this.sendChain(socket);
    }

    messageHandler(socket){
        //listen on 'message' event, trigger by 'send'
        socket.on('message', message =>{
            const data = JSON.parse(message);
            console.log('data', data);

            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket){
        //send the local stringify chain to the target socket
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChains(){
        //loop through the sckets array and send local chain to all sockets
        this.sockets.forEach(socket=>{
            this.sendChain(socket);
        })
    }

}

module.exports = p2pServer;