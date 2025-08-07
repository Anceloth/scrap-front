import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material';
import {
  Link as LinkIcon,
  CalendarToday,
  TableChart,
} from '@mui/icons-material';
import { Header } from '../components/Header';
import { FloatingThemeToggle } from '../components/FloatingThemeToggle';
import { useAuth } from '../context/auth/useAuth';

// Sample data interface
interface DataRow {
  id: number;
  name: string;
  totalLinks: number;
  date: string;
}

// Sample data
const sampleData: DataRow[] = [
  { id: 1, name: 'Project Alpha', totalLinks: 245, date: '2025-08-07' },
  { id: 2, name: 'Marketing Campaign', totalLinks: 189, date: '2025-08-06' },
  { id: 3, name: 'Website Redesign', totalLinks: 322, date: '2025-08-05' },
  { id: 4, name: 'Mobile App', totalLinks: 156, date: '2025-08-04' },
  { id: 5, name: 'Social Media', totalLinks: 78, date: '2025-08-03' },
  { id: 6, name: 'E-commerce Platform', totalLinks: 421, date: '2025-08-02' },
  { id: 7, name: 'Analytics Dashboard', totalLinks: 267, date: '2025-08-01' },
  { id: 8, name: 'Customer Portal', totalLinks: 134, date: '2025-07-31' },
  { id: 9, name: 'API Documentation', totalLinks: 89, date: '2025-07-30' },
  { id: 10, name: 'Admin Panel', totalLinks: 198, date: '2025-07-29' },
  { id: 11, name: 'Blog Platform', totalLinks: 112, date: '2025-07-28' },
  { id: 12, name: 'Newsletter System', totalLinks: 67, date: '2025-07-27' },
  { id: 13, name: 'CRM Integration', totalLinks: 289, date: '2025-07-26' },
  { id: 14, name: 'Payment Gateway', totalLinks: 156, date: '2025-07-25' },
  { id: 15, name: 'User Authentication', totalLinks: 234, date: '2025-07-24' },
];

export const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get current page data
  const paginatedData = sampleData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: (theme) => 
        theme.palette.mode === 'dark' 
          ? '#0a0a0a' 
          : '#f5f5f5',
    }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: (theme) => 
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #ffffff 30%, #64b5f6 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <TableChart sx={{ mr: 2, fontSize: '2rem', verticalAlign: 'middle' }} />
            Data Dashboard
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              mb: 2,
            }}
          >
            Welcome back, {user?.username}! Here's your URLs data overview.
          </Typography>

          {/* Stats Chips */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 2,
            mb: 3,
          }}>
            <Chip 
              icon={<TableChart />}
              label={`${sampleData.length} Total URLs`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<LinkIcon />}
              label={`${sampleData.reduce((sum, item) => sum + item.totalLinks, 0)} Total Links`} 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              icon={<CalendarToday />}
              label="Last 30 Days" 
              color="info" 
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Data Table */}
        <Paper 
          elevation={0}
          sx={{
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: (theme) => 
              `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                }}>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    color: 'primary.main' 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableChart fontSize="small" />
                      Name
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    color: 'primary.main',
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <LinkIcon fontSize="small" />
                      Total Links
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    color: 'primary.main',
                    textAlign: 'right'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <CalendarToday fontSize="small" />
                      Date
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => {
                  // Determine chip color based on total links
                  const getChipColor = (links: number) => {
                    if (links > 200) return 'success';
                    if (links > 100) return 'warning';
                    return 'default';
                  };

                  return (
                    <TableRow 
                      key={row.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: (theme) => 
                            theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.04)',
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: (theme) => 
                            theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.02)'
                              : 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip
                          label={row.totalLinks.toLocaleString()}
                          size="small"
                          color={getChipColor(row.totalLinks)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(row.date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            component="div"
            count={sampleData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]}
            sx={{
              borderTop: (theme) => 
                `1px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)'}`,
              '.MuiTablePagination-toolbar': {
                paddingLeft: 3,
                paddingRight: 3,
              },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: 'text.secondary',
                fontSize: '0.875rem',
              },
            }}
          />
        </Paper>

        {/* Summary Info */}
        <Paper 
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: (theme) => 
              `1px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)'}`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
            gap: 3,
            textAlign: 'center'
          }}>
            <Box>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {sampleData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {Math.round(sampleData.reduce((sum, item) => sum + item.totalLinks, 0) / sampleData.length)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Links per URL
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {Math.max(...sampleData.map(item => item.totalLinks))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highest Link Count
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />
    </Box>
  );
};
