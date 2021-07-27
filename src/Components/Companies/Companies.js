import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import FormDialog from '../../StockExchanges/Modal';
import Lottie from 'react-lottie';
import animationData from '../../lotties/loading2.json';
import './Company.css';
import CompanyForm from './CompanyForm';
import ExpandableTable from './ExpandableTable';
import UserAuthService from '../../App/UserAuthService';
import Autocomplete from '@material-ui/lab/Autocomplete';

var init = [
    {
        id: 4,
        companyName: "Apollo Med",
        turnover: 1.0E7,
        ceo: "Mr. Prathap Reddy",
        boardOfDirectors: "Mr. Prathap Reddy, Mrs. Sneha Reddy",
        companyBrief: "Apollo Med is one of the leading and largest hospitals in India.",
        ipo: null,
        companyStockExchangeMap: [],
        sector: {
            "id": 2,
            "sectorName": "Finance",
            "brief": "Contains companies belonging to Finance and related category"
        },
        stockPrices: []
    }
]

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormLabel-root': {
            color: '#060930'
        }
    }
}))

function Companies({token, setToken, user}) {

    var isTesting = false;

    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [companiesData, setCompaniesData] = useState((isTesting)?init:[]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const classes = useStyles();


    useEffect(() => {
        if(selectedCompany == null) {
            setCompaniesData(companies);
        } else {
            setCompaniesData([selectedCompany]);
        }
    }, [selectedCompany])


    async function fetchCompanies() {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        fetch('https://stockexchangeapp.herokuapp.com/api/v1/companies/all', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                setToken(null);
                window.location.href = "/";
            })
            .then(data => {
                setCompaniesData(data);
                setCompanies(data);
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchCompanies();
    }, []);

    // useEffect(() => {
    //     let timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);

    //     return () => {
    //         clearTimeout(timer);
    //     }
    // }, [loading])
    
    const addCompany = (values) => {
        console.log(values);
        if (isTesting) {
            values.id = 2;
            values.numberOfCompanies = 2;
            console.log(values);
            setLoading(true);
            init.push(values);

        } else {
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            };
            fetch('https://stockexchangeapp.herokuapp.com/api/v1/companies', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    fetchCompanies();
                })
        }
    }

    const tableFields = {
        names: [
            "ID",
            "Name",
            "Sector",
            "CEO"
        ],
        properties: [
            "id",
            "companyName",
            "sector",
            "ceo"
        ],
        expandableFields: {
            names: [
                "Brief",
                "Listed In"
            ],
            properties: [
                "companyBrief",
                "listedIn"
            ],
        }
    }

    const stockExchanges = [
        {
            id: 1,
            name: 'National Stock Exchange',
            code: 'NSE',
            numberOfCompanies: 2
        },
        {
            id: 2,
            name: 'New York Stock Exchange',
            code: 'NYSE',
            numberOfCompanies: 2
        },
        {
            id: 3,
            name: 'Bombay Stock Exchange',
            code: 'BSE',
            numberOfCompanies: 2
        },
    ]

    const defaultLottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div>
            {
                user && user.admin && 
                <div className="element">
                    <Button variant="contained" color="secondary" onClick={() => setOpenPopup(true)}>Add Company</Button>
                </div>
            }
            {
                !loading &&
                <div className="element">
                    <Autocomplete
                        className = {classes.root}
                        value={selectedCompany}
                        onChange={(event, newValue) => {
                            setSelectedCompany(newValue);
                            console.log(selectedCompany);
                        }}
                        options={companies}
                        name="sector"
                        getOptionLabel={(option) => option.companyName}
                        renderInput={(params) => <TextField {...params} label="Select Sector" variant="outlined" />}
                    />
                </div>
            }
            {
                !loading &&
                (
                    <div className="element">
                        <ExpandableTable 
                            data={
                                companiesData.map((val, key) => {
                                var tempCompany = {};
                                tempCompany.id = val.id;
                                tempCompany.companyName = val.companyName;
                                tempCompany.sector = val.sector.sectorName;
                                tempCompany.ceo = val.ceo;
                                tempCompany.companyBrief = val.companyBrief;
                                tempCompany.listedIn = [];
                                val.companyStockExchangeMap.forEach((map) => {
                                    tempCompany.listedIn.push(map.stockExchange.code);
                                });
                                tempCompany.listedIn = tempCompany.listedIn.join();
                                console.log(tempCompany);
                                return tempCompany;
                            })}
                            fields={tableFields} 
                            isExpandable={true}
                            hasAction={true}/>
                    </div>
                )
            }
            {
                loading &&
                (
                    <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Lottie
                            options={defaultLottieOptions}
                            height={200}
                            width={200}
                        />
                    </div>
                )
            }
            <FormDialog
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                title="Add Company">
                <CompanyForm token={token} addCompany={addCompany} closeModal={(close) => {
                    if (close) setOpenPopup(false);
                }} />
            </FormDialog>
        </div>
    );
}

export default Companies;
