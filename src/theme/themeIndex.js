import { extendTheme } from "@chakra-ui/react";
import fonts from "./themeFonts";
import config from "./themeConfig";
import styles from "./themeStyles";
import colors from "./themeColors";
import radii from "./themeRadii";
import { Container, ModalContent, Modal } from "./themeComponents";

const theme = extendTheme({
    config,
    styles,
    colors,
    fonts,
    radii,
    components: {
        Container,
        ModalContent,
        Modal,
    },
},
);

export default theme;