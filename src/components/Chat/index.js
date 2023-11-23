import {React, useState} from "react";
import ChatHeader from "../ChatHeader";
import Default from "./../Default";
import ChatBody from "../ChatBody";
import ChatFooter from "../ChatFooter";
import { db } from "../../services/firebase";
import "./styles.css";

const Chat = ({ userChat }) => {
  const [someState, setSomeState] = useState("");
  const [editMode, setEditMode] = useState();
  const [messageEdit, setMessageEdit] = useState();
 
  if (!userChat) return <Default />;

  const editMessage = async (messageObj) => {
    const chatId = userChat?.chatId;

    const querySnapshot = await db.collection("chats").doc(chatId).collection("messages").where("id", '==', messageObj.id).get();

    const editPromises = querySnapshot.docs.map(async (doc) => {      
      await db.collection("chats").doc(chatId).collection("messages").doc(doc.id).update({message: messageEdit.message});
      console.log(`Document with ID ${doc.id} edited successfully.`);
    });

    await Promise.all(editPromises);
  }

  return (
    <div className="container-chat">
      <ChatHeader photoURL={userChat?.photoURL} name={userChat?.name} setSomeState={setSomeState} chatIdToDelete={userChat?.chatId} />
      <ChatBody editMessage={editMessage} chatId={userChat?.chatId} setEditMode={setEditMode} setMessageEdit={setMessageEdit} someState={someState} setSomeState={setSomeState} />
      <ChatFooter editMessage={editMessage} editMode={editMode} setEditMode={setEditMode} messageEdit={messageEdit} setMessageEdit={setMessageEdit} chatId={userChat?.chatId} />
    </div>
  );
};

export default Chat;
