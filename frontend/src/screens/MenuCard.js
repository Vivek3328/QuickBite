import React, { useContext, useState, useEffect } from 'react'
import { Card, CardBody, Stack, Heading, Text, Image, Button, CardFooter, Select } from '@chakra-ui/react'
import cartContext from '../Context/cartContext';
import { useLocation } from 'react-router-dom';


export default function MenuCard(props) {

    const a = useContext(cartContext);
    const location = useLocation();
    const [amt, setAmt] = useState(0);

    const handlePrice = () => {
        let ans = 0;
        //eslint-disable-next-line 
        a.cart.map((it) => {
            ans += it.cnt * it.price;
        })
        setAmt(ans);
    }
    const handleRemove =(id) =>{
        const arr = a.cart.filter((item)=>item._id !== id);
        a.setCart(arr);
    }
    useEffect(() => {
        handlePrice();
        //eslint-disable-next-line 
    }, [])

    // console.log(location);
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
                    src={props.image}
                    alt='Caffe Latte'
                    borderRadius='3xl'
                    p='2'
                />

                <Stack>
                    <CardBody>
                        <div style={{ display: 'flex' }}>
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
                        {location.pathname === '/cart' ? (<>
                            <div style={{ display: 'flex', justifyContent: 'end'}}>
                                <div className='btns' >
                                    <Button variant='solid' colorScheme='red' pl='5' >
                                        -
                                    </Button>
                                    <Button variant='outline' colorScheme='green' pl='5' value="cnt">
                                        count
                                    </Button>
                                    <Button variant='solid' colorScheme='messenger' pl='5'>
                                        +
                                    </Button>
                                </div>
                                <div style={{paddingLeft:'200px' }}>
                                    <Button variant='solid' colorScheme='red' pl='5' onClick={() => handleRemove(props._id)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </>) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', marginRight: '27px' }}>
                                    <Select placeholder='Select Quantity'>
                                        <option value='1'> 1</option>
                                        <option value='2'> 2</option>
                                        <option value='3'> 3</option>
                                        <option value='4'> 4</option>
                                        <option value='5'> 5</option>
                                    </Select>
                                </div>
                                <Button variant='outline' colorScheme='green' pl='5' onClick={() => a.handleclick(props.item)}>
                                    Add to Cart
                                </Button>
                            </>
                        )}

                    </CardFooter>
                </Stack>
            </Card>
            <div>
                <span>
                    Your Total Amount is : {amt} Rs.
                </span>
            </div>
        </div>
    )
}
