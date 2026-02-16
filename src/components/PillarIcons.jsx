import { Users, Eye, Target } from 'lucide-react';

/**
 * PillarIcons // Principal Resolution
 * Minimalist, professional iconography for board-level presence.
 * Refactored for atmospheric compatibility and tactile feedback.
 */

// PEOPLE: THE HUMAN VARIABLE
export const IconPeople = () => (
  <Users 
    strokeWidth={1} 
    className="w-12 h-12 text-brand-accent opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
  />
);

// TRUTH: ABSOLUTE CANDOR
export const IconTruth = () => (
  <Eye 
    strokeWidth={1} 
    className="w-12 h-12 text-brand-accent opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
  />
);

// RESULTS: EFFECTIVENESS
export const IconResults = () => (
  <Target 
    strokeWidth={1} 
    className="w-12 h-12 text-brand-accent opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
  />
);