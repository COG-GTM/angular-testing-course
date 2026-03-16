import { Box, Typography } from '@mui/material';

function AboutPage() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Welcome!</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Welcome to the React Testing Course
      </Typography>
      <Box
        component="img"
        src="https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png"
        alt="Course Logo"
        sx={{
          display: 'block',
          mt: 2,
          boxShadow: 10,
        }}
      />
    </Box>
  );
}

export default AboutPage;
