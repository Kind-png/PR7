const {ChatServer}=require('./ChatServer');

const chatServer=new ChatServer({port:8080});

chatServer.init();