import { Heading, Spinner, Image, Button, Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChangeEvent } from "../components/ChangeEvent";

export const EventPage = () => {
  const { eventId } = useParams(); // haal de eventId uit de URL
  const [event, setEvent] = useState(null); //Houd het geselecteerde evenement bij.
  const [categories, setCategories] = useState([]); // hou de geslecteerde categorie bij.
  const [user, setUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: "",
  });

  // tijd en datum los en weer samenvogen:
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // //functies om data en tijd bij te werken wanneer de datum aan het veranderen is
  const handleDateChange = (e) => {
    const { value } = e.target;
    setSelectedDate(value);
  };
  const handleStartTimeChange = (e) => {
    const { value } = e.target;
    setSelectedStartTime(value);
  };

  const handleEndTimeChange = (e) => {
    const { value } = e.target;
    setSelectedEndTime(value);
  };

  // laad de venementen zodra het component wordt geladen:
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        const eventData = await response.json();
        setEvent(eventData);

        //categorieen ophalen voor het geslecteerde event.
        const categoryIds = eventData.categoryIds || [];
        const categoryPromises = categoryIds.map(async (categoryId) => {
          const categoryRespone = await fetch(
            `http://localhost:3000/categories/${categoryId}`
          );
          return categoryRespone.json();
        });

        const categoriesData = await Promise.all(categoryPromises);
        setCategories(categoriesData);

        // user ophalen voor het geselecteerde evenement.
        const userResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        const userData = await userResponse.json();
        setUser(userData);

        setFormData({
          ...formData,
          title: eventData.title || "",
          description: eventData.description || "",
          location: eventData.location || "",
          image: eventData.image || "",
          startTime: eventData.startTime || "",
          endTime: eventData.endTime || "",
          date: eventData.date || "",
          categoryIds: eventData.categoryIds || [],
          createdBy: eventData.createdBy || "",
        });
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchEvent();
  }, [eventId]); // voer de fetch-functie uit wanneer de eventId verandert.

  // functie om het modal te openen en natuurlijk te sluiten.
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      //update de geselecteerde starttijd, eindtijd en datum:

      setSelectedStartTime(formData.startTime);
      setSelectedEndTime(formData.endTime);
      setSelectedDate(formData.date);

      const newStartTime = `${selectedDate}T${selectedStartTime}:00`;
      const newEndTime = `${selectedDate}T${selectedEndTime}:00`;
      const newDate = `${selectedDate}`;
      const newCategoryIds = formData.categoryIds;

      // Stuur de formuliergegevens naar de server om het evenement bij te werken
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT", // Gebruik PUT-methode voor het bijwerken van het evenement
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startTime: newStartTime,
          endTime: newEndTime,
          date: newDate,
          categoryIds: newCategoryIds,
        }), // Verzend de geüpdatete gegevens van het formulier
      });

      // Controleer of de server het verzoek succesvol heeft verwerkt
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to update event:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  //event nog niet geladen toon een laadindicator:
  if (!event || !user) {
    return (
      <>
        <Spinner
          thickness="4px"
          speed="0.65"
          size="xl"
          color="pink"
          emptyColor="gray.200"
        ></Spinner>
      </>
    );
  }
  // de delete knop voor het deleten van een evenement
  const handleDelete = async () => {
    const confirmation = window.confirm("sure you want to delete this event?");
    if (confirmation) {
      try {
        const response = await fetch(
          `http://localhost:3000/events/${eventId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          window.location.href = "http://localhost:5173/";
        } else {
          console.error("Failed to delete event", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };
  return (
    <>
      <Box
        bgColor="green.700"
        display="flex"
        justifyContent="center"
        textAlign={"center"}
      >
        <Box
          justifyContent="center"
          textAlign={"center"}
          m={2}
          p={2}
          bgColor="pink"
          flexDirection="column"
          w={600}
        >
          <Heading color="green.700">Choosen event: {event.title} </Heading>
          <Heading m={2} as="h2" size="md" color="green.700">
            {" "}
            {event.description}
          </Heading>
          <Text color="green.700">
            {" "}
            <b>Location:</b> {event.location}
          </Text>
          <Box
            Box
            display="flex"
            justifyContent="center"
            heigt={200}
            borderRadius="md"
            overflow="hidden"
          >
            <Image h="10%" w="auto" src={event.image} alt={event.title} />
          </Box>
          <Heading as="h3" size="md" color="green.700">
            Date: {event.date}
          </Heading>
          <Text color="green.700">
            {" "}
            <b>Starttime: </b> {event.startTime.slice(11, 16)}{" "}
          </Text>
          <Text color="green.700">
            {" "}
            <b> Endtime: </b> {event.endTime.slice(11, 16)}{" "}
          </Text>
          <Text color="green.700">
            <b>Categories: </b>
            {categories.map((category) => category.name).join(",")}
          </Text>
          <Box
            display="flex"
            justifyContent="center"
            heigt={200}
            borderRadius="md"
            overflow="hidden"
          >
            <Image
              h={250}
              w="auto"
              src={user.image}
              alt={user.name}
              borderRadius={150}
            ></Image>
          </Box>
          <Text color="green.700">
            {" "}
            <b>{user.name}</b>
          </Text>
          <Box>
            <Button colorScheme="green" onClick={() => setIsModalOpen(true)}>
              Bewerken
            </Button>
            <ChangeEvent
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              eventData={event}
              selectedEndTime={selectedEndTime}
              selectedStartTime={selectedStartTime}
              handleStartTimeChange={handleStartTimeChange}
              handleEndTimeChange={handleEndTimeChange}
              handleDateChange={handleDateChange}
              selectedDate={selectedDate}
            />

            <Button m={2} colorScheme="green" onClick={handleDelete}>
              Delete event
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
