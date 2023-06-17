import React from 'react'
import styles from '../styles/LearnToVote.module.css'
import FAQs from './FAQs'
const LearnToVote = () => {
    return (
        <div>
            {/* <div className={styles.container} id="LearnToVote">
                <h1>Learn To Vote</h1>
                <hr className={styles.solid}></hr>
                <iframe width="850" height="450" src="https://www.youtube.com/embed/tgbNymZ7vqY"/>
            </div> */}
            <div className={styles.container}>
                <h1>FAQ&#8217;s</h1>
                <hr className={styles.solid}></hr>
                <FAQs />
            </div>
        </div>
    )
}

export default LearnToVote