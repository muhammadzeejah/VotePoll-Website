import { Button } from '@mui/material'
import Link from 'next/link'
import CheckIcon from '@material-ui/icons/Check';
import styles from '../styles/Contact.module.css'
import React from 'react'

const voteConfirm = () => {
    return (
        <div>
            <div className={styles.check}>
                <CheckIcon style={{ fontSize: '4rem', color: '#ffff' }} />
            </div>
            <h1 style={{ margin: '1rem auto' }}>Thanks for voting!</h1>
            <p style={{ marginBottom: '1rem' }}>Your vote has been submitted</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <Link href='/elections'>
                    <Button variant="outlined" style={{ borderColor: '#f15540', color: '#f15540' }}>Goto Elections</Button>
                </Link>
                <Link href='/'>
                    <Button variant="contained" style={{ backgroundColor: '#f15540', }}> Return to Home</Button>
                </Link>
            </div>
        </div>
    )
}

export default voteConfirm