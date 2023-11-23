import React, { useEffect, useRef, useState } from "react";
import { db } from "../../services/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message";
import "./styles.css";
import { v4 as uuidv4 } from 'uuid';

const ChatBody = ({ chatId, someState, setSomeState }) => {
  const [filteredMessages, setFilteredMessages] = useState();

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

    if (messagesRes?.docs) {
      setFilteredMessages(
        messagesRes.docs?.filter((m) => {
          return m.data().message.toLowerCase().includes(someState);
        })
      );
    }
  }, [someState, messagesRes]);

  const getMessage = (m) => {
    return (
      <Message
        key={m.id}
        user={m.data().user}
        message={{
          id: m.data().id ?? "NOT DEFINED",
          message: m.data().message,
          timestamp: m.data().timestamp?.toDate().getTime(),
        }}
        chatId={chatId}
      />
    );
  };

  return (
    <div className="container-body" ref={refBody}>
      {filteredMessages
        ? filteredMessages?.map((message) => getMessage(message))
        : messagesRes?.docs.map((message) => getMessage(message))}
    </div>
  );
};

export default ChatBody;
