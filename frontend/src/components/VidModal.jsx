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
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function VidDialog ({ token, data, deckNum, slideIndex, vidModal, setVidModal }) {
  const [error, setError] = React.useState(null);

  const handleClose = () => {
    setVidModal(false);
    setValues({
      width: '',
      height: '',
      position: 'absolute',
      left: 0,
      top: 0,
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.width || values.width > 100 || values.width < 0 || !values.width || values.height > 100 || values.height < 0) {
      setError('Please enter width and height between 0 and 100');
      return null;
    }
    const sendValues = {}
    sendValues.width = values.width + '%';
    sendValues.height = values.height + '%';
    sendValues.position = values.position;
    sendValues.left = values.left;
    sendValues.top = values.top;
    sendValues.type = values.type;
    sendValues.src = values.src;
    sendValues.title = values.title;
    sendValues.autoplay = values.autoplay;
    const newElementName = 'e' + Date.now();
    const newObj = {};
    newObj[newElementName] = sendValues;
    data[deckNum].slides[slideIndex].push(newObj);
    sendUserData(token, data);
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={vidModal}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
        fullWidth
      >
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Please set properties of your image area:
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
          onChange={handleAutoPlay}
          control={<Checkbox />}
          label="Autoplay"
          labelPlacement="start"
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
