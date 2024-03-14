import { Button } from '@/src/components/ui/button';
import { ORG_ID, TEMPLATE_ID } from '@/src/configs';
import UppyDashboard from '@/src/lib/uppy/dashboard';
import { PropsWithChildren, useRef } from 'react';
import {} from 'react-dropzone';

interface Props {}
function LocalFilesUpload({}: PropsWithChildren<Props>) {
  const uppyRef = useRef<{ upload: () => void }>();

  const onUpload = () => {
    try {
      uppyRef.current?.upload();
    } catch (err) {
      console.log('Error:', err);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <p className="tw-text-lg tw-font-bold">Upload từ máy của bạn</p>
      <UppyDashboard
        organizationId={ORG_ID}
        templateId={TEMPLATE_ID}
        ref={uppyRef}
        onFileAdded={(file, contentId) => {
          console.log('File added:', file, contentId);
        }}
        onFileUpload={(contentIds, file) => {
          console.log('File uploaded:', contentIds, file);
        }}
      />
      <Button onClick={onUpload}>Tải lên</Button>
    </div>
  );
}
export default LocalFilesUpload;
