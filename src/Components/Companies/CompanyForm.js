import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react'
import { useForm } from '../useForm';

const initialValues = {
    companyName: '',
    ceo: '',
    turnover: '',
    boardOfDirectors: '',
    companyBrief: '',
    sectorId: ''

}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            marginRight: '20px'
        }
    }
}))


function CompanyForm(props) {
    const [sectors, setSectors] = useState([])
    const [value, setValue] = React.useState(null);
    const { addCompany, closeModal, updateData } = props;
    const classes = useStyles();

    if(updateData) {
        initialValues.companyName = updateData.companyName;
        initialValues.ceo = updateData.ceo;
        initialValues.turnover = updateData.turnover;
        initialValues.boardOfDirectors = updateData.boardOfDirectors;
        initialValues.companyBrief = updateData.companyBrief;
        console.log(updateData.sector)
    }

    async function fetchSectors() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        };
        const response = await fetch('http://localhost:8080/api/v1/sectors', requestOptions)
        setSectors(await response.json());
        console.log(sectors);
    }

    useEffect(() => {
        fetchSectors();
    }, [])

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('companyName' in fieldValues)
            temp.companyName = fieldValues.companyName ? "" : "This field is required."
        if ('ceo' in fieldValues)
            temp.ceo = fieldValues.ceo ? "" : "This field is required."
        if ('turnover' in fieldValues)
            temp.turnover = fieldValues.turnover ? "" : "This field is required."
        if ('boardOfDirectors' in fieldValues)
            temp.boardOfDirectors = fieldValues.boardOfDirectors ? "" : "This field is required."
        if ('companyBrief' in fieldValues)
            temp.companyBrief = fieldValues.companyBrief ? "" : "This field is required."
        
        temp.sector = value ? "" : "This field is required."
        
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
            values.turnover = Number(values.turnover)
            values.sectorId = value.id
            console.log(values)
            addCompany(values);
            closeModal(true);
        }
    }




    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="Name"
                        variant="filled"
                        value={values.companyName}
                        name="companyName"
                        onChange={handleInputChange}
                        error={errors.companyName}
                        helperText={errors.companyName}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="CEO"
                        variant="filled"
                        value={values.ceo}
                        name="ceo"
                        onChange={handleInputChange}
                        error={errors.ceo}
                        helperText={errors.ceo}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        type='number'
                        label="Turnover"
                        variant="filled"
                        value={values.turnover}
                        name="turnover"
                        onChange={handleInputChange}
                        error={errors.turnover}
                        helperText={errors.turnover}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="Board Of Directors"
                        variant="filled"
                        value={values.boardOfDirectors}
                        name="boardOfDirectors"
                        onChange={handleInputChange}
                        error={errors.boardOfDirectors}
                        helperText={errors.boardOfDirectors}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        id="filled-required"
                        label="Brief"
                        variant="filled"
                        value={values.companyBrief}
                        name="companyBrief"
                        onChange={handleInputChange}
                        error={errors.companyBrief}
                        helperText={errors.companyBrief}
                    />
                </Grid>
                <Grid item sm={6}>
                    <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                            console.log(newValue);
                        }}
                        options={sectors}
                        name="sector"
                        error={errors.sector}
                        helperText={errors.sector}
                        getOptionLabel={(option) => option.sectorName}
                        renderInput={(params) => <TextField {...params} label="Select Sector" variant="outlined" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button style={{ margin: '8px', fontSize: '16px' }} type="submit" color="primary">Submit</Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default CompanyForm;
