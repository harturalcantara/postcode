import React, { useEffect, useState } from "react";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./services/firebase";
import Login from "./components/Login";
import Loading from "./components/Loading";
import * as C from "./styles/app";
import { useCollection } from "react-firebase-hooks/firestore";

const App = () => {
  const [user, loading] = useAuthState(auth);
  const [userChat, setUserChat] = useState(null);

  const [userBD] = useCollection(
    user ? db.collection("users").where('email', "==", user.email) : null
  );
  
  useEffect(() => {
    console.log('entrei na function this way:', userBD);
     if(userBD){
        console.log('Existe um usuario, não irei fazer nada!');
        return;
     } else {
      if (user) {
        console.log('Nao tem usuário, então vou criar um!');
        db.collection("users").doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          description: "Define a description...",
        });
      }
    }
  }, [user, userBD]);
  
  if (loading) return <Loading />;

  if (!user) return <Login />;

  return (
    <C.StyledContainer>
      <C.Container>
        <Sidebar setUserChat={setUserChat} userChat={userChat} />
        <Chat userChat={userChat} />
      </C.Container>
    </C.StyledContainer>
  );
};

export default App;
