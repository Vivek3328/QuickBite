import React from 'react'
import { Card, CardBody, Stack, Heading, Text, Image, Button, CardFooter, Select } from '@chakra-ui/react'

export default function MenuCard(props) {
    return (
        <div>
         
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                boxShadow='xl'
                borderRadius='2xl'
            >
                <Image
                    // objectFit='cover'
                    maxW={{ base: '500%', sm: '300px' }}
                    src=  {props.image}
                    alt='Caffe Latte'
                    borderRadius='3xl'
                    p='2'
                />

                <Stack>
                    <CardBody>
                        <div style={{ display: 'flex'}}>
                        <Heading size='md'>{props.itemname}
                            <Image
                              maxW={{ base: '100%', sm: '40px' }}
                              src='https://img.icons8.com/?size=96&id=61083&format=png'
                              alt='Veg'
                              borderRadius='3xl'
                              p='2'
                             />
                        </Heading>
                        </div>
                        <Heading py='1' size='sm'>
                            Price : {props.price} Rs.
                        </Heading>
                        <Text py='1'>
                            {props.description}
                        </Text>
                    </CardBody>

                    <CardFooter>
                        <div style={{ display: 'flex', justifyContent: 'center', marginRight: '27px' }}>
                            <Select placeholder='Select Quantity'>
                                <option value='1'> 1</option>
                                <option value='2'> 2</option>
                                <option value='3'> 3</option>
                                <option value='4'> 4</option>
                                <option value='5'> 5</option>
                            </Select>
                        </div>
                        <Button variant='outline' colorScheme='green' pl='5' >
                            Add to Cart
                        </Button>

                    </CardFooter>
                </Stack>
            </Card>
        </div>
    )
}
