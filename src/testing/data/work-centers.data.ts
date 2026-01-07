import { WorkCenterDocument } from '../../app/core/models/work-center-document.model';

const DATA: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } }
];

export function getWorkCenterDocumentData(index?: number, asArray = false): WorkCenterDocument | WorkCenterDocument[] {
  if (index !== undefined && index >= 0 && index < DATA.length) {
    const item = structuredClone(DATA[index]);
    return asArray ? [item] : item;
  }

  return structuredClone(DATA);
}
