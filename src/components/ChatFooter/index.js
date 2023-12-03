import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import * as C from "./styles";
import {
  MdSend,
  MdAttachFile,
  MdInsertEmoticon,
  MdKeyboardVoice,
  MdLink,
  MdPhotoLibrary,
} from "react-icons/md";
import { auth, db, storage } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat/app";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ChatFooter = ({
  editMessage,
  messageEdit,
  setMessageEdit,
  setEditMode,
  editMode,
  chatId,
  //statusMessage,
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
      statusMessage: false,
    });

    setMessage("");
  };

  /** AttachFile  */
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAttachFileClick = () => {
    toggleDropdown();
    // Adicione aqui qualquer outra lógica que você queira executar quando MdAttachFile for clicado
  };

  const handleLinkClick = () => {
    // Adicione aqui a lógica para quando MdLink for clicado
  };

  /* Photo click. */

  const handlePhotoClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Crie uma referência única para a imagem no Firebase Storage
      const storageRef = ref(storage, `images/${uuidv4()}_${file.name}`);

      // Faça o upload da imagem para o Firebase Storage
      await uploadBytes(storageRef, file);

      // Obtenha a URL de download da imagem após o upload
      const downloadURL = await getDownloadURL(storageRef);

      // Adicione a mensagem com a URL da imagem ao Firestore
      db.collection("chats").doc(chatId).collection("messages").add({
        id: uuidv4(),
        message: downloadURL,
        user: user.email,
        photoURL: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        statusMessage: false,
      });
    }
  };

  const inputRef = React.createRef();

  const iconeEstilo = {
    display:'flex' , 
    alignItems:'center',
    background: '#ffffff', // Cor de fundo cinza
    //padding: '5px', // Adicione padding para espaço ao redor do ícone
    borderRadius: '5%', // Isso cria um ícone circular
    margin: '5px', // Adicione margem para espaçamento entre os ícones
  };

  return (
    <C.Container>
      <C.Form onSubmit={handleSendMessage}>
        <div style={{ position: 'relative' }}>
          <MdAttachFile style={{cursor:'pointer', marginTop:'4px'}} onClick={handleAttachFileClick} />
          {dropdownOpen && (
            <div style={{ position: 'absolute', top: -95, left: -5, borderRadius:'5px' }}>
              <MdLink style={iconeEstilo} onClick={handleLinkClick} />
              <div style={iconeEstilo}> <MdPhotoLibrary style={iconeEstilo} onClick={handlePhotoClick} /> Photos&Videos </div>
            </div>
          )}
        </div>
        <MdInsertEmoticon style={{cursor:'pointer'}} onClick={toggleEmojiPicker} />
        {emojiPickerVisible && (
          <div style={{ position: 'absolute', bottom: 112 }}>
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

        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </C.Form>
    </C.Container>
  );
};

export default ChatFooter;
