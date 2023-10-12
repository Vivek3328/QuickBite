import React from 'react'
import { Card, CardBody, Stack, Heading, Text, Image, Button, CardFooter, Select } from '@chakra-ui/react'

export default function MenuCard() {
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
                    maxW={{ base: '100%', sm: '300px' }}
                    src='https://b.zmtcdn.com/data/pictures/chains/2/3800262/07aae713b8d0d951eaa489aa3bd02005_o2_featured_v2.jpg'
                    alt='Caffe Latte'
                    borderRadius='3xl'
                    p='2'
                />

                <Stack>
                    <CardBody>
                        <Heading size='md'>Margherita Pizza (personal Giant Slice (22.5 Cm))</Heading>
                        <Heading py='1' size='sm'>
                            Price : 250 Rs.
                        </Heading>
                        <Text py='1'>
                            A classic cheesy Margherita. Cant go wrong. [Fat-14.3 per 100 g, Protein-12.6 per 100 g, Carbohydrate-39.2 per 100 g, Sugar-0 per 100 g, Calories-336 K.cal] Nutritional information per 100g
                        </Text>
                    </CardBody>

                    <CardFooter>
                        <div style={{display:'flex', justifyContent:'center', marginRight:'27px'}}>
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
