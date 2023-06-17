import React from 'react'
import styles from '../styles/Result.module.css'
import NationalResult from '../components/NationalResult'

const nationalParties = () => {
  return (
    <div className={styles.container}>
        <NationalResult/>
    </div>
  )
}

export default nationalParties