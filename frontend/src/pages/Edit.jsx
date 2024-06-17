import React from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditTitleDialog from '../components/TitleModal';
import { getUserData, sendUserData } from './utils'
import DeleteDialog from '../components/DeleteDeckModal';
import EditBgDialog from '../components/BgModal';
import ErrorModal from '../components/ErrorModal';
import TxtDialog from '../components/TxtModal';
import EditTxtDialog from '../components/EditTxtModal';
import ImgDialog from '../components/ImgModal';
import EditImgDialog from '../components/EditImgModal';
import VidDialog from '../components/VidModal';
import EditVidDialog from '../components/EditVidModal';
import CodeDialog from '../components/CodeModal';
import SyntaxHighlighter from 'react-syntax-highlighter';
import EditCodeDialog from '../components/EditCodeModal';
import { Card, CardMedia } from '@mui/material';

// based on the url, data is ready for all decks, then return content
function Edit ({ token }) {
  const params = useParams();
  const match = params.slide.match(/^(\d+)-(\d+)$/);
  const deckNum = parseInt(match[1]);
  const slideIndex = parseInt(match[2]);

  if (token === null) {
    return <Navigate to='/login' />;
  }

  const [data, setData] = React.useState(null);

  // fetch user data when dashboard is opened
  React.useEffect(() => {
    getUserData(token, setData);
  }, []);

  const title = data ? data[deckNum].title : '';

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // link back to dashboard - 2.2.3. Basics of a presentation controls
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/dashboard');
  }
  // pop up delete deck dialog - 2.2.3. Basics of a presentation controls
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleDelete = () => {
    setOpenDelete(true);
  }

  // 2.2.4. Title editing
  const [openTitleEdit, setOpenTitleEdit] = React.useState(false);
  const editTitle = () => {
    setOpenTitleEdit(true);
  }

  // 2.2.5. control slides
  const [slideNum, setslideNum] = React.useState(0)
  React.useEffect(() => {
    if (data) {
      setslideNum(data[deckNum].slideNum);
    }
  }, [data]);
  // 2.2.5. Create slides
  const addSlide = () => {
    data[deckNum].slideNum += 1;
    data[deckNum].slides.push(['']);
    sendUserData(token, data);
    getUserData(token, setData); // render page to show right arrow icon
  }
  // 2.2.5. delete slides
  const [error, setError] = React.useState(null);
  const deleteSlide = () => {
    if (slideNum === 1) {
      setError('Only 1 slide left. Please delete presetation.');
    } else {
      data[deckNum].slideNum -= 1;
      data[deckNum].slides = data[deckNum].slides.filter((element, index) => index !== slideIndex);
      sendUserData(token, data);
      if (slideIndex === slideNum) {
        navigate(`/edit/${deckNum}-${slideIndex - 1}`);
      } else {
        navigate(`/edit/${deckNum}-${slideIndex}`);
      }
      getUserData(token, setData);
    }
  }
  // 2.2.5. move to previous slide
  const preSlide = () => {
    if (slideIndex > 1) {
      navigate(`/edit/${deckNum}-${slideIndex - 1}`);
    }
  }
  // 2.2.5. move to next slide
  const nextSlide = () => {
    if (slideIndex < slideNum) {
      navigate(`/edit/${deckNum}-${slideIndex + 1}`);
    }
  }

  // 2.3.1 edit text element
  const [editTxt, setEditTxt] = React.useState([false, null]);
  const editTextElement = (e) => {
    const id = e.target.id
    setEditTxt([true, id]);
  }

  // 2.3.1 add text element
  const [textModal, setTextModal] = React.useState(false);
  const addText = () => {
    setTextModal(true);
  }

  const elementArray = data ? data[deckNum].slides[slideIndex] : ''

  // delete element
  const delElement = (e) => {
    let id = e.target.id;
    if (e.target.nodeName === 'IMG' || e.target.nodeName === 'PRE') {
      id = e.target.id.slice(0, e.target.id.length - 3)
    }
    for (let i = 1; i < elementArray.length; i++) {
      if (Object.prototype.hasOwnProperty.call(elementArray[i], id)) {
        elementArray.splice(i, 1);
        sendUserData(token, data);
        navigate(`/edit/${deckNum}-${slideIndex}`);
      }
    }
  }

  // 2.3.2 add image element
  const [imgModal, setImgModal] = React.useState(false);
  const addImage = () => {
    setImgModal(true);
  }
  // 2.3.2 edit image element
  const [editImg, setEditImg] = React.useState([false, null]);
  const editImage = (e) => {
    let id = e.target.id;
    if (e.target.nodeName === 'IMG') {
      id = e.target.id.slice(0, e.target.id.length - 3)
    }
    setEditImg([true, id]);
  }

  // 2.3.3 add video element
  const [vidModal, setVidModal] = React.useState(false);
  const addVideo = () => {
    setVidModal(true);
  }
  // 2.3.2 edit video element
  const [editVid, setEditVid] = React.useState([false, null]);
  const editVideo = (e) => {
    const id = e.target.id;
    setEditVid([true, id]);
  }

  // 2.3.4 add code element
  const [codeModal, setCodeModal] = React.useState(false);
  const addCode = () => {
    setCodeModal(true);
  }
  // 2.3.4 edit code element
  const [editCode, setEditCode] = React.useState([false, null]);
  const editCod = (e) => {
    let id = e.target.id;
    if (e.target.nodeName === 'PRE') {
      id = e.target.id.slice(0, e.target.id.length - 3)
    }
    setEditCode([true, id]);
  }

  const elements = [];
  for (let i = 1; i < elementArray.length; i++) {
    const element = elementArray[i]
    const elementId = Object.keys(element)[0]
    const info = element[elementId];
    const content = info.content;
    const type = info.type;
    const { width, height, fontSize, color, position, left, top, src, alt, autoplay, language, fontFamily } = info;
    if (type === 'text') {
      const typographyStyle = {
        width,
        height,
        fontSize,
        color,
        position,
        left,
        top,
        zIndex: i,
        border: '1px solid lightgray',
        overflow: 'hidden',
        fontFamily
      };
      elements.push(
        <Typography key={elementId} id={elementId} sx={typographyStyle} onDoubleClick={editTextElement} onContextMenu={delElement} style={{ cursor: 'pointer' }}>
          {content}
        </Typography>
      );
    } else if (type === 'image') {
      elements.push(
        <Card key={elementId} id={elementId} onContextMenu={delElement} sx={{ width, height, position, left, top, zIndex: i }} onDoubleClick={editImage} style={{ cursor: 'pointer', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            src={src}
            alt={alt}
            id={elementId + 'img'}
            onContextMenu={delElement}
          />
        </Card>
      )
    } else if (type === 'video') {
      let embedUrl;
      const matchVParameter = src.match(/[?&]v=([^&]+)/);
      if (matchVParameter) {
        const videoId = matchVParameter[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else {
        const matchSingleSlash = src.match(/youtu\.be\/([^?]+)/);
        if (matchSingleSlash) {
          const videoId = matchSingleSlash[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else {
          embedUrl = src;
        }
      }
      if (autoplay) {
        embedUrl = embedUrl + '?autoplay=1'
      }
      elements.push(
        <iframe key={elementId} width={width} height={height} src={embedUrl} allow="autoplay;" id={elementId} onContextMenu={delElement} onDoubleClick={editVideo} style={{ border: '20px solid black', position, left, top }}></iframe>
      )
    } else if (type === 'code') {
      elements.push(
        <Box key={elementId} id={elementId} width={width} height={height} fontSize={fontSize} onContextMenu={delElement} onDoubleClick={editCod} style={{ position, left, top, cursor: 'pointer' }}>
          <SyntaxHighlighter language={language} id={elementId + 'vid'}>
            {content}
          </SyntaxHighlighter>
        </Box>
      )
    }
  }

  // 2.4.2. Theme and background picker
  const [bgModal, setBgModal] = React.useState(false);
  const handleBgColor = () => {
    setBgModal(true);
  }

  // 2.4.2. Theme and background picker
  const themeBg = data ? data[deckNum].slides[0] : '';
  const slideBg = data ? data[deckNum].slides[slideIndex][0] : '';
  const bgColor = slideBg === '' ? themeBg : slideBg;
  const slide = (
    <Container
      sx={{
        position: 'fixed',
        backgroundColor: bgColor,
        backgroundImage: bgColor,
        top: { xs: '56px', sm: '64px' },
        left: '0px',
        right: '0px',
        marginRight: 0,
        marginLeft: 0,
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        minWidth: '100vw',
        paddingTop: '24px',
        paddingBottom: '40px'
      }}>
      {elements}
      {/* box for slide index */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '50px',
          height: '50px',
          fontSize: '1em',
          fontWeight: 'bold',
          color: 'gray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        {slideIndex}/{slideNum}
      </Box>
      {/* box for slide control icons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: '8px',
          padding: '8px',
        }}
      >
        <IconButton onClick={deleteSlide}>
          <DeleteForeverIcon/>
        </IconButton>
        <IconButton onClick={addSlide}>
          <AddCircleOutlineIcon/>
        </IconButton>
          <IconButton onClick={nextSlide} style={{ position: 'absolute', right: 104, display: slideIndex === slideNum ? 'none' : 'inline-flex' }}>
            <ArrowForwardIcon/>
          </IconButton>
          <IconButton onClick={preSlide} style={{ position: 'absolute', right: 144, display: slideIndex === 1 ? 'none' : 'inline-flex' }}>
            <ArrowBackIcon/>
          </IconButton>
      </Box>
    </Container>
  )
  // 2.4.3 open preview tab
  const handlePreview = () => {
    // URL to be opened in the new tab
    const url = `http://localhost:3000/preview/${deckNum}-${slideIndex}`;

    // Open a new tab with the specified URL
    window.open(url, '_blank');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mx: 2, my: 2, width: '168px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {title}
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={addText}>
            <ListItemText primary='Add Text' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={addImage}>
            <ListItemText primary='Add Image' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={addVideo}>
            <ListItemText primary='Add Video' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={addCode}>
            <ListItemText primary='Add Code' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleBgColor}>
            <ListItemText primary='Update Background Colour'/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handlePreview}>
            <ListItemText primary='Preview Presentation' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleDelete}>
            <ListItemText primary='Delete Presentation' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={handleBack}>
            <ListItemText primary='Back to Dashboard' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // 2.2.5. move slides with key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!openDelete && !bgModal && !textModal && !editTxt[0] && !imgModal && !editImg[0] && !vidModal && !editVid[0] && !codeModal && !editCode[0]) {
        if (e.key === 'ArrowRight') {
          if (slideIndex < slideNum) {
            navigate(`/edit/${deckNum}-${slideIndex + 1}`);
          }
        } else if (e.key === 'ArrowLeft') {
          if (slideIndex > 1) {
            navigate(`/edit/${deckNum}-${slideIndex - 1}`);
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deckNum, slideIndex, slideNum, openDelete, bgModal, textModal, editTxt, imgModal, editImg, vidModal, editVid, codeModal, editCode]);

  return (
    <Box sx={{ display: 'flex', width: '100vw' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }} // display drawer for both big and small screen
          >
            <MenuIcon />
          </IconButton>
          <EditIcon onClick={editTitle} style={{ cursor: 'pointer' }}/>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, marginLeft: '10px' }}>
            <Typography variant="h6" component="div"
              sx={{ width: 'calc(100vw - 420px)', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' }, marginLeft: '10px' }}>
            <Typography variant="h6" component="div"
              sx={{ width: 'calc(100vw - 180px)', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }} >
            <DeleteDialog token={token} data={data} deckNum={deckNum} openDelete={openDelete} setOpenDelete={setOpenDelete}/>
            <EditBgDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} bgModal={bgModal} setBgModal={setBgModal}/>
            <ErrorModal e={error} setE={setError}/>
            <TxtDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} textModal={textModal} setTextModal={setTextModal}/>
            <EditTxtDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} editTxt={editTxt} setEditTxt={setEditTxt}/>
            <ImgDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} imgModal={imgModal} setImgModal={setImgModal}/>
            <EditImgDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} editImg={editImg} setEditImg={setEditImg}/>
            <VidDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} vidModal={vidModal} setVidModal={setVidModal}/>
            <EditVidDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} editVid={editVid} setEditVid={setEditVid}/>
            <CodeDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} codeModal={codeModal} setCodeModal={setCodeModal}/>
            <EditCodeDialog token={token} data={data} deckNum={deckNum} slideIndex={slideIndex} editCode={editCode} setEditCode={setEditCode}/>
            <Button sx={{ color: '#fff', marginLeft: 2, marginRight: 0 }}
              onClick={handleDelete}>
              Delete Presentation
            </Button>
          </Box>
          <Button sx={{ color: '#fff', marginLeft: 2, marginRight: 0 }}
            onClick={handleBack}>
            Back
          </Button>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 200 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <EditTitleDialog token={token} data={data} deckNum={deckNum} openTitleEdit={openTitleEdit} setOpenTitleEdit={setOpenTitleEdit} />
      {/* main box below contains cards  */}
      {slide}
    </Box>
  );
}

export default Edit;
