import { useState } from 'react';
import { TextField, Button, Grid, InputLabel, MenuItem, Select, FormControl } from '@mui/material';

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    distanceId: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    urlCer1: '',
    urlCer2: '',
    urlCer3: '',
    urlCer4: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data:", formData);
    // Make the API call with the formData here (e.g., using fetch or axios)
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        {/* Distance ID Dropdown */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="distance-label">Distance</InputLabel>
            <Select
              labelId="distance-label"
              id="distanceId"
              name="distanceId"
              value={formData.distanceId}
              label="Distance"
              onChange={handleChange}
            >
              <MenuItem value={1}>Distance 1</MenuItem>
              <MenuItem value={2}>Distance 2</MenuItem>
              <MenuItem value={3}>Distance 3</MenuItem>
              {/* Add more distance options here */}
            </Select>
          </FormControl>
        </Grid>

        {/* Receiver Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Receiver Name"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Receiver Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Receiver Address"
            name="receiverAddress"
            value={formData.receiverAddress}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Receiver Phone */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Receiver Phone"
            name="receiverPhone"
            value={formData.receiverPhone}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* URL Cer1 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certificate URL 1"
            name="urlCer1"
            value={formData.urlCer1}
            onChange={handleChange}
          />
        </Grid>

        {/* URL Cer2 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certificate URL 2"
            name="urlCer2"
            value={formData.urlCer2}
            onChange={handleChange}
          />
        </Grid>

        {/* URL Cer3 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certificate URL 3"
            name="urlCer3"
            value={formData.urlCer3}
            onChange={handleChange}
          />
        </Grid>

        {/* URL Cer4 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certificate URL 4"
            name="urlCer4"
            value={formData.urlCer4}
            onChange={handleChange}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Create Order
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateOrder;
