import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CustomPagination } from './CustomPagination';

export interface DataTableColumn {
  id: string;
  label: string;
  icon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown) => React.ReactNode;
}

export interface DataTableRow {
  id: string;
  [key: string]: unknown;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  loading: boolean;
  error: string | null;
  page: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowClick?: (row: DataTableRow) => void;
  emptyMessage?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  loading,
  error,
  page,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowClick,
  emptyMessage = 'No data available'
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get chip color based on value
  const getChipColor = (value: number) => {
    if (value > 200) return 'success';
    if (value > 100) return 'warning';
    return 'default';
  };

  // Safe string conversion
  const safeStringify = (value: unknown): string => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value === 'object') return JSON.stringify(value);
    return '';
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading data...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Error loading data
        </Typography>
        <Typography variant="body2">
          {error}
        </Typography>
      </Alert>
    );
  }

  return (
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
                  ? 'rgba(25, 118, 210, 0.15)' // Azul oscuro transparente
                  : 'rgba(25, 118, 210, 0.08)', // Azul claro transparente
              borderBottom: (theme) => 
                `2px solid ${theme.palette.mode === 'dark' 
                  ? 'rgba(100, 181, 246, 0.3)' 
                  : 'rgba(25, 118, 210, 0.2)'}`,
              '&:hover': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(25, 118, 210, 0.2)'
                    : 'rgba(25, 118, 210, 0.12)',
              },
            }}>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    color: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? '#64b5f6' // Azul claro en modo oscuro
                        : '#1976d2', // Azul oscuro en modo claro
                    textAlign: column.align || 'left',
                    py: 2.5, // Más padding vertical
                    px: 2,   // Padding horizontal consistente
                    background: 'transparent',
                    borderBottom: 'none', // Remover borde individual de celda
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: (() => {
                      if (column.align === 'center') return 'center';
                      if (column.align === 'right') return 'flex-end';
                      return 'flex-start';
                    })(),
                    gap: 1 
                  }}>
                    {column.icon}
                    {column.label}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow 
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
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
                  {columns.map((column) => {
                    const value = row[column.id];
                    let displayValue: React.ReactNode;

                    // Apply custom formatting if provided
                    if (column.format) {
                      displayValue = column.format(value);
                    }
                    // Default formatting for common data types
                    else if (column.id.includes('date') || column.id.includes('At')) {
                      displayValue = (
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(String(value))}
                        </Typography>
                      );
                    }
                    else if (column.id.includes('total') || column.id.includes('count') || column.id.includes('Links')) {
                      const numValue = Number(value) || 0;
                      displayValue = (
                        <Chip
                          label={numValue.toLocaleString()}
                          size="small"
                          color={getChipColor(numValue)}
                          variant="outlined"
                        />
                      );
                    }
                    else if (typeof value === 'string' && value.startsWith('http')) {
                      displayValue = (
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
                    }
                    else if (column.id === 'name') {
                      displayValue = (
                        <Typography variant="body1" fontWeight="medium">
                          {String(value)}
                        </Typography>
                      );
                    }
                    else {
                      displayValue = (
                        <Typography variant="body2">
                          {safeStringify(value)}
                        </Typography>
                      );
                    }

                    return (
                      <TableCell 
                        key={column.id}
                        sx={{ textAlign: column.align || 'left' }}
                      >
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Custom Pagination */}
      {totalItems > 0 && (
        <CustomPagination
          currentPage={page}
          totalPages={Math.ceil(totalItems / rowsPerPage)}
          totalItems={totalItems}
          itemsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          disabled={loading}
        />
      )}
    </Paper>
  );
};
