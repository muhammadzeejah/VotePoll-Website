import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/Contact.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { GetEections, GetElectionAppearance } from '../redux/actions';
import Cookies from 'js-cookie';

export default function Elections() {
    const [election, setElection] = React.useState([])
    const [isLocalBody, setIsLocalBody] = React.useState(true)
    const [loader, setLoader] = React.useState(false);
    const router = useRouter()
    const dispatch = useDispatch()
    React.useEffect(() => {
        if (!Cookies.get('token')) {
            router.push('/login')
        }
        setLoader(true)
        dispatch(GetEections(Cookies.get('cnic')))
            .then(response => {
                setLoader(false)
                dispatch(GetElectionAppearance())
                    .then(response1 => {
                        console.log(response1.data.voter.electionAppearence)
                        if (new Date() > new Date(response.data.Elections.electionObj.GeneralElections.startTime) && new Date() < new Date(response.data.Elections.electionObj.GeneralElections.endTime) && !response1.data.voter.electionAppearence.generalElections) {
                            setElection(prev => {
                                return [...prev, 'National Assembly']
                            })
                        }
                        else if (new Date() < new Date(response.data.Elections.electionObj.GeneralElections.startTime)) {
                            if (response.data.Elections.electionObj.GeneralElections.startTime) {
                                setElection(prev => {
                                    return [...prev, `National Assembly Elections will start at ${new Date(response.data.Elections.electionObj.GeneralElections.startTime)}`]
                                })
                            }
                        }
                        if (new Date() > new Date(response.data.Elections.electionObj.ProvincialElections[0].startTime) && new Date() < new Date(response.data.Elections.electionObj.ProvincialElections[0].endTime) && !response1.data.voter.electionAppearence.provincialElections) {
                            setElection(prev => {
                                return [...prev, 'Provincial Assembly']
                            })
                        }
                        else if (new Date() < new Date(response.data.Elections.electionObj.ProvincialElections[0].startTime)) {
                            if (response.data.Elections.electionObj.ProvincialElections[0].startTime) {
                                setElection(prev => {
                                    return [...prev, `Provincial Assembly Elections will start at ${new Date(response.data.Elections.electionObj.ProvincialElections[0].startTime)}`]
                                })
                            }
                        }
                        if (new Date() < new Date(response.data.Elections.electionObj.LocalBodyElections.startTime) && new Date() < new Date(response.data.Elections.electionObj.LocalBodyElections.endTime) && !response1.data.voter.electionAppearence.localBodyElections) {
                            setElection(prev => {
                                return [...prev, 'Local Body']
                            })
                        } else if (new Date() < new Date(response.data.Elections.electionObj.LocalBodyElections.startTime)) {
                            if (response.data.Elections.electionObj.LocalBodyElections.startTime) {
                                setElection(prev => {
                                    return [...prev, `Local Body Elections will start at ${new Date(response.data.Elections.electionObj.LocalBodyElections.startTime)}`]
                                })
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(error => {
                console.log(error)
                setLoader(false)
            })
    }, [])
    const onSelectElection = (election) => {
        if (election === 'Local Body') {
            setIsLocalBody(!isLocalBody)
        } else {
            router.push({
                pathname: '/vote',
                query: { election: election },
            }, 'vote')
        }
    }
    const onSelectLocalBody = (localBody) => {
        router.push({
            pathname: '/vote',
            query: { election: 'Local Body', localBody: localBody }
        }, 'vote')
    }
    return (
        <div className={styles.container}>
            <h1>Select Election</h1>
            <hr className={styles.solid}></hr>
            {loader ? <div className={styles.loader}><span></span></div>
                :
                isLocalBody ?
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        {election.length ?
                            election.map(ele => (
                                <Box key={ele} sx={{ maxWidth: 300, minWidth: 200, cursor: 'pointer' }} onClick={() => onSelectElection(ele)}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                Election
                                            </Typography>
                                            {ele === 'National Assembly' || ele === 'Provincial Assembly' || ele === 'Local Body' ?
                                                <Typography variant="h5" component="div">
                                                    {ele}
                                                </Typography>
                                                :
                                                <Typography sx={{ fontSize: 14 }}>
                                                    {ele}
                                                </Typography>
                                            }
                                        </CardContent>
                                        {/* <CardActions>
                                    <Button size="small">Learn More</Button>
                                </CardActions> */}
                                    </Card>
                                </Box>

                            )) :
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '-10px' }} color="text.secondary" component="div">
                                        No Election Found
                                    </Typography>
                                </CardContent>
                            </Card>}
                    </Box>
                    :
                    <>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box sx={{ maxWidth: 300, minWidth: 200, cursor: 'pointer' }} onClick={() => onSelectLocalBody('Chairman')}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            Election
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            Chairman
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box sx={{ maxWidth: 300, minWidth: 200, cursor: 'pointer' }} onClick={() => onSelectLocalBody('Councellor')}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            Election
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            Councellor
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </>

            }
        </div>
    );
}