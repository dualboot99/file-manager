export function getFileNameFromContentDispositionHeader(
  header: string
): string {
  const regex = /attachment;\sfilename="(.*)"$/;
  const matches = header.match(regex);
  if (matches) {
    return matches[1];
  }
  return '';
}

export function handlingResponse(res: any, filename: string) {
  const blob = new Blob([res], { type: res.type });
  downloadBlob(blob, filename);
}

export function downloadBlob(file: Blob, fileName: string = '') {
  const downloadLink = document.createElement('a');
  const objectUrl = URL.createObjectURL(file);

  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  downloadLink.target = '_self';
  document.body.appendChild(downloadLink);

  downloadLink.click();
  URL.revokeObjectURL(objectUrl);
}
