import { Button, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import MaterialTable from '../CollapsibleTable/MaterialTable'
import StockExchangeForm from './StockExchangeForm';
import Lottie from 'react-lottie';
import animationData from '../lotties/loading2.json';
import FormDialog from './Modal'
import './StockExchange.css'
import ExpandableTable from '../Components/Companies/ExpandableTable';

const init = [
    {
        id: 2,
        name: 'New York Stock Exchange',
        code: 'NYSE',
        numberOfCompanies: 2
    }
]

const useStyles = makeStyles({
    button: {
        '& > .MuiButton-containedPrimary:hover': {
            backgroundColor: '#E84545'
        },
        '& .MuiButton-containedPrimary': {
            backgroundColor: '#E84545'
        },
        '& > .MuiButton-contained': {
            backgroundColor: '#E84545'
        },
        '& .MuiButtonBase-root': {
            backgroundColor: '#E84545'
        }
    },
});

function StockExchanges({token, user, setToken}) {

    const isTesting = false;

    const classes = useStyles();


    const defaultLottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stockExchangesData, setStockExchangesData] = useState((isTesting)?init:[]);

    async function fetchSEs() {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*'
            }
        };
        fetch('https://stockexchangeapp.herokuapp.com/api/v1/stockexchange', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setStockExchangesData(data);
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchSEs();
    }, []);

    const addStockExchange = (values) => {
        console.log(values);
        if(isTesting) {
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
                    'Authorization': `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(values)
            };
            fetch('https://stockexchangeapp.herokuapp.com/api/v1/stockexchange', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    fetchSEs();
                })
        }
    }

    const tableFields = {
        names: [
            "ID",
            "Name",
            "Code",
            "No. Of Companies"
        ],
        properties:[
            "id",
            "name",
            "code",
            "numberOfCompanies"
        ]
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

    return (
        <div>
            {
                user && user.admin &&
                <div className="element">
                    <Button className={classes.button} variant="contained" color="secondary" onClick={() => setOpenPopup(true)}>Add Stock Exchange</Button>
                </div>
            }
            {
                !loading &&
                (
                    <div className="element">
                        <ExpandableTable hasAction={false} isExpandable={false} data={stockExchangesData} fields={tableFields} />
                    </div>
                )
            }
            {
                loading &&
                (
                    <div style={{width:'100%',height:'400px',display:'flex',justifyContent:'center',alignItems:'center'}}>
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
                title="Add Exchange">
                    <StockExchangeForm addStockExchange={addStockExchange} closeModal={(close) => {
                        if(close) setOpenPopup(false);}}/>
            </FormDialog>
        </div>
    )
}

export default StockExchanges
