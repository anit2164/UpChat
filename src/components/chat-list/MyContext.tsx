// MyContext.js
import { createContext } from "react";

const defaultValue = {
  message: "Default message",
};

const MyContext: any = createContext(defaultValue);

export default MyContext;
