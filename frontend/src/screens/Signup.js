import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../screens/styles/signUp.module.css";
import axios from "axios";

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

export default function Signup({ userAuthType }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  if (userAuthType === "signup") {
    if (!isOpen) {
      onOpen();
    }
  } else {
    if (isOpen) {
      onClose();
    }
  }
  const handleApi = (e) => {
    e.preventDefault();
    // console.log({email, password})
    axios
      .post("https://quickbite-kh86.onrender.com/api/userauth/registeruser", {
        name: fullName,
        email,
        password,
      })
      .then((res) => {
        toast({
          title: "Registered Successfully",
          status: "success",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
        localStorage.setItem("token", res.data.token);
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
    <div className={styles.signupbtn}>
      <Link to="/?userAuthType=signup">Register</Link>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          navigate("/");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>SignUp</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={fullName}
                  autoComplete="username"
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
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
              SignUp
            </Button>

            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
          <div className={styles.revert}>
            <h6>
              <Link to="/?userAuthType=login">Already have an account ?</Link>
            </h6>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
