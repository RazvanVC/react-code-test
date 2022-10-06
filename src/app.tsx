import {
    Circle,
    MainNavigationBar,
    NavigationBarActionGroup,
    NavigationBarAction,
    MainSectionHeader,
    MainSectionHeaderLayout,
    MasterDetailLayout,
    NavigationBar,
    NegativeBox,
    Row,
    RowList,
    useScreenSize,
    IconStarRegular,
    IconStarFilled,
    Tag,
} from "@telefonica/mistica";
import React from "react";
import { fetchPeople, type Person } from "./api";
import PersonDetails from "./person-details";
import LoadingScreen from "./LoadinScreen";
import ErrorScreen from "./ErrorScreen";

type MainSection = "People" | "Favorites";

const App = (): JSX.Element => {
    const [state, setState] = React.useState<"loading" | "loaded" | "error">("loading");

    const { isTabletOrSmaller } = useScreenSize();
    const [mainSection, setMainSection] = React.useState<MainSection>("People");

    const [people, setPeople] = React.useState<Person[]>([]);
    const [favorites, setFavorites] = React.useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(null);

    React.useEffect(() => {
        fetchPeople()
            .then((people) => {
                setPeople(people);
                setState("loaded");
            })
            .catch((error) => {
                console.error(error);
                setState("error");
            });
        setSelectedPerson(null);
    }, []);

    const defaultPerson: Person = {
        name: {
            title: "NSEL",
            first: "NSEL",
            last: "NSEL",
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

    function handleFavoriteOnPress(person: Person) {
        if (favorites.includes(person)) {
            setFavorites(favorites.filter((p) => p !== person));
        } else {
            setFavorites([...favorites, person]);
        }
        if (mainSection === "Favorites") {
            setSelectedPerson(null);
        }
    }

    const mainSections = ["People", "Favorites"] as const;

    //Implement a loading UI while the user waits for the api response.
    if (state === "loading") {
        //Make a beutiful loading UI
        return <LoadingScreen />;
    } else if (state === "error") {
        return <ErrorScreen />;
    }

    return (
        <main>
            {(!isTabletOrSmaller || !selectedPerson) && (
                <>
                    <MainNavigationBar
                        isInverse
                        selectedIndex={mainSection === "People" ? 0 : 1}
                        sections={mainSections.map((section) => ({
                            title: section,
                            onPress: () => {
                                setMainSection(section);
                                setSelectedPerson(null);
                            },
                        }))}
                    />
                    <MainSectionHeaderLayout>
                        <MainSectionHeader title={mainSection} />
                    </MainSectionHeaderLayout>
                </>
            )}

            {mainSection==="People" ? (
                <MasterDetailLayout
                isOpen={!!selectedPerson}
                master={
                    <NegativeBox>
                        <RowList>
                            {people.map((person) => (
                                <Row
                                    key={person.login.uuid}
                                    headline={
                                        //If favorite person is selected, show the tag else nothing
                                        favorites.includes(person) ? (
                                            <Tag type="promo">Favorite</Tag>
                                        ) : null}
                                    asset={
                                        <Circle
                                            size={40}
                                            backgroundImage={
                                                person.picture.medium
                                            }
                                        />
                                    }
                                    title={[
                                        person.name.title,
                                        person.name.first,
                                        person.name.last,
                                    ].join(" ")}
                                    onPress={() => {
                                        setSelectedPerson(person);
                                    }}
                                />
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
                                        <NavigationBarAction aria-label="Mark as favorite" onPress={
                                            handleFavoriteOnPress.bind(null, selectedPerson)
                                        }>
                                            {favorites.includes(selectedPerson) ? (
                                                <IconStarFilled color="currentColor" />
                                            ) : (
                                                <IconStarRegular color="currentColor" />
                                            )}
                                        </NavigationBarAction>
                                    </NavigationBarActionGroup>
                                }
                                title={[
                                    selectedPerson.name.title,
                                    selectedPerson.name.first,
                                    selectedPerson.name.last,
                                ].join(" ")}
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
            />) : (
                <MasterDetailLayout
                isOpen={!!selectedPerson}
                master={
                    <NegativeBox>
                        <RowList>
                            {favorites.map((person) => (
                                <Row
                                    headline={
                                        //If favorite person is selected, show the tag else nothing
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
                                    title={[
                                        person.name.title,
                                        person.name.first,
                                        person.name.last,
                                    ].join(" ")}
                                    onPress={() => {
                                        setSelectedPerson(person);
                                        console.log(
                                            "Person row pressed (Task 1)"
                                        );
                                    }}
                                />
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
                                        <NavigationBarAction aria-label="Mark as favorite" onPress={
                                            handleFavoriteOnPress.bind(null, selectedPerson)
                                        }>
                                            {favorites.includes(selectedPerson) ? (
                                                <IconStarFilled color="currentColor" />
                                            ) : (
                                                <IconStarRegular color="currentColor" />
                                            )}
                                        </NavigationBarAction>
                                    </NavigationBarActionGroup>
                                }
                                title={[
                                    selectedPerson.name.title,
                                    selectedPerson.name.first,
                                    selectedPerson.name.last,
                                ].join(" ")}
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
            )}
        </main>
    );
};

export default App;
