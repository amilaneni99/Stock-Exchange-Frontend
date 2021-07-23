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



export default function SectorPerformance() {
    const [sectors, setSectors] = useState([])
    const [value, setValue] = useState(null);
    const [dataSource, setDataSource] = useState(null);

    async function fetchSectors() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        };
        const response = await fetch('https://stockexchangeapp.herokuapp.com/api/v1/sectors', requestOptions)
        setSectors(await response.json());
        console.log(sectors);
    }

    useEffect(() => {
        fetchSectors();
    }, [])

    const initialValues = {
        sectorId: '',
        startDate: '',
        endDate: ''

    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('startDate' in fieldValues)
            temp.startDate = fieldValues.startDate ? "" : "This field is required."
        if ('endDate' in fieldValues)
            temp.endDate = fieldValues.endDate ? "" : "This field is required."

        temp.sector = value ? "" : "This field is required."

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    function fetchSectorPerformance(values) {
        var requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        };
        fetch(`https://stockprice-app.herokuapp.com/api/v1/chartData/performance/bySector?sectorId=${values.sectorId}&startDate=${values.startDate}&endDate=${values.endDate}`, requestOptions)
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
            values.sectorId = value.id
            console.log(values)
            fetchSectorPerformance(values);
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
        <div style={{height: 'fit-content'}}>
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
                                options={sectors}
                                name="sector"
                                error={errors.sector}
                                helperText={errors.sector}
                                getOptionLabel={(option) => option.sectorName}
                                renderInput={(params) => <TextField {...params} label="Sector" variant="outlined" />}
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
                            <Button variant="contained" type="submit" color="primary" style={{ width: '80px', transform: 'translatey(7px)' }}>Fetch</Button>
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