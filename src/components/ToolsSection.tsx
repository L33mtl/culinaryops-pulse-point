
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, File, FileImage, FileText, FilePen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
}

const ToolsSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    // Accepted file types
    const acceptedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    // Process each file
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive"
        });
        return;
      }
      
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type.`,
          variant: "destructive"
        });
        return;
      }
      
      // Add file to state
      setUploadedFiles(prev => [
        ...prev, 
        { 
          id: crypto.randomUUID(), 
          name: file.name, 
          size: file.size, 
          type: file.type 
        }
      ]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been successfully uploaded.`
      });
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [processFiles]);

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (fileType.includes("pdf")) return <File className="h-5 w-5 text-red-500" />;
    if (fileType.includes("word")) return <FilePen className="h-5 w-5 text-blue-700" />;
    if (fileType.includes("sheet")) return <FileText className="h-5 w-5 text-green-600" />;
    return <File className="h-5 w-5" />;
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "The file has been removed from the upload queue."
    });
  };

  const downloadSharedFiles = () => {
    toast({
      title: "Downloads started",
      description: "Your files are being prepared for download."
    });
    // In a real application, this would trigger downloads of shared files from the server
  };

  return (
    <section id="tools" className="section">
      <h2 className="section-title">
        Team <span className="gradient-text">Collaboration</span> Tools
      </h2>
      <p className="section-subtitle">
        Securely share and collaborate on resources with your culinary team.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Upload Area */}
        <div className="bg-card p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" /> Upload Files
          </h3>
          <p className="text-muted-foreground mb-6">
            Drag and drop files or click to browse. Accepted formats: PDF, DOCX, XLSX, JPG, PNG (max 10MB)
          </p>

          {/* Drop Zone */}
          <div
            className={`file-drop-area mb-6 ${isDragging ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
            />
            <div className="flex flex-col items-center justify-center h-40">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isDragging
                  ? "Drop files here"
                  : "Drag files here or click to browse"}
              </p>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Uploaded Files</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-muted p-2 rounded text-sm"
                  >
                    <div className="flex items-center">
                      {getFileIcon(file.type)}
                      <span className="ml-2 truncate max-w-[200px]">{file.name}</span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-6 w-6 p-0"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full">Upload All Files</Button>
              </div>
            </div>
          )}
        </div>

        {/* Download Area */}
        <div className="bg-card p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Download className="mr-2" /> Shared Resources
          </h3>
          <p className="text-muted-foreground mb-6">
            Access secure downloads shared by your team members.
          </p>

          {/* Demo shared files */}
          <div className="space-y-4 mb-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-medium">May 2025 Menu Planning</h4>
                    <p className="text-xs text-muted-foreground">
                      Excel spreadsheet • 2.4MB • Updated 2 days ago
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Food Safety Guidelines 2025</h4>
                    <p className="text-xs text-muted-foreground">
                      PDF document • 3.8MB • Updated 1 week ago
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FilePen className="h-5 w-5 text-blue-700 mr-3" />
                  <div>
                    <h4 className="font-medium">Kitchen Staff Training Manual</h4>
                    <p className="text-xs text-muted-foreground">
                      Word document • 1.7MB • Updated 3 weeks ago
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={downloadSharedFiles}>
            <Download className="mr-2 h-4 w-4" /> Download All Files
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
