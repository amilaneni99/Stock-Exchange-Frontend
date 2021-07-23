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

export function Signup({setUser}) {
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


    function addUser(values) {
        console.log(values);
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
        fetch('http://stockexchangeapp.herokuapp.com/api/v1/setUser', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUser(JSON.stringify(data));
                window.location.href = "/login";
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
