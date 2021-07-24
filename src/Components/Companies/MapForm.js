import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './CompanyData.css';
import React, { useEffect, useState } from 'react'
import { useForm } from '../useForm';

const initialValues = {
    companyCode: '',
    exchangeCode: '',
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            marginRight: '20px'
        }
    }
}))


function MapForm(props) {
    const [exchanges, setExchanges] = useState([])
    const [selectedExchange, setSelectedExchange] = React.useState(null);
    const { mapCompany, closeModal, token } = props;
    const classes = useStyles();

    async function fetchExchanges() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        };
        const response = await fetch('https://stockexchangeapp.herokuapp.com/api/v1/stockexchange', requestOptions)
        setExchanges(await response.json());
    }

    useEffect(() => {
        fetchExchanges();
        console.log(exchanges);
    }, [])

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('companyCode' in fieldValues)
            temp.companyCode = fieldValues.companyCode ? "" : "This field is required."

        temp.exchangeCode = selectedExchange ? "" : "This field is required."

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
        e.preventDefault()
        if (validate()) {
            values.exchangeCode = selectedExchange.code;
            console.log(values)
            mapCompany(values);
            closeModal(true);
        }
    }




    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="Company Code"
                        type="text"
                        variant="filled"
                        value={values.companyCode}
                        name="companyCode"
                        onChange={handleInputChange}
                        error={errors.companyCode}
                        helperText={errors.companyCode}
                    />
                </Grid>
                <Grid item sm={6}>
                    <Autocomplete
                        value={selectedExchange}
                        onChange={(event, newValue) => {
                            setSelectedExchange(newValue);
                            console.log(newValue);
                        }}
                        options={exchanges}
                        name="exchange"
                        error={errors.sector}
                        helperText={errors.sector}
                        getOptionLabel={(option) => option.code}
                        renderInput={(params) => <TextField {...params} label="Stock Exchange" variant="outlined" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button style={{ margin: '8px', fontSize: '16px' }} type="submit" color="primary">Submit</Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default MapForm;
