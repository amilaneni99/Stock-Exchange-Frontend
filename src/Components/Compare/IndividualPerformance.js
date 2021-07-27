import { Button, Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from '../useForm';
import FusionCharts from "fusioncharts";
import ReactFusioncharts from "react-fusioncharts";
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme);

function IndividualPerformance({token}) {
    const [companies, setCompanies] = useState([])
    const [value, setValue] = useState(null);
    const [dataSource, setDataSource] = useState(null);

    async function fetchCompanies() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        };
        fetch('https://stockexchangeapp.herokuapp.com/api/v1/companies/all', requestOptions)
            .then(response => response.json())
            .then(data => {
                var companyOptions = [];
                console.log(data);
                data.map(company => {
                    if (company.companyStockExchangeMap.length != 0) {
                        company.companyStockExchangeMap.map(map => {
                            var option = {};
                            option.companyName = company.companyName;
                            option.companyCode = map.companyCode;
                            option.id = company.id;
                            companyOptions.push(option);
                        })
                    }
                })
                setCompanies(companyOptions);
                console.log(companies);
            })
    }

    useEffect(() => {
        fetchCompanies();
    }, [])

    const initialValues = {
        companyCode: '',
        startDate: '',
        endDate: ''

    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('startDate' in fieldValues)
            temp.startDate = fieldValues.startDate ? "" : "This field is required."
        if ('endDate' in fieldValues)
            temp.endDate = fieldValues.endDate ? "" : "This field is required."

        temp.company = value ? "" : "This field is required."

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    function fetchCompanyPerformance(values) {
        var requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        };
        fetch(`https://stockprice-app.herokuapp.com/api/v1/chartData/performance/byCompany?companyCode=${values.companyCode}&startDate=${values.startDate}&endDate=${values.endDate}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var entries = [];
                data.pricesByDateTime.map(map => {
                    var entry = {};
                    entry.label = Object.keys(map)[0];
                    entry.value = Object.values(map)[0] + "";
                    entries.push(entry);
                });
                var tempDataSource = {};
                tempDataSource.chart = chart;
                tempDataSource.data = entries;
                setDataSource(tempDataSource);
                console.log(dataSource);
            })
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (validate()) {
            values.companyCode = value.companyCode;
            console.log(values)
            fetchCompanyPerformance(values);
        }
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialValues, true, validate);


    const chart = {
        caption: "Stock Price",
        yaxisname: "Price (in Rs.)",
        showLabels: true,
        rotatelabels: "1",
        setadaptiveymin: "1",
        theme: "fusion"
    }

    return (
        <div style={{ height: 'fit-content' }}>
            <Grid container spacing={2} style={{ margin: '10px' }}>
                <Grid item xs={12}>
                    <form style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} onSubmit={handleSubmit}>
                        <Grid item xs={3}>
                            <Autocomplete
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                    console.log(newValue);
                                }}
                                options={companies}
                                name="company"
                                error={errors.company}
                                helperText={errors.company}
                                getOptionLabel={(option) => option.companyCode}
                                renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
                            />
                        </Grid>
                        <Grid xs={3}>
                            <TextField
                                id="date"
                                label="Start Date"
                                type="date"
                                defaultValue="2017-05-24"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={values.startDate}
                                name="startDate"
                                onChange={handleInputChange}
                                error={errors.startDate}
                                helperText={errors.startDate}
                            />
                        </Grid>
                        <Grid xs={3}>
                            <TextField
                                id="date"
                                label="End Date"
                                type="date"
                                defaultValue="2017-05-24"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={values.endDate}
                                name="endDate"
                                onChange={handleInputChange}
                                error={errors.endDate}
                                helperText={errors.endDate}
                            />
                        </Grid>
                        <Grid xs={2} justifyContent='center' alignItems='center'>
                            <Button variant="contained" type="submit" color="secondary" style={{ width: '80px', transform: 'translatey(7px)' }}>Fetch</Button>
                        </Grid>
                    </form>
                </Grid>
                <Grid xs={12} justifyContent='center' style={{ textAlign: 'center', marginTop: '50px' }}>
                    {
                        <ReactFusioncharts
                            type="line"
                            width="80%"
                            height="60%"
                            dataFormat="JSON"
                            dataSource={dataSource}
                        />
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default IndividualPerformance
