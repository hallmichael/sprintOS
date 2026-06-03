/**
 * Utility functions for the IndiTable component
 */

import { IndiViewProps } from '../views';
import { IndiColumn } from './type';

/**
 * Get a value from an object by a path string or array of path segments
 * @param obj The object to get the value from
 * @param path The path to the value, can be a string with dot notation or an array of path segments
 * @param defaultValue The default value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export const getValueByPath = <T = any>(obj: Record<string, any>, path: string | string[], defaultValue?: any): T => {
  if (!obj || !path) {
    return defaultValue;
  }

  // Convert string path to array (e.g., "user.address.city" => ["user", "address", "city"])
  const pathArray = Array.isArray(path) ? path : path.split('.');

  // Start with the object
  let current = obj;

  // Traverse the path
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i];

    // If the current value is null/undefined or the key doesn't exist, return the default value
    if (current === null || current === undefined || !Object.prototype.hasOwnProperty.call(current, key)) {
      return defaultValue;
    }

    // Move to the next level
    current = current[key];
  }

  // Return the final value or default if it's null/undefined
  return (current === undefined ? defaultValue : current) as T;
};

/**
 * Determine the alignment style based on the alignment prop
 * @param align The alignment value ('left', 'center', 'right')
 * @returns The corresponding style object
 */
export const getAlignmentStyle = (align?: 'left' | 'center' | 'right') => {
  switch (align) {
    case 'left':
      return { alignContent: 'left' as const, justifyContent: 'flex-start' as const };
    case 'center':
      return { alignContent: 'center' as const, justifyContent: 'center' as const };
    case 'right':
      return { alignContent: 'right' as const, justifyContent: 'flex-end' as const };
    default:
      return { alignContent: 'left' as const, justifyContent: 'center' as const, alignItems: 'flex-start' as const };
  }
};

/**
 * Get size-related styles based on the size prop
 * @param size The size value ('sm', 'md', 'lg')
 * @returns The corresponding style object
 */
export const getSizeStyle = (size?: 'xs' | 'sm' | 'md' | 'lg' | 'small' | 'middle' | 'large'): IndiViewProps => {
  switch (size) {
    case 'xs':
      return { py: '$1', px: '$2', gap: '$1', jc: 'center' };
    case 'sm':
    case 'small':
      return { padding: '$2', gap: '$2', jc: 'center' };
    case 'lg':
    case 'large':
      return { padding: '$4', gap: '$4', jc: 'center' };
    case 'md':
    case 'middle':
    default:
      return { py: '$3', px: '$2.5', gap: '$3', jc: 'center' }; // Match Figma padding (12px vertical, 16px horizontal)
  }
};

export const getCellProps = (column: IndiColumn<any>, bordered: boolean = false): IndiViewProps => {
  return {
    style: column.width ? { width: column.width } : { flex: column.colSpan || 1 },
    minWidth: column.minWidth || 40,
    maxWidth: column.maxWidth,
    ...getAlignmentStyle(column.align),
    ...(column.viewProps || {}),
    ...(bordered && { p: 0 }),
  };
};
