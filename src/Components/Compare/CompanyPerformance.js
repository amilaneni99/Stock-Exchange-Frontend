import React, { useEffect, useState } from 'react';

import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import PowerCharts from 'fusioncharts/fusioncharts.powercharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';



import { AppBar, Box, Button, Grid, makeStyles, Paper, Tab, Tabs, TextField, Typography } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { useForm } from '../useForm';
import ReactFC from 'react-fusioncharts';

// Resolves charts dependancy
// charts(FusionCharts);
ReactFC.fcRoot(FusionCharts, PowerCharts, FusionTheme);


export default function CompanyPerformance({token}) {
    const [companies, setCompanies] = useState([])
    const [firstCompany, setFirstCompany] = useState(null);
    const [secondCompany, setSecondCompany] = useState(null);
    const [labels, setLabels] = useState(null);
    const [firstCompanyDataSet, setFirstCompanyDataSet] = useState(null);
    const [secondCompanyDataSet, setSecondCompanyDataSet] = useState(null);
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

    const chart = {
        caption: "Stock Prices",
        showvalues: "0",
        labeldisplay: "ROTATE",
        rotatelabels: "1",
        plothighlighteffect: "fadeout",
        plottooltext: "$seriesName on $label : <b>$dataValue</b>",
        theme: "fusion"
    }

    useEffect(() => {
        fetchCompanies();
    }, [])

    const initialValues = {
        firstCompanyCode: '',
        secondCompanyCode: '',
        startDate: '',
        endDate: ''

    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('startDate' in fieldValues)
            temp.startDate = fieldValues.startDate ? "" : "This field is required."
        if ('endDate' in fieldValues)
            temp.endDate = fieldValues.endDate ? "" : "This field is required."

        temp.firstCompany = firstCompany ? "" : "This field is required."
        temp.secondCompany = secondCompany ? "" : "This field is required."

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    function fetchCompanyPerformance(values, index) {
        var requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        };
        fetch(`https://stockprice-app.herokuapp.com/api/v1/chartData/performance/byCompany?companyCode=${(index === 1)?values.firstCompanyCode:values.secondCompanyCode}&startDate=${values.startDate}&endDate=${values.endDate}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var labels = [];
                var valuesArray = [];
                data.pricesByDateTime.map(map => {
                    labels.push({ label : Object.keys(map)[0]});
                    valuesArray.push({ value : Object.values(map)[0] + ""});
                });
                setLabels(labels);
                (index === 1) ? setFirstCompanyDataSet(prepareAxis(values.firstCompanyCode, valuesArray)) : setSecondCompanyDataSet(prepareAxis(values.secondCompanyCode, valuesArray));
            })
    }

    function prepareAxis(name, data) {
        var axisForCompany = {
            title: name,
            titlepos: "left",
            numberprefix: "Rs.",
            divlineisdashed: "1",
            dataset: [
                {
                    seriesname: name,
                    linethickness: "3",
                    data: data
                }
            ]
        };
        return axisForCompany;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (validate()) {
            values.firstCompanyCode = firstCompany.companyCode;
            values.secondCompanyCode = secondCompany.companyCode;
            console.log(values)
            fetchCompanyPerformance(values,1);
            fetchCompanyPerformance(values,2);
        }
    }


    useEffect(() => {
        if(firstCompanyDataSet && secondCompanyDataSet && labels) {
            var categoryItem = {
                category: labels
            };
            var tempDataSource = {
                chart: chart,
                axis: [
                    firstCompanyDataSet,
                    secondCompanyDataSet
                ],
                categories: [
                    categoryItem
                ]
            };
        }
        console.log(tempDataSource);
        setDataSource(tempDataSource);
    }, [firstCompanyDataSet, secondCompanyDataSet])

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialValues, true, validate);

    return (
        <div style={{ height: 'fit-content' }}>
            <Grid container spacing={2} style={{ margin: '10px' }}>
                <Grid item xs={12}>
                    <form style={{ display: 'flex', justifyContent: 'space-evenly', textAlign: 'center' }} onSubmit={handleSubmit}>
                        <Grid item xs={2}>
                            <Autocomplete
                                value={firstCompany}
                                onChange={(event, newValue) => {
                                    setFirstCompany(newValue);
                                    console.log(newValue);
                                }}
                                options={companies}
                                name="firstCompany"
                                error={errors.firstCompany}
                                helperText={errors.firstCompany}
                                getOptionLabel={(option) => option.companyName+" - "+option.companyCode}
                                renderInput={(params) => <TextField {...params} label="Company 1" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Autocomplete
                                value={secondCompany}
                                onChange={(event, newValue) => {
                                    setSecondCompany(newValue);
                                    console.log(newValue);
                                }}
                                options={companies}
                                name="secondCompany"
                                error={errors.secondCompany}
                                helperText={errors.secondCompany}
                                getOptionLabel={(option) => option.companyName+" - "+option.companyCode}
                                renderInput={(params) => <TextField {...params} label="Company 2" variant="outlined" />}
                            />
                        </Grid>
                        <Grid xs={2}>
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
                        <Grid xs={2}>
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
                            type="multiaxisline"
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