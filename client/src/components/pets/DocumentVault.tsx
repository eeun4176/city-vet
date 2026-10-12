import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, FileText, Upload } from 'lucide-react';
import { usePortal } from '../../hooks/usePortal';
import type { PetDocument } from '../../types/pets';
import { emptyPetDetails } from '../../data/mockPetRecords';
import { dateKey, formatPetDate } from '../../lib/petInsights';
import FormField from '../ui/FormField';
import Input, { inputClasses } from '../ui/Input';
import Button from '../ui/Button';
import { EmptyState } from '../ui/PageContent';
import { PetFacts, PetModal, PetSection, SourceBadge } from './PetUI';

export default function DocumentVault({ petId }: { petId: string }) {
  const { petDetails, updatePetDetails } = usePortal();
  const details = petDetails[petId] ?? emptyPetDetails();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<PetDocument | null>(null);
  const [message, setMessage] = useState('');
  function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get('file') as File;
    updatePetDetails(petId, { documents: [...details.documents, { id: crypto.randomUUID(), name: String(data.get('name')).trim(), category: data.get('category') as PetDocument['category'], date: dateKey(), source: 'Owner entered', fileName: file?.name || 'No file selected' }] });
    setUploading(false); setMessage('Mock document added. Only the name and metadata are kept in this session; no file is stored.');
  }
  return <PetSection title="Document Vault" action={<Button type="button" size="sm" onClick={() => setUploading(true)}><Upload size={15} />Mock upload</Button>}><p className="pets-muted">Registration, vaccination certificates, and other pet records in one place.</p><div className="pet-document-list">{details.documents.map(document => <article className="pet-document" key={document.id}><span className="pet-document-icon"><FileText size={20} /></span><div><h3>{document.name}</h3><p>{document.category} · {formatPetDate(document.date)}</p><SourceBadge source={document.source} /></div><button type="button" className="pet-icon-button" aria-label={`Preview ${document.name}`} onClick={() => setPreview(document)}><Eye size={18} /></button></article>)}</div>{!details.documents.length && <EmptyState icon={FileText} title="Your vault is ready" description="Add a mock document to see it listed here." />}<p role="status" className="pet-record-caption">{message || 'Mock interfaces only. No file storage or official document verification.'}</p>
    {uploading && <PetModal title="Add a mock document" onClose={() => setUploading(false)}><form className="pets-form" onSubmit={upload}><FormField label="Document name"><Input name="name" required maxLength={100} pattern=".*\S.*" autoFocus /></FormField><FormField label="Category"><select name="category" className={inputClasses}><option>Registration</option><option>Vaccination</option><option>Veterinary service</option><option>Other</option></select></FormField><FormField label="Choose a file (optional)"><input className="pets-file-input" type="file" name="file" accept=".pdf,.png,.jpg,.jpeg,.webp" /></FormField><p className="pets-muted">The file name is used for this mock list. The file contents will not be uploaded or stored.</p><div className="pets-button-row"><Button type="submit">Add to mock vault</Button><Button type="button" variant="outline" onClick={() => setUploading(false)}>Cancel</Button></div></form></PetModal>}
    {preview && <PetModal title="Document preview" onClose={() => setPreview(null)}><div className="pet-document-preview"><FileText size={40} /><span>City Vet · Sample document</span><h3>{preview.name}</h3><p>This is a document preview placeholder.</p></div><PetFacts items={[[ 'Category', preview.category ], [ 'Date', formatPetDate(preview.date) ], [ 'File name', preview.fileName || 'Sample document' ]]} /><SourceBadge source={preview.source} /><p className="pet-record-caption">This sample is not an official certificate.</p></PetModal>}
  </PetSection>;
}
