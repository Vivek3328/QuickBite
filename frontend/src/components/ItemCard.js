import React from "react";
import { Card, CardBody, Stack, Heading, Text, Image, Button } from '@chakra-ui/react'

export default function ItemCard() {

    // const handleClick = () => {

    // }

    // const handleAddToCart = async () => {

    // }

    return (
        <div>
            <Card boxShadow='xl' maxW='md'>
                <CardBody>
                    <Image
                        src='https://b.zmtcdn.com/data/pictures/chains/5/18575885/54b6de34323395a3b10897e48bd2a6e5_o2_featured_v2.jpg?output-format=webp'
                        alt='Green double couch with wooden legs'
                        borderRadius='lg'
                    />
                    <Stack mt='5' spacing='1'>
                        <Heading size='md' alignContent='left' >La Pino'z Pizza</Heading>
                        <div className='d-flex flex-row'>
                            <div style={{ marginRight: '50px' }}>
                                <Text >
                                    Pizza, Italian, Pasta, Fast Food

                                </Text>
                                {/* <Text>
                                    Udhna Gam, Surat
                                </Text> */}
                            </div>
                            <Text  >
                                Rs. 200 for one
                            </Text>
                        </div>
                        <Button  variant='ghost' colorScheme='blue'>
                       Order Now
                    </Button>
                    </Stack>
                </CardBody>
               
            </Card>
        </div>
    )
}
