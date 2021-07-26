import { Button, Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import { useForm } from '../useForm';

const initialValues = {
    name: '',
    password: '',
    email: ''
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            marginRight: '20px'
        }
    }
}))

export function Signup({setUser, setToken}) {
    const classes = useStyles();

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password ? "" : "This field is required."
        if ('email' in fieldValues)
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
        return subject.sub;
    };

    function addUser(values) {
        console.log(values);
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        fetch('https://stockprice-app.herokuapp.com/api/v1/auth/setUser', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.status && data.status !== 200) {
                    console.log(data);
                } else {
                    setToken(data.jwtToken);
                    setUser(parseJwt(data.jwtToken));
                    window.location.href = "/login";
                }
            })
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault();
        if(validate()) {
            values.admin = false;
            values.confirmed = false;
            values.role = 'USER'
            addUser(values);
        }
    }

    return (
        <div style={{margin: 'auto'}}>
            <Paper style={{ width: '70%', margin: '80px auto', }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ paddingTop: '20px' }}>Signup</h2>
                    <form className={classes.root} onSubmit={handleSubmit}>
                        <Grid container spacing={2} justifyContent='center'>
                            <Grid item sm={8} style={{ textAlign: 'center' }}>
                                <TextField
                                    style={{ width: '100%' }}
                                    id="filled-required"
                                    label="User Name"
                                    type="text"
                                    variant="outlined"
                                    value={values.name}
                                    name="name"
                                    onChange={handleInputChange}
                                    error={errors.name}
                                    helperText={errors.name}
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
                            <Grid item sm={8} style={{ textAlign: 'center' }}>
                                <TextField
                                    id="filled-required"
                                    style={{ width: '100%' }}
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
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                                <Button style={{ margin: '8px', fontSize: '16px' }} type="submit" color="primary">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Paper>
        </div>
    );
}

export default Signup;
