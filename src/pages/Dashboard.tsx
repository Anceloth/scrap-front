import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import {
  Link as LinkIcon,
  CalendarToday,
  TableChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { FloatingThemeToggle } from '../components/FloatingThemeToggle';
import { DataTable, type DataTableColumn, type DataTableRow } from '../components/DataTable';
import { useAuth } from '../context/auth/useAuth';
import { scrapingService, type ScrapingUrl, type PaginationInfo } from '../api/scraping';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
  const loadUrls = React.useCallback(async (pageNumber: number = 0) => {
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
  }, []);

  // Load data on component mount and when page changes
  useEffect(() => {
    loadUrls(page);
  }, [page, loadUrls]);

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle row click - navigate to links page
  const handleRowClick = (row: DataTableRow) => {
    const url = row.url as string;
    const name = row.name as string;
    navigate(`/links?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`);
  };

  // Transform API data to match table format
  const transformedData = urls.map(url => ({
    id: url.id,
    name: url.name,
    url: url.url,
    totalLinks: url.linksCount,
    date: url.createdAt
  }));

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      id: 'name',
      label: 'Name',
      icon: <TableChart fontSize="small" />,
      align: 'left'
    },
    {
      id: 'totalLinks',
      label: 'Total Links',
      icon: <LinkIcon fontSize="small" />,
      align: 'center'
    },
    {
      id: 'date',
      label: 'Date',
      icon: <CalendarToday fontSize="small" />,
      align: 'right'
    }
  ];

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
        <DataTable
          columns={columns}
          rows={transformedData}
          loading={loading}
          error={error}
          page={page}
          totalItems={pagination?.totalItems || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowClick={handleRowClick}
          emptyMessage="No URLs found"
        />

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
