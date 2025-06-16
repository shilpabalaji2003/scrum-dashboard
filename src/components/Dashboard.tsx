import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

interface Update {
  _id: string;
  employeeName: string;
  updates: string;
  githubIssueLink: string;
  issueDescription: string;
  buildNumber: string;
  issueStatus: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [employeeFilter, setEmployeeFilter] = useState('');

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/updates`);
      console.log('Fetched updates:', response.data); // Debug log
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
      setError('Failed to fetch updates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/updates/${id}`);
        fetchUpdates(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting update:', error);
        alert('Failed to delete update. Please try again.');
      }
    }
  };

  const filteredUpdates = updates.filter(update => {
    const updateDate = new Date(update.date);
    const matchesDate = (!startDate || updateDate >= startDate) && 
                       (!endDate || updateDate <= endDate);
    const matchesEmployee = !employeeFilter || 
                           update.employeeName.toLowerCase().includes(employeeFilter.toLowerCase());
    return matchesDate && matchesEmployee;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Daily Updates Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add')}
        >
          Add New Update
        </Button>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ minWidth: 200 }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ minWidth: 200 }}
          />
        </LocalizationProvider>
        <TextField
          label="Filter by Employee"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {filteredUpdates.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          No updates found
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredUpdates.map((update) => (
            <Card key={update._id} elevation={2}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {update.employeeName}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      whiteSpace: 'pre-wrap',
                      '& ul': {
                        margin: 0,
                        paddingLeft: '20px',
                      },
                      '& li': {
                        marginBottom: '8px',
                      }
                    }}>
                      <ul>
                        {update.updates.split('\n').map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                      </ul>
                    </Typography>
                    
                    {update.githubIssueLink && (
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        <a href={update.githubIssueLink} target="_blank" rel="noopener noreferrer">
                          GitHub Issue
                        </a>
                      </Typography>
                    )}
                    
                    {update.issueDescription && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Issue: {update.issueDescription}
                      </Typography>
                    )}
                    
                    {update.buildNumber && (
                      <Typography variant="body2" color="text.secondary">
                        Build: {update.buildNumber}
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                      Status: {update.issueStatus}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Date: {format(new Date(update.date), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => navigate(`/edit/${update._id}`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(update._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 