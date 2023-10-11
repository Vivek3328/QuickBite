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


export default function RestaurantLogin({authType}) {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    if(authType==="login"){
        if(!isOpen){
            onOpen();
        }
    }
    else{
        if(isOpen){
            onClose();
        }
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div className={styles.loginbtn}>
            <Button><Link to="/resto?authType=login" >Login to view your existing Restaurant</Link></Button>

            <Modal isOpen={isOpen} onClose={()=>{
                onClose();
                navigate("/Resto")
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Login</ModalHeader>
                    <ModalCloseButton onClick={()=>navigate("/Resto")} />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                {/* <label htmlFor="exampleInputEmail1">Email address :</label> */}
                                <input
                                    type="text" placeholder="Email"
                                    value={email}
                                    autoFocus
                                    autoComplete="username"
                                    onChange={(event) => setEmail(event.target.value)}

                                />
                            </div>
                            <div className="form-group">
                                {/* <label htmlFor="exampleInputPassword1">Password :</label> */}
                                <input
                                    type="password" placeholder="Password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>

                            {/* <button type="submit" className="btn btn-dark">Submit</button> */}
                        </form>

                        {/* <div className="card login-card input-field">
                                {/* <h2>QuickBite</h2> */}

                    </ModalBody>

                    <ModalFooter style={{justifyContent: 'center', paddingBottom: '0'}} >

                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Login
                        </Button>

                        {/* <Button variant='ghost'>Secondary Action</Button> */}
                    </ModalFooter>
                    <div className={styles.revert}>
                        <h6>
                            <Link to="/resto?authType=signup">Don't have an account ?</Link>
                        </h6>
                    </div>

                </ModalContent>
            </Modal>
        </div>
    )
}
