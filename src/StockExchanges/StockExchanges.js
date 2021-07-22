import { Button } from '@material-ui/core'
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

function StockExchanges() {

    const isTesting = false;


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
            headers: { 'Accept': 'application/json' }
        };
        const response = await fetch('http://localhost:8080/api/v1/stockexchange', requestOptions)
        setStockExchangesData(await response.json());
    }

    useEffect(() => {
        fetchSEs();
    }, []);

    useEffect(() => {
        let timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            clearTimeout(timer);
        }
    }, [loading])

    const addStockExchange = (values) => {
        console.log(values);
        if(isTesting) {
            values.id = 2;
            values.numberOfCompanies = 2;
            console.log(values);
            setLoading(true);
            init.push(values);
            // setStockExchangesData(init);
            
        } else {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            };
            fetch('http://localhost:8080/api/v1/stockexchange', requestOptions)
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
            <div className="element">
                <Button variant="contained" color="primary" onClick={() => setOpenPopup(true)}>Add Stock Exchange</Button>
            </div>
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