import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

} from '@chakra-ui/react'

import styles from "./styles/resto.module.css"

export default function RestaurantSignup({authType}) {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

    }
    if(authType==="signup"){
        if(!isOpen){
            onOpen();
        }
    }
    else{
        if(isOpen){
            onClose()
        }
    }
    return (
        <div className={styles.signupbtn}>
            <Button ><Link to="/Resto?authType=signup">Register your restaurant</Link></Button>

            <Modal  isOpen={isOpen} onClose={()=>{
                onClose();
                navigate("/Resto")
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>SignUp</ModalHeader>
                    <ModalCloseButton  />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text" placeholder="Name"
                                    value={fullName}
                                    autoFocus
                                    autoComplete="username"
                                    onChange={(event) => setFullName(event.target.value)}

                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text" placeholder="Email"
                                    value={email}
                                    autoComplete="username"
                                    onChange={(event) => setEmail(event.target.value)}

                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password" placeholder="Password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>

                           
                        </form>
                    </ModalBody>

                    <ModalFooter style={{ justifyContent: 'center', paddingBottom: '0' }} >

                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            SignUp
                        </Button>

                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                    <div className={styles.revert}>
                        <h6>
                            <Link to="/Resto?authType=login">Already have an account ?</Link>
                        </h6>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    )
}
