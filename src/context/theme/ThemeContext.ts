import { createContext } from 'react';
import type { ThemeContextType } from '../../types/theme';

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
