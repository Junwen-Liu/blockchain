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
        //the server/client will listen to new connections and call the connectScocket function
        server.on('connection', socket=>this.connectSocket(socket));
        //new client will connect to existing host/clients
        this.connectToPeers();
        console.log(`server up and listen to the port ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer=>{
            //on new client side, create socket for every existing host/clients 
            const socket = new Websocket(peer);
            //then call socket.on to establish socket connection
            socket.on('open',()=>this.connectSocket(socket));
        });
    }
    
    connectSocket(socket){
        //connectSocket basically only push new socket to local socket array
        this.sockets.push(socket);
        console.log('socket connect');
    }
}

module.exports = p2pServer;