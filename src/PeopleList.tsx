import * as React from "react";
import {
    Circle,
    NavigationBarActionGroup,
    NavigationBarAction,
    MasterDetailLayout,
    NavigationBar,
    NegativeBox,
    Row,
    RowList,
    IconStarRegular,
    IconStarFilled,
    Tag,
} from "@telefonica/mistica";
import { type Person } from "./api";

import PersonDetails from "./person-details";

type Props = {
    favorites: Person[];
    list: Person[];
    handleFavoriteOnPress: (person: Person) => void;
    isTabletOrSmaller: boolean;
    selectedPerson: Person | null;
    setSelectedPerson: (person: Person | null) => void;
};

const PeopleList: React.FC<Props> = ({
    favorites,
    list,
    handleFavoriteOnPress,
    isTabletOrSmaller,
    selectedPerson,
    setSelectedPerson,
}) => {
    const defaultPerson: Person = {
        name: {
            title: "NSEL",
            first: "NSEL",
            last: "NSEL",
            fullname: "NSEL",
        },
        location: {
            street: {
                name: "NSEL",
                number: 0,
            },
            city: "NSEL",
            state: "NSEL",
            country: "NSEL",
            postcode: 0,
            coordinates: {
                latitude: "NSEL",
                longitude: "NSEL",
            },
        },
        email: "NSEL",
        login: {
            uuid: "NSEL",
            username: "NSEL",
            password: "NSEL",
            salt: "NSEL",
            md5: "NSEL",
            sha1: "NSEL",
            sha256: "NSEL",
        },
        dob: {
            date: "NSEL",
            age: 0,
        },
        registered: {
            date: "NSEL",
            age: 0,
        },
        phone: "NSEL",
        cell: "NSEL",
        id: {
            name: "NSEL",
            value: "NSEL",
        },
        picture: {
            large: "",
            medium: "",
            thumbnail: "",
        },
        nat: "NSEL",
    };

    return (
        <>
            {console.log("favorites", favorites)}
            <MasterDetailLayout
                isOpen={!!selectedPerson}
                master={
                    <NegativeBox>
                        <RowList>
                            {list.map((person) => (
                                <>
                                    <Row
                                        headline={
                                            favorites.includes(person) ? (
                                                <Tag type="promo">Favorite</Tag>
                                            ) : null
                                        }
                                        key={person.login.uuid}
                                        asset={
                                            <Circle
                                                size={40}
                                                backgroundImage={
                                                    person.picture.medium
                                                }
                                            />
                                        }
                                        title={person.name.fullname}
                                        onPress={() => {
                                            setSelectedPerson(person);
                                        }}
                                    />
                                </>
                            ))}
                        </RowList>
                    </NegativeBox>
                }
                detail={
                    selectedPerson ? (
                        <>
                            <NavigationBar
                                isInverse={isTabletOrSmaller}
                                topFixed={isTabletOrSmaller}
                                onBack={() => {
                                    setSelectedPerson(null);
                                }}
                                right={
                                    <NavigationBarActionGroup>
                                        <NavigationBarAction
                                            aria-label="Mark as favorite"
                                            onPress={handleFavoriteOnPress.bind(
                                                null,
                                                selectedPerson
                                            )}
                                        >
                                            {favorites.includes(
                                                selectedPerson
                                            ) ? (
                                                <IconStarFilled color="currentColor" />
                                            ) : (
                                                <IconStarRegular color="currentColor" />
                                            )}
                                        </NavigationBarAction>
                                    </NavigationBarActionGroup>
                                }
                                title={selectedPerson.name.fullname}
                            />
                            <PersonDetails person={selectedPerson} />
                        </>
                    ) : (
                        <>
                            <NavigationBar
                                isInverse={isTabletOrSmaller}
                                topFixed={isTabletOrSmaller}
                                onBack={() => {
                                    setSelectedPerson(null);
                                }}
                                title={"No person selected"}
                            />
                            <PersonDetails person={defaultPerson} />
                        </>
                    )
                }
            />
        </>
    );
};

export default PeopleList;
