import React from 'react'
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import Twitter from '@material-ui/icons/Twitter';
import LinkedIn from '@material-ui/icons/LinkedIn';
import styles from '../styles/About.module.css'

const About = () => {
    return (
        <div>
            <div className={styles.container} id="about">
                <div className={styles.box}>
                    <img className={styles.img1} src="/about.jpg" alt="about" />
                </div>
                <div className={styles.about}>
                    <h2>About</h2>
                    <hr className={styles.hr}></hr>
                    <p>This platform provides the facility for users to conduct voting activity digitially thorugh Blockchain.
                        This will resolve the problem of mishap or injustice in traditional voting system.
                        Blockchain technology can be used in voting system to have a fair election and reduce injustice.
                        This platform offers an effective solution to secure the democratic rights of the people.
                    </p>
                    <h3 style={{ fontSize: '22px', marginTop: '1rem' }}>Follow</h3>
                    <div className={styles.icons}>
                        <FacebookIcon />
                        <span className={styles.icon1}>
                            <InstagramIcon />
                        </span>
                        <LinkedIn />
                        <span className={styles.icon1}>
                            <Twitter />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About