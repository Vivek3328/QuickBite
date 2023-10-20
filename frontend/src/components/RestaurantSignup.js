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
    Radio,
    RadioGroup,
    Stack,
    useToast,
} from "@chakra-ui/react";
import styles from "./styles/resto.module.css";

export default function RestaurantSignup({ authType }) {
    const navigate = useNavigate();
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (authType === "signup") {
        if (!isOpen) {
            onOpen();
        }
    } else {
        if (isOpen) {
            onClose();
        }
    }
    const [Credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        pincode: "",
        mobile: "",
        foodtype: "",
        restaurantType: "veg",
        image: "",
    });
    const [img, setImg] = useState("");

    const uploadimage = async (e) => {
        e.preventDefault();
        const files = document.querySelector("[type=file]").files;
        // await setImage(e.target.files)
        console.log(files[0]);
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("upload_preset", "quickbite");
        formData.append("cloud_name", "drdcsopo2");
        await fetch("https://api.cloudinary.com/v1_1/drdcsopo2/image/upload", {
            method: "post",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                console.log(data.url);
                setImg(data.url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onChange = (e) => {
        setCredentials({ ...Credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(
            "http://localhost:5000/api/ownerauth/registerowner",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: Credentials.name,
                    email: Credentials.email,
                    password: Credentials.password,
                    address: Credentials.address,
                    pincode: Credentials.pincode,
                    mobile: Credentials.mobile,
                    image: img,
                    foodtype: Credentials.foodtype,
                    restaurantType: Credentials.restaurantType,
                }),
            }
        );
        console.log(Credentials);
        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            navigate("/Resto?authType=login");
            toast({
                title: 'Restuarant Created Successfully',
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
              })
        } else {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className={styles.signupbtn}>

            <Link to="/Resto?authType=signup">
                <Button>
                    Register your restaurant
                </Button>
            </Link>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    navigate("/Resto");
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>SignUp</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Restaurant Name"
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
                                    placeholder="Enter your Email"
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
                                    placeholder="Create Password"
                                    id="password"
                                    name="password"
                                    value={Credentials.password}
                                    autoComplete="off"
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Complete Address"
                                    value={Credentials.address}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="pincode"
                                    placeholder="Pincode"
                                    name="pincode"
                                    value={Credentials.pincode}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="mobile"
                                    placeholder="Phone Number"
                                    name="mobile"
                                    value={Credentials.mobile}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="foodtype"
                                    placeholder="eg. Italian, North Indian"
                                    name="foodtype"
                                    value={Credentials.foodtype}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <RadioGroup>
                                <Stack direction="row">
                                    <label htmlFor="">Restaurant type:</label>
                                    <Radio
                                        value="veg"
                                        id="restaurantType1"
                                        name="restaurantType"
                                        onChange={onChange}
                                        defaultChecked
                                        required
                                    >
                                        Veg
                                    </Radio>
                                    <Radio
                                        value="non-veg"
                                        id="restaurantType2"
                                        name="restaurantType"
                                        onChange={onchange}
                                        required
                                    >
                                        Non-veg
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                            <div className="mb-1">
                                Image <span className="font-css top"></span>
                                <div className="">
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={uploadimage}
                                    />
                                </div>
                            </div>

                            <ModalFooter
                                style={{
                                    justifyContent: "center",
                                    paddingBottom: "0",
                                }}
                            >
                                <Button colorScheme="blue" mr={3} type="submit">
                                    SignUp
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>

                    <div className={styles.revert}>
                        <h6>
                            <Link to="/Resto?authType=login">
                                Already have an account ?
                            </Link>
                        </h6>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    );
}
