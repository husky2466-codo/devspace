import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import IDE from './IDE.jsx';

createRoot(document.getElementById('root')).render(<IDE />);
