import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    listRoot: {
      width: "80%",
      margin: "10px",
      borderRadius: "10px",
      color: "white",
      "&:hover": {
        backgroundColor: "white",
        color: "#a42167",
        "& $listItemIcon": {
          color: "#a42167",
        },
      },
      "&$selected": {
        backgroundColor: "white",
        color: "#a42167",
        "&:hover": {
          backgroundColor: "white",
        },
      },
    },
    hover: {},
    selected: {},
    listItemIconSelected: {
      color: "#a42167",
    },
    listItemIcon: {
      color: "white",
    },
    listItemText: {
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    appBar: {
      backgroundColor: "white",
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      margin: "10px 20px",
      color: "white",
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      backgroundColor: "#a42167",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      backgroundColor: "#a42167",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    // listItemSelected: {
    //   color: 'red',
    // },

    // TPC Heading
    tpcHeading: {
      color: "white",
      textTransform: "uppercase",
      fontWeight: "bold",
    },

    // Project Selection
    projectSelection: {
      color: "white",
    },
    icon: {
      color: "white",
    },
  })
);
