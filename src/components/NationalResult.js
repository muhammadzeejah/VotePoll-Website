import React, { useEffect } from 'react'
import abi from '../contract/contract'
import { ethers } from 'ethers'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import styles from '../styles/Result.module.css'
import { TextField } from '@mui/material'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 3,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 3,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const NationalResult = () => {
    const [state, setState] = React.useState({
        provider: null,
        signer: null,
        contract: null,
    });
    const [resultData, setResultData] = useState([])
    const [finalResultData, setFinalResultData] = useState([])
    const [search, setSearch] = useState('')
    const [arr, setArr] = useState([
        { party: 'PPP', noOfSeats: 30 },
        { party: 'PMLN', noOfSeats: 27 },
        { party: 'JI', noOfSeats: 18 },
        { party: 'MQM', noOfSeats: 22 },
        { party: 'PTI', noOfSeats: 32 },
        { party: 'TLP', noOfSeats: 7 },
    ])

    const func = () => {
        if (resultData) {
            const filterElectionType = resultData.filter((ele) => {
                return ele.electionType === 'National Assembly'
            })
            const filteredArr = []
            let max = 0, winningParty

            // seat count
            for (let i = 0; i < filterElectionType.length; i++) {
                for (let j = 0; j < filterElectionType.length; j++) {
                    const vc = Number(ethers.utils.formatEther(filterElectionType[j].voteCount))
                        .toString()
                        .split('e')[0]
                    if (filterElectionType[i].halka === filterElectionType[j].halka) {
                        if (max < Number(vc)) {
                            max = Number(vc)
                            winningParty = {
                                party: filterElectionType[j].party,
                                halka: filterElectionType[j].halka,
                            }
                        }
                    }
                }
                filteredArr.push(winningParty)
            }

            // Winning Party with halka
            const seatIds = filteredArr.map((o) => o.halka)
            const removeDuplicate = filteredArr.filter(
                ({ halka }, index) => !seatIds.includes(halka, index + 1),
            )

            // party with no. of seats
            const result = Object.values(
                removeDuplicate.reduce((r, e) => {
                    let k = `${e.party}`
                    if (!r[k]) r[k] = { ...e, noOfSeats: 1 }
                    else r[k].noOfSeats += 1
                    return r
                }, {}),
            )
            const sortedArray = result.sort((a, b) => b.noOfSeats - a.noOfSeats)
            const tempArr = []
            let progressBar = 90
            for (let i = 0; i < sortedArray.length; i++) {
                if (i > 0) progressBar = progressBar - ((sortedArray[i - 1].noOfSeats - sortedArray[i].noOfSeats) + 10)
                console.log(progressBar)
                tempArr.push({ party: sortedArray[i].party, noOfSeats: sortedArray[i].noOfSeats, progressBar: progressBar })
            }
            console.log(tempArr, 'result')
            setFinalResultData(tempArr)
        }
    }

    useEffect(() => {
        // const sortedArray = arr.sort((a, b) => b.noOfSeats - a.noOfSeats)
        // const tempArr = []
        // let progressBar = 90
        // for (let i = 0; i < sortedArray.length; i++) {
        //     if (i > 0) progressBar = progressBar - ((sortedArray[i - 1].noOfSeats - sortedArray[i].noOfSeats) + 10)
        //     console.log(progressBar)
        //     tempArr.push({ party: sortedArray[i].party, noOfSeats: sortedArray[i].noOfSeats, progressBar: progressBar })
        // }
        // setArr(tempArr)
        const connectWallet = async () => {
            const contractAddress = '0x8D660640933f573554f24651e812f1B02675BAfb'
            const contractABI = abi.abi
            try {
                const { ethereum } = window

                if (ethereum) {
                    const account = await ethereum.request({
                        method: 'eth_requestAccounts',
                    })

                    window.ethereum.on('chainChanged', () => {
                        window.location.reload()
                    })

                    window.ethereum.on('accountsChanged', () => {
                        window.location.reload()
                    })

                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const contract = new ethers.Contract(contractAddress, contractABI, signer)
                    setState({ provider, signer, contract })
                } else {
                    alert('Please install metamask')
                }
            } catch (error) {
                console.log(error)
            }
        }
        connectWallet()
        console.log(state)
    }, [])
    useEffect(() => {
        func()
    }, [resultData])
    useEffect(() => {
        resultHandler()
    }, [state])
    const resultHandler = async () => {
        if (state.contract) {
            await state.contract
                .eachCandidateVote()
                .then((response) => {
                    console.log(response)
                    setResultData(response)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
    return (
        <div className={styles.nationalContainer}>
            <h1 className={styles.heading}>National Parties Result</h1>
            <hr className={styles.solid}></hr>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'start' }}>
                {/* <TextField value={search} onChange={(e) => setSearch(e.target.value)} size='small' className={styles.searchField} id="filled-basic" label="Search Parties" placeholder='Search' variant="filled" multiline="true" /> */}
                <input
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.search}
                />
            </div>
            <div className={styles.headerBox}>
                <p className={styles.partyHeading}>Party</p>
                <p className={styles.partyHeading}>Seats</p>
            </div>
            {finalResultData.length ?
                finalResultData
                    .filter((ele) => {
                        return search.toLowerCase() === ''
                            ? ele
                            : ele.party.toLowerCase().includes(search)
                    })
                    .map((result, index) =>
                        <div key={index} className={styles.box}>
                            <p className={styles.partyName}>{result.party}</p>
                            <div className={styles.progressBar}>
                                <BorderLinearProgress variant="determinate" value={result.progressBar} />
                            </div>
                            <p className={styles.noOfSeats}>{result.noOfSeats}</p>
                        </div>
                    )
                :
                <p className={styles.notFound}>No Result Found</p>
            }
        </div>
    )
}

export default NationalResult