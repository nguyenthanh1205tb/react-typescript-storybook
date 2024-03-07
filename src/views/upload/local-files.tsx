import { Button } from '@/src/components/ui/button';
import { ORG_ID, TEMPLATE_ID } from '@/src/configs';
import UppyDashboard from '@/src/lib/uppy/dashboard';
import { PropsWithChildren, useRef } from 'react';
import {} from 'react-dropzone';

interface Props {}
function LocalFilesUpload({}: PropsWithChildren<Props>) {
  const uppyRef = useRef<{ upload: () => void }>();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <p className="tw-text-lg tw-font-bold">Upload từ máy của bạn</p>
      <UppyDashboard
        organizationId={ORG_ID}
        templateId={TEMPLATE_ID}
        ref={uppyRef}
      />
      <Button>Tải lên</Button>
    </div>
  );
}
export default LocalFilesUpload;
