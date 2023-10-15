import React from 'react'
import { Card, CardBody, Stack, Heading, Text, Image, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
// import { Button } from '@chakra-ui/react'


export default function RestoCard(props) {
    return (
        <div>
            <Card boxShadow='xl' maxW='md'>
                <CardBody>
                    <Image
                        src='https://b.zmtcdn.com/data/pictures/chains/5/18575885/54b6de34323395a3b10897e48bd2a6e5_o2_featured_v2.jpg?output-format=webp'
                        // src={ `../uploads/${props.image}`}
                        alt='Restaurant Image'
                        borderRadius='lg'
                    />
                    <Stack mt='5' spacing='1'>
                        <Heading size='md' alignContent='left' >{props.name}</Heading>
                        <div className='d-flex flex-row' style={{justifyContent:'space-between'}}>
                            <div style={{ marginRight: '50px' }}>
                                <Text >
                                    {props.foodtype}
                                </Text>
                            </div>
                            <Text  >
                                Rs. 200 for one
                            </Text>
                        </div>

                    </Stack>
                    <div style={{ display: 'flex', justifyContent: 'end' }} >
                        <Button variant='outline' colorScheme='green' pl='5'  >
                        <Link to= {`/userHome/resto/${props.id}`}> Order Now</Link>
                        </Button>
                    </div>
                </CardBody>

            </Card>
        </div>
    )
}
