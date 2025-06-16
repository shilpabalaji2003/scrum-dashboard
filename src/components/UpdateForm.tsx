import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FormData {
  employeeName: string;
  updates: string[];
  currentUpdate: string;
  githubIssueLink: string;
  issueDescription: string;
  buildNumber: string;
  issueStatus: string;
  date: Date;
}

const UpdateForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    employeeName: '',
    updates: [],
    currentUpdate: '',
    githubIssueLink: '',
    issueDescription: '',
    buildNumber: '',
    issueStatus: 'N/A',
    date: new Date(),
  });

  const handleAddUpdate = () => {
    if (formData.currentUpdate.trim()) {
      setFormData({
        ...formData,
        updates: [...formData.updates, formData.currentUpdate.trim()],
        currentUpdate: ''
      });
    }
  };

  const handleRemoveUpdate = (index: number) => {
    setFormData({
      ...formData,
      updates: formData.updates.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddUpdate();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.updates.length === 0) {
      alert('Please add at least one update');
      return;
    }
    setLoading(true);
    try {
      const data = {
        ...formData,
        updates: formData.updates.join('\n'),
        date: formData.date.toISOString(),
      };
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/updates/${id}`, data);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/updates`, data);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving update:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchUpdate = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/updates/${id}`);
          const update = response.data;
          setFormData({
            ...formData,
            employeeName: update.employeeName || '',
            updates: update.updates ? update.updates.split('\n') : [],
            currentUpdate: '',
            githubIssueLink: update.githubIssueLink || '',
            issueDescription: update.issueDescription || '',
            buildNumber: update.buildNumber || '',
            issueStatus: update.issueStatus || 'N/A',
            date: new Date(update.date),
          });
        } catch (error) {
          console.error('Error fetching update:', error);
        }
      };
      fetchUpdate();
    }
  }, [id]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Update' : 'Add New Update'}
      </Typography>

      <TextField
        fullWidth
        label="Employee Name"
        value={formData.employeeName}
        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
        required
        margin="normal"
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Add Update"
          value={formData.currentUpdate}
          onChange={(e) => setFormData({ ...formData, currentUpdate: e.target.value })}
          onKeyPress={handleKeyPress}
          placeholder="Type your update and press Enter or click Add Update"
          margin="normal"
        />
        <Button
          variant="outlined"
          onClick={handleAddUpdate}
          disabled={!formData.currentUpdate.trim()}
          sx={{ mt: 1 }}
        >
          Add Update
        </Button>
      </Box>

      {formData.updates.length > 0 && (
        <Paper sx={{ mt: 2, p: 2, maxHeight: 200, overflow: 'auto' }}>
          <List>
            {formData.updates.map((update, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveUpdate(index)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={`• ${update}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <TextField
        fullWidth
        label="GitHub Issue Link"
        value={formData.githubIssueLink}
        onChange={(e) => setFormData({ ...formData, githubIssueLink: e.target.value })}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Issue Description"
        value={formData.issueDescription}
        onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Build Number"
        value={formData.buildNumber}
        onChange={(e) => setFormData({ ...formData, buildNumber: e.target.value })}
        margin="normal"
      />

      <TextField
        fullWidth
        select
        label="Issue Status"
        value={formData.issueStatus}
        onChange={(e) => setFormData({ ...formData, issueStatus: e.target.value })}
        margin="normal"
      >
        <MenuItem value="N/A">N/A</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="Blocked">Blocked</MenuItem>
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={formData.date}
          onChange={(newDate) => newDate && setFormData({ ...formData, date: newDate })}
          sx={{ width: '100%', mt: 2 }}
        />
      </LocalizationProvider>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || formData.updates.length === 0}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ minWidth: 100 }}
        >
          {loading ? 'Saving...' : (id ? 'Update' : 'Submit')}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateForm; 