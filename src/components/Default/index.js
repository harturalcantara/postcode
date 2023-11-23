import React from "react";
import * as C from "./styles";
import MinhaImagem from './icons8-chat-room-color-glass-96.png';

const Default = () => {
  return (
    <C.Container>
      
      <img src={MinhaImagem} alt="Postcode" />
      <C.Title>Postcode</C.Title>
      <C.Info>
        Agora você pode enviar e receber mensagens sem precisar manter seu
        celular conectado à internet.
      </C.Info>
    </C.Container>
  );
};

export default Default;
