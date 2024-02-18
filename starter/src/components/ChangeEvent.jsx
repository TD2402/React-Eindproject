import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Checkbox,
  Stack,
} from "@chakra-ui/react";

export const ChangeEvent = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  eventData,
  selectedEndTime,
  selectedStartTime,
  handleStartTimeChange,
  handleEndTimeChange,
  handleDateChange,
  selectedDate,
}) => {
  

  console.log(eventData);
  const toast = useToast();

  const handleFormSubmit = async () => {
    try {
      await handleSubmit();
      toast({
        title: "Event succesfully updated",
        position: "top-left",
        status: "success",
        duration: 200000,
        isclosable: true,
      });
    } catch (error) {
      console.error("Error updating event", error);
      toast({
        positon: "top-left",
        title: "Error updating event",
        description: "Please try later on! ",
        status: "error",
        duration: 2000000,
        isClosable: true,
      });
    }
  };
 const handleCategoryChange = (categoryId) => {
   let updatedCategoryIds;

   if (formData.categoryIds.includes(categoryId)) {
     // Als de categorie al aanwezig is, verwijder deze
     updatedCategoryIds = formData.categoryIds.filter(
       (id) => id !== categoryId
     );
   } else {
     // Als de categorie niet aanwezig is, voeg deze toe
     updatedCategoryIds = [...formData.categoryIds, categoryId];
   }

   handleChange({
     target: {
       name: "categoryIds",
       value: updatedCategoryIds,
     },
   });
 };


  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Change evenement </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel> Change Title: </FormLabel>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Change Description: </FormLabel>
              <Input
                type="text"
                name="description"
                value={formData.description || eventData.description}
                onChange={handleChange}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Change Location: </FormLabel>
              <Input
                type="text"
                name="location"
                value={formData.location || eventData.location}
                onChange={handleChange}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Change image: </FormLabel>
              <Input
                type="text"
                name="image"
                value={formData.image || eventData.image}
                onChange={handleChange}
              ></Input>
              <FormControl>
                <FormLabel> Change date </FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={
                    selectedDate ||
                    eventData.startTime.slice(0, 10) ||
                    formData.starTime.slice(0, 10)
                  }
                  onChange={(e) => {
                    handleDateChange(e);
                    handleChange(e); // Voer handleChange uit om formData bij te werken
                  }}
                ></Input>
              </FormControl>
            </FormControl>
            <FormControl>
              <FormLabel> Change start Time: </FormLabel>
              <Input
                type="time"
                name="startTime"
                value={
                  selectedStartTime ||
                  eventData.startTime.slice(11, 16) ||
                  formData.startTime.slice(11, 16)
                }
                onChange={(e) => {
                  handleStartTimeChange(e);
                  handleChange(e); // Voer handleChange uit om formData bij te werken
                }}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel> Change end Time: </FormLabel>
              <Input
                type="time"
                name="endTime"
                value={
                  selectedEndTime ||
                  eventData.endTime.slice(11, 16) ||
                  formData.endTime.slice(11, 16)
                }
                onChange={(e) => {
                  handleChange(e);
                  handleEndTimeChange(e);
                }}
              ></Input>
            </FormControl>
            <FormControl>
              <Stack spacing={1} direction="column">
                <h1> category:</h1>
                <Checkbox
                  value={1}
                  checked={formData.categoryIds.includes(1)}
                  onChange={() => handleCategoryChange(1)}
                >
                  sports
                </Checkbox>
                <Checkbox
                  value={2}
                  checked={formData.categoryIds.includes(2)}
                  onChange={() => handleCategoryChange(2)}
                >
                  games
                </Checkbox>
                <Checkbox
                  value={3}
                  checked={formData.categoryIds.includes(3)}
                  onChange={() => handleCategoryChange(3)}
                >
                  relaxation
                </Checkbox>
              </Stack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="pink" onClick={handleFormSubmit}>
              Save
            </Button>
            <Button colorScheme="pink" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
