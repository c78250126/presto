import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogTitle from '@mui/material/DialogTitle';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function EditVidDialog ({ token, data, deckNum, slideIndex, editVid, setEditVid }) {
  if (data === null) {
    return null;
  }

  const [error, setError] = React.useState(null);

  const handleClose = () => {
    setEditVid(false);
    setValues({
      width: '',
      height: '',
      position: 'absolute',
      left: '',
      top: '',
      type: 'video',
      title: '',
      src: '',
      autoplay: false
    })
  };

  const [values, setValues] = React.useState({
    width: '',
    height: '',
    position: 'absolute',
    left: '',
    top: '',
    type: 'video',
    title: '',
    src: '',
    autoplay: false
  });

  const handleTxtInput = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleAutoPlay = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      values.autoplay = true;
    } else {
      values.autoplay = false;
    }
  }

  const elementId = editVid[1]
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
    sendUserData(token, data);
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={editVid[0]}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
        fullWidth
      >
        <DialogTitle>Please update, or leave blank for unchanged properties</DialogTitle>
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Properties of the video area:
          </DialogContentText>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                autoFocus
                required
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
                required
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
              Position of the video area:
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
              Please enter the title of your video:
            </DialogContentText>
            <TextField sx={{ marginBottom: '20px' }}
              margin="dense"
              name="title"
              label="title"
              onChange={handleTxtInput}
              value={values.title}
              fullWidth
              variant="standard"
            />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <DialogContentText sx={{ marginTop: '5px' }}>
              Please enter url:
            </DialogContentText>
          </Box>
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
          <FormControlLabel
          sx={{ marginLeft: '0px' }}
          onChange={handleAutoPlay}
          control={<Checkbox />}
          label="Autoplay"
          labelPlacement="start"
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
