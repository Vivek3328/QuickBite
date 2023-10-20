import React from "react";
import {
    Card,
    CardBody,
    Stack,
    Heading,
    Text,
    Image,
    Button,
} from "@chakra-ui/react";

export default function ItemCard(props) {
    const handleDelete = async () => {
        // Assuming you have an API endpoint for deleting items
        const apiUrl = `http://localhost:5000/api/menuitemauth/deletemenuitems/${props.itemId}`;

        // Make a DELETE request to the API
        await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token" : localStorage.getItem("token")
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Item deleted: ${props.itemname}`);
                    props.updateHotels();
                    // You can also update the UI to reflect the deletion if needed
                } else {
                    console.error("Failed to delete item");
                }
            })
            .catch((error) => {
                console.error("Error while deleting item:", error);
            });
    };
    return (
        <div>
            <Card
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
                boxShadow="xl"
                borderRadius="2xl"
            >
                <CardBody>
                    <Image
                        src={props.image}
                        alt="Green double couch with wooden legs"
                        borderRadius="lg"
                    />
                    <Stack mt="5" spacing="1">
                        <Heading size="md" alignContent="left">
                            {props.itemname}
                        </Heading>
                        <div className="d-flex flex-row">
                            <div style={{ marginRight: "50px" }}>
                                <Text style={{
                                            textAlign: "center",
                                            textJustify: "inter-word",
                                        }}>
                                        {props.description}
                                </Text>
                            </div>
                            <div>
                                <Text>Rs. {props.price}</Text>
                            </div>
                        </div>
                        <div
                            style={{ display: "flex", justifyContent: "right" }}
                        >
                            <div className="mx-2">
                                <Button variant="outline" colorScheme="red" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Stack>
                </CardBody>
            </Card>
        </div>
    );
}
