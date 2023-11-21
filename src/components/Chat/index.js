import {React, useState} from "react";
import ChatHeader from "../ChatHeader";
import Default from "./../Default";
import ChatBody from "../ChatBody";
import ChatFooter from "../ChatFooter";
import "./styles.css";

const Chat = ({ userChat }) => {
  const [someState, setSomeState] = useState([]);
 
  if (!userChat) return <Default />;

  return (
    <div className="container-chat">
      <ChatHeader photoURL={userChat?.photoURL} name={userChat?.name} setSomeState={setSomeState} />
      <ChatBody chatId={userChat?.chatId} someState={someState} setSomeState={setSomeState} />
      <ChatFooter chatId={userChat?.chatId} />
    </div>
  );
};

export default Chat;
