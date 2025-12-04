import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Psychology } from '@mui/icons-material';
import { LandingPage, ResumeUploadPage, InterviewPage } from './pages';
import { JobType, InterviewDifficulty, InterviewSession } from './types';
import { interviewApiService } from './services';
import './App.css';

/**
 * Main App component
 * Provides Material UI theme and Interview Prep application
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

type AppPage = 'landing' | 'setup' | 'interview' | 'complete';

interface InterviewConfig {
  jobType: JobType;
  difficulty: InterviewDifficulty;
  resumeText?: string;
}

// eslint-disable-next-line max-lines-per-function
function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [_completedSession, setCompletedSession] = useState<InterviewSession | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const pricingPlans = interviewApiService.getPricingPlans();

  const handleStartInterview = useCallback(() => {
    setCurrentPage('setup');
  }, []);

  const handleViewPricing = useCallback(() => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSetupComplete = useCallback(
    (jobType: JobType, difficulty: InterviewDifficulty, resumeText?: string) => {
      setInterviewConfig({ jobType, difficulty, resumeText });
      setCurrentPage('interview');
    },
    []
  );

  const handleInterviewComplete = useCallback((session: InterviewSession) => {
    setCompletedSession(session);
    setCurrentPage('complete');
  }, []);

  const handleBackToSetup = useCallback(() => {
    setCurrentPage('setup');
    setInterviewConfig(null);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentPage('landing');
    setInterviewConfig(null);
    setCompletedSession(null);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onStartInterview={handleStartInterview}
            onViewPricing={handleViewPricing}
            pricingPlans={pricingPlans}
          />
        );
      case 'setup':
        return (
          <ResumeUploadPage
            onStartInterview={handleSetupComplete}
            onBack={handleBackToLanding}
          />
        );
      case 'interview':
        if (!interviewConfig) {
          setCurrentPage('setup');
          return null;
        }
        return (
          <InterviewPage
            jobType={interviewConfig.jobType}
            difficulty={interviewConfig.difficulty}
            resumeText={interviewConfig.resumeText}
            onComplete={handleInterviewComplete}
            onBack={handleBackToSetup}
            onHome={handleBackToLanding}
          />
        );
      case 'complete':
        // Show completed state - InterviewPage handles its own complete view
        if (!interviewConfig) {
          setCurrentPage('landing');
          return null;
        }
        return (
          <InterviewPage
            jobType={interviewConfig.jobType}
            difficulty={interviewConfig.difficulty}
            resumeText={interviewConfig.resumeText}
            onComplete={handleInterviewComplete}
            onBack={handleBackToSetup}
            onHome={handleBackToLanding}
          />
        );
      default:
        return null;
    }
  };

  const showAppBar = currentPage === 'landing';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        {showAppBar && (
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Psychology sx={{ mr: 1 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Interview Prep AI
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); handleStartInterview(); }}>
                  Start Interview
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); handleViewPricing(); }}>
                  Pricing
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        )}
        {renderPage()}
      </Box>
    </ThemeProvider>
  );
}

export default App;
