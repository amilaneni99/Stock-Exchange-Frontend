import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Close } from '@material-ui/icons';

export default function FormDialog(props) {

  const {title, children, openPopup, setOpenPopup} = props;
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <Dialog open={openPopup} onClose={handleClose} aria-labelledby="form-dialog-title">
        <div style={{display: "flex", flexDirection: 'row'}}>
          <DialogTitle id="form-dialog-title" style={{flexGrow: '1',marginLeft: '8px'}}>{title}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              <Close/>
            </Button>
          </DialogActions>
        </div>
        {
          children &&
          <DialogContent>
            {children}
          </DialogContent>
        }
      </Dialog>
    </div>
  );
}