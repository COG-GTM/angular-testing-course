import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function About() {
  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to the Angular Testing Course
      </Typography>
      <Box
        component="img"
        src="https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png"
        alt="Course Logo"
        sx={{
          maxWidth: 200,
          borderRadius: '4px',
          boxShadow: '0 6px 6px -3px #0003, 0 10px 14px 1px #00000024, 0 4px 18px 3px #0000001f',
        }}
      />
    </Box>
  );
}

export default About;
