import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function EditCodeDialog ({ token, data, deckNum, slideIndex, editCode, setEditCode }) {
  if (data === null) {
    return null;
  }

  const [error, setError] = React.useState(null);

  const handleClose = () => {
    setEditCode([false, null]);
    setValues({
      width: '',
      height: '',
      fontSize: '',
      content: '',
      position: 'absolute',
      left: '',
      top: '',
      type: 'code',
      language: '',
    })
  };

  const [values, setValues] = React.useState({
    width: '',
    height: '',
    fontSize: '',
    content: '',
    position: 'absolute',
    left: '',
    top: '',
    type: 'code',
    language: '',
  });

  const handleTxtInput = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [language, setLanguage] = React.useState('');
  const handleChange = (event) => {
    setLanguage(event.target.value);
  }

  const elementId = editCode[1]

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
        } else if (value === 'fontSize') {
          oldProsObject[value] = values[value] + 'em'
        } else {
          oldProsObject[value] = values[value]
        }
      }
    }
    if (language) {
      oldProsObject.language = language;
    }
    sendUserData(token, data);
    handleClose();
  }

  return (
    <React.Fragment>
      <Dialog
        open={editCode[0]}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
        fullWidth
      >
        <DialogTitle>Please update, or leave blank for unchanged properties</DialogTitle>
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Properties of your code area:
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
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
            Properties of your code:
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              margin="dense"
              name="fontSize"
              label="Size (em)"
              type="number"
              onChange={handleTxtInput}
              value={values.size}
              variant="standard"
              sx={{ my: 1, width: '40%' }}
              InputLabelProps={{
                sx: { fontSize: '12px' }
              }}
            />
            <FormControl variant="standard" sx={{ my: 1, width: '40%' }}>
              <InputLabel id="lang-label" sx={{ fontSize: '12px' }}>Language</InputLabel>
              <Select
                labelId="lang-label"
                value={language}
                onChange={handleChange}
                label="language"
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'c'}>C</MenuItem>
                <MenuItem value={'python'}>Python</MenuItem>
                <MenuItem value={'javascript'}>Javascript</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Position of the code area:
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
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
            Please enter code, or leave blank if no update:
          </DialogContentText>
          <TextField
            multiline
            margin="dense"
            name="content"
            label="Content"
            onChange={handleTxtInput}
            value={values.content}
            variant="outlined"
            placeholder="Add your text here..."
            minRows={3}
            fullWidth
            sx={{ marginTop: '5px' }}
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
