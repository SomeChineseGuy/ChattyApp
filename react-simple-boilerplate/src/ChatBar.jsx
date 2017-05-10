import React, {Component} from 'react';


class ChatBar extends Component {
  enterCheck (event) {
    if (event.key === 'Enter') {
      this.props.newMessage(event);
    }
  }
  enterUserCheck (event) {
    console.log("Keypress", event.key);
    if (event.key === 'Enter') {
      this.props.newUser(event);
    }
  }

  render() {
    return (
     <footer className="chatbar">
      <input className="chatbar-username" placeholder="Your Name (Optional)" onKeyPress =  {this.enterUserCheck.bind(this)} />
      <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress = {this.enterCheck.bind(this)} />
     </footer>
    );
  }
}

export default ChatBar;