import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Stack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

const users = [
  { id: 1, name: "Ignacio Doe" },
  { id: 2, name: "Jane Bennett" },
];

import { useState } from "react";
import { Form } from "react-router-dom";

export const AddEvent = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "title",
    description: "description",
    location: "location",
    image: "image",
    date: "date",
    categoryIds: [],
    newStartTime: "",
    createdBy: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // wordt opgeroepen bij het wijzigen van de invoervelden en werkt door de waarde van het invoerveld bij te werken in de staat.
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);

    if (formData.categoryIds.includes(categoryId)) {
      setFormData({
        ...formData,
        categoryIds: formData.categoryIds.filter((id) => id !== categoryId),
      });

      //wordt opgeroepen wanneer de categoriecheckbox wordt gewijzigd. het voegt de geselecteerde categorie toe aan de staat als
      //sdeze nog niet is geselcteerd, anders verwijderd het de categorie.
    } else {
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, categoryId],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = users.find((user) => user.name === formData.name);
    const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`);

    if (!user) {
      throw new Error(
        "User not Found are you new here, make a userAccount first!"
      );
    }
    const formattedStartDateTime = startDateTime.toISOString();
    const formattedEndDateTime = endDateTime.toISOString();

    setFormData({
      ...formData,
      startTime: formattedStartDateTime,
      endTime: formattedEndDateTime,
      createdBy: user.id,
    });
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startTime: formattedStartDateTime,
          endTime: formattedEndDateTime,
          createdBy: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }
      onClose();
    } catch (error) {
      console.log("Error adding event", error);
    }
  };
  // handleSubmit wordt opgeroepen bij het verzenden van het formulier.
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent size="xl" bgColor={"pink"}>
        <ModalHeader textAlign={"center"}> Add New Event</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel> Title: </FormLabel>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Description:</FormLabel>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="description"
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Location:</FormLabel>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="location"
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Image: </FormLabel>
              <Input
                type="url"
                name="image"
                onChange={handleChange}
                placeholder={"URL"}
                value={formData.image}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Date: </FormLabel>
              <Input
                type="date"
                name="date"
                onChange={handleChange}
                value={formData.date}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Start time: </FormLabel>
              <Input
                type="time"
                name="startTime"
                onChange={handleChange}
                value={formData.startTime}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> End time: </FormLabel>
              <Input
                type="time"
                name="endTime"
                onChange={handleChange}
                value={formData.endTime}
              ></Input>
            </FormControl>
            <FormControl>
              <Stack spacing={1} direction="column">
                <h1> category:</h1>
                <Checkbox
                  value={1}
                  onChange={handleCategoryChange}
                  checked={formData.categoryIds.includes(2)}
                >
                  sports
                </Checkbox>
                <Checkbox
                  value={2}
                  onChange={handleCategoryChange}
                  checked={formData.categoryIds.includes(2)}
                >
                  games
                </Checkbox>
                <Checkbox
                  value={3}
                  onChange={handleCategoryChange}
                  checked={formData.categoryIds.includes(3)}
                >
                  relaxation
                </Checkbox>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel> UserName: </FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="name"
              ></Input>
            </FormControl>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button margin={2} onClick={onClose}>
            Cancel
          </Button>
          <Button margin={2} type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
