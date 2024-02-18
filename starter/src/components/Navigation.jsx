import React from 'react';
import { Link } from 'react-router-dom';
import {Menu, MenuButton, MenuList, MenuGroup, MenuItem, Button} from "@chakra-ui/react";


export const Navigation = () => {
  return (
    
      <Menu bgColor={"gray.400"}>
        <MenuButton
          as={Button}
          colorScheme="white"
          color={"green.700"}
          height="48px"
          width="200px"
          fontSize={"3xl"}
        >
          Menu
        </MenuButton>
        <MenuList m={2} marginTop={0}>
          <MenuGroup>
            <MenuItem>
              <Link to="/">Events</Link>
            </MenuItem> 
            <MenuItem>
              <Link to="/event/1">Trampoline party</Link>
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>


    // <nav>
    //   <ul>
    //     <li>
    //       <Link to="/">Events</Link>
    //     </li>
    //     <li>
    //       <Link to="/event/1">Event</Link>
    //     </li>
    //   </ul>
    // </nav>
  );
};
