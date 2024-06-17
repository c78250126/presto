import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function EditBgDialog ({ token, data, deckNum, slideIndex, bgModal, setBgModal }) {
  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setBgModal(false);
  };

  const [themeColor, setThemeColor] = React.useState('');
  const handleThemeColor = (e) => {
    setThemeColor(e.target.value.trim());
  };

  const [bgColor, setBgColor] = React.useState('');
  const handleBgColor = (e) => {
    setBgColor(e.target.value.trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    data[deckNum].slides[0] = themeColor;
    data[deckNum].slides[slideIndex][0] = bgColor;
    sendUserData(token, data);
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={bgModal}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
      >
        <DialogContent>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText>
            Please enter default background colour for current presentation.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="themeColor"
            label="Theme Colour"
            onChange={handleThemeColor}
            value={themeColor}
            fullWidth
            variant="standard"
            placeholder='#f7f2f2'
            sx={{ marginBottom: '20px' }}
          />
          <DialogContentText>
            Please enter background colour for current slide.
          </DialogContentText>
          <TextField
            margin="dense"
            name="bgColor"
            label="Slide Background Colour"
            placeholder='linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);'
            onChange={handleBgColor}
            value={bgColor}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
