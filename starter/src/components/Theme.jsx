import { extendTheme } from "@chakra-ui/react"
// 2. Call `extendTheme` and pass your custom values
export const Theme = extendTheme({
  colors: {
    brand: {
      100: "pink",
      // ...
      900: "#1a202c",
    },
  },
})



