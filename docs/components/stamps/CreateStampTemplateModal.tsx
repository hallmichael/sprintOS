import { useApolloClient } from '@apollo/client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  StampTemplatesDocument,
  useCreateMediaMutation,
  useCreateStampTemplateMutation,
  useStampTemplateQuery,
  useUpdateStampTemplateMutation,
} from '@/graphql/graphql';
import { useAppSelector, useUser } from '@/redux/app/selectors';
import { IndiButton } from '@/components/buttons';
import { IndiModal } from '@/components/modal';
import { Toast } from '@/components/toast';
import { IndiText } from '@/components/text';
import { IndiXStack, IndiYStack } from '@/components/views';
import {
  StampTemplateDesignModalContent,
  createEmptyStampDesignerRow,
  stampDocFromRow,
  stampDrawingRowHasInk,
  stampImageBoxPercentsForNaturalAspect,
  stampDesignerRowsFromStampTemplateItems,
  type StampDesignerRow,
} from '@/app/(app)/_pdf-editor-web-stamp-modals';

export type CreateStampTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** When set, the template is tied to this project; omit for org-wide (settings) stamps. */
  projectId?: string | string[];
  /** Called after a successful save; PDF editor uses this to open the Apply stamp flow. */
  onSaved?: (created: { id: string }) => void;
  /** When set, loads this template — same UI as create with title "Edit stamp". */
  editTemplateId?: string | null;
};

function normalizeProjectId(projectId: CreateStampTemplateModalProps['projectId']): string | undefined {
  if (projectId == null) return undefined;
  const v = Array.isArray(projectId) ? projectId[0] : projectId;
  return v && String(v).trim() !== '' ? String(v) : undefined;
}

export function CreateStampTemplateModal({
  isOpen,
  onClose,
  projectId,
  onSaved,
  editTemplateId = null,
}: CreateStampTemplateModalProps) {
  const user = useUser();
  const apolloClient = useApolloClient();
  const [createMedia] = useCreateMediaMutation();
  const [createStampTemplateMut] = useCreateStampTemplateMutation();
  const [updateStampTemplateMut] = useUpdateStampTemplateMutation();

  const { data: editTplData, loading: editTplLoading } = useStampTemplateQuery({
    variables: { id: editTemplateId! },
    skip: !isOpen || !editTemplateId,
    fetchPolicy: 'network-only',
  });
  const editTemplate = editTplData?.stampTemplate ?? null;
  const editHydratedRef = useRef(false);
  const [editFormHydrated, setEditFormHydrated] = useState(false);

  const [stampTemplateName, setStampTemplateName] = useState('');
  const [stampTemplateStateIds, setStampTemplateStateIds] = useState<string[]>([]);
  const userStates = useAppSelector((s) => s.settings.userStates);
  const stampCreateStatesSeededRef = useRef(false);
  const [stampCanvasW, setStampCanvasW] = useState(400);
  const [stampCanvasH, setStampCanvasH] = useState(300);
  const stampCanvasSubmitRef = useRef({ w: 400, h: 300 });
  const [stampDesignerRows, setStampDesignerRows] = useState<StampDesignerRow[]>([]);
  const [stampSaving, setStampSaving] = useState(false);

  const pid = normalizeProjectId(projectId);

  useEffect(() => {
    if (!isOpen) {
      editHydratedRef.current = false;
      setEditFormHydrated(false);
      return;
    }
    if (editTemplateId) return;
    setStampTemplateName('');
    setStampCanvasW(400);
    setStampCanvasH(300);
    stampCanvasSubmitRef.current = { w: 400, h: 300 };
    setStampDesignerRows([]);
    stampCreateStatesSeededRef.current = false;
  }, [isOpen, editTemplateId]);

  useEffect(() => {
    editHydratedRef.current = false;
    setEditFormHydrated(false);
  }, [editTemplateId]);

  useLayoutEffect(() => {
    if (!isOpen) {
      stampCreateStatesSeededRef.current = false;
      return;
    }
    if (editTemplateId) return;
    if (stampCreateStatesSeededRef.current) return;
    if (userStates.length === 0) return;
    setStampTemplateStateIds(userStates.map((s) => s.id));
    stampCreateStatesSeededRef.current = true;
  }, [isOpen, editTemplateId, userStates]);

  useEffect(() => {
    if (!isOpen || !editTemplateId) return;
    if (editTplLoading || !editTemplate) return;
    if (editHydratedRef.current) return;
    editHydratedRef.current = true;
    const t = editTemplate;
    setStampTemplateName(t.name);
    setStampCanvasW(t.canvas_width);
    setStampCanvasH(t.canvas_height);
    stampCanvasSubmitRef.current = { w: t.canvas_width, h: t.canvas_height };
    setStampTemplateStateIds(t.states.map((s) => s.id));
    setStampDesignerRows(stampDesignerRowsFromStampTemplateItems(t.items));
    setEditFormHydrated(true);
  }, [isOpen, editTemplateId, editTplLoading, editTemplate]);

  const handleStampAddText = useCallback((opts?: { font_size?: number; color?: string }) => {
    setStampDesignerRows((prev) => {
      const row = createEmptyStampDesignerRow(prev.length, 'text');
      return [
        ...prev,
        {
          ...row,
          ...(opts?.font_size != null ? { font_size: opts.font_size } : {}),
          ...(opts?.color != null ? { color: opts.color } : {}),
        },
      ];
    });
  }, []);

  const handleStampAddImage = useCallback((file: File) => {
    const pendingImagePreviewUrl = URL.createObjectURL(file);
    setStampDesignerRows((prev) => [
      ...prev,
      {
        ...createEmptyStampDesignerRow(prev.length, 'image'),
        pendingImageFile: file,
        pendingImagePreviewUrl,
      },
    ]);
    if (typeof Image === 'undefined') return;
    const img = new Image();
    const url = pendingImagePreviewUrl;
    img.onload = () => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (iw <= 0 || ih <= 0) return;
      const imageNaturalAspect = iw / ih;
      const { w: cw, h: ch } = stampCanvasSubmitRef.current;
      const { width, height } = stampImageBoxPercentsForNaturalAspect(imageNaturalAspect, cw, ch);
      setStampDesignerRows((prev) =>
        prev.map((r) =>
          r.item_type === 'image' && r.pendingImagePreviewUrl === url
            ? { ...r, imageNaturalAspect, width, height }
            : r,
        ),
      );
    };
    img.src = pendingImagePreviewUrl;
  }, []);

  const handleSaveStampTemplate = useCallback(async () => {
    if (!user?.id) return;
    const name = stampTemplateName.trim();
    if (!name) {
      Toast.error({ message: 'Enter a template name' });
      return;
    }
    if (stampDesignerRows.length === 0) {
      Toast.error({ message: 'Add at least one item to the stamp' });
      return;
    }
    setStampSaving(true);
    try {
      for (const row of stampDesignerRows) {
        if (row.item_type === 'drawing' && !stampDrawingRowHasInk(row)) {
          Toast.error({ message: 'Remove empty drawings or add ink before saving' });
          setStampSaving(false);
          return;
        }
      }
      const itemsPayload: Array<{
        item_type: string;
        sort_order: number;
        x: number;
        y: number;
        width: number;
        height: number;
        text_content?: string;
        color?: string;
        font_family?: string;
        font_size?: number;
        media_id?: string;
        rotation: number;
      }> = [];
      for (let i = 0; i < stampDesignerRows.length; i++) {
        const row = stampDesignerRows[i];
        let mediaId: string | undefined;
        if (row.item_type === 'image') {
          if (row.pendingImageFile) {
            const res = await createMedia({
              variables: {
                input: {
                  entity: 'User',
                  entity_id: user.id,
                  collection_name: 'stamp',
                },
                media: row.pendingImageFile,
              },
            });
            mediaId = res.data?.createMedia?.id;
            if (!mediaId) throw new Error('Image upload failed');
          } else if (row.media_id) {
            mediaId = row.media_id;
          } else {
            throw new Error('Each image item needs a file');
          }
        }
        itemsPayload.push({
          item_type: row.item_type,
          sort_order: i,
          x: row.x,
          y: row.y,
          width: row.width,
          height: row.height,
          text_content:
            row.item_type === 'text'
              ? row.text_content ?? ''
              : row.item_type === 'drawing'
                ? JSON.stringify(stampDocFromRow(row) ?? { v: 1, sw: 0.02, els: [] })
                : undefined,
          color:
            row.item_type === 'text' || row.item_type === 'drawing' ? row.color ?? '#000000' : undefined,
          font_family: row.item_type === 'text' ? row.font_family ?? undefined : undefined,
          font_size:
            row.item_type === 'text' || row.item_type === 'drawing' ? row.font_size ?? 14 : undefined,
          media_id: row.item_type === 'image' ? mediaId : undefined,
          rotation: row.rotation ?? 0,
        });
      }
      const { w: submitW, h: submitH } = stampCanvasSubmitRef.current;
      const stateIdsForApi = stampTemplateStateIds.filter((id): id is string => id != null && id !== '');
      if (editTemplateId) {
        await updateStampTemplateMut({
          variables: {
            input: {
              id: editTemplateId,
              name,
              project_id: editTemplate?.project_id ?? pid,
              canvas_width: submitW,
              canvas_height: submitH,
              items: itemsPayload,
              state_ids: stateIdsForApi.length > 0 ? stateIdsForApi : undefined,
            },
          },
        });
        setStampCanvasW(submitW);
        setStampCanvasH(submitH);
        await apolloClient.refetchQueries({ include: [StampTemplatesDocument] });
        Toast.success({ message: 'Stamp template updated' });
        onClose();
        onSaved?.({ id: editTemplateId });
      } else {
        const res = await createStampTemplateMut({
          variables: {
            input: {
              name,
              project_id: pid,
              canvas_width: submitW,
              canvas_height: submitH,
              items: itemsPayload,
              state_ids: stateIdsForApi.length > 0 ? stateIdsForApi : undefined,
            },
          },
        });
        const created = res.data?.createStampTemplate;
        setStampCanvasW(submitW);
        setStampCanvasH(submitH);
        await apolloClient.refetchQueries({ include: [StampTemplatesDocument] });
        Toast.success({ message: 'Stamp template saved' });
        onClose();
        if (created?.id) {
          onSaved?.({ id: created.id });
        }
      }
    } catch (e) {
      Toast.error({ message: e instanceof Error ? e.message : 'Failed to save stamp template' });
    } finally {
      setStampSaving(false);
    }
  }, [
    user?.id,
    stampTemplateName,
    stampTemplateStateIds,
    stampDesignerRows,
    createMedia,
    createStampTemplateMut,
    updateStampTemplateMut,
    editTemplateId,
    editTemplate,
    pid,
    apolloClient,
    onClose,
    onSaved,
  ]);

  const isEdit = Boolean(editTemplateId);
  const showEditLoader = isEdit && !editFormHydrated;

  return (
    <IndiModal
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open && stampSaving) return;
        if (!open) onClose();
      }}
      title={isEdit ? 'Edit stamp' : 'Create stamp'}
      size="2xl"
      contentPaddingHorizontal={0}
      contentPaddingVertical={0}
      footerComponent={
        <IndiXStack py="$4" px="$6" gap="$4" jc="flex-end">
          <IndiButton
            text="Cancel"
            type="outline"
            color="secondary"
            size="md"
            handlePress={onClose}
            disabled={stampSaving}
          />
          <IndiButton
            text={isEdit ? 'Save changes' : 'Save template'}
            type="solid"
            color="primary"
            size="md"
            handlePress={() => void handleSaveStampTemplate()}
            disabled={
              stampSaving ||
              stampDesignerRows.length === 0 ||
              showEditLoader
            }
          />
        </IndiXStack>
      }>
      {showEditLoader ? (
        <IndiYStack padding="$8" ai="center" jc="center" minHeight={200}>
          <IndiText>Loading…</IndiText>
        </IndiYStack>
      ) : (
        <StampTemplateDesignModalContent
          visible={isOpen}
          projectId={pid}
          saving={stampSaving}
          rows={stampDesignerRows}
          templateName={stampTemplateName}
          selectedStateIds={stampTemplateStateIds}
          onChangeSelectedStateIds={setStampTemplateStateIds}
          canvasW={stampCanvasW}
          canvasH={stampCanvasH}
          onChangeName={setStampTemplateName}
          onChangeCanvasW={setStampCanvasW}
          onChangeCanvasH={setStampCanvasH}
          onChangeRows={setStampDesignerRows}
          onAddText={handleStampAddText}
          onAddImage={handleStampAddImage}
          onSave={() => void handleSaveStampTemplate()}
          onClose={onClose}
          canvasSubmitRef={stampCanvasSubmitRef}
        />
      )}
    </IndiModal>
  );
}
