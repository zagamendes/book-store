import React, { useState } from "react";

import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { Container } from './styles';
import "./index.css";
import { useMiniCart } from "../../contextos/MiniCartContext";
import { StyledFirebaseAuth } from "react-firebaseui";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import app from "../../utils/firebaseConfig";
interface MyModalProps {
  show: boolean;
  title?: string;
  children: React.ReactNode;
  handleClose: () => void;
}
const MyModal: React.FC<MyModalProps> = ({ show, handleClose, children }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          OPS! Para finalizar a compra é necessário estar logado
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default MyModal;
