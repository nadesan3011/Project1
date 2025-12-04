import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Description,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { JobType, InterviewDifficulty, ResumeData } from '../types';

interface ResumeUploadPageProps {
  onStartInterview: (
    jobType: JobType,
    difficulty: InterviewDifficulty,
    resumeText?: string
  ) => void;
  onBack: () => void;
}

const jobTypeLabels: Record<JobType, string> = {
  'software-engineer': 'Software Engineer',
  'product-manager': 'Product Manager',
  'data-scientist': 'Data Scientist',
  'marketing': 'Marketing',
  'finance': 'Finance',
  'sales': 'Sales',
  'customer-service': 'Customer Service',
  'general': 'General Interview',
};

const difficultyLabels: Record<InterviewDifficulty, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
};

/**
 * Resume Upload Page Component
 * Handles resume upload and interview configuration
 */
// eslint-disable-next-line max-lines-per-function
const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({
  onStartInterview,
  onBack,
}) => {
  const [jobType, setJobType] = useState<JobType>('general');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('mid');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useManualText, setUseManualText] = useState(false);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      // Validate file type
      const validTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
        setError('Please upload a .txt, .pdf, or .doc/.docx file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        // For demo purposes, we'll read text files directly
        // In production, you'd use a PDF/DOC parsing library or service
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const text = await file.text();
          setResumeData({
            fileName: file.name,
            fileSize: file.size,
            text,
            uploadedAt: new Date(),
          });
          setResumeText(text);
        } else {
          // For non-text files, we'd normally parse them on the server
          // For this demo, we'll show a message
          setError(
            'For this demo, please use a .txt file. In production, PDF and DOC files are fully supported.'
          );
        }
      } catch (err) {
        setError('Failed to read file. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const handleRemoveResume = useCallback(() => {
    setResumeData(null);
    setResumeText('');
    setUseManualText(false);
  }, []);

  const handleStartInterview = useCallback(() => {
    onStartInterview(jobType, difficulty, resumeText || undefined);
  }, [jobType, difficulty, resumeText, onStartInterview]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Set Up Your Interview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your interview practice session
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Configuration */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Interview Settings
              </Typography>

              {/* Job Type Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobType}
                  label="Job Type"
                  onChange={(e) => setJobType(e.target.value as JobType)}
                >
                  {Object.entries(jobTypeLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Difficulty Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={difficulty}
                  label="Difficulty Level"
                  onChange={(e) =>
                    setDifficulty(e.target.value as InterviewDifficulty)
                  }
                >
                  {Object.entries(difficultyLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Start Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleStartInterview}
                endIcon={<ArrowForward />}
                sx={{ py: 1.5 }}
              >
                Start Interview
              </Button>
            </Paper>
          </Grid>

          {/* Right Column - Resume Upload */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Resume (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload your resume to get personalized interview questions
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {uploading && <LinearProgress sx={{ mb: 2 }} />}

              {!resumeData && !useManualText ? (
                <Box>
                  {/* File Upload */}
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'grey.400',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      hidden
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <CloudUpload
                      sx={{ fontSize: 48, color: 'grey.400', mb: 1 }}
                    />
                    <Typography variant="body1" gutterBottom>
                      Drop your resume here or click to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supports .txt, .pdf, .doc, .docx (max 5MB)
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    textAlign="center"
                    sx={{ my: 2 }}
                    color="text.secondary"
                  >
                    — or —
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setUseManualText(true)}
                  >
                    Paste Resume Text Manually
                  </Button>
                </Box>
              ) : resumeData ? (
                <Card variant="outlined">
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Description color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {resumeData.fileName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(resumeData.fileSize / 1024).toFixed(1)} KB
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={handleRemoveResume}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </CardContent>
                </Card>
              ) : (
                <Box>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    placeholder="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setUseManualText(false);
                        setResumeText('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!resumeText.trim()}
                      onClick={() => {
                        setResumeData({
                          fileName: 'Pasted Resume',
                          fileSize: resumeText.length,
                          text: resumeText,
                          uploadedAt: new Date(),
                        });
                        setUseManualText(false);
                      }}
                    >
                      Save Resume
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Tips Section */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Interview Tips
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Use the STAR method (Situation, Task, Action, Result) for
                    behavioral questions
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Be specific with examples from your experience
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Keep responses focused and relevant
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" color="text.secondary">
                    Practice speaking clearly and confidently
                  </Typography>
                </li>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeUploadPage;
