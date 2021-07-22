// import { TextField } from '@material-ui/core';
import { Button, Grid, makeStyles, Paper, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import XLSX from "xlsx";
import ExpandableTable from '../Companies/ExpandableTable';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Import() {

  const [cols, setCols] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [file, setFile] = useState(null);
  const [jsonRows, setJsonRows] = useState([]);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [headerNames, setHeaderNames] = useState([]);
  const [importSummary, setImportSummary] = useState(null);

  function handleFileUpload(e) {
    e.preventDefault();
    const files = e.target.sheet.files;
    setFile(files[0]);
    handleFile(files[0]);
    setImportSummary(null);
  }

  function handleFile(fileData /*:File*/) {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      //console.log(rABS, wb);
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false});
      //console.log(JSON.stringify(data) + "this data needs to be passed to rest endpoint to save prices");
      /* Update state */
      // setData(data);
      setCols(make_cols(ws["!ref"]));
      // console.log(cols);
      setHeaderNames(data.slice(0,1));
      var data_ = data.slice(1);

      var jsonData = [];
      data_.map((r,i) => {
        if(r.length == 5) {
          var temp = {}
          temp.companyCode=r[0];
          temp.exchangeCode=r[1];
          temp.sharePrice=Number(r[2]);
          var dateSplit = r[3].split("/");
          var timeTrimmed = r[4].trim();
          var finalDateTime = dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+" "+timeTrimmed;
          temp.timeStamp = finalDateTime;
          jsonData.push(temp);
        }
      })
      // console.log(jsonData);
      setJsonRows(jsonData);
      console.log(jsonRows);
      // jsonRows[0].map((val,key) => console.log(val));

      // this.setState({ data: data, cols: make_cols(ws["!ref"]) });
    };
    if (rABS) reader.readAsBinaryString(fileData);
    else reader.readAsArrayBuffer(fileData);
  }

  const tableFields = {
    names: [
      'Company Code',
      'Exchange Code',
      'Price Per Share (in Rs.)',
      'Time Stamp'
    ],
    properties: (jsonRows.length !== 0)?Object.keys(jsonRows[0]):[]
  }

  function uploadStockPrices(json) {
    console.log(json);
    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    };
    fetch('http://localhost:8081/api/v1/stockprices', requestOptions)
      .then(response => response.json())
      .then(data => {
        setSeverity("success");
        setMessage("Successfully Imported Data");
        setOpenSnackBar(true);
        setImportSummary(data);
      })
      .catch((error) => {
        console.log(error);
        setSeverity("error");
        setMessage("Error Occurred");
      })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  return(
    <div style={{display:'flex',justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
      <div>
        <form onSubmit={handleFileUpload}>
          <TextField
            style={{ transform: 'translatey(15px)' }}
            type="file"
            inputProps={{ 'accept': SheetJSFT }}
            accept={SheetJSFT}
            name="sheet"
          />
          <Button style={{ margin: '8px', fontSize: '16px' }} type="submit" variant="outlined" color="primary">Upload</Button>
        </form>
      </div>
      {
        file && (! importSummary) &&
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-evenly',width:'70%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', width:'30%'}}>
            <h4 style={{marginRight: '15px'}}>Name</h4>
            <h4>{file.name}</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '30%'}}>
            <h4 style={{ marginRight: '15px' }}>Last Modified</h4>
            <h4>{file.lastModified}</h4>
          </div>
          {
            (jsonRows.length !== 0) &&
            <div style={{ display: 'flex', flexDirection: 'row', width: '30%',}}>
              <h4 style={{ marginRight: '15px' }}>No. of Rows</h4>
              <h4>{jsonRows.length}</h4>
            </div>
          }
          <div style={{margin:'auto'}}>
            <Button variant="contained" color="primary" onClick={() => uploadStockPrices(jsonRows)}>Send Data</Button>
          </div>
        </div>
      }
      {
        (jsonRows.length !== 0) && (! importSummary) &&
        <ExpandableTable
          data={jsonRows}
          fields={tableFields}
          isExpandable={false}
          hasAction={false} />
      }
      {
        (importSummary) && 
        <div style={{width:'80%', textAlign:'center'}}>
          <h2>Import Summary</h2>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} sm={6} md={4}>
              <Paper>
                <div style={{ textAlign: 'center', padding: '1px' }}>
                  <h4>Failed Entries</h4>
                  <h4>{importSummary.failedEntries.length}</h4>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={6} md={4}>
              <Paper>
                <div style={{ textAlign: 'center', padding: '1px' }}>
                  <h4>Added Entries</h4>
                  <h4>{importSummary.addedStocks.length}</h4>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={6} md={4}>
              <Paper>
                <div style={{ textAlign: 'center', padding: '1px' }}>
                  <h4>Start Date</h4>
                  <h4>{importSummary.startDateTime}</h4>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={6} md={4}>
              <Paper>
                <div style={{ textAlign: 'center', padding: '1px' }}>
                  <h4>Last Date</h4>
                  <h4>{importSummary.lastDateTime}</h4>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={6} md={4}>
              <Paper>
                <div style={{ textAlign: 'center', padding: '1px' }}>
                  <h4>Missing Dates</h4>
                  <h4>{(importSummary.missingDates.length !== 0) ? importSummary.missingDates.join() : 'N/A'}</h4>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      }
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

/* generate an array of column objects */
const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};


// exchangeName;
// companyCode;
// companyId;
// @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
// timeStamp;
// sharePrice;

export default Import;
