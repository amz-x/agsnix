/**
 * Convert file size to human readable format
 */
export const formatFileSize = (bytes: number, decimalPoint: number) => {
  // Validate
  if (bytes == 0 || typeof bytes !== 'number') {
    return '0 Bytes';
  }

  const k = 1000;
  const dm = decimalPoint || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
