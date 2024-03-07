import { action } from 'mobx';

type FileStatus = {
  file: any;
  bytesTotal: number;
  bytesUploaded: number;
  percent?: number;
  organizationId: string;
};

class UppyStore {
  uploadStatusMap = {};

  @action
  updateUploadStatusMap = (fileId: string, file: FileStatus) => {
    this.uploadStatusMap = { ...this.uploadStatusMap, [fileId]: file };
  };

  @action
  clearStatusMap = () => {
    this.uploadStatusMap = {};
  };
}

export default new UppyStore();
