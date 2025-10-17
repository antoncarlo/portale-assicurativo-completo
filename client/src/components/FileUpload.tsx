import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FileUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export function FileUpload({ onUploadComplete, maxFiles = 10, acceptedTypes = "*" }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > maxFiles) {
        alert(`Puoi caricare massimo ${maxFiles} file`);
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (files.length + droppedFiles.length > maxFiles) {
      alert(`Puoi caricare massimo ${maxFiles} file`);
      return;
    }
    setFiles([...files, ...droppedFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Seleziona almeno un file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles: UploadedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Converti il file in Data URL per permettere il download
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        setUploadProgress(((i + 1) / files.length) * 100);

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: dataUrl, // Data URL per download immediato
        });
      }

      onUploadComplete?.(uploadedFiles);
      setFiles([]);
      alert("✅ File caricati con successo!");
    } catch (error) {
      alert("❌ Errore durante il caricamento");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-2">
          <div className="text-5xl">📁</div>
          <p className="text-lg font-semibold text-gray-700">
            Trascina i file qui o clicca per selezionare
          </p>
          <p className="text-sm text-gray-500">
            Massimo {maxFiles} file • PDF, Word, Excel, Immagini
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">
                  File selezionati ({files.length})
                </h4>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? `Caricamento... ${uploadProgress.toFixed(0)}%` : "📤 Carica File"}
                </Button>
              </div>

              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {file.type.includes("pdf") ? "📄" :
                       file.type.includes("word") ? "📝" :
                       file.type.includes("excel") || file.type.includes("sheet") ? "📊" :
                       file.type.includes("image") ? "🖼️" : "📎"}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

