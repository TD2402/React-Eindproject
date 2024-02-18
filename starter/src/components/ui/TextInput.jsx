import { Input } from "@chakra-ui/react";

export const TextInput = ({ changeFn}) => {
  return (
    <>
      <Input variant="flushed" onChange={changeFn} ></Input>
    </>
  );
};
