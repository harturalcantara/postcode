import React, { useState, useEffect } from "react";
import * as C from "./styles";
import { MdChat, MdPerson, MdExitToApp } from "react-icons/md";
import * as EmailValidator from "email-validator";
import { auth, db } from "../../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import CreateChatModal from "../CreateChatModal";
import { Modal, Button } from "antd";

const SidebarHeader = ({ setUserChat, userChat }) => {
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

  const [userData, setUserData] = useState(null); // State para armazenar os dados do usuário

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await db.collection("users").doc(user.uid).get();
          setUserData(userDoc.data());
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  console.log("Description:", userData?.description);

  const handleCreateChat = () => {
    setIsCreationOpen(true);
  };

  const createContactSubmit = (newChatEmails) => {
    if (!newChatEmails) return;

    newChatEmails.forEach((emailInput) => {
      if (!EmailValidator.validate(emailInput)) {
        return alert("E-mail inválido!");
      } else if (emailInput === user.email) {
        return alert("Insira um e-mail diferente do seu!");
      } else if (emails.length === 1 && chatExists(emailInput)) {
        return alert("Chat já existe!");
      }
    });

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

  const [updateName, setUpdateName] = useState(userData?.name || "");
  const [updatePhotoURL, setUpdatePhotoURL] = useState(
    userData?.photoURL || ""
  );
  const [updatedDescription, setUpdatedDescription] = useState(
    userData?.description || ""
  );

  const updateUserProfile = async () => {
    try {
      console.log(
        "Estou indo atualizar os dados do usuario!",
        updatedDescription,
        " --- ",
        user.uid
      );

      await db.collection("users").doc(user.uid).update({
        name: updateName,
        photoURL: updatePhotoURL,
        description: updatedDescription,
      });

      console.log("Dados do usuário atualizados com sucesso!");
      setIsModalOpen(false); // Feche o modal após a atualização
    } catch (error) {
      console.error("Erro ao atualizar os dados do usuário:", error.message);
    }
  };

  const [userLoggedIn] = useAuthState(auth);

  const deleteUserData = async () => {
    console.log("Id do usuario a ser deletado:", userLoggedIn.uid);
    try {
      /*passo 1 - Pegar todos os chats do qual é o usuario */
      /*passo 2 - Deletar todas as 'Mensagens' contidas em cada 'Chat' do usuario */
      /*passo 3 - Deletar o usuario */

      const userChatsQuery = await db
        .collection("chats")
        .where("users", "array-contains", user.email)
        .get();

      console.log("Apenas os chats", userChatsQuery.docs);

      /* Passo 2 */

      userChatsQuery.forEach(async (chatDoc) => {
        const chatId = chatDoc.id;
        // Consulta para obter os documentos da subcoleção "messages" para o chat atual
        const messagesQuery = await db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .get();

        // Delete all "messages"
        messagesQuery.forEach(async (messageDoc) => {
          await messageDoc.ref.delete();
        });
      });

      userChatsQuery.forEach(async (chat) => {
        await chat.ref.delete();
      });

      console.log(
        "Ms from system: Coleção 'chats' e 'messages' excluídos com sucesso!"
      );
      await db.collection("users").doc(userLoggedIn.uid).delete();
      auth.signOut();
      setUserChat(null);
    } catch (error) {
      alert("Error deleting user:", error.message);
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
        <C.Avatar src={user?.photoURL} onClick={showModal} />
        <C.Options>
          <MdChat onClick={handleCreateChat} />
          <MdPerson onClick={showModal} />
          <Modal
            title="Perfil"
            visible={isModalOpen}
            onCancel={handleCancel}
            footer={[
              <div key="buttons" style={{ textAlign: "center" }}>
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button key="ok" type="primary" onClick={handleOk}>
                  Ok
                </Button>
              </div>,
            ]}
          >
            <div style={{ textAlign: "center" }}>
              <C.AvatarPerfil src={user?.photoURL} />
              <h4>
                <b>{user?.displayName}</b>
              </h4>
              <hr></hr>
            </div>
            <div style={{ marginLeft: "110px" }}>
              <p>
                {" "}
                <b>E-mail:</b> {user?.email}{" "}
              </p>
              {/* <p>
                {" "}
                <b>UID:</b> {user.uid}{" "}
              </p> */}
              <p>
                {" "}
                <b> Description: </b> {updatedDescription}{" "}
              </p>
              
              Name description:
              <div
                className="wrap-input100 validate-input"
                style={{
                  width: "250px",
                }}
              >
                <input
                  type="text"
                  style={{
                    width: "250px",
                    height: "36px",
                    //paddingLeft: "35px",
                    //backgroundImage: 'url("https://i.imgur.com/1uLaGFd.png")',
                    backgroundPosition: "10px 50%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "16px 16px",
                    fontSize: "16px",
                  }}
                  className="input100"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  placeholder="Update description..."
                />
              </div>

              photoURL description:
              <div
                className="wrap-input100 validate-input"
                style={{
                  width: "250px",
                }}
              >
                <input
                  type="text"
                  style={{
                    width: "250px",
                    height: "36px",
                    //paddingLeft: "35px",
                    //backgroundImage: 'url("https://i.imgur.com/1uLaGFd.png")',
                    backgroundPosition: "10px 50%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "16px 16px",
                    fontSize: "16px",
                  }}
                  className="input100"
                  value={updatePhotoURL}
                  onChange={(e) => setUpdatePhotoURL(e.target.value)}
                  placeholder="Update description..."
                />
              </div>

              Update description:
              <div
                className="wrap-input100 validate-input"
                style={{
                  width: "250px",
                }}
              >
                <input
                  type="text"
                  style={{
                    width: "250px",
                    height: "36px",
                    //paddingLeft: "35px",
                    //backgroundImage: 'url("https://i.imgur.com/1uLaGFd.png")',
                    backgroundPosition: "10px 50%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "16px 16px",
                    fontSize: "16px",
                  }}
                  className="input100"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  placeholder="Update description..."
                />
              </div>
              
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                type="primary"
                style={{ marginRight: "10px", backgroundColor: "#2e8b57" }}
                onClick={updateUserProfile}
              >
                Update account
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: "#9c1111" }}
                onClick={deleteUserData}
              >
                Delete account
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
