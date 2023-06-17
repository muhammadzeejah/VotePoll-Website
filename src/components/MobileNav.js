import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import LearnIcon from '@material-ui/icons/SearchOutlined';
import ContactIcon from '@material-ui/icons/ContactMailOutlined';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });
  const pages = [
    {
      name: 'Home',
      link: '/',
      icon: <HomeIcon />
    },
    {
      name: 'About',
      link: '/about',
      icon: <InfoIcon />
    },
    {
      name: 'Result',
      link: '/result',
      icon: <LearnIcon />
    },
    // {
    //   name: 'Learn-To-Vote',
    //   link: '/learn-to-vote',
    // },
    {
      name: 'Contact',
      link: '/contact',
      icon: <ContactIcon />
    },
  ];

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
        <div onClick={toggleDrawer(anchor, false)} style={{position: 'absolute', right: '10px', top: '5px', fontSize: '20px', cursor: 'pointer'}}>&#x2715;</div>
      <List sx={{marginTop: '2rem'}}>
        {pages.map((text, index) => (
            <Link key={text} href={text.link} style={{color: 'black'}}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text.icon}
              </ListItemIcon>
              <ListItemText style={{marginLeft: '-15px'}} primary={text.name} />
            </ListItemButton>
          </ListItem>
            </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
          <Button style={{color: 'white'}} onClick={toggleDrawer('left', true)}><MenuIcon /></Button>
          <Drawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
    </div>
  );
}