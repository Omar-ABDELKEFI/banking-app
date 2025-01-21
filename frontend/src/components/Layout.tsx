import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, Dashboard, People, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const drawerWidth = 240;

const Main = styled('main')<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? drawerWidth : 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Clients', icon: <People />, path: '/clients' },
    { text: 'Accounts', icon: <AccountBalance />, path: '/accounts' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton 
            color="inherit" 
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Banking Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main open={open}>
        <Toolbar />
        {children}
      </Main>
    </Box>
  );
};

export default Layout;
