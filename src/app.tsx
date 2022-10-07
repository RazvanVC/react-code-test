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
                <PeopleList favorites={favorites} list={people} isTabletOrSmaller={isTabletOrSmaller} handleFavoriteOnPress={handleFavoriteOnPress}/>
                ) : (
                <PeopleList favorites={favorites} list={favorites} isTabletOrSmaller={isTabletOrSmaller} handleFavoriteOnPress={handleFavoriteOnPress}/>
                )
            }
        </main>
    );
};

export default App;
