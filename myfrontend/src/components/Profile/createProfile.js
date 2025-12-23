import React, { useEffect, useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Toolbar, Container } from '@mui/material';
import { styled } from '@mui/system';
import api from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import LogoutSystem from './logout';

const CreateProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: null,
    is_public: true,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
        try {
           await api.get('api/check-profile/');
            navigate('/profil')
        } catch (err) {
          console.log(err.response?.data?.detail || 'Terjadi kesalahan.');
        }
    };

    fetchProfileData();
}, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0], 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('bio', formData.bio);
    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    }
    formDataToSend.append('is_public', formData.is_public);

    api.post('api/create-profile/', formDataToSend)
    .then((response) => {
      console.log('Success:', response.data);
      navigate('/profil')
    })
    .catch((error) => {
      console.error('Error:', error.response?.data || error.message);
    });
  };

  const Input = styled('input')({
    display: 'none',
  });

  return (
    <Container>
    <Toolbar />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Typography variant="h4">Create Profile</Typography>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <label htmlFor="avatar">
          <Input
            accept="image/*"
            id="avatar"
            type="file"
            name="avatar"
            onChange={handleFileChange}
          />
          <Button variant="contained" component="span">
            Upload Avatar
          </Button>
        </label>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.is_public}
              onChange={handleChange}
              name="is_public"
              color="primary"
            />
          }
          label="Public Profile"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>

      <LogoutSystem />
    </Container>
  );
};

export default CreateProfile;
