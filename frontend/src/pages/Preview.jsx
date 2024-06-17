import React from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getUserData } from './utils'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Card, CardMedia } from '@mui/material';

function Preview ({ token }) {
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

  // 2.2.5. move to previous slide
  const preSlide = () => {
    if (slideIndex > 1) {
      navigate(`/preview/${deckNum}-${slideIndex - 1}`);
    }
  }
  // 2.2.5. move to next slide
  const nextSlide = () => {
    if (slideIndex < slideNum) {
      navigate(`/preview/${deckNum}-${slideIndex + 1}`);
    }
  }
  // 2.2.5. control slides
  const [slideNum, setslideNum] = React.useState(0)
  React.useEffect(() => {
    if (data) {
      setslideNum(data[deckNum].slideNum);
    }
  }, [data]);

  const elements = [];
  const elementArray = data ? data[deckNum].slides[slideIndex] : ''
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
        overflow: 'hidden',
        fontFamily
      };
      elements.push(
        <Typography key={elementId} id={elementId} sx={typographyStyle}>
          {content}
        </Typography>
      );
    } else if (type === 'image') {
      elements.push(
        <Card key={elementId} id={elementId} sx={{ width, height, position, left, top, zIndex: i }} style={{ overflow: 'hidden' }}>
          <CardMedia
            component="img"
            src={src}
            alt={alt}
            id={elementId + 'img'}
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
        <iframe key={elementId} width={width} height={height} src={embedUrl} allow="autoplay;" id={elementId} style={{ border: '20px solid black', position, left, top }}></iframe>
      )
    } else if (type === 'code') {
      elements.push(
        <Box key={elementId} id={elementId} width={width} height={height} fontSize={fontSize} style={{ position, left, top }}>
          <SyntaxHighlighter language={language} id={elementId + 'vid'}>
            {content}
          </SyntaxHighlighter>
        </Box>
      )
    }
  }

  const themeBg = data ? data[deckNum].slides[0] : '';
  const slideBg = data ? data[deckNum].slides[slideIndex][0] : '';
  const bgColor = slideBg === '' ? themeBg : slideBg;
  const slide = (
    <Container
      sx={{
        position: 'fixed',
        backgroundColor: bgColor,
        backgroundImage: bgColor,
        top: 0,
        left: '0px',
        right: '0px',
        marginRight: 0,
        marginLeft: 0,
        height: '100vh',
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
          bottom: 40,
          right: 0,
          display: 'flex',
          flexDirection: 'row-reverse',
          gap: '8px',
          padding: '8px',
        }}
      >
        <IconButton onClick={nextSlide} style={{ position: 'absolute', right: 104, display: slideIndex === slideNum ? 'none' : 'inline-flex' }}>
          <ArrowForwardIcon/>
        </IconButton>
        <IconButton onClick={preSlide} style={{ position: 'absolute', right: 144, display: slideIndex === 1 ? 'none' : 'inline-flex' }}>
          <ArrowBackIcon/>
        </IconButton>
      </Box>
    </Container>
  )

  // 2.2.5. move slides with key
  const navigate = useNavigate();
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (slideIndex < slideNum) {
          navigate(`/preview/${deckNum}-${slideIndex + 1}`);
        }
      } else if (e.key === 'ArrowLeft') {
        if (slideIndex > 1) {
          navigate(`/preview/${deckNum}-${slideIndex - 1}`);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deckNum, slideIndex, slideNum]);

  return (
    <Box sx={{ display: 'flex', width: '100vw' }}>
      {slide}
    </Box>
  );
}

export default Preview;
