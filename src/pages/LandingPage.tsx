import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Psychology,
  Description,
  Analytics,
  CheckCircle,
  Star,
  EmojiEvents,
  TrendingUp,
  AccessTime,
} from '@mui/icons-material';
import { PricingPlan } from '../types';

interface LandingPageProps {
  onStartInterview: () => void;
  onViewPricing: () => void;
  pricingPlans: PricingPlan[];
}

/**
 * Landing Page Component
 * Main entry point showcasing the interview prep tool
 */
// eslint-disable-next-line max-lines-per-function
const LandingPage: React.FC<LandingPageProps> = ({
  onStartInterview,
  onViewPricing,
  pricingPlans,
}) => {
  const features = [
    {
      icon: <Psychology sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'AI-Powered Feedback',
      description: 'Get instant, personalized feedback on your interview responses using advanced AI analysis.',
    },
    {
      icon: <Description sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Resume-Tailored Questions',
      description: 'Upload your resume and receive interview questions specifically tailored to your experience.',
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Detailed Reports',
      description: 'Download comprehensive interview transcripts with scores, strengths, and improvement areas.',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Multiple Job Types',
      description: 'Practice for software engineering, product management, data science, and many more roles.',
    },
  ];

  const stats = [
    { value: '1,500+', label: 'Interviews Completed' },
    { value: '7.5', label: 'Average Score' },
    { value: '85%', label: 'User Satisfaction' },
    { value: '8', label: 'Job Categories' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Ace Your Next Interview
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Practice with AI-powered mock interviews and get instant feedback to improve your performance
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={onStartInterview}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Start Free Interview
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onViewPricing}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              View Pricing
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 4, mt: -4 }}>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            p: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {stats.map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
          Why Choose Interview Prep?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to prepare for your dream job
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
                elevation={2}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Three simple steps to interview success
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                step: 1,
                icon: <Description />,
                title: 'Upload Resume (Optional)',
                description: 'Upload your resume for personalized questions tailored to your experience.',
              },
              {
                step: 2,
                icon: <Psychology />,
                title: 'Practice Interview',
                description: 'Answer AI-generated interview questions for your target job type.',
              },
              {
                step: 3,
                icon: <TrendingUp />,
                title: 'Get Feedback & Improve',
                description: 'Receive instant AI feedback and download your transcript.',
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    position: 'relative',
                  }}
                  elevation={2}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="pricing">
        <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Choose the plan that works for you
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: index === 2 ? '2px solid' : '1px solid',
                  borderColor: index === 2 ? 'primary.main' : 'grey.300',
                  position: 'relative',
                }}
                elevation={index === 2 ? 8 : 2}
              >
                {index === 2 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    BEST VALUE
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {plan.name}
                  </Typography>
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h3" component="span" fontWeight="bold">
                      ${plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.tier === 'monthly' ? '/month' : plan.tier === 'pay-per-use' ? '/interview' : ''}
                    </Typography>
                  </Box>
                  <List>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant={index === 2 ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    onClick={onStartInterview}
                    sx={{ mt: 2 }}
                  >
                    {plan.tier === 'free' ? 'Start Free' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonial Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" gutterBottom fontWeight="bold">
            What Users Say
          </Typography>
          <Paper sx={{ p: 4, mt: 4 }} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} sx={{ color: 'warning.main', fontSize: 32 }} />
              ))}
            </Box>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ fontStyle: 'italic', mb: 2 }}
            >
              "This tool helped me prepare for my software engineering interviews at top tech companies. 
              The AI feedback was incredibly helpful in identifying areas where I needed to improve."
            </Typography>
            <Typography textAlign="center" color="text.secondary">
              - Sarah K., Software Engineer
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Ready to Ace Your Interview?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Start practicing today with your first interview free
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <AccessTime sx={{ fontSize: 24 }} />
            <Typography variant="body1">Takes only 15-20 minutes</Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={onStartInterview}
            sx={{
              mt: 4,
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Get Started Now — It's Free!
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
