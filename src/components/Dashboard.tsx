import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

interface Update {
  _id: string;
  employeeName: string;
  date: string;
  updates: string;
  githubIssueLink?: string;
  issueDescription?: string;
  buildNumber?: string;
  issueStatus: 'N/A' | 'Opened' | 'Closed';
}

const Dashboard = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();

  const fetchUpdates = async (date?: Date) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/updates`, {
        params: date ? { date: format(date, 'yyyy-MM-dd') } : {},
      });
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  useEffect(() => {
    fetchUpdates(selectedDate || undefined);
  }, [selectedDate]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/updates/${id}`);
      fetchUpdates(selectedDate || undefined);
    } catch (error) {
      console.error('Error deleting update:', error);
    }
  };

  const formatUpdates = (updates: string) => {
    // Check if the text contains bullet points
    if (updates.includes('•')) {
      // Split by bullet points and filter out empty lines
      const bulletPoints = updates
        .split('•')
        .map(point => point.trim())
        .filter(point => point.length > 0);
      
      return (
        <List dense disablePadding>
          {bulletPoints.map((point, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={point}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '1rem',
                    lineHeight: 1.5,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      );
    }
    
    // If no bullet points, return as regular text
    return (
      <Typography variant="body1" paragraph>
        {updates}
      </Typography>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={2}
        sx={{ 
          p: { xs: 2, sm: 3 },
          mb: 3,
          width: '100%',
          borderRadius: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          alignItems: 'center', 
          width: '100%'
        }}>
          <Box sx={{ flex: '1 1 50%', minWidth: 300 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'All Updates'}
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 25%', minWidth: 200 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3, 
        width: '100%'
      }}>
        {updates.map((update) => (
          <Box key={update._id} sx={{ width: '100%' }}>
            <Card 
              elevation={2}
              sx={{ 
                width: '100%',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {format(new Date(update.date), 'MMMM d, yyyy')}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {update.employeeName}
                </Typography>
                {formatUpdates(update.updates)}
                
                {(update.githubIssueLink || update.issueDescription || update.buildNumber || update.issueStatus !== 'N/A') && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Issues Raised
                    </Typography>
                    
                    {update.githubIssueLink && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        GitHub Issue:{' '}
                        <Link 
                          href={update.githubIssueLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          sx={{ 
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {update.githubIssueLink}
                        </Link>
                      </Typography>
                    )}
                    
                    {update.issueDescription && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Description: {update.issueDescription}
                      </Typography>
                    )}
                    
                    {update.buildNumber && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Build Number: {update.buildNumber}
                      </Typography>
                    )}
                    
                    {update.issueStatus !== 'N/A' && (
                      <Typography 
                        variant="body2" 
                        color={update.issueStatus === 'Closed' ? 'success.main' : 'warning.main'}
                        paragraph
                      >
                        Status: {update.issueStatus}
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => navigate(`/update/${update._id}`)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(update._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
        {updates.length === 0 && (
          <Box sx={{ width: '100%' }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                width: '100%',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No updates found for this date
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 