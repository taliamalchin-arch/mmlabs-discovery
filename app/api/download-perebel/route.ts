import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import JSZip from 'jszip';

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public', 'perebel');
    const zip = new JSZip();

    function addFilesRecursively(dir: string, zipFolder: JSZip) {
      const files = readdirSync(dir);

      files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        const relativePath = filePath.replace(publicDir + '/', '');

        if (stat.isDirectory()) {
          addFilesRecursively(filePath, zipFolder);
        } else {
          // Skip .DS_Store and other system files
          if (!file.startsWith('.')) {
            const fileContent = readFileSync(filePath);
            zipFolder.file(relativePath, fileContent);
          }
        }
      });
    }

    addFilesRecursively(publicDir, zip);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="perebel-brand-assets.zip"',
      },
    });
  } catch (error) {
    console.error('Error generating ZIP:', error);
    return new Response('Error generating ZIP file', { status: 500 });
  }
}
