import {React, useState} from "react";
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
        <form onSubmit={handleSearchSubmit} className="example">
          <input
            type="text"
            placeholder="Search.."
            name="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">
            <i class="fa fa-search"></i>
          </button>
        </form>
        <button type="submit">
            <i className="fa fa-trash"></i>
          </button>
      </C.Options>
    </C.Container>
  );
};

export default ChatHeader;
