import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { sendUserData } from '../pages/utils'

export default function DeleteDialog ({ token, data, deckNum, openDelete, setOpenDelete }) {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpenDelete(false);
  };

  // Create a new object excluding the specified key
  const removeDeck = (oldData, keyToRemove) => {
    const newData = Object.fromEntries(
      Object.entries(oldData)
        .filter(([key]) => {
          return parseInt(key) !== parseInt(keyToRemove);
        })
        .map(([key, value]) => [parseInt(key) > keyToRemove ? parseInt(key) - 1 : parseInt(key), value])
    );
    return newData;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const sendData = removeDeck(data, deckNum);
    sendUserData(token, sendData);
    handleClose();
    navigate('/dashboard');
  }

  return (
    <React.Fragment>
      <Dialog
        open={openDelete}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
