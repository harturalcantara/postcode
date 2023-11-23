import { React, useState } from "react";
import * as C from "./styles";
import { MdPerson } from "react-icons/md";
import iconEllipsis from "./icon_ellipsis_vertical.png";
import { db } from "../../services/firebase";



const ChatHeader = ({ photoURL, name, setSomeState, chatIdToDelete }) => {
  const [searchInput, setSearchInput] = useState("");

  console.log(chatIdToDelete);
  
  const deleteUserData = async ( ) => {
    try {
      // Reference to the user document
      const userRef = db.collection("chats").doc(chatIdToDelete);
  
      // Delete the user document
      await userRef.delete();
  
      alert(`User with ID ${chatIdToDelete} deleted successfully!`);
      chatIdToDelete = null;
      window.location.reload(true);
      
    } catch (error) {
      alert("Error deleting user:", error.message);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSomeState(searchInput);
    setSearchInput("");
  };

  const DropdownMenu = ({ isOpen, onClose }) => {
    // O conteúdo do dropdown vai aqui
    return (
      <div
        style={{
          display: isOpen ? "block" : "none",
          position: "absolute",
          width: "132px",
          top: "32px",  // Ajuste conforme necessário
          right: "0",   // Ajuste conforme necessário
          backgroundColor: "#fff",
          border: "2px solid #ccc",
          padding: "16px",
          zIndex: 1,
        }}
      >
        <p onClick={deleteUserData}> Delete chat</p>
        <hr></hr>
        <p>Sair</p>
      </div>
    );
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <C.Container>
      <C.UserInfo>
        {photoURL ? <C.Avatar src={photoURL} alt="Avatar" /> : <MdPerson />}
        <C.NameContent>
          <C.Name>{name}</C.Name>
        </C.NameContent>
      </C.UserInfo>
      <C.Options>
        <form onSubmit={handleSearchSubmit}>
          <div className="wrap-input100 validate-input">
          <input
            className="input100"
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "250px",
              height: "42px",
              paddingLeft: "35px",
              backgroundImage: 'url("https://i.imgur.com/1uLaGFd.png")',
              backgroundPosition: "10px 50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "20px 20px",
            }}
            value={searchInput}
            placeholder="Search message..."
          />
            <span className="focus-input100"></span>
          </div>
        </form>
        <div style={{ position: "relative" }}>
        <img
          style={{ cursor: "pointer" }}
          className="m-t-10"
          width={"24px"}
          height={"24px"}
          src={iconEllipsis}
          alt="options"
          onClick={handleDropdownClick}
        />
        
        <DropdownMenu isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)} />
      </div>
        {/* <img style={{ cursor: "pointer" }} className="m-t-10" width={"24px"} height={"24px"} src={iconEllipsis} alt="options"></img> */}
      </C.Options>
    </C.Container>
  );
};

export default ChatHeader;
