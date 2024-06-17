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
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { sendUserData } from '../pages/utils'
import ErrorModal from './ErrorModal';

export default function CodeDialog ({ token, data, deckNum, slideIndex, codeModal, setCodeModal }) {
  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setCodeModal(false);
    setValues({
      width: '',
      height: '',
      fontSize: '',
      content: '',
      position: 'absolute',
      left: 0,
      top: 0,
      type: 'code',
      language: '',
    });
  };

  const [values, setValues] = React.useState({
    width: '',
    height: '',
    fontSize: '',
    content: '',
    position: 'absolute',
    left: 0,
    top: 0,
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.width || values.width > 100 || values.width < 0 || !values.width || values.height > 100 || values.height < 0) {
      setError('Please enter width and height between 0 and 100');
      return null;
    }
    const sendValues = {}
    sendValues.width = values.width + '%';
    sendValues.height = values.height + '%';
    sendValues.fontSize = values.fontSize + 'em';
    sendValues.position = values.position;
    sendValues.left = values.left;
    sendValues.top = values.top;
    sendValues.content = values.content;
    sendValues.type = values.type;
    sendValues.language = language;
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
        open={codeModal}
        onClose={handleClose}
        PaperProps={{ component: 'form' }}
        fullWidth
      >
        <DialogContent sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <ErrorModal e={error} setE={setError}/>
          <DialogContentText sx={{ marginTop: '20px' }}>
            Please set properties of your code area:
          </DialogContentText>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
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
              Please set properties of your code:
            </DialogContentText>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
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
            Please enter code:
          </DialogContentText>
          <TextField
            multiline
            margin="dense"
            name="content"
            label="Content"
            onChange={handleTxtInput}
            value={values.content}
            variant="outlined"
            placeholder="Add your code here..."
            minRows={3}
            fullWidth
            sx={{ marginTop: '5px' }}
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
