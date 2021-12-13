import React, { useEffect, useState } from 'react';
import Post from './components/Post';
import ImageUpload from './components/ImageUpload';
import db, { auth } from './firebase';
import { Box, Button, Input, Modal, Typography } from '@mui/material';
import InstagramEmbed from 'react-instagram-embed';
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            <form className='app__signup'>
              <center>
                <img
                  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                  alt='instagram logo'
                  className='app__headerImage'
                />
              </center>
              <Input
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signUp}>Sign Up</Button>
            </form>
          </Typography>
        </Box>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            <form className='app__signup'>
              <center>
                <img
                  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                  alt='instagram logo'
                  className='app__headerImage'
                />
              </center>

              <Input
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signIn}>Sign In</Button>
            </form>
          </Typography>
        </Box>
      </Modal>
      <div className='app__header'>
        <img
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='instagram logo'
          className='app__headerImage'
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className='app__posts'>
        <div className='app__postsLeft'>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              imageUrl={post.imageUrl}
              username={post.username}
              caption={post.caption}
            />
          ))}
        </div>
        <div className='app__postsRight'>
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 className='app__loginCheck'>You need to login to upload</h3>
      )}
    </div>
  );
};

export default App;
