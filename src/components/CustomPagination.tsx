import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Pagination,
  Stack,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';

export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  disabled = false
}) => {
  // Calculate display range
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  // Handle pagination change (Material-UI Pagination uses 1-based indexing)
  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page - 1); // Convert back to 0-based for our state
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 2,
        borderTop: (theme) => 
          `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      {/* Items display info */}
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          order: { xs: 2, sm: 1 },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Showing {startItem}-{endItem} of {totalItems} items
      </Typography>

      {/* Pagination controls */}
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
        sx={{ order: { xs: 1, sm: 2 } }}
      >
        {totalPages > 1 && (
          <>
            {/* First page button */}
            <IconButton
              onClick={() => onPageChange(0)}
              disabled={disabled || currentPage === 0}
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <FirstPage />
            </IconButton>

            {/* Previous page button */}
            <IconButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={disabled || currentPage === 0}
              size="small"
            >
              <KeyboardArrowLeft />
            </IconButton>

            {/* Page numbers */}
            <Pagination
              count={totalPages}
              page={currentPage + 1} // Convert to 1-based for Material-UI
              onChange={handleChange}
              disabled={disabled}
              color="primary"
              shape="rounded"
              size="small"
              showFirstButton={false}
              showLastButton={false}
              siblingCount={1}
              boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '0.875rem',
                  minWidth: '32px',
                  height: '32px',
                },
                '& .MuiPaginationItem-page': {
                  borderRadius: 1,
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '& .MuiPaginationItem-page:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            />

            {/* Next page button */}
            <IconButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={disabled || currentPage >= totalPages - 1}
              size="small"
            >
              <KeyboardArrowRight />
            </IconButton>

            {/* Last page button */}
            <IconButton
              onClick={() => onPageChange(totalPages - 1)}
              disabled={disabled || currentPage >= totalPages - 1}
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <LastPage />
            </IconButton>
          </>
        )}
      </Stack>
    </Box>
  );
};
