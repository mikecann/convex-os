/**
 * Helper functions for drag and drop operations
 */

/**
 * Check if drag event contains a specific data type
 */
export function hasDragDataType(
  event: React.DragEvent,
  dataType: string,
): boolean {
  return event.dataTransfer.types.includes(dataType);
}

/**
 * Get data from drag event
 */
export function getDragData(event: React.DragEvent, dataType: string): string {
  return event.dataTransfer.getData(dataType);
}

/**
 * Check if drag event contains files
 */
export function hasDragFiles(event: React.DragEvent): boolean {
  return event.dataTransfer.types.includes("Files");
}

/**
 * Get files from drag event
 */
export function getDragFiles(event: React.DragEvent): File[] {
  return Array.from(event.dataTransfer.files);
}

/**
 * Create a shouldAcceptDrag function for a specific data type
 */
export function createDataTypeFilter(dataType: string) {
  return (event: React.DragEvent) => hasDragDataType(event, dataType);
}

/**
 * Create a shouldAcceptDrag function that accepts files
 */
export function createFileFilter() {
  return (event: React.DragEvent) => hasDragFiles(event);
}

/**
 * Create a shouldAcceptDrag function that accepts either a data type or files
 */
export function createDataTypeOrFileFilter(dataType: string) {
  return (event: React.DragEvent) =>
    hasDragDataType(event, dataType) || hasDragFiles(event);
}
