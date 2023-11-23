import { React, useState, useEffect, useRef } from "react";
import * as C from "./styles";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase";
import { db } from "../../services/firebase";
import {
  MdExpandMore,
  //MdFormatAlignLeft,
  //MdFormatAlignRight,
} from "react-icons/md";

const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  console.log('mensagem:', message.uid, message.message);
  const updateUserData = async (userId, newData) => {
    try {
      // Reference to the user document
      const userRef = db.collection("chats").doc(userId);

      // Update the user document
      await userRef.update(newData);

      console.log(`User with ID ${userId} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleButtonClick = (e) => {
    setClickPosition({ x: e.clientX, y: e.clientY });
    setDropdownOpen(!isDropdownOpen);
  };

  const DropdownMenu = ({ isOpen, onClose, position }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
      if (isOpen) {
        // Ajuste a posição do dropdown com base no clique
        if (position) {
          const { x, y } = position;
          dropdownRef.current.style.position = "absolute";
          dropdownRef.current.style.left = `${x - 140}px`;
          dropdownRef.current.style.top = `${y}px`;
          dropdownRef.current.style.zIndex = 1000; // Ajuste conforme necessário
        }
      }
    }, [isOpen, position]);

    return (
      <div
        ref={dropdownRef}
        style={{
          display: isOpen ? "block" : "none",
          width: "132px",
          backgroundColor: "#fff",
          border: "2px solid #ccc",
          padding: "16px",
        }}
      >
        <p>Update chat</p>
        <hr />
        <p>Delete chat</p>
      </div>
    );
  };

  return (
    <C.Container>
      <C.Line className={userLoggedIn?.email === user ? "me" : ""}>
        <C.Content className={userLoggedIn?.email === user ? "me" : ""}>
          <C.MessageDate className={userLoggedIn?.email === user ? "me" : ""}>
            <b
              className="m-r-8"
              style={{ fontSize: "12px", marginBottom: "8" }}
            >
              {" "}
              @{user.split("@")[0]}{" "}
            </b>
            {userLoggedIn?.email === user && (
              <MdExpandMore
                fontSize={18}
                style={{ cursor: "pointer" }}
                onClick={handleButtonClick}
              />
            )}
            <DropdownMenu
              isOpen={isDropdownOpen}
              onClose={() => setDropdownOpen(false)}
              position={clickPosition}
            />
          </C.MessageDate>

          <C.Message>{message.message} </C.Message>
          <C.MessageDate className={userLoggedIn?.email === user ? "me" : ""}>
            at {new Date(message?.timestamp).toLocaleString()}
          </C.MessageDate>
        </C.Content>
      </C.Line>
    </C.Container>
  );
};

export default Message;
