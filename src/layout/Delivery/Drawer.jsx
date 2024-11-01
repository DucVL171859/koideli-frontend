import React from "react";
import { Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";

const DrawerStyled = styled(Drawer)(() => ({
  "& .MuiDrawer-paper": {
    width: 200,
    top: "69px",
  },
}));

const DrawerNav = [
  { title: "Delivery List", route: "/delivery/delivery-update" },
  { title: "Delivery Update Order", route: "/delivery/delivery-update-order" },
  { title: "Blogs", route: "/delivery/blogs" },
  { title: "Tasks", route: "/delivery/tasks" },
  { title: "Information", route: "/delivery/information" },
];

const DrawerComponent = ({ open, onClose }) => {
  return (
    <DrawerStyled variant="temporary" open={open} onClose={onClose}>
      <List>
        {DrawerNav.map(({ title, route }) => (
          <ListItem key={route}>
            <Button component="a" href={route} fullWidth>
              <ListItemText primary={title} sx={{ color: "#000" }} />
            </Button>
          </ListItem>
        ))}
      </List>
    </DrawerStyled>
  );
};

export default DrawerComponent;
