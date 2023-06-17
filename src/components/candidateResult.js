import React, { useEffect, useRef } from 'react'
import abi from '../contract/contract'
import { ethers } from 'ethers'
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '../styles/Result.module.css'
import Arrow from '@material-ui/icons/ArrowDropDown';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const CandidateResult = () => {
    const [state, setState] = React.useState({
        provider: null,
        signer: null,
        contract: null,
    });
    const [resultData, setResultData] = useState([])
    const [search, setSearch] = useState('')
    const [finalResultData, setFinalResultData] = useState([])
    const [result, setResult] = useState([])
    const [searchBy, setSearchBy]=useState('Search by Consituency')
    const [dropdown, setDropdown] = useState(false)
    const dropdownRef = useRef()

    const closeSelectBox = (event) => {
        if (!dropdownRef.current.contains(event.target)) {
          setDropdown(false)
        }
      }
    
      useEffect(() => {
        document.addEventListener('click', closeSelectBox)
        return () => {
          document.removeEventListener('click', closeSelectBox)
        }
      }, [])

    const func = () => {
        if (resultData) {
            const tempResult = []
            for (let i = 0; i < resultData.length; i++) {
                const vc = Number(ethers.utils.formatEther(resultData[i].voteCount))
                    .toString()
                    .split('e')[0]
                tempResult.push({
                    name: resultData[i].name,
                    party: resultData[i].party,
                    halka: resultData[i].halka,
                    voteCount: Number(vc),
                })
            }
            const sortedArray = tempResult.sort((a, b) => b.voteCount - a.voteCount)
            console.log(sortedArray)
            setResult(sortedArray)
        }
    }
    useEffect(() => {
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
        <div className={styles.candidateResultContainer}>
            <h1 style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Candidates Result</h1>
            <hr className={styles.solid}></hr>
            <div style={{width: '100%', marginTop: '1rem'}}>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div className={styles.searchBar}>
            <div>
              <div
                className={styles.resultDropdownBox}
                style={{ width: '211px' }}
                onClick={() => setDropdown(!dropdown)}
              >
                <div className={styles.selectedText}>
                  <p className={styles.dropdownText}>{searchBy}</p>
                </div>
                <div className={styles.ArrowIcon}>
                  <Arrow />
                </div>
              </div>
              {dropdown && (
                <div className={styles.resultSelectboxContainer} style={{width: '211px'}}>
                  <div className={styles.SelectBox}>
                  <p
                      className={styles.Text}
                      onClick={() => (setSearchBy('Search by Consituency'), setDropdown(!dropdown))}
                    >
                      Search by Consituency
                    </p>
                    <p
                      className={styles.Text}
                      onClick={() => (setSearchBy('Search by Name'), setDropdown(!dropdown))}
                    >
                      Search by Name
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: '100%' }}>
              <input
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                className={styles.resultSearch}
              />
            </div>
          </div>
        </div>
            </div>
            {search &&
            <TableContainer component={Paper} style={{ marginTop: '1.5rem' }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Candidate</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Party</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Consituency</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">No of Votes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result &&
                         result
                        .filter((ele) => {
                            return search.toLowerCase() === ''
                              ? ele
                              : searchBy === 'Search by Name'
                              ? ele.name.toLowerCase().includes(search)
                              : ele.halka.toLowerCase().includes(search)
                          })
                        .map((item, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    {item.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">{item.party}</StyledTableCell>
                                <StyledTableCell align="right">{item.halka}</StyledTableCell>
                                <StyledTableCell align="right">{item.voteCount}</StyledTableCell>
                            </StyledTableRow>
                        ))
                    
                    }
                    </TableBody>
                </Table>
            </TableContainer>
}
        </div>
    )
}

export default CandidateResult