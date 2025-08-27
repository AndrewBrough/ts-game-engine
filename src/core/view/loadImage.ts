import type { View } from './types';

export type ImageLoader = {
  image: Promise<HTMLImageElement>;
  loadedImage: HTMLImageElement | null;
  isReady: () => boolean;
  waitForImage: () => Promise<HTMLImageElement>;
  reload: (view: View) => Promise<HTMLImageElement>;
};

// Load image on creation if imageUrl is provided
export const loadImage = (view: View): ImageLoader => {
  const url = view.imageUrl;
  let loadedImage: HTMLImageElement | null = null;
  let currentPromise: Promise<HTMLImageElement> | null = null;

  const createImagePromise = (viewToLoad: View): Promise<HTMLImageElement> => {
    const urlToLoad = viewToLoad.imageUrl;

    if (!urlToLoad) {
      return Promise.reject(new Error('Image URL is required'));
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      // Check if it's a data URL
      if (urlToLoad.startsWith('data:')) {
        if (urlToLoad.startsWith('data:image/svg+xml')) {
          // Handle SVG data URLs
          try {
            // Decode the data URL to get the SVG content
            const decodedSvg = decodeURIComponent(urlToLoad.split(',')[1]);

            // Replace currentColor with actual colors
            const modifiedSvg = decodedSvg
              .replace(
                /fill='currentColor'/g,
                `fill='${viewToLoad.geometry.style.fill.color}'`
              )
              .replace(
                /stroke='currentColor'/g,
                `stroke='${viewToLoad.geometry.style.stroke.color}'`
              );

            console.log('Modified SVG from data URL:', modifiedSvg);

            // Create a new data URL with the modified SVG
            const modifiedDataUrl = `data:image/svg+xml;base64,${btoa(
              modifiedSvg
            )}`;
            img.src = modifiedDataUrl;

            img.onload = () => {
              loadedImage = img;
              resolve(img);
            };

            img.onerror = () => {
              reject(new Error(`Failed to load SVG data URL`));
            };
          } catch (error) {
            console.error('Error processing SVG data URL:', error);
            reject(error);
          }
        } else {
          // Handle other data URLs (PNG, JPG, etc.)
          img.src = urlToLoad;
          img.onload = () => {
            loadedImage = img;
            resolve(img);
          };
          img.onerror = () => {
            reject(new Error(`Failed to load data URL image`));
          };
        }
      } else if (urlToLoad.endsWith('.svg')) {
        // For SVG files, fetch and modify the content
        fetch(urlToLoad)
          .then(response => response.text())
          .then(svgText => {
            // Replace currentColor with actual colors
            const modifiedSvg = svgText
              .replace(
                /fill="currentColor"/g,
                `fill="${viewToLoad.geometry.style.fill.color}"`
              )
              .replace(
                /stroke="currentColor"/g,
                `stroke="${viewToLoad.geometry.style.stroke.color}"`
              );

            console.log('Modified SVG from URL:', modifiedSvg);

            // Create a blob URL for the modified SVG
            const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
            const blobUrl = URL.createObjectURL(blob);
            img.src = blobUrl;

            img.onload = () => {
              // Clean up the blob URL after loading
              URL.revokeObjectURL(blobUrl);
              loadedImage = img;
              resolve(img);
            };

            img.onerror = () => {
              URL.revokeObjectURL(blobUrl);
              reject(new Error(`Failed to load SVG: ${urlToLoad}`));
            };
          })
          .catch(error => {
            console.error('Error loading SVG:', error);
            reject(error);
          });
      } else {
        // For non-SVG images, load directly
        img.src = urlToLoad;
        img.onload = () => {
          loadedImage = img;
          resolve(img);
        };
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${urlToLoad}`));
      }
    });
  };

  // Initialize image loading if imageUrl is provided
  if (url) {
    currentPromise = createImagePromise(view);
  }

  // Function to check if image is ready
  const isReady = () => {
    return loadedImage !== null;
  };

  // Function to wait for image to be ready
  const waitForImage = () => {
    return currentPromise || Promise.reject(new Error('No image to wait for'));
  };

  // Function to reload image (useful when styles change)
  const reload = (viewToReload: View) => {
    loadedImage = null;
    currentPromise = createImagePromise(viewToReload);
    return currentPromise;
  };

  const imageLoader = {
    image: currentPromise || Promise.reject(new Error('No image URL provided')),
    get loadedImage() {
      return loadedImage;
    },
    isReady,
    waitForImage,
    reload,
  };

  // Update the loadedImage reference when the promise resolves
  if (currentPromise) {
    currentPromise
      .then(img => {
        loadedImage = img;
      })
      .catch(error => {
        console.error('Image loading failed:', error);
        loadedImage = null;
      });
  }

  return imageLoader;
};
