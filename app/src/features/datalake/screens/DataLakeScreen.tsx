import {
  Container,
  IndiBadge,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiH3,
  IndiLoader,
  IndiModal,
  IndiParagraph,
  IndiText,
  IndiXStack,
  IndiYStack,
  Toast,
} from '@/components';
import { FormTextInput } from '@/components/forms';
import { IndiColumn, IndiTable } from '@/components';
import { api } from '@/lib/api/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
interface DataSource {
  id: string;
  name: string;
  type: string;
  status: string;
  last_synced_at: string | null;
}

interface DataDocument {
  id: string;
  source_id: string;
  title: string;
  mime_type: string | null;
  size_bytes: number;
  role_tags: string[];
  status: string;
  chunk_count: number;
  error: string | null;
  created_at: string;
}

interface SearchResult {
  text: string;
  score: number;
  title: string | null;
}

// -- Helpers --
const STATUS_COLOR: Record<string, string> = {
  indexed: '$Green500',
  pending: '$Orange500',
  indexing: '$Blue500',
  failed: '$Red500',
  active: '$Green500',
};

const fmt = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

const sourceSchema = yup.object({ name: yup.string().required('Source name is required') });
const searchSchema = yup.object({ query: yup.string().required('Enter a search query') });

export default function DataLakeScreen() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [documents, setDocuments] = useState<DataDocument[]>([]);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchContext, setSearchContext] = useState('');
  const [sourceOpen, setSourceOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sourceForm = useForm({ resolver: yupResolver(sourceSchema), defaultValues: { name: '' } });
  const searchForm = useForm({ resolver: yupResolver(searchSchema), defaultValues: { query: '' } });

  const loadSources = () =>
    api.get<{ data: DataSource[] }>('/datalake/sources')
      .then((r) => setSources(r.data ?? []))
      .catch(() => setSources([]));

  const loadDocuments = (sourceId?: string) => {
    const path = sourceId ? `/datalake/sources/${sourceId}/documents` : '/datalake/documents';
    return api.get<{ data: DataDocument[] }>(path).then((r) => setDocuments(r.data ?? [])).catch(() => setDocuments([]));
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadSources(), loadDocuments()]);
      setLoading(false);
    })();
  }, []);

  const onSelectSource = async (src: DataSource | null) => {
    setSelectedSource(src);
    await loadDocuments(src?.id);
  };

  const onCreateSource = async (data: { name: string }) => {
    try {
      await api.post('/datalake/sources', { name: data.name, type: 'upload' });
      Toast.success({ message: `Source "${data.name}" created` });
      sourceForm.reset();
      setSourceOpen(false);
      loadSources();
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Create failed' });
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSource) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      // Use fetch directly for multipart
      const token = (await import('@/lib/api/client')).auth.token();
      const tenantId = (await import('@/lib/api/client')).auth.tenant();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      if (tenantId) headers['X-Tenant-ID'] = tenantId;
      const res = await fetch(`http://localhost:8000/api/datalake/sources/${selectedSource.id}/documents`, { method: 'POST', headers, body });
      if (!res.ok) throw new Error((await res.json()).message ?? res.statusText);
      Toast.success({ message: `${file.name} uploaded — indexing queued` });
      loadDocuments(selectedSource.id);
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Upload failed' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onDelete = async (doc: DataDocument) => {
    try {
      await api.del(`/datalake/documents/${doc.id}`);
      Toast.success({ message: `${doc.title} deleted` });
      loadDocuments(selectedSource?.id);
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Delete failed' });
    }
  };

  const onSearch = async (data: { query: string }) => {
    setSearching(true);
    setSearchResults(null);
    try {
      const res = await api.post<{ results: SearchResult[]; context: string }>('/datalake/search', { query: data.query, top_k: 5 });
      setSearchResults(res.results ?? []);
      setSearchContext(res.context ?? '');
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Search failed' });
    } finally {
      setSearching(false);
    }
  };

  const docColumns: IndiColumn<DataDocument>[] = [
    { title: 'File', dataIndex: 'title' },
    { title: 'Size', dataIndex: 'size_bytes', render: (_v, d) => fmt(d.size_bytes) },
    { title: 'Chunks', dataIndex: 'chunk_count' },
    { title: 'Status', dataIndex: 'status', render: (_v, d) => <IndiBadge color={STATUS_COLOR[d.status] ?? '$Neutral200'}>{d.status}</IndiBadge> },
    {
      title: '',
      dataIndex: 'id',
      render: (_v, d) => (
        <IndiButton type="ghost" color="red" size="sm" handlePress={() => onDelete(d)}>Delete</IndiButton>
      ),
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiXStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$2">
          <IndiH1>Data lake</IndiH1>
          <IndiXStack gap="$2">
            <IndiButton type="outline" color="primary" handlePress={() => setSearchOpen(true)}>
              Search / RAG
            </IndiButton>
            <IndiButton type="solid" color="primary" handlePress={() => setSourceOpen(true)}>
              New source
            </IndiButton>
          </IndiXStack>
        </IndiXStack>

        {loading ? (
          <IndiLoader />
        ) : (
          <IndiXStack gap="$4" flexWrap="wrap" alignItems="flex-start">

            {/* Source list */}
            <IndiYStack gap="$2" width="100%" $gtMd={{ width: '28%' }}>
              <IndiH3>Sources</IndiH3>
              {sources.length === 0 ? (
                <IndiCard padding="$4">
                  <IndiText color="$textSecondary">No sources yet. Create one to start ingesting files.</IndiText>
                </IndiCard>
              ) : (
                [{ id: '', name: 'All documents', type: 'all', status: 'active', last_synced_at: null } as DataSource, ...sources].map((src) => (
                  <IndiCard
                    key={src.id}
                    padding="$3"
                    gap="$1"
                    backgroundColor={selectedSource?.id === src.id || (src.id === '' && !selectedSource) ? '$Blue500' : '$containerBg'}
                    onPress={() => onSelectSource(src.id ? src : null)}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectSource(src.id ? src : null)}
                  >
                    <IndiText color={selectedSource?.id === src.id || (src.id === '' && !selectedSource) ? 'white' : '$textPrimary'} fontWeight="600">
                      {src.name}
                    </IndiText>
                    {src.id && <IndiBadge color={STATUS_COLOR[src.status] ?? '$Neutral200'}>{src.status}</IndiBadge>}
                  </IndiCard>
                ))
              )}
            </IndiYStack>

            {/* Document list + upload */}
            <IndiYStack gap="$3" flex={1} minWidth={280}>
              <IndiXStack justifyContent="space-between" alignItems="center">
                <IndiH3>{selectedSource ? selectedSource.name : 'All documents'}</IndiH3>
                {selectedSource && (
                  <IndiButton type="outline" color="primary" size="sm" loading={uploading}
                    handlePress={() => fileInputRef.current?.click()}>
                    Upload file
                  </IndiButton>
                )}
              </IndiXStack>

              {/* Hidden native file input */}
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={onUpload}
                accept=".txt,.md,.pdf,.docx,.html,.json,.csv" />

              {documents.length === 0 ? (
                <IndiCard padding="$6" alignItems="center" gap="$2">
                  <IndiText color="$textSecondary">No documents yet.</IndiText>
                  {selectedSource && (
                    <IndiParagraph color="$textSecondary">
                      Upload a file above to index it into the data lake.
                    </IndiParagraph>
                  )}
                </IndiCard>
              ) : (
                <IndiTable data={documents} columns={docColumns} />
              )}
            </IndiYStack>
          </IndiXStack>
        )}
      </IndiYStack>

      {/* New source modal */}
      <IndiModal isOpen={sourceOpen} setIsOpen={setSourceOpen} hideFooter title="New data source">
        <IndiYStack gap="$3" padding="$4">
          <IndiText color="$textSecondary">Create a source to organise your uploaded files.</IndiText>
          <FormTextInput control={sourceForm.control} name="name" label="Source name" placeholder="Company policies" />
          <IndiButton type="solid" color="primary" handlePress={sourceForm.handleSubmit(onCreateSource)}>
            Create source
          </IndiButton>
        </IndiYStack>
      </IndiModal>

      {/* RAG search modal */}
      <IndiModal isOpen={searchOpen} setIsOpen={setSearchOpen} hideFooter title="Search data lake">
        <IndiYStack gap="$3" padding="$4">
          <FormTextInput control={searchForm.control} name="query" label="Query" placeholder="What are the payment terms?" />
          <IndiButton type="solid" color="primary" loading={searching} handlePress={searchForm.handleSubmit(onSearch)}>
            Search
          </IndiButton>

          {searchResults !== null && (
            <IndiYStack gap="$2">
              <IndiText color="$textSecondary">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</IndiText>
              {searchResults.length === 0 ? (
                <IndiText color="$textNeutral">No matching documents found.</IndiText>
              ) : (
                searchResults.map((r, i) => (
                  <IndiCard key={i} padding="$3" gap="$1">
                    <IndiXStack justifyContent="space-between">
                      <IndiText color="$textSecondary">{r.title ?? 'Document'}</IndiText>
                      <IndiBadge color="$Blue500">score {r.score.toFixed(3)}</IndiBadge>
                    </IndiXStack>
                    <IndiText color="$textPrimary">{r.text}</IndiText>
                  </IndiCard>
                ))
              )}
              {searchContext && (
                <IndiCard padding="$3" backgroundColor="$pageBg" gap="$1">
                  <IndiText color="$textSecondary" fontWeight="600">Context (for prompt injection)</IndiText>
                  <IndiText color="$textNeutral" style={{ fontFamily: 'monospace', fontSize: 11 }}>{searchContext.slice(0, 400)}…</IndiText>
                </IndiCard>
              )}
            </IndiYStack>
          )}
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
