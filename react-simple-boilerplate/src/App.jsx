import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
let uuidV4 = require('uuid/v4');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: [],
      clientConnections: 0
    };
  }

  msg(event) {
    let message = {username: this.state.currentUser.name, content: event.target.value, id: uuidV4(), type: "postMessage"};
    let mess = this.state.messages.concat(message);
    console.log(JSON.stringify(mess));
    this.socket.send(JSON.stringify(message));
    // this.setState({messages: mess});
  }

  user(event) {
    console.log("app.user", event.target.value);
    let username = event.target.value;
    const state = {
      currentUser: { name: username },
      messages: this.state.messages,
      clientConnections: this.state.clientConnections
    };


    let message = {oldName: this.state.currentUser.name, newName: state.currentUser.name, id: uuidV4(), type: "postUsernameChangeNotification"};
    this.socket.send(JSON.stringify(message));

    this.setState(state);
  }


  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://localhost:3001/socketserver");
    this.socket.onopen = (event) => {
      console.log("Connected to server");
    };
    this.socket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      let message;
      switch(data.type) {
      case "incomingMessage":
        message = {messages: data.content, username: data.username, id: data.id};
        this.setState({
          currentUser: this.state.currentUser,
          messages: this.state.messages.concat(data),
          clientConnections: this.state.clientConnections
        });
        break;
      case "incomingNotification":
        message = {messages: data.content, id: data.id};
        this.setState({
          currentUser: this.state.currentUser,
          messages: this.state.messages.concat(data),
          clientConnections: this.state.clientConnections
        });
        break;
      case "clientConnections":
        this.setState({
          currentUser: this.state.currentUser,
          messages: this.state.messages,
          clientConnections: data.count
        });
        break;
      default:
        throw new Error("Unknown event type " + data.type);
      }
    };
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className ="user-online"> {this.state.clientConnections} users online </span>
        </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar currentUser = {this.state.currentUser.name} newMessage = {this.msg.bind(this)} newUser = {this.user.bind(this)} />
      </div>
    );
  }
}


export default App;