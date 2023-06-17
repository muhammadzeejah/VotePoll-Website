import React, { useEffect, useState } from 'react'
import styles from '../styles/Result.module.css'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { GetEections } from '../redux/actions'
import Cookies from 'js-cookie';

const Result = () => {
  const router = useRouter()
  const [elections, setElections] = useState([])
  const temp=[]
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(GetEections(Cookies.get('cnic'))).then(response => {
      if (new Date() > new Date(response.data.Elections.electionObj.GeneralElections.endTime)) {
        console.log('GeneralElections')
        temp.push('National Parties Result')
        setElections(prev => {
          return [...prev, 'National Parties Result']
        })
      }
      if (new Date() > new Date(response.data.Elections.electionObj.ProvincialElections[0].endTime)) {
        console.log('pro')
        temp.push('Provincial Parties Result')
        setElections(prev => {
          return [...prev, 'Provincial Parties Result']
        })
      }
      if (new Date() > new Date(response.data.Elections.electionObj.LocalBodyElections.endTime)) {
        console.log('Local')
        temp.push('Local Body Parties Result')
        setElections(prev => {
          return [...prev, 'Local Body Parties Result']
        })
      }
    })
      .catch(error => {
        console.log(error)
      })
      console.log(temp, 'temp')
      console.log(elections, 'elections')
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Parties Result</h1>
      <hr className={styles.solid}></hr>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {elections && elections.map((election, index) => {
          return <Box key={index} sx={{ maxWidth: 300, cursor: 'pointer' }} onClick={() => router.push(election.route)}>
            <Card variant="outlined">
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Election
                </Typography>
                <Typography variant="h5" component="div">
                  {election}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        })}
      </Box>
    </div >
  )
}

export default Result