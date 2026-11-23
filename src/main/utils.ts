export async function Base64ToImageBuffer(
  base64: string,
): Promise<{ buffer: Buffer; fileType: string }> {
  const fileType = base64.split(',')[0].split(':')[1].split(';')[0];
  const binaryString = atob(base64.split(',')[1]);

  return { buffer: Buffer.from(binaryString, 'binary'), fileType };
}

// export async function EncodeFileToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       resolve(reader.result as string);
//     };
//     reader.onerror = (error) => {
//       reject(error);
//     };
//     reader.readAsDataURL(file);
//   });
// }
