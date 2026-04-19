import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';

import api from '../../lib/api';

import './styles.css';

function UserDetail({ userId: userIdProp }) {
  const { userId: userIdParam } = useParams();
  const userId = userIdProp || userIdParam;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/user/${userId}`);
        if (!ignore) {
          setUser(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setUser(null);
          setError('Unable to load this user.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="user-detail-state">
        <CircularProgress size={32} />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <Alert severity="info">User not found.</Alert>;
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Stack className="user-detail" spacing={3}>
      <Box>
        <Typography gutterBottom variant="h4">
          {fullName}
        </Typography>
        <Typography color="text.secondary" variant="subtitle1">
          {user.occupation}
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={2}>
        <Box>
          <Typography className="user-detail-label" variant="subtitle2">
            Location
          </Typography>
          <Typography variant="body1">{user.location}</Typography>
        </Box>

        <Box>
          <Typography className="user-detail-label" variant="subtitle2">
            Description
          </Typography>
          <Typography variant="body1">{user.description}</Typography>
        </Box>
      </Stack>

      <Box>
        <Button
          component={RouterLink}
          to={`/users/${user._id}/photos`}
          variant="contained"
        >
          View Photos
        </Button>
      </Box>
    </Stack>
  );
}

UserDetail.propTypes = {
  userId: PropTypes.string,
};

export default UserDetail;
