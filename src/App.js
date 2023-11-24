import React, { useEffect, useState } from "react";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./services/firebase";
import Login from "./components/Login";
import Loading from "./components/Loading";
import * as C from "./styles/app";

const App = () => {
  const [user, loading] = useAuthState(auth);
  const [userChat, setUserChat] = useState(null);
  
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set({
        email: user.email,
        photoURL: user.photoURL,
        description: "Define a description...",
      });
    }
  }, [user]);

  if (loading) return <Loading />;

  if (!user) return <Login />;

  console.log('usuario:', user);

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
