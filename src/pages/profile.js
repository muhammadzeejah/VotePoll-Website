import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/Profile.module.css'
import { GetCitizen } from '../redux/actions';
import Cookies from 'js-cookie';

const Profile = () => {
    const [learnMore, setLearnMore] = useState(false)
    const [user, setUser] = useState()
    const selector = useSelector((state) => state.GetCitizen)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(GetCitizen(Cookies.get('cnic')))
            .then(response => {
                console.log(response.data)
                setUser(response.data.Citizen.citizen)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    // useEffect(() => {
    //     console.log(selector.Citizen)
    //     if(selector.Citizen){
    //     setUser(selector.Citizen.citizen)
    // }
    //   }, [selector])
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>User Info</h1>
            <hr className={styles.solid}></hr>
            <Box sx={{ width: { xs: 400, sm: 520 } }}>
                {user &&
                    <Card variant="outlined">
                        {/* <div className={styles.userImg}>
                            <img src='/avatar.jpg' alt='' width={90} />
                        </div> */}
                        <CardContent >
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 7 } }}>
                                <div className={styles.info}>
                                    <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                        Name:
                                    </Typography>
                                    <Typography sx={{ mt: 1, textAlign: 'end' }} color="text.secondary" gutterBottom>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                </div>
                                <div className={styles.info}>
                                    <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                        Father Name:
                                    </Typography>
                                    <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                        {user.fatherName}
                                    </Typography>
                                </div>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 7 } }}>
                                <div className={styles.info}>
                                    <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                        CNIC:
                                    </Typography>
                                    <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                        {user.cnic}
                                    </Typography>
                                </div>
                                <div className={styles.info}>
                                    <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                        Gender:
                                    </Typography>
                                    <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                        {user.gender}
                                    </Typography>
                                </div>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 7 } }}>
                                <div className={styles.info}>
                                    <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                        Country:
                                    </Typography>
                                    <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                        {user.country}
                                    </Typography>
                                </div>
                                <div className={styles.info}>
                                    <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                        Province:
                                    </Typography>
                                    <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                        {user.province}
                                    </Typography>
                                </div>
                            </Box>
                            {learnMore &&
                                <>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 7 } }}>
                                        <div className={styles.info}>
                                            <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                                Division:
                                            </Typography>
                                            <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                                {user.division}
                                            </Typography>
                                        </div>
                                        <div className={styles.info}>
                                            <Typography variant="h6" component="div">
                                                District:
                                            </Typography>
                                            <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                                {user.division}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 7 } }}>
                                        <div className={styles.info}>
                                            <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                                Union Council:
                                            </Typography>
                                            <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                                {user.unionCouncil}
                                            </Typography>
                                        </div>
                                        <div className={styles.info}>
                                            <Typography variant="h6" component="div">
                                                Date of Birth:
                                            </Typography>
                                            <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                                {user.dob.split('T')[0]}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 7 } }}>
                                        <div className={styles.info}>
                                            <Typography sx={{ fontSize: 19 }} variant="h2" component="div">
                                                Cell #:
                                            </Typography>
                                            <Typography sx={{ mt: 1 }} color="text.secondary" gutterBottom>
                                                {user.cell}
                                            </Typography>
                                        </div>
                                    </Box>
                                </>
                            }
                        </CardContent>
                        <CardActions sx={{ mt: '-10px' }}>
                            <Button onClick={() => setLearnMore(!learnMore)} size="small">Read {learnMore ? 'Less' : 'More'}</Button>
                        </CardActions>
                    </Card>
                }
            </Box>
        </div>
    )
}

export default Profile