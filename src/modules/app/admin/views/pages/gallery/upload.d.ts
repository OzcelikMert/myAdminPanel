interface UploadingFilesDocument {
    id: string
    file: File
    progressValue: number
    isUploading: boolean
}

export default UploadingFilesDocument;