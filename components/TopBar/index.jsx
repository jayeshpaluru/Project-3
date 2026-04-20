import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';

import api from '../../lib/api';

import './styles.css';

function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const [title, setTitle] = useState('Photo Share');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function resolveTitle() {
      const photoMatch = matchPath('/users/:userId/photos', location.pathname);
      const detailMatch = matchPath('/users/:userId', location.pathname);

      if (!currentUser) {
        setLoading(false);
        setTitle('Photo Share');
        return;
      }

      if (photoMatch || detailMatch) {
        setLoading(true);
        try {
          const matchedUserId = photoMatch?.params.userId || detailMatch?.params.userId;
          const response = await api.get(`/user/${matchedUserId}`);
          if (!ignore) {
            const fullName = `${response.data.first_name} ${response.data.last_name}`;
            setTitle(photoMatch ? `Photos of ${fullName}` : fullName);
          }
        } catch (err) {
          if (!ignore) {
            setTitle('User not found');
          }
        } finally {
          if (!ignore) {
            setLoading(false);
          }
        }
        return;
      }

      setLoading(false);
      setTitle(location.pathname === '/users' ? 'Users' : 'Browse the photo collection');
    }

    resolveTitle();

    return () => {
      ignore = true;
    };
  }, [currentUser, location.pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Jayesh Paluru
        </Typography>
        <Box className="topbar-spacer" />
        {loading ? <CircularProgress color="inherit" size={22} /> : null}
        <Typography className="topbar-context" variant="h6" color="inherit">
          {title}
        </Typography>
        {currentUser ? (
          <>
            <Typography className="topbar-greeting" variant="body1" color="inherit">
              Hi
              {' '}
              {currentUser.first_name}
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  currentUser: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
  }),
  onLogout: PropTypes.func.isRequired,
};

export default TopBar;
