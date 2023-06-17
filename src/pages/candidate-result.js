import React from 'react'
import CandidateResult from '../components/candidateResult'
import styles from '../styles/Result.module.css'

const candidateResult = () => {
  return (
    <div className={styles.container}>
        <CandidateResult/>
    </div>
  )
}

export default candidateResult