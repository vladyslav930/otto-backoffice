import { IMyndAttachment, IMyndFile } from '@myndmanagement/services-otto';

export function getFilesAsAttachments(files: IMyndFile[]): IMyndAttachment[] {
  return files.map((file, i) => {
    return ({
      file,
      name: file.fileName,
      fileId: file.fileId,
      createdAt: (new Date()).toISOString(),
      attachmentId: file.fileId,
      type: null,
      createdBy: null,
      createdByUser: null,
      comments: null,
    }) as IMyndAttachment;
  });
}
