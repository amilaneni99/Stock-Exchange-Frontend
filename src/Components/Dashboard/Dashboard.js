import React, { Component, useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import FormDialog from '../../StockExchanges/Modal';
import animationData from '../../lotties/loading2.json';
import './Dashboard.css';
import ExpandableTable from '../Companies/ExpandableTable';


const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

function Dashboard({token}) {
    const [loading, setLoading] = useState(true);
    const [IPOs, setIPOs] = useState([]);


    function fetchIPOs() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        fetch('https://stockexchangeapp.herokuapp.com/api/v1/IPOs/upcoming', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                setIPOs(data);
                setLoading(false);
                console.log(IPOs);
            })
    }

    useEffect(() => {
        fetchIPOs();
    }, [])

    const tableFields = {
        names: [
            "ID",
            "Date & Time",
            "Company Name",
            "Price Per Share",
        ],
        properties: [
            "id",
            "dateTime",
            "companyName",
            "pricePerShare",
        ],
        expandableFields: {
            names: [
                "Total Number of Shares",
                "Listed In"
            ],
            properties: [
                "totalNumberOfShares",
                "listedIn"
            ],
        }
    }

    return (
        <div>
            <h2 style={{paddingLeft:'10px'}}>IPO Details</h2>
            {
                !loading &&
                (
                    <div className="element">
                        <ExpandableTable
                            data={
                                IPOs.map((val, key) => {
                                    var tempIPO = {};
                                    tempIPO.id = val.id;
                                    tempIPO.companyName = val.companyName;
                                    tempIPO.dateTime = val.openDateTime;
                                    tempIPO.pricePerShare = val.pricePerShare;
                                    tempIPO.totalNumberOfShares = val.totalNumberOfShares;
                                    tempIPO.listedIn = [];
                                    val.stockExchanges.forEach((map) => {
                                        tempIPO.listedIn.push(map.code);
                                    });
                                    tempIPO.listedIn = tempIPO.listedIn.join();
                                    console.log(tempIPO);
                                    return tempIPO;
                                })}
                            fields={tableFields}
                            isExpandable={true}
                            hasAction={false} />
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
        </div>
    );
}

export default Dashboard;
