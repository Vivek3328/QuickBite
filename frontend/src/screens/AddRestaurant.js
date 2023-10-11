import React, { useState } from 'react'
import styles from '../components/styles/addRestaurant.module.css'
import { Radio, RadioGroup, Button, Stack } from '@chakra-ui/react'


export default function AddRestaurant() {
    const [value, setValue] = React.useState('1')
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
        <div className={styles.addResto}>
        <div className={styles.container}>
            <h2>Restaurant Information</h2>
            <form onSubmit={handleSubmit}>
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
                <div className={styles.submitContainer} >
                    <Button type='submit' colorScheme='blue'>Submit</Button>
                </div>
            </form>
        </div>
        </div>
    )
}
