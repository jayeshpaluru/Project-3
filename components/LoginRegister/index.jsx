/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  getApiErrorMessage,
  loginUser,
  registerUser,
} from '../../lib/api';

import './styles.css';

const initialLoginForm = {
  login_name: '',
  password: '',
};

const initialRegisterForm = {
  login_name: '',
  password: '',
  first_name: '',
  last_name: '',
  location: '',
  description: '',
  occupation: '',
};

function LoginRegister({ onAuthChange }) {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);

  function updateLoginField(event) {
    setLoginForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  function updateRegisterField(event) {
    setRegisterForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');

    try {
      const user = await loginUser(loginForm);
      onAuthChange(user);
      navigate(`/users/${user._id}`, { replace: true });
    } catch (err) {
      setLoginError(getApiErrorMessage(err, 'Login failed.'));
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setRegisterSubmitting(true);
    setRegisterError('');

    try {
      await registerUser(registerForm);
      const user = await loginUser({
        login_name: registerForm.login_name,
        password: registerForm.password,
      });
      onAuthChange(user);
      navigate(`/users/${user._id}`, { replace: true });
    } catch (err) {
      setRegisterError(getApiErrorMessage(err, 'Registration failed.'));
    } finally {
      setRegisterSubmitting(false);
    }
  }

  return (
    <Box className="login-register">
      <Typography gutterBottom variant="h4">
        Photo Share
      </Typography>
      <Typography color="text.secondary" variant="body1">
        Sign in or create an account to browse photos.
      </Typography>

      <Grid container spacing={4} className="login-register-grid">
        <Grid item xs={12} md={5}>
          <Stack component="form" spacing={2} onSubmit={handleLogin}>
            <Typography variant="h5">Login</Typography>
            {loginError ? <Alert severity="error">{loginError}</Alert> : null}
            <TextField
              label="Login name"
              name="login_name"
              onChange={updateLoginField}
              required
              value={loginForm.login_name}
            />
            <TextField
              label="Password"
              name="password"
              onChange={updateLoginField}
              required
              type="password"
              value={loginForm.password}
            />
            <Button
              disabled={loginSubmitting}
              type="submit"
              variant="contained"
            >
              {loginSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={1}>
          <Divider className="login-register-divider" orientation="vertical" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack component="form" spacing={2} onSubmit={handleRegister}>
            <Typography variant="h5">Register</Typography>
            {registerError ? <Alert severity="error">{registerError}</Alert> : null}
            <TextField
              label="Login name"
              name="login_name"
              onChange={updateRegisterField}
              required
              value={registerForm.login_name}
            />
            <TextField
              label="Password"
              name="password"
              onChange={updateRegisterField}
              required
              type="password"
              value={registerForm.password}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First name"
                  name="first_name"
                  onChange={updateRegisterField}
                  required
                  value={registerForm.first_name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="last_name"
                  onChange={updateRegisterField}
                  required
                  value={registerForm.last_name}
                />
              </Grid>
            </Grid>
            <TextField
              label="Location"
              name="location"
              onChange={updateRegisterField}
              value={registerForm.location}
            />
            <TextField
              label="Description"
              multiline
              name="description"
              onChange={updateRegisterField}
              rows={3}
              value={registerForm.description}
            />
            <TextField
              label="Occupation"
              name="occupation"
              onChange={updateRegisterField}
              value={registerForm.occupation}
            />
            <Button
              disabled={registerSubmitting}
              type="submit"
              variant="contained"
            >
              {registerSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

LoginRegister.propTypes = {
  onAuthChange: PropTypes.func.isRequired,
};

export default LoginRegister;
