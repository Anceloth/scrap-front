<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Project Guidelines

This is a React application built with Vite, TypeScript, and Material-UI. Please follow these guidelines when working on this project:

## Code Style & Best Practices
- Use TypeScript for all new files
- Follow React functional component patterns with hooks
- Use Material-UI components and theme system
- Keep components small and focused on a single responsibility
- Use proper type definitions and avoid `any` types
- All comments should be written in English
- Use meaningful variable and function names

## Project Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/context/` - React contexts organized by feature (theme, auth, etc.)
- `src/types/` - TypeScript type definitions
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions

## Context Management
- The theme context is already implemented for light/dark mode switching
- An auth context folder structure is prepared for future authentication implementation
- Each context should be in its own folder with proper exports

## Authentication
- The project includes a login/register form component
- Authentication logic is prepared but not yet implemented
- Future auth implementation should integrate with the existing form structure

## Material-UI Integration
- Use the established theme configuration
- Leverage Material-UI icons and components
- Follow Material Design principles
- The app supports both light and dark themes

## State Management
- Use React Context for global state
- Use useState/useReducer for local component state
- Implement proper error handling and loading states
