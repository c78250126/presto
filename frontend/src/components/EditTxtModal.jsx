import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function EditTxtDialog ({ token, data, deckNum, slideIndex, editTxt, setEditTxt }) {
  if (data === null) {
    return null;
  }

  const [values, setValues] = React.useState({
    width: '',
    height: '',
    fontSize: '',
    color: '',
    content: '',
    position: 'absolute',
    left: '',
    top: '',
    type: 'text'
  });

  const elementId = editTxt[1]

  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setEditTxt([false, null]);
  };

  const handleTxtInput = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [fontFamily, setFontFamily] = React.useState('');
  const handleChange = (event) => {
    setFontFamily(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.width > 100 || values.width < 0 || values.height > 100 || values.height < 0 || values.left > 100 || values.left < 0 || values.top > 100 || values.top < 0) {
      setError('Please enter width, height and position between 0 and 100');
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
    if (fontFamily) {
      oldProsObject.fontFamily = fontFamily;
    }
    sendUserData(token, data);
    handleClose();
  }

  return (
      <Dialog
        open={editTxt[0]}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
        fullWidth
        sx={{ width: '100vw' }}
      >
        <DialogTitle>Please update, or leave blank for unchanged properties</DialogTitle>
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 1, }}>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Properties of the text area:
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
              Properties of the text:
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
              <TextField
                margin="dense"
                name="color"
                label="Colour (#)"
                onChange={handleTxtInput}
                value={values.color}
                variant="standard"
                sx={{ my: 1, width: '40%' }}
                InputLabelProps={{
                  sx: { fontSize: '12px' }
                }}
              />
            </Box>
            <FormControl variant="standard" sx={{ my: 1, width: '40%', mx: 0 }}>
              <InputLabel id="font-family-label" sx={{ fontSize: '12px' }}>Font Family</InputLabel>
              <Select
                labelId="font-family-label"
                value={fontFamily}
                onChange={handleChange}
                label="Font Family"
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'Arial'}>Arial</MenuItem>
                <MenuItem value={'Brush Script MT'}>Brush Script MT</MenuItem>
                <MenuItem value={'Times New Roman'}>Times New Roman</MenuItem>
              </Select>
            </FormControl>
            <DialogContentText sx={{ marginTop: '20px' }}>
              Position of the text area:
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
            Please enter text:
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
  );
}
