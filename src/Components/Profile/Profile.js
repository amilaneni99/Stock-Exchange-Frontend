import { Button, Grid, makeStyles, Paper, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useForm } from '../useForm';

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            marginRight: '20px'
        }
    }
}))

function Profile({setUser, setToken, token, user}) {

    const classes = useStyles();
    const [changePassword, setChangePassword] = useState(false);

    const initialValues = {
        name: user.name,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: user.email
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('oldPassword' in fieldValues){
            if(fieldValues.oldPassword !== '') {
                if (fieldValues.oldPassword !== user.password) {
                    temp.oldPassword = "Wrong Password";
                } else {
                    temp.oldPassword = "";
                }
            } else {
                temp.oldPassword = "";
            }
        }
        if('newPassword' in fieldValues) {
            if(values.oldPassword !== "" && temp.oldPassword === "") {
                console.log(fieldValues);
                temp.newPassword = (fieldValues.newPassword == "") ? "Required":"";
            } else {
                temp.newPassword = "";
            }
        }
        if('confirmPassword' in fieldValues) {
            if(values.newPassword != "" && temp.newPassword === "") {
                temp.confirmPassword = (fieldValues.confirmPassword === "") ? "Required" : (fieldValues.confirmPassword !== values.newPassword) ? "Passwords do not match" : "";
            } else {
                temp.confirmPassword = "";
            }
        }
        if ('email' in fieldValues)
            temp.email = fieldValues.email ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            console.log(values);
            var newUser = {};
            newUser.name = values.name;
            newUser.email = values.email;
            if((values.newPassword === values.confirmPassword) && values.newPassword !== "") {
                newUser.password = values.newPassword;
            } else {
                newUser.password = user.password;
            }
            newUser.confirmed = user.confirmed;
            newUser.admin = user.admin;
            newUser.id = user.id;
            newUser.role = user.role;
            console.log(newUser);
            updateUser(newUser);
        }
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

    function updateUser(values) {
        console.log(values);
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(values)
        };
        fetch('https://stockprice-app.herokuapp.com/api/v1/updateUser', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.status && data.status !== 200) {
                    console.log(data);
                } else {
                    setToken(data.jwtToken);
                    setUser(parseJwt(data.jwtToken));
                    window.location.href = "/";
                }
            })
    }

    function handleChangePassword(index) {
        if(index === 1) {
            setChangePassword(true);
        } else {
            setChangePassword(false);
        }
    }

    return (
        <div>
            <Paper>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{ textAlign: 'center', paddingTop: '40px' }} justifyContent='center'>
                        <Grid item xs={8}>
                            <div style={{ width: '40%', margin: 'auto' }}>
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
                            </div>
                        </Grid>
                        <Grid item xs={8}>
                            <div style={{ width: '40%', margin: 'auto' }}>
                                <TextField
                                    style={{ width: '100%' }}
                                    id="filled-required"
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                    value={values.email}
                                    name="email"
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    helperText={errors.email}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={8}>
                            {
                                !changePassword &&
                                <Button variant="contained" color="primary" onClick={() => handleChangePassword(1)}>Change Password?</Button>
                            }
                            {
                                changePassword && 
                                <Button variant="contained" color="secondary" onClick={() => handleChangePassword(2)}>Cancel</Button>
                            }
                        </Grid>
                        {
                            changePassword &&
                            <Grid item xs={8}>
                                <div style={{ width: '40%', margin: 'auto' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        id="filled-required"
                                        label="Old Password"
                                        type="password"
                                        variant="outlined"
                                        value={values.oldPassword}
                                        name="oldPassword"
                                        onChange={handleInputChange}
                                        error={errors.oldPassword}
                                        helperText={errors.oldPassword}
                                    />
                                </div>
                            </Grid>
                        }
                        {
                            changePassword &&
                            <Grid item xs={8}>
                                <div style={{ width: '40%', margin: 'auto' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        id="filled-required"
                                        label="New Password"
                                        type="password"
                                        variant="outlined"
                                        value={values.newPassword}
                                        name="newPassword"
                                        onChange={handleInputChange}
                                        error={errors.newPassword}
                                        helperText={errors.newPassword}
                                    />
                                </div>
                            </Grid>
                        }
                        {
                            changePassword &&
                            <Grid item xs={8}>
                                <div style={{ width: '40%', margin: 'auto' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        id="filled-required"
                                        label="Confirm New Password"
                                        type="password"
                                        variant="outlined"
                                        value={values.confirmPassword}
                                        name="confirmPassword"
                                        onChange={handleInputChange}
                                        error={errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                    />
                                </div>
                            </Grid>
                        }
                        <Grid item xs={6} style={{ textAlign: 'center' }}>
                            <Button style={{ margin: '8px', fontSize: '16px' }} type="submit" color="primary">Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    )
}

export default Profile
