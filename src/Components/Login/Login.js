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
    const { setUser, setToken } = props;

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        // if ('email' in fieldValues)
        //     temp.email = fieldValues.email ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        var subject = JSON.parse(jsonPayload);
        setToken(token);
        return subject.sub;
    };

    function loginUser(credentials) {
        var payload = JSON.stringify({
            username: credentials.email,
            password: credentials.password
        })
        return fetch(`https://stockprice-app.herokuapp.com/api/v1/auth/authenticate?email=${credentials.email}&password=${credentials.password}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        })
            .then(response => {
                console.log(response);
                if(response.ok) {
                    return response.json();
                }
                setUser(null);
                setToken(null);
            })
            .then(data => {
                console.log(data);
                if(data) {
                    setUser(parseJwt(data.jwtToken));
                } else {
                    setUser(null);
                    setToken(null);
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
                                    required
                                    style={{ width: '100%' }}
                                    id="filled-required"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={values.email}
                                    name="email"
                                    onChange={handleInputChange}
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