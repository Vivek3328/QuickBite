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
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
    const [file,setfile]=React.useState()
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        pincode: '',
        phoneNumber: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here, e.g., send the data to an API or perform any necessary actions.
        console.log('Form submitted with data:', formData);
    };
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
                        <form onSubmit={handleSubmit} action="uploads" method="post" enctype="multipart/form-data">
                            <div>
                                <label htmlFor="name">Restaurant Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address">Complete Address:</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="pincode">Pincode:</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <RadioGroup onChange={setValue} value={value}>
                                <Stack direction='row'>
                                    <label htmlFor="">Restaurant type:</label>
                                    <Radio value='veg'>Veg</Radio>
                                    <Radio value='non-veg'>Non-veg</Radio>
                                </Stack>
                            </RadioGroup>
                            <div className="mb-1">
                                Image <span className="font-css top">*</span>
                                <div className="">
                                    {/* on onChange */}
                                    <input type="file" id="file-input" name="Image" accept="image/*" />
                                </div>
                            </div>

                            <ModalFooter style={{ justifyContent: 'center', paddingBottom: '0' }} >

                                <Button colorScheme='blue' mr={3} onClick={onClose}>
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
