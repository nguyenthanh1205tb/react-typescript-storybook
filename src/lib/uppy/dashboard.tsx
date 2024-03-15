import { useToast } from '@/src/components/ui/use-toast';
import { createUppyInstance } from '@/src/configs/uppy';
import useAppStore from '@/src/stores/useAppStore';
import UppyStore from '@/src/stores/useUppyStore';
import { useQueryClient } from '@tanstack/react-query';
import type { Uppy } from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import { Computer } from 'lucide-react';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { cn } from '../utils';
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
    onFileAdded,
    onChangeUploadPercent,
    onFileUpload,
    setIsDisabledUploadButton,
  } = props;

  const [uppyInstance, setUppyInstance] = useState<Uppy>();
  const [isFileAdded, setIsFileAdded] = useState(false);
  const { updateUploadStatusMap } = UppyStore();
  const { toast } = useToast();
  const { listMediaQueries, config } = useAppStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isFileAdded) {
      uppyInstance?.upload();
    }
  }, [isFileAdded]);

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
    if (!config?.organizationId) {
      return () => {};
    }

    const uppy = createUppyInstance({});

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
        organizationId: config.organizationId,
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
            organizationId: config.organizationId,
          });
        }
      })
      .on('file-added', (file) => {
        if (setIsDisabledUploadButton) setIsDisabledUploadButton(false);
        const contentId = getContentId(file.id) || uuid();
        saveContentIdToLocalStorage(file.id, contentId);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        typeof onFileAdded === 'function' && onFileAdded(file, contentId);
        console.log('File added:', file, contentId);

        uppy.setFileMeta(file.id, {
          contentId,
          organizationId: config.organizationId,
          templateId: config.templateId,
        });

        setIsFileAdded(true);
      })
      .on('file-removed', () => {
        if (setIsDisabledUploadButton) setIsDisabledUploadButton(true);
      })
      .on('upload', (file) => {
        const ids = file?.fileIDs;
        const contentIds = ids?.map((id) => getContentId(id)).filter(Boolean);
        console.log('ContentIds:', contentIds);
        console.log('File:', file);
        if (onFileUpload) onFileUpload(contentIds as string[], undefined);
      })
      .on('upload-success', (file, response) => {
        queryClient.invalidateQueries({
          queryKey: ['getListMedia', listMediaQueries],
        });
      })
      .on('complete', (result) => {
        const successFiles = result?.successful || [];
        successFiles.map((f) => deleteFileContentId(f.id));
        setIsFileAdded(false);
        toast({
          description: 'Tải lên thành công',
        });
      })
      .on('error', (error) => {
        setIsFileAdded(false);
        toast({
          description: 'Tải lên thất bại',
        });
      });
  }, [config]);

  return (
    <label
      htmlFor="browser-files"
      className={cn(
        'tw-w-[35px] tw-h-[35px] tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-cursor-pointer'
      )}
      // onClick={() => onChangeMenu(SideMenuActive.LOCAL_FILES)}
    >
      <Computer size={18} />
      <input
        id="browser-files"
        type="file"
        accept="image/*, video/*"
        style={{ display: 'none' }}
        onChange={
          // handleFileInputChange
          (e) => {
            if (e?.target?.files) {
              console.log('Files:', e.target.files);
              uppyInstance?.addFiles(e.target.files as any);
            }
          }
        }
        multiple
      />
    </label>
  );
});

export default UppyDashboard;
