import React from "react";
import ChatHeader from "../ChatHeader";
import Default from "./../Default";
import ChatBody from "../ChatBody";
import ChatFooter from "../ChatFooter";
import "./styles.css";

const Chat = ({ userChat }) => {
  if (!userChat) return <Default />;

  return (
    <div className="container-chat">
      <ChatHeader photoURL={userChat?.photoURL} name={userChat?.name} />
      <ChatBody chatId={userChat?.chatId} />
      <ChatFooter chatId={userChat?.chatId} />
    </div>
  );
};

export default Chat;
