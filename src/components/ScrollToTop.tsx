import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop component that scrolls the window to the top when the route changes.
 * Place this component inside your Router component in the AppRouter file.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Use 'auto' for instant scrolling instead of smooth animation
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}