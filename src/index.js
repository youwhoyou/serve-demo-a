import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme/themeIndex";
import { MoralisProvider } from "react-moralis";
import Moralis from "moralis";
import "focus-visible/dist/focus-visible";
import "@fontsource/montserrat-alternates/500.css";
import "@fontsource/montserrat-alternates/300.css";
import "@fontsource/inter/300.css";
// import "@fontsource/montserrat-alternates";
// import "@fontsource/inter";

Moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID_RINKEBY);
Moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL_RINKEBY;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_APPLICATION_ID_RINKEBY}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL_RINKEBY}
    >
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
