
export interface DocumentModel {
  docId: string;        // Unique identifier
  docType: string;      // Document type
  data: {
    // Document-specific fields
  }
}