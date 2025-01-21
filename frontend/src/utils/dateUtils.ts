export const formatDate = (date: string | undefined, includeTime = false): string => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return includeTime
      ? d.toLocaleString('en-GB')
      : d.toLocaleDateString('en-GB');
  } catch (error) {
    return 'Invalid date';
  }
};
