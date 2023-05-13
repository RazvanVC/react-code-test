import {
    MainNavigationBar,
    MainSectionHeader,
    MainSectionHeaderLayout,
    useScreenSize,
} from "@telefonica/mistica";
import React from "react";
import { fetchPeople, type Person } from "./api";
import LoadingScreen from "./LoadinScreen";
import ErrorScreen from "./ErrorScreen";
import PeopleList from "./PeopleList";

const App = (): JSX.Element => {
    const [state, setState] = React.useState<"loading" | "loaded" | "error">(
        "loading"
    );

    const { isTabletOrSmaller } = useScreenSize();
    //retrive main section from localstorage if exists
    const [mainSection, setMainSection] = React.useState<string>(
        localStorage.getItem("mainSection")?.replace(/"/gi, "") || "People"
    );
    const [people, setPeople] = React.useState<Person[]>([]);
    const [favorites, setFavorites] = React.useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
        null
    );

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

    React.useEffect(() => {
        localStorage.setItem("mainSection", JSON.stringify(mainSection));
    }, [mainSection]);

    /*
     * This function is passed to the PeopleList component to handle the favorite button press
     */
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

    if (state === "loading") {
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

            {mainSection === "People" ? (
                <PeopleList
                    favorites={favorites}
                    list={people}
                    isTabletOrSmaller={isTabletOrSmaller}
                    handleFavoriteOnPress={handleFavoriteOnPress}
                    selectedPerson={selectedPerson}
                    setSelectedPerson={setSelectedPerson}
                />
            ) : (
                <PeopleList
                    favorites={favorites}
                    list={favorites}
                    isTabletOrSmaller={isTabletOrSmaller}
                    handleFavoriteOnPress={handleFavoriteOnPress}
                    selectedPerson={selectedPerson}
                    setSelectedPerson={setSelectedPerson}
                />
            )}
        </main>
    );
};

export default App;
