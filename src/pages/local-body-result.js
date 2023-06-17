import React from 'react'
import styles from '../styles/Result.module.css'
import LocalBodyResult from '../components/LocalBodyResult'

const LocalBody = () => {
  return (
    <div className={styles.container}>
        <LocalBodyResult/>
    </div>
  )
}

export default LocalBody