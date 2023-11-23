import React, { useState } from "react";
import * as C from "./styles";
import { MdChat, MdPerson, MdExitToApp } from "react-icons/md";
import * as EmailValidator from "email-validator";
import { auth, db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import CreateChatModal from "../CreateChatModal";
import { Modal, Button } from "antd";

const SidebarHeader = ({ setUserChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [user] = useAuthState(auth);
  const refChat = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(refChat);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [emails, setEmails] = useState([]);

  const handleCreateChat = () => {
    setIsCreationOpen(true);
    // if (!EmailValidator.validate(emailInput)) {
    //   return alert("E-mail inválido!");
    // } else if (emailInput === user.email) {
    //   return alert("Insira um e-mail diferente do seu!");
    // } else if (chatExists(emailInput)) {
    //   return alert("Chat já existe!");
    // }

    // db.collection("chats").add({
    //   users: [user.email, emailInput],
    // });
  };

  const createContactSubmit = (newChatEmails) => {
    if (!newChatEmails) return;

    //console.log("pepepe");

    newChatEmails.forEach((emailInput) => {
      if (!EmailValidator.validate(emailInput)) {
        return alert("E-mail inválido!");
      } else if (emailInput === user.email) {
        return alert("Insira um e-mail diferente do seu!");
      } else if (emails.length === 1 && chatExists(emailInput)) {
        return alert("Chat já existe!");
      }
    });

    console.log("pewpew", [...newChatEmails, user.email]);

    db.collection("chats").add({
      users: [...emails, user.email],
    });

    setIsCreationOpen(false);
  };

  const chatExists = (emailChat) => {
    return !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((user) => user === emailChat)?.length > 0
    );
  };

  const updateProfile = () => {
    if (user) {
      user
        .updateProfile({
          displayName: "Nome do Usuário",
        })
        .then(() => {
          console.log("Perfil atualizado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao atualizar perfil:", error);
        });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const user = db.auth().currentUser;

      if (user) {
        await user.delete();
        console.log("User deleted successfully.");
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <>
      {isCreationOpen && (
        <CreateChatModal
          emails={emails}
          setEmails={setEmails}
          isOpen={isCreationOpen}
          onSubmit={createContactSubmit}
          setIsOpen={setIsCreationOpen}
        ></CreateChatModal>
      )}

      <C.Container>
        <C.Avatar src={user?.photoURL} />
        <C.Options>
          <MdChat onClick={handleCreateChat} />
          <MdPerson onClick={showModal} />
          <Modal
            title="Perfil"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div style={{ textAlign: "center" }}>
              <C.AvatarPerfil src={user?.photoURL} />
              <h4><b>{user?.displayName}</b></h4>
              <hr></hr>
              <p> <b>Email:</b> {user?.email} </p>
              <p> <b>UID:</b> {user.uid} </p>
              <p> <b>Descrição:</b> ... </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button type="primary" info onClick={updateProfile}>
                Atualizar Perfil
              </Button>
              <Button type="primary" danger onClick={handleDeleteUser}>
                Deletar conta
              </Button>
            </div>
          </Modal>
          <MdExitToApp onClick={() => [auth.signOut(), setUserChat(null)]} />
        </C.Options>
      </C.Container>
    </>
  );
};

export default SidebarHeader;
