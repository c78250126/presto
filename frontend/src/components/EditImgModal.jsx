import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function EditImgDialog ({ token, data, deckNum, slideIndex, editImg, setEditImg }) {
  if (data === null) {
    return null;
  }

  const [error, setError] = React.useState(null);

  const [image, setImage] = React.useState('');
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
    setImage(await convertImageToBase64(file));
    setImageUploaded(true);
  };

  const handleClose = () => {
    setImage('');
    setEditImg([false, null]);
    setValues({
      width: '',
      height: '',
      position: 'absolute',
      left: '',
      top: '',
      type: 'image',
      alt: '',
      src: ''
    })
    setImageUploaded(false);
  };

  const [values, setValues] = React.useState({
    width: '',
    height: '',
    position: 'absolute',
    left: '',
    top: '',
    type: 'image',
    alt: '',
    src: ''
  });

  const handleTxtInput = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const elementId = editImg[1]
  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.width > 100 || values.width < 0 || values.height > 100 || values.height < 0) {
      setError('Please enter width and height between 0 and 100');
      return null;
    }
    let oldProsObject;
    const elementArray = data[deckNum].slides[slideIndex];
    for (let i = 1; i < elementArray.length; i++) {
      if (Object.prototype.hasOwnProperty.call(elementArray[i], elementId)) {
        oldProsObject = elementArray[i][elementId]
      }
    }

    for (const value in values) {
      if (values[value] !== '') {
        if (value === 'width' || value === 'height' || value === 'left' || value === 'top') {
          oldProsObject[value] = values[value] + '%'
        } else {
          oldProsObject[value] = values[value]
        }
      }
    }
    if (image) {
      oldProsObject.src = image;
    }
    sendUserData(token, data);
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={editImg[0]}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
        fullWidth
      >
        <DialogTitle>Please update, or leave blank for unchanged properties</DialogTitle>
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Properties of the image area:
          </DialogContentText>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                autoFocus
                margin="dense"
                name="width"
                type="number"
                label="Width (%)"
                onChange={handleTxtInput}
                value={values.width}
                variant="standard"
                sx={{ my: 1, width: '40%' }}
                InputLabelProps={{
                  sx: { fontSize: '12px' }
                }}
              />
              <TextField
                margin="dense"
                name="height"
                label="Height (%)"
                type="number"
                onChange={handleTxtInput}
                value={values.height}
                variant="standard"
                sx={{ my: 1, width: '40%' }}
                InputLabelProps={{
                  sx: { fontSize: '12px' }
                }}
              />
            </Box>
            <DialogContentText sx={{ marginTop: '20px' }}>
              Position of the image area:
            </DialogContentText>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                autoFocus
                margin="dense"
                name="left"
                label="x"
                type="number"
                onChange={handleTxtInput}
                value={values.left}
                variant="standard"
                sx={{ my: 1, width: '40%' }}
                InputLabelProps={{
                  sx: { fontSize: '12px' }
                }}
              />
              <TextField
                margin="dense"
                name="top"
                label="y"
                onChange={handleTxtInput}
                value={values.top}
                variant="standard"
                sx={{ my: 1, width: '40%' }}
                InputLabelProps={{
                  sx: { fontSize: '12px' }
                }}
              />
            </Box>
            <DialogContentText sx={{ marginTop: '20px' }}>
              Name of your image:
            </DialogContentText>
            <TextField sx={{ marginBottom: '20px' }}
              margin="dense"
              name="alt"
              label="Image name"
              onChange={handleTxtInput}
              value={values.alt}
              fullWidth
              variant="standard"
            />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogContentText sx={{ marginTop: '5px' }}>
            Please upload image file or enter url:
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
          </Box>
          {!imageUploaded && (
          <TextField
            multiline
            margin="dense"
            label='url'
            name="src"
            value={values.src}
            onChange={handleTxtInput}
            variant="outlined"
            placeholder="enter URL here..."
            minRows={2}
            fullWidth
            sx={{ marginTop: '5px' }}
            InputProps={{ style: { height: '100px', overflowY: 'auto' } }}
          />
          )}
          {imageUploaded && (
            <DialogContentText sx={{ fontStyle: 'italic' }}>
              Image uploaded
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
