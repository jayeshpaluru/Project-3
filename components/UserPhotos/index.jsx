import React from 'react';
import { useQuery } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';

import api from '../../lib/api';

import './styles.css';

function formatDateTime(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

function UserPhotos({ userId: userIdProp }) {
  const { userId: userIdParam } = useParams();
  const userId = userIdProp || userIdParam;

  const { data: photos = [], isLoading: loading, error } = useQuery({
    queryKey: ['photos', userId],
    queryFn: () => api.get(`/photosOfUser/${userId}`).then((res) => res.data),
  });

  if (loading) {
    return (
      <div className="user-photos-state">
        <CircularProgress size={32} />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (photos.length === 0) {
    return <Alert severity="info">This user has not posted any photos yet.</Alert>;
  }

  return (
    <Stack spacing={3}>
      {photos.map((photo) => (
        <Card key={photo._id} className="user-photo-card" elevation={2}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={`Uploaded by user ${photo.user_id}`}
          />
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Photo</Typography>
                <Typography color="text.secondary" variant="body2">
                  Posted
                  {' '}
                  {formatDateTime(photo.date_time)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography gutterBottom variant="subtitle1">
                  Comments
                </Typography>
                {photo.comments?.length ? (
                  <List disablePadding>
                    {photo.comments.map((comment) => (
                      <ListItem
                        key={comment._id}
                        className="user-photo-comment"
                        disableGutters
                      >
                        <Stack spacing={0.5}>
                          <Typography color="text.secondary" variant="caption">
                            {formatDateTime(comment.date_time)}
                          </Typography>
                          <Typography component="div" variant="body2">
                            <Box
                              component={RouterLink}
                              to={`/users/${comment.user._id}`}
                              className="user-photo-comment-link"
                            >
                              {comment.user.first_name}
                              {' '}
                              {comment.user.last_name}
                            </Box>
                            {' '}
                            {comment.comment}
                          </Typography>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    No comments yet.
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

UserPhotos.propTypes = {
  userId: PropTypes.string,
};

export default UserPhotos;
