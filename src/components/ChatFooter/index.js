import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import * as C from "./styles";
import {
  MdSend,
  MdAttachFile,
  MdInsertEmoticon,
  MdKeyboardVoice,
  MdLink,
  MdPhoto,
} from "react-icons/md";
import { auth, db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";
import { v4 as uuidv4 } from "uuid";

const ChatFooter = ({
  editMessage,
  messageEdit,
  setMessageEdit,
  setEditMode,
  editMode,
  chatId,
}) => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
    setEmojiPickerVisible(false);
  };

  const handleSendMessage = (e) => {
    if (editMode) {
      editMessage(messageEdit);
      setEditMode(false);
      return;
    }

    e.preventDefault();

    db.collection("chats").doc(chatId).collection("messages").add({
      id: uuidv4(),
      message: message,
      user: user.email,
      photoURL: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessage("");
  };

  return (
    <C.Container>
      <C.Form onSubmit={handleSendMessage}>
        <MdLink />
        <MdPhoto />
        <MdAttachFile />
        <MdInsertEmoticon style={{cursor:'pointer'}} onClick={toggleEmojiPicker} />
        {emojiPickerVisible && (
          <div style={{ position: 'absolute', bottom: 100 }}>
          <EmojiPicker
            width={400}
            height={400}
            skinTonesDisabled
            previewConfig={{
              showPreview: false,
            }}
            onEmojiClick={(e) => handleEmojiSelect(e.emoji)}
          />
          </div>
        )}
        <C.Input
          placeholder="Type a message..."
          onChange={(e) => {
            if (editMode) {
              setMessageEdit({ ...messageEdit, message: e.target.value });
            } else {
              setMessage(e.target.value);
            }
          }}
          value={editMode ? messageEdit.message : message}
        />

        {message ? (
          <MdSend onClick={handleSendMessage} />
        ) : (
          <MdKeyboardVoice
            onClick={() => console.log("Start voice recording")}
          />
        )}
      </C.Form>
    </C.Container>
  );
};

export default ChatFooter;
