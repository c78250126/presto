import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function EditTitleDialog ({ token, data, deckNum, openTitleEdit, setOpenTitleEdit }) {
  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setOpenTitleEdit(false);
    setThumbnail('');
    setnewTitle('');
    setImageUploaded(false);
  };

  const [newTitle, setnewTitle] = React.useState('');
  const handleChange = (e) => {
    setnewTitle(e.target.value);
  };

  const [thumbnail, setThumbnail] = React.useState('');
  // Function to convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle image upload and conversion to base64
  const [imageUploaded, setImageUploaded] = React.useState(false);
  const handleImageUploadAndConvert = async (event) => {
    const file = event.target.files[0];
    setThumbnail(await convertImageToBase64(file));
    setImageUploaded(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newTitle) {
      data[deckNum].title = newTitle;
    }
    if (thumbnail) {
      data[deckNum].thumbnail = thumbnail;
    }
    if (newTitle || thumbnail) {
      sendUserData(token, data);
    }
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={openTitleEdit}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
      >
        <DialogContent>
          <DialogContentText>
            Please enter your new title
          </DialogContentText>
          <ErrorModal e={error} setE={setError}/>
          <TextField
            autoFocus
            required
            margin="dense"
            name="title"
            label="Title"
            onChange={handleChange}
            value={newTitle} // display exsiting value
            fullWidth
            variant="standard"
          />
          <DialogContentText sx={{ marginTop: '5px', marginBottom: '5px' }}>
            Please upload thumbnail file:
          </DialogContentText>
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={handleImageUploadAndConvert}
            style={{ display: 'none' }}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" component="span" size="small">
              Upload
            </Button>
          </label>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {imageUploaded && (
            <DialogContentText sx={{ fontStyle: 'italic' }}>
              Thumbnail uploaded
            </DialogContentText>
          )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
