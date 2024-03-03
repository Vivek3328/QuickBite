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
    useToast,

} from '@chakra-ui/react'

import styles from "./styles/resto.module.css"


export default function RestaurantLogin({ authType }) {
    const navigate = useNavigate()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    if (authType === "login") {
        if (!isOpen) {
            onOpen();
        }
    }
    else {
        if (isOpen) {
            onClose();
        }
    }


    const [Credentials, setCredentials] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/ownerauth/loginowner", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: Credentials.email, password: Credentials.password })
        });

        const json = await response.json()
        // console.log(json)

        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            navigate("/RestaurantHome")
            toast({
                title: 'Logged in Successfully',
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
        }
        else {
            alert("Invalid Credentials")
        }

    }

    const onChange = (e) => {
        setCredentials({ ...Credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className={styles.loginbtn}>
            <Link to={'/Resto?authType=login'} ><Button>Login to existing Restaurant</Button></Link>

            <Modal isOpen={isOpen} onClose={() => {
                onClose();
                navigate("/Resto")
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Login</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                {/* <label htmlFor="exampleInputEmail1">Email address :</label> */}
                                <input
                                    type="text" placeholder="Email"
                                    value={Credentials.email}
                                    id='email'
                                    name='email'
                                    autoFocus
                                    autoComplete="username"
                                    onChange={onChange}
                                />
                            </div>
                            <div className="form-group">
                                {/* <label htmlFor="exampleInputPassword1">Password :</label> */}
                                <input
                                    type="password" placeholder="Password"
                                    autoComplete="current-password"
                                    id='password'
                                    name='password'
                                    value={Credentials.password}
                                    onChange={onChange}
                                />
                            </div>
                            {/* <button type="submit" className="btn btn-primary">Login</button> */}
                            <ModalFooter style={{ justifyContent: 'center', paddingBottom: '0' }} >

                                <Button colorScheme='blue' mr={3} type='submit'>
                                    Login
                                </Button>
                            </ModalFooter>
                        </form>

                    </ModalBody>


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
