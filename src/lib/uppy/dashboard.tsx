import { createUppyInstance } from '@/src/configs/uppy';
import UppyStore from '@/src/stores/useUppyStore';
import type { Uppy } from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { v4 as uuid } from 'uuid';
// import '@/assets/css/libs/uppy-dashboard.css';

interface Props {
  organizationId: string;
  templateId: string;
  onFileAdded?: (file: any, contentId: string) => void;
  onChangeUploadPercent?: (contentId: string, percent: number) => void;
  onFileUpload?: (contentIds: string[], file: any) => void;
  setIsDisabledUploadButton?: (value: boolean) => void;
}

export const saveContentIdToLocalStorage = (
  fileId: string,
  contentId: string
) => {
  localStorage.setItem(fileId, contentId);
};

export const getContentId = (fileId: string) => {
  return localStorage.getItem(fileId);
};

export const deleteFileContentId = (fileId: string) => {
  return localStorage.removeItem(fileId);
};

const UppyDashboard = React.forwardRef((props: Props, ref) => {
  const {
    organizationId,
    templateId,
    onFileAdded,
    onChangeUploadPercent,
    onFileUpload,
    setIsDisabledUploadButton,
    // type,
  } = props;

  const [uppyInstance, setUppyInstance] = useState<Uppy>();
  const { updateUploadStatusMap } = UppyStore();

  useImperativeHandle(
    ref,
    () => {
      return {
        upload: () => {
          if (!uppyInstance) return null;
          return uppyInstance?.upload();
        },
      };
    },
    [uppyInstance]
  );

  // const allowTypes = (t?: ContentType) => {
  //   switch (t) {
  //     case ContentType.Image:
  //       return ['image/*'];
  //     case ContentType.Video:
  //       return ['video/*'];
  //     default:
  //       return ['*'];
  //   }
  // };

  useEffect(() => {
    if (uppyInstance) {
      uppyInstance.setOptions({
        restrictions: {
          // allowedFileTypes: allowTypes(type),
        },
      });
    }
  }, [uppyInstance]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!organizationId) {
      return () => {};
    }

    const uppy = createUppyInstance();
    setUppyInstance(uppy);

    uppy.on('upload-progress', (file, progress) => {
      if (!file?.id) {
        return;
      }

      const contentId = getContentId(file?.id);
      const percent = Math.round(
        (progress.bytesUploaded / progress.bytesTotal) * 100
      );
      if (onChangeUploadPercent)
        onChangeUploadPercent(contentId || '', percent);
      updateUploadStatusMap(file?.id, {
        organizationId,
        file,
        bytesUploaded: progress.bytesUploaded,
        bytesTotal: progress.bytesTotal,
        percent,
      });
    });

    uppy
      .on('files-added', (files) => {
        if (files?.length === 1) {
          return;
        }

        // uppy?.upload();
        for (const file of files) {
          updateUploadStatusMap(file?.id, {
            file,
            bytesUploaded: 0,
            bytesTotal: 0,
            percent: 0,
            organizationId,
          });
        }
      })
      .on('file-added', (file) => {
        if (setIsDisabledUploadButton) setIsDisabledUploadButton(false);
        const contentId = getContentId(file.id) || uuid();
        saveContentIdToLocalStorage(file.id, contentId);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        typeof onFileAdded === 'function' && onFileAdded(file, contentId);

        uppy.setFileMeta(file.id, {
          contentId,
          organizationId,
          templateId,
        });
      })
      .on('file-removed', () => {
        if (setIsDisabledUploadButton) setIsDisabledUploadButton(true);
      })
      .on('upload', (file) => {
        const ids = file?.fileIDs;
        const contentIds = ids?.map((id) => getContentId(id)).filter(Boolean);
        if (onFileUpload) onFileUpload(contentIds as string[], undefined);
      })
      .on('complete', (result) => {
        const successFiles = result?.successful || [];
        successFiles.map((f) => deleteFileContentId(f.id));
      });
  }, [organizationId]);

  return <div id="uppy-target"></div>;
});

export default UppyDashboard;
