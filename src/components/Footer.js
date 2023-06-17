import React from 'react'
import { TextField, Button } from '@mui/material'
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedIn from '@material-ui/icons/LinkedIn';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import LaunchIcon from '@material-ui/icons/Launch';
import Typography from '@mui/material/Typography';
import styles from '../styles/Footer.module.css'
import Link from 'next/link';

const Footer = () => {
    function year() {
        return new Date().getFullYear()
    }
    return (
        <div>
            <footer class={styles.footerDistributed}>
                <div class={styles.footerLeft}>
                    <div>
                        <HowToVoteIcon style={{ color: 'white' }} fontSize='large' sx={{ mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                fontFamily: 'monospace',
                                fontWeight: 900,
                                fontSize: '30px',
                                letterSpacing: '.2rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            VotePoll
                        </Typography>
                        
                        <p class={styles.footerCompanyName}>© copyright {year()} | All rights reserved</p>
                    </div>
                    <div style={{marginTop: '8px'}}>
                    <div class={styles.footerLinks}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px'}}> <LaunchIcon/> <Link href='/'>Home &nbsp;</Link></div>
                           <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px'}} >  <LaunchIcon/> <Link href='/about'> About &nbsp;</Link></div>
                           <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px'}} >  <LaunchIcon/> <Link href="/learn-to-vote">Learn To Vote &nbsp;</Link></div>
                           <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px'}} >  <LaunchIcon/> <Link href="/contact"> Contact</Link></div>
                        </div>
                        <div class={styles.footerIcons}>
                        <a href="https://www.facebook.com/PakistanECP/" target='blank'><FacebookIcon /></a>
                        <a href="#"><InstagramIcon /></a>
                        <a href="#"><LinkedIn /></a>
                        <a href="https://twitter.com/ECP_Pakistan" target='blank'><TwitterIcon /></a>
                        </div>
                        
                    </div>
                </div>
                {/* <div class={styles.footerRight}>
                    <form action="#" method="post">
                    <TextField 
                    InputLabelProps={{
                        style: { color: '#fff'}, 
                     }}
                    sx={{ my: 1, color: 'white'}} id="filled-basic" label="Search" variant="filled" />                      
                    <Button variant="outlined" style={{borderColor: '#ffff'}} sx={{mt: 1, ml: 1}}>Search</Button>
                    </form>
                </div> */}
            </footer>
        </div>
    )
}

export default Footer