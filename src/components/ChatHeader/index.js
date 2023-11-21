import React from "react";
import * as C from "./styles";
import { MdPerson } from "react-icons/md";

const ChatHeader = ({ photoURL, name , someState}) => {
  return (
    <C.Container>
      <C.UserInfo>
        {photoURL ? <C.Avatar src={photoURL} alt="Avatar" /> : <MdPerson />}
        <C.NameContent>
          <C.Name>{name}</C.Name>
        </C.NameContent>
      </C.UserInfo>
      <C.Options>
        <form class="example" action="action_page.php">
          <input type="text" placeholder="Search.." name="search" />
          <button type="submit">
            <i class="fa fa-search"></i>
          </button>
          <button style={{ marginLeft: "20px" }} type="submit">
            <i className="fa fa-trash"></i>
          </button>
        </form>
      </C.Options>
    </C.Container>
  );
};

export default ChatHeader;
