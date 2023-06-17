import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/Contact.module.css'
import Image from 'next/image';
import Modal from '@mui/material/Modal';
import CheckIcon from '@material-ui/icons/Check';
import Link from 'next/link';
import { GetCandidate, GetCitizen, GetElectionAppearance, PostElectionAppearance } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { ethers } from "ethers";
import abi from '../contract/contract'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
};

export default function Vote() {
    const [confirm, setConfirm] = React.useState(true);
    const [candidate, setCandidate] = useState()
    const [candidateInfo, setCandidteInfo] = useState()
    const [candidatedExisted, setCandidateExisted] = useState(0)
    const [candidateName, setCandidteName] = useState({ name: '', id: '' })
    const [loader, setLoader] = React.useState(false)
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const handleClose2 = () => setOpen2(false);
    const dipatch = useDispatch()
    const router = useRouter()
    const handleClose1 = () => setOpen1(false)
    const dispatch = useDispatch()
    const [userUc, setUserUC] = useState()
    const [halka, setHalka] = useState()
    const [blockchainCand, setBlockchainCand] = useState()
    const [candidateArr, setcandidateArr] = useState([])
    const handleOpen1 = (name, halka) => {
        setOpen1(true)
        setCandidteName({ name: name, halka: halka })
    }
    const handleOpen2 = (candidate) => {
        setCandidteInfo(candidate)
        setOpen2(true)
    }
    React.useEffect(() => {
        if (!Cookies.get('token')) {
            router.push('/login')
        }
        dispatch(GetCitizen(Cookies.get('cnic'))).then(response => {
            setUserUC(response.data.Citizen.citizen.unionCouncil)
        })
        .catch(error=>{
            console.log(error)
        })
        dispatch(GetElectionAppearance())
            .then(response1 => {
                let national, provincial, local
                console.log(response1.data.voter.electionAppearence)
                if(response1.data.voter.electionAppearence.generalElections===true){
                    national='National Assembly'
                }
                if(response1.data.voter.electionAppearence.provincialElections===true){
                    provincial='Provincial Assembly'
                }
                if(response1.data.voter.electionAppearence.localBodyElections===true){
                    local='Local Body Assembly'
                }
                if(national === router.query.election || provincial === router.query.election || local === router.query.election){
                    router.push('/elections')
                }

            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    React.useEffect(() => {
        let type
        if (router.query.election === 'National Assembly') {
            type = 'generalCandidates'
        }
        else if (router.query.election === 'Provincial Assembly') {
            type = 'provisionalCandidates'
        }
        else if (router.query.election === 'Local Body') {
            type = 'localCandidates'
        }
        setLoader(true)
        dipatch(GetCandidate(type, Cookies.get('cnic')))
            .then(response => {
                setLoader(false)
                const tempArr = []
                if (router.query.election === 'Local Body') {
                    for (let i = 0; i < response.data.Candidate.length; i++) {
                        for (let j = 0; j < response.data.Candidate[i].consituencies.length; j++) {
                            if (response.data.Candidate[i].consituencies[j].seatType === router.query.localBody) {
                                tempArr.push(response.data.Candidate[i])
                            }
                        }
                    }
                    setCandidate(tempArr)
                } else {
                    setCandidate(response.data.Candidate)
                }

            })
            .catch(err => {
                setLoader(false)
                console.log(err)
            })
    }, [router.query])
    const [state, setState] = React.useState({
        provider: null,
        signer: null,
        contract: null,
    });
    const [account, setAccount] = React.useState("None");
    React.useEffect(() => {
        const connectWallet = async () => {
            const contractAddress = "0x8D660640933f573554f24651e812f1B02675BAfb";
            const contractABI = abi.abi;
            try {
                const { ethereum } = window;

                if (ethereum) {
                    const account = await ethereum.request({
                        method: "eth_requestAccounts",
                    });

                    window.ethereum.on("chainChanged", () => {
                        window.location.reload();
                    });

                    window.ethereum.on("accountsChanged", () => {
                        window.location.reload();
                    });

                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(
                        contractAddress,
                        contractABI,
                        signer
                    );
                    setAccount(account);
                    setState({ provider, signer, contract });
                } else {
                    alert("Please install metamask");
                }
            } catch (error) {
                console.log(error);
            }
        };
        connectWallet();
        console.log(state, 'contract')
    }, [])
    React.useEffect(() => {
        candidateCount()
        result()
    }, [state])

    const candidateCount = async () => {
        if (state.contract) {
            await state.contract.candidateCount()
                .then(response => {
                    console.log(Number(ethers.utils.formatEther(response)).toString().split('e')[0], 'cc')
                    setCandidateExisted(Number(ethers.utils.formatEther(response)).toString().split('e')[0])
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const result = async () => {
        if (state.contract) {
            await state.contract.eachCandidateVote()
                .then(response => {
                    console.log(response, 'resultt')
                    setBlockchainCand(response)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    const onConfirm = async () => {
        const data = {
            electionAppearence: {
                generalElections: router.query.election === 'National Assembly',
                provincialElections: router.query.election === 'Provincial Assembly',
                localBodyElections: router.query.election === 'Local Body'
            }
        }
        let index
        if (state.contract) {
            await state.contract.eachCandidateVote()
                .then(response => {
                    console.log(response, 'resultt')
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].name === candidateName.name) {
                            index = i
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        console.log(index, 'index')
        await state.contract.castVote(index)
            .then(response1 => {
                console.log(response1)
                setConfirm(false)
                dispatch(PostElectionAppearance(data))
                    .then(response2 => {
                        console.log(response2)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className={styles.container}>
            {confirm ? <>
                <h1>Select Candidate To Vote</h1>
                <hr className={styles.solid}></hr>
                {loader ? <div className={styles.loader}><span></span></div>
                :
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    {candidate ?
                        candidate.map((item, index) => (
                            <Box key={index} sx={{ minWidth: 275, cursor: 'pointer' }}>
                                <Card variant="outlined">
                                    <CardContent sx={{ cursor: 'pointer' }} onClick={() => handleOpen1(`${item.citizen.firstName}${item.citizen.lastName}`, item.consituencies[0].halka)}>
                                        <img src={`http://localhost:3000/images/admin/Party/${item.party.logo}`} width={90} height={90} alt='' style={{ borderRadius: '100%' }} />
                                        <Typography variant="h5" component="div">
                                            {item.party.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {item.citizen.firstName} {item.citizen.lastName}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleOpen2(item)} size="small">Learn About Candidate</Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        ))
                        :
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '-10px' }} color="text.secondary" component="div">
                                    No Candidate Found
                                </Typography>
                            </CardContent>
                        </Card>
                    }
                </Box>
}
                <Modal
                    open={open1}
                    onClose={handleClose1}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography id="modal-modal-description">
                                Are you sure want to vote for {candidateName.name}?
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button onClick={handleClose1} variant="outlined">Cancel</Button>
                                <Button variant="contained" onClick={onConfirm}>Confirm</Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
                {candidateInfo &&
                    <Modal
                        open={open2}
                        onClose={handleClose2}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: 2 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <img src={`http://localhost:3000/images/web/Citizen/${candidateInfo.citizen.photo}`} width={90} height={90} alt='' style={{ borderRadius: '100%' }} />
                                </div>
                                <Typography id="modal-modal-description">
                                    <b>Name: </b>{candidateInfo.citizen.firstName} {candidateInfo.citizen.lastName}
                                </Typography>
                                <Typography id="modal-modal-description">
                                    <b>Party Name: </b>{candidateInfo.party.name}
                                </Typography>
                                <Typography id="modal-modal-description">
                                    <b>Assets: </b>{candidateInfo.assets}
                                </Typography>
                                <Typography id="modal-modal-description">
                                    <b>Manifesto: </b>{candidateInfo.party.manifesto}
                                </Typography>
                                <Typography id="modal-modal-description">
                                    <b>Consituencies: </b>{candidateInfo.consituencies.map((consituency, index) => {
                                        return (
                                            <span key={index}>
                                                {consituency.halka}{candidateInfo.consituencies.length - 1 !== index && ', '}
                                            </span>
                                        )
                                    })}
                                </Typography>
                                <Button onClick={handleClose2} variant="outlined">Cancel</Button>
                            </Box>
                        </Box>
                    </Modal>}
            </>
                :
                <>
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
                </>
            }
        </div>
    );
}