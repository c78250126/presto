import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const ErrorDialog = Dialog;

export default function ErrorModal ({ e, setE }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setE(null);
  };

  React.useEffect(() => {
    if (e !== null) {
      handleClickOpen();
    }
  }, [e]);

  return (
    <ErrorDialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ m: 0, p: 1 }}>Error message:</DialogTitle>
      <IconButton onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography sx={{ minWidth: '200px' }}>{e}</Typography>
      </DialogContent>
    </ErrorDialog>
  );
}
