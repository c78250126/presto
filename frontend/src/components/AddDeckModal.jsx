import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function FormDialog ({ token, setStore, store, open, setOpen }) {
  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = React.useState({ title: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.title) {
      setError('Please enter title');
    } else {
      const formDataUpdate = { ...formData }
      formDataUpdate.slides = ['', ['']];
      formDataUpdate.slideNum = 1;
      const deckNum = Object.keys(store).length + 1;
      const sendData = { ...store };
      sendData[deckNum] = formDataUpdate;
      sendUserData(token, sendData, setStore);
      handleClose();
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
      >
        <DialogTitle>New Presentation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new presentation, please enter the title and description.
          </DialogContentText>
          <ErrorModal e={error} setE={setError}/>
          <TextField
            autoFocus
            required
            margin="dense"
            name="title"
            label="Title"
            onChange={handleChange}
            value={formData.title}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="description"
            label="Description (optional)"
            onChange={handleChange}
            value={formData.description}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit}>Create</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
