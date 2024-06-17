import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormDialog from '../components/AddDeckModal';
import { Card, CardMedia } from '@mui/material';
import { getUserData } from './utils'

function Dashboard ({ tokenD, setTokenFunctionD }) {
  if (tokenD === null) {
    return <Navigate to='/login' />;
  }

  const [store, setStore] = React.useState({});

  // state of new deck modal
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  // state of drawer
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // fetch user data when dashboard is opened
  React.useEffect(() => {
    getUserData(tokenD, setStore);
  }, []);

  // link to Edit page
  const navigate = useNavigate();
  const handleClick = (key, data) => {
    navigate(`/edit/${key}-1`, { state: { data } });
  }

  // create cards
  const childbox = Object.keys(store).map(key => (
    <Box key={key} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', px: '15px', py: '15px' }} onClick={() => handleClick(key, store)}>
      {/* Render the data associated with the current key */}
      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <b>{store[key].title}</b>
      </Typography>
      <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {store[key].description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Slides: {store[key].slideNum}
        </Typography>
        <Card sx={{ width: '50px', height: '50px' }}>
          <CardMedia component="img" src={store[key].thumbnail ? store[key].thumbnail : require('./defaultThumbnail.png')} alt="thumbnail"/>
        </Card>
      </Box>
    </Box>
  ));

  // log out
  const handleLogout = async () => {
    await axios.post('http://localhost:5005/admin/auth/logout', {}, {
      headers: { Authorization: tokenD }
    })
    setTokenFunctionD(null);
  }

  // define drawer
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Presto
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleClickOpen}>
            <ListItemText primary='New Presentation' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleLogout}>
            <ListItemText primary='Logout' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Presto
          </Typography>
          <Typography variant="h6" component="div"
            sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}
          >
            Presto
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }} >
            {/* FormDialog is the modal for creating new deck */}
            <FormDialog token={tokenD} setStore={setStore} store={store} open={open} setOpen={setOpen}/>
            <Button sx={{ color: '#fff', marginLeft: 2, marginRight: 0 }}
              onClick={handleClickOpen}>
              New Presentation
            </Button>
            <Button sx={{ color: '#fff', marginLeft: 2, marginRight: 0 }}
              onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 200 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {/* main box below contains cards  */}
      <Box
        component="main"
        sx={{
          marginTop: '80px',
          width: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          '@media (max-width: 725px)': { // Adjustments for smaller screens
            justifyContent: 'center',
          },
          '& > *': { // Apply styles to all direct children
            width: '300px',
            height: '150px',
            maxWidth: '400px',
            maxHeight: '200px',
            marginBottom: '16px',
            border: '0px solid grey',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            '@media (max-width: 725px)': { // Adjustments for smaller screens
              width: 'calc(100vw - 96px)',
              height: 'calc(50vw - 48px)',
            },
          },
          padding: '16px',
        }}
      >
        {childbox}
      </Box>
    </Box>
  );
}

export default Dashboard;
