import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import { Button, Grid, TextField, makeStyles, Paper, Link } from '@material-ui/core';
import { useForm } from '../useForm';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { fakeAuth } from '../../App/auth';

const initialValues = {
    email: '',
    password: ''
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            marginRight: '20px'
        }
    }
}))

export default function Login(props) {
    const classes = useStyles();
    const { setUser } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    function loginUser(credentials) {
        return fetch(`https://stockexchangeapp.herokuapp.com/api/v1/user/login?email=${credentials.email}&password=${credentials.password}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log("value");
                if(data) {
                    setUser(JSON.stringify(data));
                    window.location.href = "/";
                } else {
                    setUser(null);
                }
            })
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialValues, true, validate);

    // const [
    //     redirectToReferrer,
    //     setRedirectToReferrer
    // ] = React.useState(false)

    // const { state } = useLocation()

    // const login = () => fakeAuth.authenticate(() => {
    //     setRedirectToReferrer(true)
    // })

    // if (redirectToReferrer === true) {
    //     return <Redirect to={state?.from || '/'} />
    // }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(values);
        loginUser(values);
    }

    return (
        <div style={{
            margin:'auto'
        }}>
            <Paper style={{ width: '70%', margin:'80px auto',}}>
                <div style={{ textAlign: 'center'}}>
                    <h2 style={{ paddingTop: '20px'}}>Login</h2>
                    <form className={classes.root} onSubmit={handleSubmit}>
                        <Grid container spacing={2} justifyContent='center'>
                            <Grid item sm={8} style={{ textAlign: 'center' }}>
                                <TextField
                                    style={{ width: '100%' }}
                                    id="filled-required"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={values.email}
                                    name="email"
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item sm={8} style={{ textAlign: 'center' }}>
                                <TextField
                                    id="filled-required"
                                    style={{ width: '100%' }}
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={values.password}
                                    name="password"
                                    onChange={handleInputChange}
                                    error={errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                                <Button style={{ margin: '8px', fontSize: '16px' }} type="submit" color="primary">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <h5 style={{ paddingBottom: '20px', marginTop:'0px' }}>
                        <Link
                            href='/signup'>
                            Not an existing user? Signup
                        </Link>
                    </h5>
                </div>
            </Paper>
        </div>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired
};