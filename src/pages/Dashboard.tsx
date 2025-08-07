import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Link as LinkIcon,
  CalendarToday,
  TableChart,
} from '@mui/icons-material';
import { Header } from '../components/Header';
import { FloatingThemeToggle } from '../components/FloatingThemeToggle';
import { useAuth } from '../context/auth/useAuth';
import { scrapingService, type ScrapingUrl, type PaginationInfo } from '../api/scraping';

export const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  
  // API data states
  const [urls, setUrls] = useState<ScrapingUrl[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Load URLs from API
  const loadUrls = async (pageNumber: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await scrapingService.getUrls({
        page: pageNumber + 1, // API expects 1-based pagination
        limit: rowsPerPage
      });
      
      setUrls(response.urls);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page changes
  useEffect(() => {
    loadUrls(page);
  }, [page]);

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

  // Transform API data to match table format
  const transformedData = urls.map(url => ({
    id: url.id,
    name: url.name,
    totalLinks: url.linksCount,
    date: url.createdAt
  }));

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? '#0a0a0a' 
            : '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Header />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading URLs...
          </Typography>
        </Box>
        <FloatingThemeToggle />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? '#0a0a0a' 
            : '#f5f5f5',
      }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Error loading URLs
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        </Container>
        <FloatingThemeToggle />
      </Box>
    );
  }

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
              label={`${pagination?.totalItems || 0} Total URLs`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<LinkIcon />}
              label={`${urls.reduce((sum, url) => sum + url.linksCount, 0)} Total Links`} 
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
                {transformedData.map((row) => {
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
            count={pagination?.totalItems || 0}
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
                {pagination?.totalItems || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {urls.length > 0 ? Math.round(urls.reduce((sum, url) => sum + url.linksCount, 0) / urls.length) : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Links per URL
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {urls.length > 0 ? Math.max(...urls.map(url => url.linksCount)) : 0}
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
