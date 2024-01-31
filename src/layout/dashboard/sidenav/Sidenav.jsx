import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import './sidenav.scss';
const drawerWidth = 240;


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#071C0B", // Set the background color
      color: "#fff", // Set the text color
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: "#071C0B", // Set the background color
      color: "#fff", // Set the text color
    },
  }),
}));
export default function Sidenav() {
  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();

  //context
  const { logoutUser, user } = React.useContext(AuthContext);

  const { data } = useGetProfileByEmailQuery(user.email);

  const registerUser = data?.data;

  //Logout
  const handleLogout = () => {
    logoutUser()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            sx={{
              color: "#37F42E",
            }}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        {registerUser?.role === "admin" ||
        registerUser?.role === "super admin" ? (
          <List sx={{ p: 0 }}>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("profile")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Profile"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("calender")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <CalendarMonthOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Calender"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("send-email")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <MarkEmailReadOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Send Email"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("all-employee")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <GroupsOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"All Employee"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("support-tickets-management")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <SupportAgentOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Tickets Management"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("leave-management")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <DirectionsRunOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Leave Management"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          <List sx={{ p: 0 }}>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("profile")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Profile"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("attendence")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <ChecklistOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Attendence"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("work-status")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <ApartmentOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Work Status"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("support-tickets")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <SupportAgentOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Support Tickets"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("leave-status")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <DirectionsRunOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Leave Status"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate("calender")}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#37F42E",
                  }}
                >
                  <CalendarMonthOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Calender"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleLogout()}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "#37F42E",
                }}
              >
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        {/* <div className="dashboard-header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="profile">
            
            <h6>{registerUser?.name}</h6>
            <img src={registerUser?.img} alt="user" />
          </div>
        </div> */}
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
