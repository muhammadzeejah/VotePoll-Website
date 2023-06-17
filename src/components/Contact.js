import { TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import styles from '../styles/Contact.module.css'
import { ContactUs } from '../redux/actions'
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [disable, setDisable] = useState(false)
    const [phone_no, setPhoneNo] = useState('')
    const [message, setMessage] = useState('')
    const [loader, setLoader] = useState(false)
    const dispatch = useDispatch()
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      const onChangeEmail = (e) => {
        if (!regex.test(e.target.value)) setDisable(true)
        else setDisable(false)
        setEmail(e.target.value)
      }

    const Submit = (e) => {
        e.preventDefault()
        setLoader(true);
        const form = {
            name: name,
            email: email,
            phone_no: phone_no,
            message: message,
        }

        dispatch(ContactUs(form))
            .then(response => {
                setLoader(false)
                setName('')
                setEmail('')
                setPhoneNo('')
                setMessage('')
                toast.success("Query Submitted Successfully")

            })
            .catch(error => {
                setLoader(false)
                toast.error(error.response.data.message)
            })
    }

    return (
        <div style={{width: '100%'}}>
            <div className={styles.container} id="contact">
                <h1>Get In Touch</h1>
                <hr className={styles.solid}></hr>
                <div className={styles.formContainer}>
                <form onSubmit={Submit} className={styles.form}>
                    <div>
                        <TextField value={name} onChange={(e) => setName(e.target.value)} sx={{width: '100%'}} id="filled-basic" label="Name" variant="filled" required />
                    </div>
                    <div>
                        <TextField value={email} error={disable} onChange={onChangeEmail} sx={{ width: '100%', my: 1 }} id="filled-basic" label="Email" variant="filled" required />
                    </div>
                    <div>
                        <TextField value={phone_no} onChange={(e) => setPhoneNo(e.target.value)} sx={{ width: '100%', my: 1 }} id="filled-basic" label="Phone Number" variant="filled" required />
                    </div>
                    <div>
                        <TextField value={message} onChange={(e) => setMessage(e.target.value)} sx={{width: '100%'}} id="filled-basic" label="Message" variant="filled" required />
                    </div>
                    <div class={styles.button}>
                    <Button type='submit' disabled={disable} variant="outlined" style={{ borderColor: '#f15540', color: '#f15540', width: "40%", marginTop: "25px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }} sx={{ mt: 1 }}>
                      {loader && <div className={styles.loader}><span></span></div>}
                      <div>Submit </div>
                    </Button>
                  </div>
                </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Contact