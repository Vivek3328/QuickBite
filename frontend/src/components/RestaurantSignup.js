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
    Radio, RadioGroup, Stack

} from '@chakra-ui/react'
import styles from "./styles/resto.module.css"


export default function RestaurantSignup({ authType }) {
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    if (authType === "signup") {
        if (!isOpen) {
            onOpen();
        }
    }
    else {
        if (isOpen) {
            onClose()
        }
    }
    const [Credentials, setCredentials] = useState({name:"", email:"",password:"", address:"",pincode:null,  phoneNumber: null, foodtype:"",image:""});

    const imageUpload=(e)=>{
        console.log(e.target.files[0]);
        setCredentials({...Credentials,image:e.target.files[0]})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/ownerauth/registerowner",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name:Credentials.name, email:Credentials.email,password:Credentials.password, address:Credentials.address,pincode:Credentials.pincode,  phoneNumber: Credentials.phoneNumber,image:Credentials.image, foodtype:"italian",restaurantType:Credentials.foodtype})
        });

        const json = await response.json()
        console.log(json)

        if(json.success){
            localStorage.setItem('token', json.authtoken);
            navigate("/RestaurantHome")
        }
        else{
           alert("Invalid Credentials")
        }

    }

    const onChange = (e)=>{
        setCredentials({...Credentials, [e.target.name]: e.target.value});
    }

    return (
        <div className={styles.signupbtn}>
            <Button ><Link to="/Resto?authType=signup">Register your restaurant</Link></Button>

            <Modal isOpen={isOpen} onClose={() => {
                onClose();
                navigate("/Resto")
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>SignUp</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Restaurant Name'
                                    id="name"
                                    name="name"
                                    value={Credentials.name}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder='Enter your Email'
                                    id="email"
                                    name="email"
                                    value={Credentials.email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder='Create Password'
                                    id="password"
                                    name="password"
                                    value={Credentials.password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder='Complete Address'
                                    value={Credentials.address}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="pincode"
                                    placeholder='Pincode'
                                    name="pincode"
                                    value={Credentials.pincode}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    placeholder='Phone Number'
                                    name="phoneNumber"
                                    value={Credentials.phoneNumber}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                             <RadioGroup >
                                <Stack direction='row'>
                                    <label htmlFor="">Restaurant type:</label>
                                    <Radio value='veg' id="veg" name="foodtype" onChange={onChange}>Veg</Radio>
                                    <Radio value='non-veg' id="non-veg" name='foodtype' onChange={onchange}>Non-veg</Radio>
                                </Stack>
                            </RadioGroup>  
                            <div className="mb-1">
                                Image <span className="font-css top"></span>
                                <div className="">
                                    {/* on onChange */}
                                    <input type="file" id="image" name="image" value={Credentials.image} onChange={imageUpload} accept="image/*" />
                                </div>
                            </div>

                            <ModalFooter style={{ justifyContent: 'center', paddingBottom: '0' }} >

                                <Button colorScheme='blue' mr={3} type='submit'>
                                    SignUp
                                </Button>

                                {/* <Button variant='ghost'>Secondary Action</Button> */}
                            </ModalFooter>


                        </form>
                    </ModalBody>


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
