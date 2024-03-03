import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure

} from '@chakra-ui/react'
// import styles from "./styles/resto.module.css"

export default function AddItem() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [Item, setItem] = useState({
        itemname: "",
        description: "",
        price: "",
        image: ""
    });
    const [img, setImg] = useState("");

    const uploadimage = async (e) => {
        e.preventDefault();
        const files = document.querySelector("[type=file]").files;
        // console.log(files[0]);
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
                // console.log(data);
                // console.log(data.url);
                setImg(data.url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onChange = (e) => {
        setItem({ ...Item, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        // e.preventDefault();
        const response = await fetch(
            "http://localhost:5000/api/menuitemauth/additem",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    itemname: Item.itemname,
                    description: Item.description,
                    price: Item.price,
                    image: img,
                }),
            }
        );
        // console.log(Item);
        const json = await response.json();
        // console.log(json);
        if (json.success) {
            window.location.reload(false);
        } else {
            alert("Invalid Item");
        }
    };
    return (
        <div>
            <Button onClick={onOpen}>Add Item</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form >
                            <div>
                                <input
                                    type="text"
                                    placeholder='Item Name'
                                    id="name"
                                    name="itemname"
                                    value={Item.itemname}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Description'
                                    id="desc"
                                    name="description"
                                    value={Item.description}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder='Price'
                                    id="price"
                                    name="price"
                                    value={Item.price}
                                    onChange={onChange}
                                />
                            </div>
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
                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                                    Add
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>


                </ModalContent>
            </Modal>
        </div>
    )
}
