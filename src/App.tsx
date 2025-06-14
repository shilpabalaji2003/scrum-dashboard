import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import UpdateForm from './components/UpdateForm';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`
          * {
            box-sizing: border-box;
          }
        `}
      </style>
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          width: '100%',
          }}>
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: '100%',
              px: { xs: 2, sm: 4, md: 6 },
              py: { xs: 2, sm: 3 },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: '1400px' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/update" element={<UpdateForm />} />
                <Route path="/update/:id" element={<UpdateForm />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
