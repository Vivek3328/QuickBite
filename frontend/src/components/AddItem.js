import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
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
    const { isOpen, onOpen, onClose } = useDisclosure()
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
                                    name="name"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Description'
                                    id="desc"
                                    name="desc"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder='Price'
                                    id="price"
                                    name="price"
                                />
                            </div>
                            <div className="mb-1">
                                Image <span className="font-css top"></span>
                                <div className="">
                                    <input type="file" id="file-input" name="ImageStyle" accept="image/*" />
                                </div>
                            </div>
                            <ModalFooter>
                        <Button colorScheme='blue' mr={3}>
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
