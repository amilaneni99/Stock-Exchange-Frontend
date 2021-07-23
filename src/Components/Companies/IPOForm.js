import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './CompanyData.css';
import React, { useEffect, useState } from 'react'
import { useForm } from '../useForm';

const initialValues = {
    pricePerShare: '',
    totalNumberOfShares: '',
    openDateTime: '',
    exchangesList: '',

}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            marginRight: '20px'
        }
    }
}))


function IPOForm(props) {
    const [exchanges, setExchanges] = useState([])
    const [selectedExchange, setSelectedExchange] = React.useState(null);
    const { addIPO, closeModal } = props;
    const classes = useStyles();

    async function fetchExchanges() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
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
        if ('pricePerShare' in fieldValues)
            temp.pricePerShare = fieldValues.pricePerShare ? "" : "This field is required."
        if ('totalNumberOfShares' in fieldValues)
            temp.totalNumberOfShares = fieldValues.totalNumberOfShares ? "" : "This field is required."
        if ('openDateTime' in fieldValues)
            temp.openDateTime = fieldValues.openDateTime ? "" : "This field is required."

        temp.exchange = selectedExchange ? "" : "This field is required."

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
            values.exchangesList = []
            values.exchangesList.push(selectedExchange.code)
            values.openDateTime = values.openDateTime.replace("T"," ");
            values.openDateTime = values.openDateTime+":00";
            values.pricePerShare = Number(values.pricePerShare);
            values.totalNumberOfShares = Number(values.totalNumberOfShares);
            console.log(values)
            addIPO(values);
            closeModal(true);
        }
    }




    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="Price Per Share"
                        type="number"
                        variant="filled"
                        value={values.pricePerShare}
                        name="pricePerShare"
                        onChange={handleInputChange}
                        error={errors.pricePerShare}
                        helperText={errors.pricePerShare}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="Number of Shares"
                        type="number"
                        variant="filled"
                        value={values.totalNumberOfShares}
                        name="totalNumberOfShares"
                        onChange={handleInputChange}
                        error={errors.totalNumberOfShares}
                        helperText={errors.totalNumberOfShares}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        type="datetime-local"
                        variant="filled"
                        value={values.openDateTime}
                        name="openDateTime"
                        defaultValue="2021-07-01T00:00"
                        onChange={handleInputChange}
                        error={errors.openDateTime}
                        helperText={errors.openDateTime}
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
                        error={errors.exchange}
                        helperText={errors.exchange}
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

export default IPOForm;
