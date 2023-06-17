import React, { useEffect, useRef } from 'react'
import abi from '../contract/contract'
import { ethers } from 'ethers'
import { useState } from 'react';
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import styles from '../styles/Result.module.css'
import Arrow from '@material-ui/icons/ArrowDropDown';

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

const ProvincialResult = () => {
  const [state, setState] = React.useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [resultData, setResultData] = useState([])
  const [search, setSearch] = useState('')
  const [finalResultData, setFinalResultData] = useState([])
  const [seatType, setSeatType] = useState('Chairman')
  const [dropdown, setDropdown] = useState(false)
  const [tempResultArr, setTempResultArr] = useState([
    {
      electionType: 'Local Body',
      halka: 'UC-20',
      name: 'abc',
      party: 'PTI',
      seatType: 'Councellor',
      voteCount: 10,
    },
    {
      electionType: 'Local Body',
      halka: 'UC-20',
      name: 'xyz',
      party: 'PMLN',
      seatType: 'Chairman',
      voteCount: 3,
    },
    {
      electionType: 'Local Body',
      halka: 'UC-20',
      name: 'asd',
      party: 'PPP',
      seatType: 'National Assembly',
      voteCount: 6,
    },
    {
      electionType: 'National Assembly',
      halka: 'NA-05',
      name: 'ert',
      party: 'PMLN',
      seatType: 'National Assembly',
      voteCount: 20,
    },
    {
      electionType: 'National Assembly',
      halka: 'NA-05',
      name: 'qwe',
      party: 'PTI',
      seatType: 'National Assembly',
      voteCount: 12,
    },
    {
      electionType: 'National Assembly',
      halka: 'NA-05',
      name: 'iuo',
      party: 'PPP',
      seatType: 'National Assembly',
      voteCount: 9,
    },
    {
      electionType: 'National Assembly',
      halka: 'NA-05',
      name: 'qhy',
      party: 'JI',
      seatType: 'National Assembly',
      voteCount: 17,
    },
    {
      electionType: 'Local Body',
      halka: 'UC-21',
      name: 'gyh',
      party: 'PPP',
      seatType: 'Councellor',
      voteCount: 19,
    },
    {
      electionType: 'Local Body',
      halka: 'UC-21',
      name: 'gyh',
      party: 'PPP',
      seatType: 'Chairman',
      voteCount: 13,
    },
    {
      electionType: 'Local Body',
      halka: 'UC-21',
      name: 'xne',
      party: 'PTI',
      seatType: 'Chairman',
      voteCount: 31,
    },
    {
      electionType: 'Local Body',
      halka: 'UC-20',
      name: 'uty',
      party: 'PTI',
      seatType: 'Councellor',
      voteCount: 10,
    },
  ])
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

  const func = (province) => {
    if (resultData) {
      const filterElectionType = resultData.filter((ele) => {
        return ele.seatType === province
      })
      const filteredArr = []
      let max = 0,
        winningParty,
        voteCount = 0
      const VCarr = []

      // vote count
      for (let i = 0; i < filterElectionType.length; i++) {
        let party
        for (let j = 0; j < filterElectionType.length; j++) {
          const vc = Number(ethers.utils.formatEther(filterElectionType[j].voteCount))
            .toString()
            .split('e')[0]
          if (filterElectionType[i].party === filterElectionType[j].party) {
            party = filterElectionType[j].party
            voteCount += Number(vc)
          }
        }
        VCarr.push({ party: party, voteCount: voteCount })
        voteCount = 0
      }
      const voteIds = VCarr.map((o) => o.party)
      const removeDuplicateVoteCount = VCarr.filter(
        ({ party }, index) => !voteIds.includes(party, index + 1),
      )

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
        if (i > 0) progressBar = progressBar - ((sortedArray[i - 1].noOfSeats - sortedArray[i].noOfSeats))
        console.log(progressBar)
        tempArr.push({ party: sortedArray[i].party, noOfSeats: sortedArray[i].noOfSeats, progressBar: progressBar })
      }
      console.log(result, 'result')
      setFinalResultData(tempArr)
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
    func('Chairman')
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
      <h1 className={styles.heading}>Provincial Parties Result</h1>
      <hr className={styles.solid}></hr>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div className={styles.searchBar}>
            <div>
              <div
                className={styles.resultDropdownBox}
                style={{ maxWidth: '135px' }}
                onClick={() => setDropdown(!dropdown)}
              >
                <div className={styles.selectedText}>
                  <p className={styles.dropdownText}>{seatType}</p>
                </div>
                <div className={styles.ArrowIcon}>
                  <Arrow />
                </div>
              </div>
              {dropdown && (
                <div className={styles.resultSelectboxContainer}>
                  <div className={styles.SelectBox}>
                    <p
                      className={styles.Text}
                      onClick={() => (setSeatType('Chairman'), setDropdown(!dropdown), func('Chairman'))}
                    >
                      Chairman
                    </p>
                    <p
                      className={styles.Text}
                      onClick={() => (setSeatType('Councellor'), setDropdown(!dropdown), func('Councellor'))}
                    >
                      Councellor
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

export default ProvincialResult