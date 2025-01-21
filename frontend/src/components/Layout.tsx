import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Fade, useMediaQuery } from '@mui/material';
import { Menu, Dashboard, People, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Main = styled('main')<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: 0,
  width: '100vw',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(window.innerWidth > 600);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Clients', icon: <People />, path: '/clients' },
    { text: 'Accounts', icon: <AccountBalance />, path: '/accounts' },
  ];

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile]);

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
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? drawerWidth : 0,
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

      <Fade in={true} timeout={1000}>
        <Main open={open}>
          <DrawerHeader />
          {children}
        </Main>
      </Fade>
    </Box>
  );
};

export default Layout;
