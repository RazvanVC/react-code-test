import {
    Circle,
    MainNavigationBar,
    MainSectionHeader,
    MainSectionHeaderLayout,
    MasterDetailLayout,
    NavigationBar,
    NegativeBox,
    Row,
    RowList,
    useScreenSize,
} from "@telefonica/mistica";
import React from "react";
import { fetchPeople, type Person } from "./api";
import PersonDetails from "./person-details";

type MainSection = "People" | "Favorites";

const App = (): JSX.Element => {
    const { isTabletOrSmaller } = useScreenSize();

    const [people, setPeople] = React.useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(null);
    const [mainSection, setMainSection] = React.useState<MainSection>("People");
    const [favorites, setFavorites] = React.useState<Person[]>([]);
    const [state, setState] = React.useState<"loading" | "loaded" | "error">("loading");

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

    //let selectedPerson: Person | null = null; // TODO Task 1: implement the logic to select a person

    const mainSections = ["People"] as const;
    const section: MainSection = "People";

    //Implement a loading UI while the user waits for the api response.
    if (state === "loading") {
        return <div>Loading...</div>;
    } else if (state === "error") {
        return <div>Error</div>;
    }

    

    //catch error "FetchPeople: Something went wrong" and show a negative box with the error message
    //if (error) {
    //    return <NegativeBox message={error.message} />;
    //}


    return (
        <main>
            {(!isTabletOrSmaller || !selectedPerson) && (
                <>
                    <MainNavigationBar
                        isInverse
                        selectedIndex={section === "People" ? 0 : 1}
                        sections={mainSections.map((section) => ({
                            title: section,
                            onPress: () => {
                                setMainSection(section);
                                console.log("Section pressed (Task 6)");
                            },
                        }))}
                    />
                    <MainSectionHeaderLayout>
                        <MainSectionHeader title={section} />
                    </MainSectionHeaderLayout>
                </>
            )}

            <MasterDetailLayout
                isOpen={!!selectedPerson}
                master={
                    <NegativeBox>
                        <RowList>
                            {people.map((person) => (
                                <Row
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
                                    console.log("Navbar back pressed (Task 1)");
                                }}
                                title={selectedPerson.name.first}
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
                                    console.log("Navbar back pressed (Task 1)");
                                }}
                                title={"No person selected"}
                            />
                            <PersonDetails person={defaultPerson} />
                        </>
                    )
                }
            />
        </main>
    );
};

export default App;
