export interface DocumentModel {
  docId: string; // Unique identifier
  docType: string; // Document type
  data: {
    field: string;
    // Document-specific fields
  };
}
