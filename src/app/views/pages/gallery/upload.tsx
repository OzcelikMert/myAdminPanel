import React, {Component, createRef, RefObject} from 'react'
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import UploadingFilesDocument from "../../../../types/app/views/pages/gallery/upload";
import ApiRequestConfig from "../../../../services/api/config";
import Thread from "../../../../library/thread";
import galleryService from "../../../../services/gallery.service";

type PageState = {
    isDragging: boolean,
    uploadingFiles: UploadingFilesDocument[]
    isUploading: boolean
};

type PageProps = {
    isModal?: boolean
    uploadedImages?: (images: string[]) => void
} & PagePropCommonDocument;

class PageGalleryUpload extends Component<PageProps, PageState> {
    refInputFile: RefObject<HTMLInputElement> = createRef();

    constructor(props: PageProps) {
        super(props);
        this.state = {
            isDragging: false,
            uploadingFiles: [],
            isUploading: false
        }
    }

    componentDidMount() {
        this.setPageTitle()
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("gallery"),
            this.props.router.t("upload")
        ])
    }

    uploadFiles() {
        if (!this.state.isUploading && this.state.uploadingFiles.length > 0) {
            this.setState({
                isUploading: true
            });

            new Promise<string[]>(async (resolve) => {
                let uploadedImages: string[] = [];
                for (const uploadingFile of this.state.uploadingFiles) {
                    if (
                        uploadingFile.progressValue === 100 ||
                        uploadingFile.file.size > 1024000
                    ) continue;

                    this.setState((state: PageState) => {
                        let findIndex = state.uploadingFiles.indexOfKey("id", uploadingFile.id);
                        if (findIndex > -1) {
                            state.uploadingFiles[findIndex].isUploading = true;
                        }
                        return state;
                    })

                    const formData = new FormData();
                    formData.append("file", uploadingFile.file, uploadingFile.file.name);

                    let resData = await galleryService.add(formData);
                    if(
                        resData.status &&
                        Array.isArray(resData.data) &&
                        resData.data.length > 0
                    ) uploadedImages.push(resData.data[0])
                    await Thread.sleep(750);
                    this.setState((state: PageState) => {
                        let findIndex = state.uploadingFiles.indexOfKey("id", uploadingFile.id);
                        if (findIndex > -1) {
                            state.uploadingFiles[findIndex].progressValue = 100;
                            state.uploadingFiles[findIndex].isUploading = false;
                        }
                        return state;
                    })
                }
                resolve(uploadedImages);
            }).then(result => {
                console.log(result)
                this.setState({
                    isUploading: false
                });
                ApiRequestConfig.onUploadProgress = undefined;
                if(this.props.uploadedImages) this.props.uploadedImages(result)
            });
        }
    }

    onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        let files = event.target.files;
        this.setState((state: PageState) => {
            if (files != null && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    console.log(file)
                    state.uploadingFiles.push({
                        id: String.createId(),
                        file: file,
                        progressValue: 0,
                        isUploading: false
                    });
                }
            }
            state.isDragging = false;
            return state;
        }, this.uploadFiles);
    }

    onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        this.setState({isDragging: true});
    }

    onDragEnd(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        this.setState({isDragging: false});
    }

    onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        let files = event.dataTransfer.files;
        if (files.length > 0) {
            this.setState((state: PageState) => {
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    console.log(file)
                    state.uploadingFiles.push({
                        id: String.createId(),
                        file: file,
                        progressValue: 0,
                        isUploading: false
                    });
                }
                state.isDragging = false;
                return state;
            }, this.uploadFiles);
        }
    }

    onRemoveImageInList(id: string) {
        this.setState((state: PageState) => {
            let findIndex = state.uploadingFiles.indexOfKey("id", id);
            state.uploadingFiles.remove(findIndex);
            return state;
        });
    }

    UploadingItem = (props: UploadingFilesDocument) => {
        return (
            <div
                className={`col-md-2 uploading-item bg-gradient-${(props.file.size > 1024000) ? "danger" : "secondary"}`}>
                {
                    (!props.isUploading)
                        ? <div className="uploading-item-remove">
                            <span onClick={() => this.onRemoveImageInList(props.id)}>
                                <i className="mdi mdi-close"></i>
                            </span>
                        </div>
                        : <div className="uploading-item-loader">
                            <span>
                                <div className="loader-demo-box">
                                    <div className="circle-loader"></div>
                                </div>
                            </span>
                        </div>
                }
                <img className="shadow-lg mb-1" src={URL.createObjectURL(props.file)} alt={props.file.name}/>
                {
                    (props.file.size > 1024000)
                        ? <b>{this.props.router.t("bigImageSize")}</b>
                        : null
                }
            </div>
        );
    }

    render() {
        return (
            <div className="page-gallery">
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="upload-container"
                                 onDragOver={(event) => this.onDragOver(event)}
                                 onDragLeave={(event) => this.onDragEnd(event)}
                                 onDrop={(event) => this.onDrop(event)}>
                                <div
                                    className={`border-container text-center ${this.state.isDragging ? `bg-gradient-dark` : ``}`}>
                                    <input
                                        type="file"
                                        ref={this.refInputFile}
                                        hidden={true}
                                        onChange={(event) => this.onChangeFile(event)}
                                        multiple={true}
                                        name="image[]"
                                        accept=".jpg,.png,.gif,.webp"
                                    />
                                    {
                                        this.state.uploadingFiles.length > 0
                                            ? (
                                                <div className="row">
                                                    {
                                                        this.state.uploadingFiles.map((file, index) =>
                                                            <this.UploadingItem {...file} key={index}/>
                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                <span>
                                                    <div className="icons">
                                                      <i className="mdi mdi-image"></i>
                                                      <i className="mdi mdi-file"></i>
                                                      <i className="mdi mdi-file-cloud"></i>
                                                    </div>
                                                </span>
                                            )
                                    }
                                    <p
                                        className="cursor-pointer"
                                        onClick={() => this.refInputFile.current?.click()}>
                                        {
                                            this.props.router.t("dragAndDropHere")
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageGalleryUpload;
