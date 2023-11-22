import { React, useState } from "react";
import * as C from "./styles";
import { MdPerson } from "react-icons/md";

const ChatHeader = ({ photoURL, name, setSomeState }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSomeState(searchInput);
    setSearchInput("");
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
              height: "48px",
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
        <button type="submit">
          <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        </button>
      </C.Options>
    </C.Container>
  );
};

export default ChatHeader;
