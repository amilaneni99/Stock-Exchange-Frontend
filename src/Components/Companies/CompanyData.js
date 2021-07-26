import { Button, Grid, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import FormDialog from '../../StockExchanges/Modal';
import './CompanyData.css';
import CompanyForm from './CompanyForm';
import IPOForm from './IPOForm';
import MapForm from './MapForm';
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Lottie from 'react-lottie';
import animationData from '../../lotties/loading2.json';
import UserAuthService from '../../App/UserAuthService';


// Resolves charts dependancy
charts(FusionCharts);

const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};



function CompanyData(props) {
    const [company, setCompany] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [openMapDialog, setOpenMapDialog] = useState(false);
    const [dataSource, setDataSource] = useState({});
    const [currentPrice, setCurrentPrice] = useState({})
    const [currentCompanyCode, setCurrentCompanyCode] = useState(null);
    const [stockData, setStockData] = useState({});
    const history = useHistory();
    const user = props.user;

    const chart = {
        caption: "Stock Price",
        yaxisname: "Price (in Rs.)",
        showLabels: false,
        rotatelabels: "1",
        setadaptiveymin: "1",
        theme: "fusion"
    }


    function fetchPerfomance(codes) {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${props.token}`
            }
        };
        var tempPrice = {}
        var tempStockData = {}
        codes.map(code => {
            fetch(`https://stockprice-app.herokuapp.com/api/v1/chartData/performance/byCompany?companyCode=${code}&startDate=start&endDate=end`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    var entries = [];
                    data.pricesByDateTime.map(map => {
                        var entry = {};
                        entry.label = Object.keys(map)[0];
                        entry.value = Object.values(map)[0] + "";
                        entries.push(entry);
                    });
                    const price = (data.pricesByDateTime[data.pricesByDateTime.length - 1]) ? Object.values(data.pricesByDateTime[data.pricesByDateTime.length - 1])[0]:null;
                    tempPrice[code] = price;
                    var tempDataSource = {};
                    tempDataSource.chart = chart;
                    tempDataSource.data = entries;
                    tempStockData[code] = tempDataSource;
                })
        })
        setStockData(tempStockData);
        setCurrentPrice(tempPrice);
    }

    function fetchCompany(id) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${props.token}` }
        };
        fetch(`https://stockexchangeapp.herokuapp.com/api/v1/companies/${id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.status === 404) {
                    alert("Not found");
                    window.location.href = "/companies";
                } else {
                    setCompany(data);
                    const companyCodes = data.companyStockExchangeMap.map(map => map.companyCode);
                    if (companyCodes.length > 0) {
                        fetchPerfomance(companyCodes);
                    }
                    console.log(company);
                }
            })
    }
    
    useEffect(() => {
        fetchCompany(props.match.params.id);
    }, [])

    function addIPO(ipoDetails) {
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
            body: JSON.stringify(ipoDetails)
        };
        fetch(`https://stockexchangeapp.herokuapp.com/api/v1/companies/${company.id}/addIPO`, requestOptions)
            .then(response => response.json())
            .then(data => {
                fetchCompany(company.id);
            });
    }

    function mapCompany(mapDetails) {
        mapDetails.companyId = company.id
        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
            body: JSON.stringify(mapDetails)
        };
        fetch(`https://stockexchangeapp.herokuapp.com/api/v1/companies/mapExchange`, requestOptions)
            .then(response => {
                fetchCompany(company.id);
            });
    }

    function handleDelete(companyId) {
        var requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` }
        };
        fetch(`https://stockexchangeapp.herokuapp.com/api/v1/companies/${companyId}`, requestOptions)
            .then(response => {
                // window.location.href="/companies";
            });
    }

    function editCompany(values) {
        var requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${props.token}` },
            body: JSON.stringify(values)
        };
        fetch(`https://stockexchangeapp.herokuapp.com/api/v1/companies/${company.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                fetchCompany(company.id);
            });
    }

    useEffect(() => {
        console.log("Use Effect Called");
        setDataSource(stockData[currentCompanyCode]);
    }, [currentCompanyCode]);

    useEffect(() => {

    }, [currentPrice])
    

    return (
        <div>
            {
                company != null &&
                <div>
                    {
                        !loading &&
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Paper>
                                    <div className="container" style={{height: '400px'}}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid xs={12} sm={12} md={6}>
                                                        <div className="paddedDiv">
                                                            <h4>Name</h4>
                                                            <h4>{company.companyName}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6}>
                                                        <div className="paddedDiv">
                                                            <h4>CEO</h4>
                                                            <h4>{company.ceo}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6}>
                                                        <div className="paddedDiv">
                                                            <h4>Sector</h4>
                                                            <h4>{company.sector.sectorName}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6}>
                                                        <div className="paddedDiv">
                                                            <h4>Board</h4>
                                                            <h4>{company.boardOfDirectors}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12}>
                                                        <div className="paddedDiv">
                                                            <h4>About</h4>
                                                            <h4>{company.companyBrief}</h4>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} justifyContent='center'>
                                {
                                    user && user.admin &&
                                    <Grid item xs={12} justifyContent='center' alignItems='center' style={{ textAlign: 'center' }}>
                                        <Paper style={{ padding: '20px 0px', marginBottom: '10px' }}>
                                            <Grid item xs={12} justifyContent='center' alignItems='center' style={{ textAlign: 'center' }}>
                                                <Button style={{ margin: '0px 10px 10px 0px', fontSize: '16px' }} variant="contained" color="primary" onClick={() => setOpenMapDialog(true)}>Map Company</Button>
                                                <Button style={{ margin: '0px 10px 10px 0px', fontSize: '16px' }} variant="contained" color="secondary" onClick={() => setOpenEditDialog(true)}>Edit Company</Button>
                                                <Button style={{ margin: '0px 10px 10px 0px', fontSize: '16px' }} color="secondary" onClick={() => setOpenDeleteDialog(true)}>Delete Company</Button>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                }
                                <Paper>
                                    {
                                        user && user.admin &&
                                        <div style={{ width: '100%', padding: '20px 0px', height: '300px' }}>
                                            <h2 style={{ textAlign: 'center' }}>IPO Details</h2>
                                            {
                                                (company.ipo == null) &&
                                                <Grid>
                                                    <div className="container" id="notFound">
                                                        <p style={{ fontSize: '24px' }}>No Upcoming IPOs!</p>
                                                        {
                                                            user && user.admin &&
                                                            <Button style={{ margin: '8px', fontSize: '16px' }} variant="contained" color="primary" onClick={() => setOpenPopup(true)}>Add IPO</Button>
                                                        }
                                                    </div>
                                                </Grid>
                                            }
                                            {
                                                (company.ipo != null) &&
                                                <Grid container spacing={1} justifyContent="center">
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Date & Time</p>
                                                            <h4>{company.ipo.openDateTime}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Price per Share</p>
                                                            <h4>{company.ipo.pricePerShare}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Total No. of Shares</p>
                                                            <h4>{company.ipo.totalNumberOfShares}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Stock Exchanges</p>
                                                            <h4>{company.ipo.stockExchanges.map(exchange => exchange.code)}</h4>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            }
                                        </div>
                                    }
                                    {
                                        user && !user.admin &&
                                        <div style={{ width: '100%', padding: '20px 0px', height: '400px' }}>
                                            <h2 style={{ textAlign: 'center' }}>IPO Details</h2>
                                            {
                                                (company.ipo == null) &&
                                                <Grid>
                                                    <div className="container" id="notFound">
                                                        <p style={{ fontSize: '24px' }}>No Upcoming IPOs!</p>
                                                    </div>
                                                </Grid>
                                            }
                                            {
                                                (company.ipo != null) &&
                                                <Grid container spacing={1} justifyContent="center">
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Date & Time</p>
                                                            <h4>{company.ipo.openDateTime}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Price per Share</p>
                                                            <h4>{company.ipo.pricePerShare}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Total No. of Shares</p>
                                                            <h4>{company.ipo.totalNumberOfShares}</h4>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={5}>
                                                        <div>
                                                            <p>Stock Exchanges</p>
                                                            <h4>{company.ipo.stockExchanges.map(exchange => exchange.code)}</h4>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            }
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={6} style={{ backgroundColor: 'coral' }}>
                                <Grid item xs={12} justifyContent="center">
                                    {
                                        (company.companyStockExchangeMap.length != 0) &&
                                        <Grid container justifyContent="center">
                                            {
                                                company.companyStockExchangeMap.map(map => {
                                                    return (
                                                        <Grid item xs={4} justifyContent="center" style={{ textAlign: 'center' }}>
                                                            <Button style={{ margin: 'auto' }} className={(currentCompanyCode === map.companyCode) ? 'redBg' : 'whiteBg'} onClick={() => setCurrentCompanyCode(map.companyCode)}>
                                                                <Paper style={{ width: '150px', height: 'fit-content', margin: 'auto' }} id={(currentCompanyCode == map.companyCode) ? 'redBg' : 'whiteBg'} >
                                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                                                        <div >
                                                                            <p>{map.companyCode}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p>{map.stockExchange.code}</p>
                                                                        </div>
                                                                    </div>
                                                                </Paper>
                                                            </Button>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    }
                                </Grid>
                                {
                                    <Grid xs={12}>
                                        <ReactFusioncharts
                                            type="line"
                                            width="100%"
                                            height="50%"
                                            dataFormat="JSON"
                                            dataSource={dataSource}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            <Grid item xs={6}>
                                {
                                    (company.companyStockExchangeMap.length == 0) &&
                                    <div style={{height: '500px'}}>
                                        <Paper>
                                            <div className="container" id="notFound">
                                                <p style={{ fontSize: '24px' }}>Not Listed yet!</p>
                                                {
                                                    user && user.admin &&
                                                    <Button style={{ margin: '8px', fontSize: '16px' }} variant="contained" color="primary" onClick={() => setOpenMapDialog(true)}>List Company</Button>
                                                }
                                            </div>
                                        </Paper>
                                    </div>
                                }
                                {
                                    (company.companyStockExchangeMap.length != 0) &&
                                    <Grid container spacing={2}>
                                        {
                                            company.companyStockExchangeMap.map(map => {
                                                return (
                                                    <Grid item xs={12} sm={12} md={6}>
                                                        <Paper style={{ width: '100%', height: '100%' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0px 40px 0px 40px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                    <h2 style={{ margin: '20px 0px 0px 0px' }}>{map.companyCode}</h2>
                                                                    <h4 style={{ margin: '5px 0px 20px 0px' }}>{map.stockExchange.code}</h4>
                                                                </div>
                                                                {
                                                                    currentPrice[map.companyCode] &&
                                                                    <h3 style={{ color: 'red', margin: 'auto 10px', height: 'auto' }}>{currentPrice[map.companyCode]}</h3>
                                                                }
                                                                {
                                                                    !currentPrice[map.companyCode] &&
                                                                    <h3 style={{ color: 'red', margin: 'auto 10px', height: 'auto' }}>N/A</h3>

                                                                }
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    }
                    <FormDialog
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                        title="Add IPO">
                        <IPOForm token={props.token} addIPO={addIPO} closeModal={(close) => {
                            if (close) setOpenPopup(false);
                        }} />
                    </FormDialog>
                    <FormDialog
                        openPopup={openMapDialog}
                        setOpenPopup={setOpenMapDialog}
                        title="Map Exchange">
                        <MapForm token={props.token} mapCompany={mapCompany} closeModal={(close) => {
                            if (close) setOpenMapDialog(false);
                        }} />
                    </FormDialog>
                    <FormDialog
                        openPopup={openDeleteDialog}
                        setOpenPopup={setOpenDeleteDialog}
                        title={"Are you sure to delete " + company.companyName}>
                        <form onSubmit={() => {
                            setOpenDeleteDialog(false);
                            handleDelete(company.id);
                        }}>
                            <Button style={{ margin: '8px', fontSize: '16px' }} variant="contained" type="submit" color="primary">Confirm</Button>
                        </form>
                    </FormDialog>
                    <FormDialog
                        openPopup={openEditDialog}
                        setOpenPopup={setOpenEditDialog}
                        title="Edit Company">
                        <CompanyForm token={props.token} updateData={company} addCompany={editCompany} closeModal={(close) => {
                            if (close) setOpenEditDialog(false);
                        }
                        } />
                    </FormDialog>
                </div>
            }
            {
                loading && !company &&
                <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Lottie
                        options={defaultLottieOptions}
                        height={200}
                        width={200}
                    />
                </div>
            }
        </div>
    )
}

export default CompanyData;
