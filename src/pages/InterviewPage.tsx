import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  CheckCircle,
  TrendingUp,
  LightbulbOutlined,
  WarningAmber,
  Download,
  Replay,
  Home,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import {
  JobType,
  InterviewDifficulty,
  InterviewQuestion,
  InterviewSession,
  AIFeedback,
  UserResponse,
} from '../types';
import { interviewApiService } from '../services/interviewApi';
import { sessionStorageService } from '../services/sessionStorage';

interface InterviewPageProps {
  jobType: JobType;
  difficulty: InterviewDifficulty;
  resumeText?: string;
  onComplete: (session: InterviewSession) => void;
  onBack: () => void;
  onHome: () => void;
}

/**
 * Interview Simulation Page Component
 * Handles the interview question flow and feedback
 */
// eslint-disable-next-line max-lines-per-function
const InterviewPage: React.FC<InterviewPageProps> = ({
  jobType,
  difficulty,
  resumeText,
  onComplete,
  onBack,
  onHome,
}) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<AIFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const newSession = await interviewApiService.createSession(
          'user-demo',
          jobType,
          difficulty,
          resumeText
        );
        setSession(newSession);
        sessionStorageService.setCurrentSession(newSession);
      } catch (err) {
        setError('Failed to initialize interview session');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [jobType, difficulty, resumeText]);

  const currentQuestion: InterviewQuestion | undefined =
    session?.questions[currentQuestionIndex];

  const handleSubmitResponse = useCallback(async () => {
    if (!session || !currentQuestion || !userResponse.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Record user response
      const response: UserResponse = {
        questionId: currentQuestion.id,
        response: userResponse,
        timestamp: new Date(),
      };

      // Get AI feedback
      const feedback = await interviewApiService.analyzeResponse(
        currentQuestion,
        userResponse,
        resumeText
      );

      // Update session
      const updatedSession: InterviewSession = {
        ...session,
        responses: [...session.responses, response],
        feedback: [...session.feedback, feedback],
      };

      setSession(updatedSession);
      sessionStorageService.setCurrentSession(updatedSession);
      setCurrentFeedback(feedback);
      setShowFeedback(true);
    } catch (err) {
      setError('Failed to analyze response. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [session, currentQuestion, userResponse, resumeText]);

  const handleNextQuestion = useCallback(() => {
    if (!session) {
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      // Interview complete
      const completedSession: InterviewSession = {
        ...session,
        completedAt: new Date(),
        overallScore:
          session.feedback.reduce((sum, f) => sum + f.score, 0) /
          session.feedback.length,
      };
      setSession(completedSession);
      sessionStorageService.saveSession(completedSession);
      sessionStorageService.clearCurrentSession();
      setIsComplete(true);
      onComplete(completedSession);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setUserResponse('');
      setCurrentFeedback(null);
      setShowFeedback(false);
    }
  }, [session, currentQuestionIndex, onComplete]);

  const handleDownloadTranscript = useCallback(() => {
    if (!session) {
      return;
    }
    const transcript = interviewApiService.generateTranscript(session);
    sessionStorageService.downloadTranscript(transcript);
  }, [session]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={48} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Preparing your interview...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box sx={{ minHeight: '100vh', p: 4 }}>
        <Alert severity="error">
          Failed to load interview session. Please try again.
        </Alert>
        <Button onClick={onBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Complete screen
  if (isComplete) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle
              sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Interview Complete!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Great job completing your practice interview
            </Typography>

            {/* Overall Score */}
            <Paper
              sx={{
                p: 3,
                mb: 4,
                bgcolor: 'primary.main',
                color: 'white',
              }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                Overall Score
              </Typography>
              <Typography variant="h2" fontWeight="bold">
                {session.overallScore?.toFixed(1) || '—'}/10
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Based on {session.feedback.length} responses
              </Typography>
            </Paper>

            {/* Question Summary */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Question Summary
              </Typography>
              {session.questions.map((q, index) => {
                const feedback = session.feedback[index];
                return (
                  <Card key={q.id} sx={{ mb: 2 }} variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {index + 1}. {q.question}
                        </Typography>
                        <Chip
                          label={`${feedback?.score || 0}/10`}
                          color={
                            (feedback?.score || 0) >= 8
                              ? 'success'
                              : (feedback?.score || 0) >= 6
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadTranscript}
              >
                Download Transcript
              </Button>
              <Button
                variant="outlined"
                startIcon={<Replay />}
                onClick={onBack}
              >
                Practice Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={onHome}
              >
                Back to Home
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button startIcon={<ArrowBack />} onClick={onBack} size="small">
            Exit Interview
          </Button>
        </Box>

        {/* Progress Stepper */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stepper activeStep={currentQuestionIndex} alternativeLabel>
            {session.questions.map((q, index) => (
              <Step key={q.id} completed={index < currentQuestionIndex}>
                <StepLabel>Q{index + 1}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Question Card */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </Typography>
            <Chip
              label={currentQuestion?.category}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          <Typography variant="h5" gutterBottom fontWeight="medium">
            {currentQuestion?.question}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Response Input */}
          {!showFeedback ? (
            <Box>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder="Type your response here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                disabled={isAnalyzing}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {userResponse.length} characters
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim() || isAnalyzing}
                  endIcon={isAnalyzing ? <CircularProgress size={20} /> : <ArrowForward />}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Submit Response'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* User's Response */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="overline" color="text.secondary">
                  Your Response
                </Typography>
                <Typography variant="body1">{userResponse}</Typography>
              </Paper>

              {/* Feedback Display */}
              {currentFeedback && (
                <FeedbackDisplay feedback={currentFeedback} />
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  endIcon={<ArrowForward />}
                >
                  {currentQuestionIndex < session.questions.length - 1
                    ? 'Next Question'
                    : 'Complete Interview'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

// Feedback Display Component
interface FeedbackDisplayProps {
  feedback: AIFeedback;
}

// eslint-disable-next-line max-lines-per-function
const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  const [expanded, setExpanded] = useState(true);

  const getScoreColor = (score: number) => {
    if (score >= 8) {
      return 'success';
    }
    if (score >= 6) {
      return 'warning';
    }
    return 'error';
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUp color="primary" />
            <Typography variant="h6" fontWeight="bold">
              AI Feedback
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`Score: ${feedback.score}/10`}
              color={getScoreColor(feedback.score)}
            />
            <IconButton size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />

          {/* Strengths */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="success.main"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <CheckCircle fontSize="small" />
              Strengths
            </Typography>
            <List dense>
              {feedback.strengths.map((strength, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Areas for Improvement */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="warning.main"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <WarningAmber fontSize="small" />
              Areas for Improvement
            </Typography>
            <List dense>
              {feedback.improvements.map((improvement, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WarningAmber fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={improvement} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Suggestions */}
          <Box>
            <Typography
              variant="subtitle2"
              color="info.main"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <LightbulbOutlined fontSize="small" />
              Suggestions
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'info.lighter' }} variant="outlined">
              <Typography variant="body2">{feedback.suggestions}</Typography>
            </Paper>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default InterviewPage;
