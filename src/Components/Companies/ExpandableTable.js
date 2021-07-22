import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useHistory } from 'react-router-dom';
import { Pageview } from '@material-ui/icons';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row, properties, expandableFields, expandable, hasAction } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const history = useHistory();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        {
          expandable &&
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        }
        {
          properties.map((val,key) => {
            return (<TableCell key={key} align="left">{row[val]}</TableCell>)
          })
        }
        {
          hasAction &&
          <TableRow className={classes.root}>
            <TableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => {
                history.push("/companies/"+row['id']);
              }}>
                <Pageview />
              </IconButton>
            </TableCell>
          </TableRow>
        }
      </TableRow>
      {
        expandable &&
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {
                        expandableFields.names.map((val, key) => {
                          return (<TableCell key={key} align="left">{val}</TableCell>)
                        })
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      expandableFields.properties.map((val, key) => {
                        return (<TableCell key={key} align="left">{(row[val] === "") ? "N/A" : row[val]}</TableCell>)
                      })
                    }
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      }
    </React.Fragment>
  );
}

export default function ExpandableTable(props) {

  const {data, fields, isExpandable, hasAction} = props;

  console.log(props);

  const rows = [];
  data.forEach(r => {
    rows.push(r);
  });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {
              isExpandable &&
              <TableCell />
            }
            {
              fields.names.map((val,key) => {
                return (<TableCell key={key} align="left">{val}</TableCell>)
              })
            }
            {
              hasAction &&
              <TableCell/>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((r,key) => {
              return (<Row hasAction={hasAction} expandable={isExpandable} key={key} row={r} expandableFields={fields.expandableFields} properties={fields.properties}/>)
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}