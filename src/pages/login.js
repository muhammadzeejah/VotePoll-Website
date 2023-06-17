import React, { useEffect, useState } from 'react'
import { TextField, Button, Card, CardContent, Typography } from '@mui/material'
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import styles from '../styles/Contact.module.css'
import Link from 'next/link'
import { useDispatch } from 'react-redux';
import { Signin, isLoggedin, GetCitizen } from '../redux/actions';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { loadModels, createMatcher, getFullFaceDescription, isFaceDetectionModelLoaded, isFacialLandmarkDetectionModelLoaded, isFeatureExtractionModelLoaded, matchFace } from '@/faceUtil';
import axios from 'axios';

const Login = () => {
  const CLOUDINARY_PRESET = 'zvd9xm76';
  const CLOUDINARY_CLOUDNAME = 'dp4hc2cmb';
  const hiddenFileInput = React.useRef(null);
  const [image, setImage] = useState();
  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");
  const [detectionCount, setDetectionCount] = useState();
  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [isRunningFaceDetector, setIsRunningFaceDetector] = useState(false);
  const [loader, setLoader] = useState(false);
  const [faceProfiles, setFaceProfiles] = useState([])

  const [login, setLogin] = useState(true)
  const [cnic, setCnic] = useState('')
  const [isValidFileType, setIsValidFileType] = useState(true);

  const [disable, setDisable] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const [token, setToken] = useState()

  useEffect(() => {
    setToken(Cookies.get('token'))
  }, [])

  const Input = (e) => {
    if (e.target.value.length > 13) return
    if (e.target.value.length < 13) setDisable(true)
    else setDisable(false)
    setCnic(e.target.value)

  }
  const handleChange = async event => {
    const fileUploaded = event.target.files[0];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'image/JPG', 'image/JPEG', 'image/PNG'];
    if (fileUploaded) {
      if (!validImageTypes.includes(fileUploaded.type)) {
        setIsValidFileType(false);
        return;
      }
    }
    setIsValidFileType(true);
    const formData = new FormData()
    formData.append('file', fileUploaded)
    formData.append('upload_preset', CLOUDINARY_PRESET)
    axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDNAME}/image/upload`, formData)
      .then(resp => {
        setImage(resp.data)
      }).catch(err => {
        console.log(err)
      })
  };

  const getFaceDetails = async (img, inputSize) => {
    await getFullFaceDescription(img, inputSize).then(
      (data) => {
        setDetectionCount(data.length);
        setFaceDescriptor(data[0]?.descriptor);
        setIsRunningFaceDetector(false);
      }
    );
  }
  useEffect(() => {
    if (image) {
      const inputSize = 160;
      getFaceDetails(image.secure_url, inputSize);
    }
  }, [image]);

  useEffect(() => {
    if (!cnic || (image && detectionCount === 0 && !isRunningFaceDetector)) {
      setDisable(true);
    }
  }, [cnic, isRunningFaceDetector, detectionCount, image]);

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(setLoadingMessage, setLoadingMessageError);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded()) {
      setIsAllModelLoaded(true);
    }

    loadingtheModel();
  }, [isAllModelLoaded]);

  const LoginHandler = async () => {
    if (!cnic || !image) {
      toast.error("Both Cnic and image are required")
    } else {
      setLoader(true)
      let citizen;
      dispatch(GetCitizen(cnic))
        .then(response => {
          if (response.data.Citizen.citizen.faceDescriptor) {
            citizen = response.data.Citizen.citizen
          }
        }).catch(err => {
          toast.error("CNIC Incorrect")
        })
      setLoader(false)
      if (!citizen) {
        setLoader(true);
        let temp
        await axios.get(`http://127.0.0.1:3000/api/v1/citizen/getCitizens`)
          .then(response => {
            temp=response.data.data.editedCitizens
            setFaceProfiles(response.data.data.editedCitizens)
          })
          .catch(error => {
            console.log(error)
          })
        let queryDescriptor = faceDescriptor;
        // const threshold = 0.1;
        const areEqual = (arr1, arr2) => arr1.sort().join(',') === arr2.sort().join(',');
        let sameFacesCnic = [];
        temp.forEach(profile => {
          if (areEqual(new Float32Array(profile.faceDescriptor.map((value) => parseFloat(value.trim()))), queryDescriptor)) {
            sameFacesCnic.push(profile.cnic)
          }
        })
        let bool=false
        sameFacesCnic.forEach(cnic => {
          if (cnic === citizen.cnic) {
            toast.success("Face Recognized successfully")
            bool=true
            onLogin()
          }
        })
        if(!bool){
          toast.error("Match not found!")
        }
        console.log("Match not found!");

        setLoader(false)
        // 3410139513810
        // let matcher = await createMatcher(faceProfiles, threshold);
        // let matchResult = matcher(queryDescriptor);
        // console.log(matchResult)
        // if (matchResult.distance <= threshold) {
        //   console.log("CNIC:", matchResult.cnic);
        // } else {
        //   // No match found
        //   console.log("No match found!");
        // }
      }
    }
  }
const onLogin=()=>{
  const form = {
    cnic: cnic,
  }
  dispatch(Signin(form))
    .then(response => {
      if (Cookies.get('token')) {
        toast.success("LoggedIn Successfully")
        router.push('/elections')
        dispatch(isLoggedin())
        Cookies.set('cnic', form.cnic)
      }
    }).catch(error => {
      toast.error("Error Occured!")
    })
}
  const onLogout = () => {
    Cookies.remove('token')
    Cookies.remove('cnic')
    dispatch(isLoggedin())
    router.push('/')
  }
  const handleClick = event => {
    event.preventDefault()
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <div className={styles.container} >
        {token ?
          <Card variant="outlined" style={{ width: '20rem' }}>
            <CardContent>
              <Typography color="text.secondary" style={{ textAlign: 'center' }}>
                You are already LoggedIn!
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <Button onClick={() => router.push('/')} variant="contained" style={{ backgroundColor: '#f15540', color: 'white' }}>Home</Button>
                <Button onClick={onLogout} variant="outlined" style={{ borderColor: '#f15540', color: '#f15540' }}>Sign Out</Button>
              </div>
            </CardContent>
          </Card>
          :
          login && (
            <div className={styles.loginContainer}>
              <h1>Login</h1>
              <hr className={styles.solid}></hr>
              <div className={styles.formContainer}>
                <form className={styles.form}>
                  <div>
                    <TextField error={disable} required type='number' value={cnic} onChange={Input} sx={{ width: '100%', borderColor: 'green' }} id="filled-basic" label="CNIC" placeholder='30000000000' variant="filled" />
                  </div>
                  <div className={styles.uploadContainer}>
                    <div className={styles.inputBox}>
                      <div>
                        Upload image
                      </div>
                      <button className={styles.upload} onClick={handleClick} style={{ cursor: "pointer" }}>
                        +
                      </button>
                      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />
                      {image && <p style={{ margin: '0', color: 'blue' }}>File name: {image.original_filename}.{image.format} </p>}
                      {!isValidFileType && <p style={{ margin: '0', color: 'red' }}>You can only upload image file</p>}
                      {(!detectionCount && !faceDescriptor) && <p style={{ margin: '0', color: 'red' }}>No Face Detected </p>}
                      {(!!detectionCount && !!faceDescriptor) && <p style={{ margin: '0', color: 'green' }}> Face Detected </p>}
                    </div>
                    {image && <div style={{ width: '150px', height: "150px" }}>
                      <img src={image.secure_url} style={{ width: '100%' }} />
                    </div>}
                  </div>
                  <div class={styles.button}>
                    <Button disabled={disable} onClick={LoginHandler} variant="outlined" style={{ borderColor: '#f15540', color: '#f15540', width: "40%", marginTop: "25px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }} sx={{ mt: 1 }}>
                      {loader && <div className={styles.loader}><span></span></div>}
                      <div>Sign In </div>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login