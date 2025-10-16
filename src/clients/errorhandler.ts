// Error handler utility for API responses
export const errorHandler = (response: Response) => {
  if (!response.ok) {
    throw new Error(response.statusText || 'API request failed');
  }
  return response;
};
