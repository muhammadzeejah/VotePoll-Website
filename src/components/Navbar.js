import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import styles from '../styles/Home.module.css'
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { isLoggedin } from '../redux/actions';
import Cookies from 'js-cookie';
import MobileNav from './MobileNav'
import Arrow from '@material-ui/icons/ArrowDropDown';

const pages = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'About',
    link: '/about',
  },
  {
    name: 'Result',
    link: '/result',
  },
  // {
  //   name: 'Learn-To-Vote',
  //   link: '/learn-to-vote',
  // },
  {
    name: 'Contact',
    link: '/contact',
  },
];
const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isUserMenu, setUserMenu] = React.useState(false)
  const [isResultMenu, setResultMenu] = React.useState(false)
  const selector = useSelector((state) => state.IsLoggedin)
  const settingMenu = React.useRef()
  const resultMenu = React.useRef()
  const router=useRouter()
  const dispatch = useDispatch()
  const [token,setToken]=React.useState(true)

  React.useEffect(() => {
    setToken(Cookies.get('token') ? true : false)
    document.addEventListener("click", closeSelectBox);
    return () => {
      document.removeEventListener("click", closeSelectBox);
    };
  }, [])

  const closeSelectBox = (event) => {
    if (!settingMenu.current.contains(event.target)) {
      setUserMenu(false);
    }
    if (!resultMenu.current.contains(event.target)) {
      setResultMenu(false);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const onLogout = () => {
    Cookies.remove('token')
    Cookies.remove('cnic')
    setUserMenu(false)
    dispatch(isLoggedin())
    router.push('/')
  }
  const onRouteClick=(route)=>{
    if(route==='/result'){
      setResultMenu(!isResultMenu)
    }
    else{   
      router.push(route) 
    }
  }
  const onCloseResultMenu =(route)=> {
    if(route==='/result'){
      router.push(route)
    }
    else{
      router.push('/candidate-result')
    }
    setResultMenu(false)
  }
  console.log(selector,!token,'login')
  return (
    <AppBar position="fixed" className={styles.navbar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HowToVoteIcon fontSize='large' sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              mt: 0.5,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              flexGrow: 1,
              fontWeight: 900,
              fontSize: '30px',
              letterSpacing: '.2rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <Link href='/' style={{ color: 'white' }}>VotePoll</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, marginLeft: '-10px', marginTop: '5px' }}>
            <MobileNav/>
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href='/' style={{ color: 'white' }}>Vote Poll</Link>
          </Typography>
          {/* Main Menu */}
          <Box ref={resultMenu} sx={{ flexGrow: 0, marginRight: '2rem', paddingLeft: '5rem', display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <>
                <Button
                  onClick={()=>onRouteClick(page.link)}
                  sx={{ my: 2, color: 'white', display: 'flex', letterSpacing: '.2rem', marginLeft: '2rem' }}
                >
                  <p style={{ color: 'white' }}>{page.name}</p>
                  {index===2 && <Arrow/>}
                </Button>
              {index===2 && isResultMenu &&
              <div className={styles.resultMenu}>
                <MenuItem>
                  <Typography textAlign="center" onClick={() => onCloseResultMenu('/result')}>Parties Result</Typography>
                </MenuItem>
              <MenuItem>
                <Typography textAlign="center" onClick={() => onCloseResultMenu('/candidate-result')}>Candidates Result</Typography>
              </MenuItem>
            </div>
            }
            </>
            ))}
          </Box>
          {/* User icon */}
          <Box sx={{ flexGrow: 0, }} ref={settingMenu}>
            {selector && !token ?
              <Link href='/login'>
                <Button
                  sx={{ my: 2, color: 'white', display: 'block', letterSpacing: '.2rem' }}
                >
                  <p style={{ color: 'white' }}>Login</p>
                </Button>
              </Link>
              :
              <IconButton onClick={() => setUserMenu(!isUserMenu)} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/avatar.jpg" />
              </IconButton>
            }
            {isUserMenu &&
              <div className={styles.userMenu}>
                <Link href='/profile'>
                  <MenuItem>
                    <Typography textAlign="center" onClick={()=>setUserMenu(false)}>Profile</Typography>
                  </MenuItem>
                </Link>
                <MenuItem>
                  <Typography textAlign="center" onClick={onLogout}>Logout</Typography>
                </MenuItem>
              </div>}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;