import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import styles from "../screens/styles/login.module.css";
import axios from "axios";

export default function Login({ userAuthType }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (userAuthType === "login") {
    if (!isOpen) {
      onOpen();
    }
  } else {
    if (isOpen) {
      onClose();
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleApi = (e) => {
    e.preventDefault();
    axios
      .post("https://quickbite-kh86.onrender.com/api/userauth/loginuser", {
        email,
        password,
      })
      .then((res) => {
        toast({
          title: "Logged in Successfully",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        localStorage.setItem("token", res.data.authtoken);
        navigate("/userhome");
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Error occured",
          description: err.response.data.error || "Server error occured",
          status: "error",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
      });
  };

  return (
    <div className={styles.loginbtn}>
      <Link to="/?userAuthType=login"> Login</Link>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          navigate("/");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Login</ModalHeader>
          <ModalCloseButton onClick={() => navigate("/")} />

          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  autoComplete="username"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </form>
          </ModalBody>

          <ModalFooter style={{ justifyContent: "center", paddingBottom: "0" }}>
            <Button colorScheme="blue" mr={3} onClick={handleApi}>
              Login
            </Button>
          </ModalFooter>
          <div className={styles.revert}>
            <h6>
              <Link to="/?userAuthType=signup">Don't have an account ?</Link>
            </h6>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
