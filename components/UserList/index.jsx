import React, { useEffect, useState } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import api from '../../lib/api';

import './styles.css';

function UserList() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/user/list');
        if (!ignore) {
          setUsers(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError('Unable to load users.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="user-list-state">
        <CircularProgress size={28} />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (users.length === 0) {
    return <Alert severity="info">No users found.</Alert>;
  }

  return (
    <div className="user-list">
      <Typography className="user-list-title" variant="h6">
        Photographers
      </Typography>
      <List component="nav">
        {users.map((user, index) => {
          const fullName = `${user.first_name} ${user.last_name}`;
          const isSelected = location.pathname === `/users/${user._id}`
            || location.pathname === `/users/${user._id}/photos`;

          return (
            <React.Fragment key={user._id}>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={`/users/${user._id}`}
                  selected={isSelected}
                >
                  <ListItemText
                    primary={fullName}
                    secondary={user.location}
                  />
                </ListItemButton>
              </ListItem>
              {index < users.length - 1 ? <Divider component="li" /> : null}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
