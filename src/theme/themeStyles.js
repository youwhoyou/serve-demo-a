const styles = {
  global: (props) => ({
    // styles for the `body`
    "html, body": {
      background: props.colorMode === "dark" ? "gray.900" : "gray.50",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
      overflowX: "hidden",
    },
    a: {
      // color: props.colorMode === "dark" ? "teal.300" : "teal.500",
    },
    // styles for the `a`
    // a: {
    //     color: "teal.500",
    //     _hover: {
    //         textDecoration: "underline",
    //     },
    // },
  }),
};

export default styles;
