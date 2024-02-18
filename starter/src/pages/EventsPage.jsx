import React from "react";
import {
  Wrap,
  WrapItem,
  Heading,
  FormLabel,
  Image,
  Button,
  FormControl,
  Select,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AddEvent } from "./AddEvent";
import { TextInput } from "../components/ui/TextInput";

//loader functie haalt evenementen en categorieen op van de opgegeven endpoints met behulp van fetch:
export const loader = async () => {
  const responseEvents = await fetch("http://localhost:3000/events");
  const responseCategories = await fetch("http://localhost:3000/categories");
  const events = await responseEvents.json();
  const categories = await responseCategories.json();
  return { events, categories };
};

// state hooks
export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedDate, setSelectedDate] = useState("");

  // functie om het modal te openen en natuurlijk te sluiten.
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // haalt data op bij het laden van de pagina.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { events, categories } = await loader();
        setEvents(events);
        setCategories(categories);
        setFilteredEvents(events); //
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  // eventhandlers voor het filteren en zoeken.
  //Event handler voor het wijzingen van de geslecteerde categorie:
  const handleChangeCategory = (event) => {
    const selectedCategoryValue = parseInt(event.target.value); //converteer naar een getal.
    setSelectedCategory(selectedCategoryValue); //update de geselecteerde categorie
    // Stop de functie als de events-array niet is ingesteld
    // Filter de evenenementen op basis van de nieuwe geselecteerde categorie:
    const filtered = events.filter((event) => {
      return event.categoryIds?.includes(selectedCategoryValue);
    });

    //update de gefilterde category
    setFilteredEvents(filtered);
  };

  const handleChangeDate = (event) => {
    const selectedDateValue = event.target.value;
    setSelectedDate(selectedDateValue); //Update de geselecteerde datum
    //filter de evenementen van de datum op basis van de nieuwe geselecteerde datum
    filterEvents();
  };

  const handleFilter = () => {
    filterEvents();
  };
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedDate("0000-00-00");
    setFilteredEvents(events);
  };

  //functie voor het filteren van evenemenenten
  const filterEvents = () => {
    let filtered = [...events];

    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categoryIds?.includes(selectedCategory)
      );
    }
    if (selectedDate) {
      filtered = filtered.filter(
        (event) =>
          event.startTime?.slice(0,10) === selectedDate ||
            event.endTime?.slice(0,10) === selectedDate
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  };

  // functies om categorieeen op te halen op basis van ID's
  const getCategoryName = (categoryIds) => {
    const eventCategories =
      categoryIds?.map((categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "unknown";
      }) ?? [];
    return eventCategories.join(", ");
  };

  // Filter events based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEvents(events);
      return;
    }
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // handle change in searchinput

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <>
      <Grid
        p={3}
        templateAreas={`"header header header header"
                  "nav main main main" 
                  "footer footer footer foter"`}
        gridTemplateRows={"50px 1fr 30px"}
        gridTemplateColumns={"1fr 1fr 1fr 1fr"}
        h="auto"
        gap="2"
        color="blackAlpha.700"
        gap={4}
        m={3}
        bgColor="pink"
      >
        <GridItem bgColor="green.800" area={"header"}>
          <Heading color="white" textAlign="center" gridColumn>
            Zoek hier uw evenement!{" "}
          </Heading>
        </GridItem>
        <GridItem area="nav">
          <FormControl>
            <FormLabel> Category</FormLabel>
            <Select value={selectedCategory} onChange={handleChangeCategory}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel> Date</FormLabel>
            <input
              type="date"
              value={selectedDate}
              onChange={handleChangeDate}
            />
          </FormControl>

          <FormControl>
            <FormLabel> Search </FormLabel>
            <TextInput changeFn={handleChange}></TextInput>
          </FormControl>
          <FormControl>
            <Button m={1} onClick={clearFilters}>
              Clear Filters
            </Button>
          </FormControl>
          <FormControl>
            <Button m={1} onClick={openModal}>
              Add new Event
            </Button>
            <AddEvent isOpen={isModalOpen} onClose={closeModal} />
          </FormControl>
        </GridItem>
        <GridItem area={"main"}>
          <Wrap m={2} mt={3} spacing={3}>
            {filteredEvents.map((event, id) => (
              <WrapItem key={id}>
                <Link to={`/event/${event.id}`}>
                  <Heading color="green.700"> {event.title}</Heading>
                  <Heading m={2} as="h2" size="md" color="green.700">
                    {" "}
                    {event.description}
                  </Heading>
                  <Image
                    h={250}
                    w={500}
                    src={event.image}
                    alt={event.title}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                  />

                  <Heading as="h3" size="md" color="green.700">
                    Date: {event.startTime?.slice(0, 10)}
                  </Heading>
                  <Text color="green.700">
                    <b>Starttime: </b>
                    {event.startTime?.slice(11, 16) || event.startTime}
                  </Text>
                  <Text color="green.700">
                    <b> Endtime:</b>{" "}
                    {event.endTime?.slice(11, 16) || event.endTime}
                  </Text>
                  <Text color="green.700">
                    <b>Category: </b>
                    {getCategoryName(event.categoryIds) || event.categories}
                  </Text>
                </Link>
              </WrapItem>
            ))}
          </Wrap>
        </GridItem>
      </Grid>
    </>
  );
};
