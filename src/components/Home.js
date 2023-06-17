import { Button } from '@mui/material'
import React from 'react'
import VoteIcon from '@material-ui/icons/HowToVote';
import VideoIcon from '@material-ui/icons/ContactMail';
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router';

const Home = () => {
    const router = useRouter()
    return (
        <div>
            {/* Header */}
            <div className={styles.container} id="home">
                <div>
                    <h1 className={styles.heading}> Welcome to
                        <strong className={styles.websiteName}>VotePoll</strong>                      
                    </h1>                    
                    <div className={styles.description}>
                        <p>An online voting system that combines advanced security measures, blockchain technology, and user-friendly interfaces to provide secure, transparent, and efficient voting experiences.</p>
                    </div>
                    <div className={styles.button}>
                        <Button onClick={()=>router.push('/contact')} variant="outlined" style={{borderColor: '#f15540', color: '#f15540'}} startIcon={<VideoIcon />} sx={{ mr: 1 }}> Get In Touch</Button>
                       <Link href='/elections'><Button variant="contained" style={{backgroundColor: '#f15540', }} startIcon={<VoteIcon />}> Vote Now</Button></Link> 
                    </div>
                </div>
                <div className={styles.headerImg}>
                    <img src='/headerImage.png' alt='header-img' />
                </div>
            </div>                    
        </div>
    )
}

export default Home