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
                                <Button variant="outline" colorScheme="red">
                                    Delete
                                </Button>
                            </div>
                            <div className="mx-2">
                                <Button variant="outline" colorScheme="blue">
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </Stack>
                </CardBody>
            </Card>
        </div>
    );
}
