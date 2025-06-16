import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import axios from 'axios';
import { format } from 'date-fns';

interface UpdateFormData {
  employeeName: string;
  updates: string;
  githubIssueLink: string;
  issueDescription: string;
  buildNumber: string;
  issueStatus: 'N/A' | 'Opened' | 'Closed';
  date: Date;
}

const UpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulletMode, setIsBulletMode] = useState(false);
  const [formData, setFormData] = useState<UpdateFormData>({
    employeeName: '',
    updates: '',
    githubIssueLink: '',
    issueDescription: '',
    buildNumber: '',
    issueStatus: 'N/A',
    date: new Date(),
  });

  useEffect(() => {
    if (id) {
      const fetchUpdate = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/updates/${id}`);
          const update = response.data;
          setFormData({
            employeeName: update.employeeName || '',
            updates: update.updates || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        employeeName: formData.employeeName,
        date: format(formData.date, 'yyyy-MM-dd'),
        updates: formData.updates,
        githubIssueLink: formData.githubIssueLink,
        issueDescription: formData.issueDescription,
        buildNumber: formData.buildNumber,
        issueStatus: formData.issueStatus,
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
      setIsSubmitting(false);
    }
  };

  const handleUpdatesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (isBulletMode) {
      // Split by newlines and ensure each line starts with a bullet point
      const lines = value.split('\n');
      const formattedLines = lines.map(line => {
        if (line.trim() === '') return '';
        return line.startsWith('• ') ? line : `• ${line}`;
      });
      setFormData({ ...formData, updates: formattedLines.join('\n') });
    } else {
      setFormData({ ...formData, updates: value });
    }
  };

  const toggleBulletMode = () => {
    if (!isBulletMode) {
      // Convert to bullet points
      const lines = formData.updates.split('\n');
      const bulletedLines = lines.map(line => {
        if (line.trim() === '') return '';
        return line.startsWith('• ') ? line : `• ${line}`;
      });
      setFormData({ ...formData, updates: bulletedLines.join('\n') });
    } else {
      // Remove bullet points
      const lines = formData.updates.split('\n');
      const unbulletedLines = lines.map(line => line.replace(/^•\s*/, ''));
      setFormData({ ...formData, updates: unbulletedLines.join('\n') });
    }
    setIsBulletMode(!isBulletMode);
  };

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Box sx={{ width: '100%', maxWidth: '1000px' }}>
        <Paper 
          elevation={2}
          sx={{ 
            p: { xs: 2, sm: 3 },
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            {id ? 'Edit Update' : 'Add New Update'}
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3, 
              width: '100%'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Employee Name"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                required
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData({ ...formData, date: newValue });
                    }
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  Updates
                </Typography>
                <Tooltip title={isBulletMode ? "Disable bullet points" : "Enable bullet points"}>
                  <IconButton 
                    onClick={toggleBulletMode}
                    color={isBulletMode ? "primary" : "default"}
                    size="small"
                  >
                    <FormatListBulletedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.updates}
                onChange={handleUpdatesChange}
                required
                placeholder={isBulletMode ? "Enter updates (each line will be a bullet point)..." : "Enter your daily updates here..."}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Issues Raised
            </Typography>

            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="GitHub Issue Link"
                value={formData.githubIssueLink}
                onChange={(e) => setFormData({ ...formData, githubIssueLink: e.target.value })}
                placeholder="https://github.com/..."
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Issue Description"
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                placeholder="Describe the issue..."
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Build Number"
                value={formData.buildNumber}
                onChange={(e) => setFormData({ ...formData, buildNumber: e.target.value })}
                placeholder="e.g., build-123"
              />
            </Box>
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel>Issue Status</InputLabel>
                <Select
                  value={formData.issueStatus}
                  label="Issue Status"
                  onChange={(e) => setFormData({ ...formData, issueStatus: e.target.value as 'N/A' | 'Opened' | 'Closed' })}
                >
                  <MenuItem value="N/A">N/A</MenuItem>
                  <MenuItem value="Opened">Opened</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              width: '100%',
              mt: 2
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Submitting...' : (id ? 'Update' : 'Submit')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UpdateForm; 