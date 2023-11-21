import React, { useEffect, useRef } from "react";
import { db } from "../../services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message";
import "./styles.css";

const ChatBody = ({ chatId, someState, setSomeState }) => {
  console.log('eleeeee:', someState);

  const [messagesRes] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const refBody = useRef("");

  useEffect(() => {
    if (refBody.current.scrollHeight > refBody.current.offsetHeight) {
      refBody.current.scrollTop =
        refBody.current.scrollHeight - refBody.current.offsetHeight;
    }
  }, [messagesRes]);

  // Filtra as mensagens com base no someState
  const filteredMessages =
    messagesRes?.docs?.filter((message) =>
      message.data().message.includes(someState)
    ) || [];

  // Limpa o estado de someState quando há mensagens filtradas
  useEffect(() => {
    if (someState !== "" && filteredMessages.length > 0) {
      setSomeState("");
    }
  }, [filteredMessages, setSomeState, someState]);


  return (
    <div className="container-body" ref={refBody}>
      {messagesRes?.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            message: message.data().message,
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))}
    </div>
  );
};

export default ChatBody;
