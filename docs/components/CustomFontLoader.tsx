import { useEffect } from 'react';
import { isWeb } from 'tamagui';

export const CustomFontLoader = () => {
  useEffect(() => {
    if (isWeb) {
      // Only do this on web
      const loadFonts = async () => {
        try {
          // Import the local font files
          const interRegular = require('../assets/fonts/inter/Inter-Regular.otf');
          const interMedium = require('../assets/fonts/inter/Inter-Medium.otf');
          const interSemiBold = require('../assets/fonts/inter/Inter-SemiBold.otf');
          const interBold = require('../assets/fonts/inter/Inter-Bold.otf');

          // Create a style element
          const style = document.createElement('style');
          style.textContent = `
            @font-face {
              font-family: 'Inter';
              src: url(${interRegular}) format('opentype');
              font-weight: 400;
            }
            
            @font-face {
              font-family: 'Inter';
              src: url(${interMedium}) format('opentype');
              font-weight: 500;
            }
            
            @font-face {
              font-family: 'Inter';
              src: url(${interSemiBold}) format('opentype');
              font-weight: 600;
            }
            
            @font-face {
              font-family: 'Inter';
              src: url(${interBold}) format('opentype');
              font-weight: 700;
            }
          `;

          // Append the style element to the document head
          document.head.appendChild(style);
        } catch (error) {
          console.error('Failed to load fonts:', error);
        }
      };

      loadFonts();
    }
  }, []);

  return null;
};
