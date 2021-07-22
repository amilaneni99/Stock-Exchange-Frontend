import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import React from 'react'
import { useForm } from '../Components/useForm';

const initialValues = {
    name: '',
    code: '',
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: "100%",
            margin: theme.spacing(1)
        }
    }
}))


function StockExchangeForm(props) {
    const {addStockExchange, closeModal} = props;
    const classes = useStyles();


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('code' in fieldValues)
            temp.code = fieldValues.code ? "" : "This field is required."
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
            addStockExchange(values);
            closeModal(true)
        }
    }


    

    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={8}>
                    <TextField
                        id="filled-required"
                        label="Name"
                        variant="filled"
                        value={values.name}
                        name="name"
                        onChange={handleInputChange}
                        error={errors.name}
                        helperText={errors.name}
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id="filled-required"
                        label="Code"
                        variant="filled"
                        value={values.code}
                        name="code"
                        onChange={handleInputChange}
                        error={errors.code}
                        helperText={errors.code}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button style={{margin: '8px', fontSize:'16px'}} type="submit" color="primary">Submit</Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default StockExchangeForm
