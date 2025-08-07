import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Link as LinkIcon,
  CalendarToday,
  Language,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { FloatingThemeToggle } from '../components/FloatingThemeToggle';
import { DataTable, type DataTableColumn } from '../components/DataTable';
import { scrapingService, type ScrapingLink } from '../api/scraping';

// Link cell component
const LinkCell: React.FC<{ value: string }> = ({ value }) => (
  <Typography 
    variant="body2" 
    color="primary.main"
    sx={{ 
      textDecoration: 'underline',
      cursor: 'pointer',
      '&:hover': {
        color: 'primary.dark'
      }
    }}
  >
    {value}
  </Typography>
);

export const LinksPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get URL parameters
  const urlParam = searchParams.get('url') || '';
  const nameParam = searchParams.get('name') || 'Unknown URL';
  
  // API data states
  const [links, setLinks] = useState<ScrapingLink[]>([]);
  const [pagination, setPagination] = useState<{ totalItems: number; currentPage: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Load links from API
  const loadLinks = React.useCallback(async (pageNumber: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await scrapingService.getLinks({
        page: pageNumber + 1, // API expects 1-based pagination
        limit: rowsPerPage,
        url: urlParam
      });
      
      setLinks(response.links);
      setPagination({
        totalItems: response.pagination.totalItems,
        currentPage: response.pagination.currentPage
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  }, [urlParam]);

  // Load data on component mount and when page changes
  useEffect(() => {
    if (urlParam) {
      loadLinks(page);
    } else {
      setError('No URL specified');
      setLoading(false);
    }
  }, [page, urlParam, loadLinks]);

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle back button
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Transform API data to match table format
  const transformedData = links.map(link => ({
    id: link.id,
    name: link.name,
    link: link.link,
    date: link.createdAt
  }));

  // Format link cell function
  const formatLinkCell = (value: unknown) => <LinkCell value={String(value)} />;

  // Define table columns
  const columns: DataTableColumn[] = [
    {
      id: 'name',
      label: 'Name',
      icon: <Language fontSize="small" />,
      align: 'left'
    },
    {
      id: 'link',
      label: 'Total Links',
      icon: <LinkIcon fontSize="small" />,
      align: 'center',
      format: formatLinkCell
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
        {/* Back Button and Title */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Back to Dashboard
          </Button>

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
            <LinkIcon sx={{ mr: 2, fontSize: '2rem', verticalAlign: 'middle' }} />
            Links for {nameParam}
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              mb: 2,
              wordBreak: 'break-all'
            }}
          >
            URL: {urlParam}
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
              icon={<LinkIcon />}
              label={`${pagination?.totalItems || 0} Total Links`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<CalendarToday />}
              label="All Time" 
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
          emptyMessage="No links found for this URL"
        />
      </Container>

      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />
    </Box>
  );
};
