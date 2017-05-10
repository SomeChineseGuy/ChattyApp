import React, {Component} from 'react';
import Message from './Message.jsx';
import Notifacation from './Notifacation.jsx';

class MessageList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main className="messages">
        { this.props.messages.map((currentMessage) => {
          if(currentMessage.type === "incomingMessage"){
            return <Message message = {currentMessage.content} key={currentMessage.id}  username = {currentMessage.username} />;
          } else {
            return <Notifacation message = {currentMessage.content}  key={currentMessage.id}/>;
          }
        })
      }
      </main>
    );
  }
}
export default MessageList;