const WebSocket = require('ws').WebSocket;
const { time } = require('console');
const { type } = require('os');
const readline = require('readline');
const crypto = require('node:crypto');

const secretKey = 'secret_key';   // secret
const secretIV = 'initialization_vector';  // share
const encMethod = 'aes-256-cbc';

class ChatClient{
  constructor(options){
    this.ws = new WebSocket(options.url);
    this.sessionId = options.sessionId || null;
    this.username = options.username;
    this.encIv=crypto.createHash('sha512').update(secretIV).digest('hex').substring(0, 16);
    this.key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0, 32);
  }

  encryptData(data) {
    const cipher = crypto.createCipheriv(encMethod, this.key, this.encIv);
    const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    return Buffer.from(encrypted).toString('base64');
  }

  decryptData(encryptedData) {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(encMethod, this.key, this.encIv);
    return decipher.update(buff.toString('utf-8'), 'hex', 'utf8') + decipher.final('utf8');
  }

  init(){
    this.ws.on('open', () => this.onOpen());
    this.ws.on('message', (data) => this.onMessage(data));
    this.ws.on('error', console.error);

    
  }

  onOpen(){
    console.log('connected');
    this.ws.send(JSON.stringify({
      type: "options",
      data: {
        sessionId: this.sessionId,
        username: this.username,
        secretIV: this.encIv
      }
    }));

    
  }
    
  onMessage(data){
    const parseData = JSON.parse(data);

    switch (parseData.type){
      case 'message':
          console.log(`${parseData.data.sender}>> ${this.decryptData(parseData.data.message)}`);
          break;
      case 'options':
          this.setOptions(parseData);
          break;
    default:
      console.log('unknown message type');
    }
  }
  

  setOptions(msgObject){
    this.sessionId=msgObject.sessionId;
    console.log('Your sessionId: ', this.sessionId);

  }

  send(data){
    const encData=this.encryptData(data);
    const msgObject={
      type: 'message',
      sessionId: this.sessionId,
      data: encData
    }

    this.ws.send(JSON.stringify(msgObject));
  }


}

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What is your name?: ', (name) => {
    rl.close();
    init(name); 
  });


  const init = (name)=>{
    const client = new ChatClient({url: 'ws://localhost:8080', username: name});

    client.init();

    const chatInput = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    chatInput.on('line', (input) => {
      if (input.trim().toLowerCase() === 'exit') {
          chatInput.close();
      } else{
        client.send(input);
      }
    });
  }