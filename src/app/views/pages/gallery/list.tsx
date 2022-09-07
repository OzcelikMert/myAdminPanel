import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import Carousel, {Modal, ModalGateway} from "react-images";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Swal from "sweetalert2";
import {ThemeFormCheckBox} from "../../components/form";
import galleryService from "../../../../services/gallery.service";
import Spinner from "../../tools/spinner";
import Thread from "../../../../library/thread";
import pathUtil from "../../../../utils/path.util";
import DataTable, {TableColumn} from "react-data-table-component";
import imageSourceUtil from "../../../../utils/functions/imageSource.util";
import ThemeToast from "../../components/toast";
import permissionUtil from "../../../../utils/functions/permission.util";
import {PermissionId} from "../../../../constants";

type PageState = {
    isSelectedAll: boolean
    images: string[]
    showingImages: string[]
    selectedImages: PageState["images"]
    selectedImageIndex: number
    isOpenViewer: boolean
    isLoading: boolean
    searchKey: string
    checkedRowsClear: boolean
};

type PageProps = {
    isModal?: boolean
    isMulti?: boolean
    onSubmit?: (images: string[]) => void
    uploadedImages?: string[]
} & PagePropCommonDocument;

export class PageGalleryList extends Component<PageProps, PageState> {
    toast: null | ThemeToast = null;

    constructor(props: PageProps) {
        super(props);
        this.state = {
            isSelectedAll: false,
            images: [],
            showingImages: [],
            selectedImages: [],
            selectedImageIndex: 0,
            isOpenViewer: false,
            isLoading: true,
            searchKey: "",
            checkedRowsClear: false,
        }
    }

    componentDidMount() {
        this.setPageTitle()
        Thread.start(() => {
            this.getImages();
            this.setState({
                isLoading: false
            })
        })
    }

    componentWillUnmount() {
        this.toast?.hide();
    }

    getImages() {
        let resData = galleryService.get();

        if (resData.status) {
            if (Array.isArray(resData.data)) {
                let images = resData.data.orderBy("", "desc");
                this.setState({
                    images: images
                }, () => {
                    this.onSearch()
                })
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<PageProps>, prevState: Readonly<PageState>) {
        if (
            this.props.uploadedImages &&
            JSON.stringify(this.props.uploadedImages) !== JSON.stringify(prevProps.uploadedImages) &&
            this.props.uploadedImages.length > 0
        ) {
            this.setState((state: PageState) => {
                state.images = state.images.concat(this.props.uploadedImages || []).orderBy("", "desc");
                return state;
            })
        }
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("gallery"),
            this.props.router.t("list")
        ])
    }

    onSelect(image: string[]) {
        if(!this.props.isModal && !permissionUtil.checkPermission(
            this.props.getSessionData.roleId,
            this.props.getSessionData.permissions,
            PermissionId.GalleryEdit
        )) return;

        this.setState({
            selectedImages: image,
        }, () => {
            if (this.state.selectedImages.length > 0) {
                if (!this.toast || !this.toast.isShow) {
                    this.toast = new ThemeToast({
                        content: (
                            (this.props.isModal)
                                ? <button type="button" className="btn btn-gradient-success btn-icon-text w-100"
                                          onClick={() => this.onSubmit()}>
                                    <i className="mdi mdi-check btn-icon-prepend"></i> {this.props.router.t("okay")}
                                </button>
                                : <button type="button" className="btn btn-gradient-danger btn-icon-text w-100"
                                          onClick={() => this.onDelete()}>
                                    <i className="mdi mdi-trash-can btn-icon-prepend"></i> {this.props.router.t("delete")}
                                </button>
                        ),
                        borderColor: this.props.isModal ? "success" : "error"
                    })
                }
            } else {
                this.toast?.hide();
            }
        })
    }

    onShow(image: string) {
        this.setState({
            selectedImageIndex: this.state.showingImages.indexOfKey("", image),
            isOpenViewer: true
        })
    }

    onDelete() {
        Swal.fire({
            title: this.props.router.t("deleteAction"),
            html: `${this.props.router.t("deleteSelectedItemsQuestion")}`,
            confirmButtonText: this.props.router.t("yes"),
            cancelButtonText: this.props.router.t("no"),
            icon: "question",
            showCancelButton: true
        }).then(result => {
            if (result.isConfirmed) {
                this.toast?.hide();
                const loadingToast = new ThemeToast({
                    content: this.props.router.t("deleting"),
                    type: "loading"
                });

                galleryService.delete({
                    images: this.state.selectedImages
                }).then(resData => {
                    loadingToast.hide();
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.images = state.images.filter(image => !state.selectedImages.includes(image));
                            state.selectedImages = [];
                            state.checkedRowsClear = !state.checkedRowsClear;
                            return state;
                        }, () => {
                            this.onSearch();
                            new ThemeToast({
                                content: this.props.router.t("itemDeleted"),
                                type: "success",
                                timeOut: 3
                            });
                        })
                    }
                })
            }
        })
    }

    onSubmit() {
        if (this.props.onSubmit) {
            this.toast?.hide();
            this.props.onSubmit(this.state.selectedImages);
        }
    }

    onCloseViewer() {
        this.setState({
            isOpenViewer: false
        })
    }

    onSearch() {
        this.setState({
            showingImages: this.state.images.filter(image => image.search(this.state.searchKey) > -1)
        })
    }

    get getTableColumns(): TableColumn<PageState["images"][0]>[] {
        return [
            {
                name: this.props.router.t("image"),
                width: "105px",
                cell: row => (
                    <div className="image pt-2 pb-2">
                        <LazyLoadImage
                            className="gallery-img"
                            effect="blur"
                            alt={row}
                            src={imageSourceUtil.getUploadedImageSrc(row)} // use normal <img> attributes as props
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("title"),
                selector: row => row,
                sortable: true
            },
            {
                name: this.props.router.t("show"),
                width: "70px",
                button: true,
                cell: row => (
                    <button
                        className="btn btn-gradient-info btn-icon-text"
                        onClick={() => this.onShow(row)}
                    ><i className="mdi mdi-eye"></i></button>
                )
            }
        ];
    }

    ImageViewer = () => this.state.isOpenViewer
        ? (
            <ModalGateway>
                <Modal onClose={() => this.onCloseViewer()} closeOnBackdropClick={false}>
                    <Carousel
                        currentIndex={this.state.selectedImageIndex}
                        views={this.state.showingImages.map(image => ({
                            alt: image,
                            source: pathUtil.uploads.images + image,
                            caption: image
                        }))}
                    />
                </Modal>
            </ModalGateway>
        ) : null


    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-gallery">
                <this.ImageViewer/>
                <div className="row">
                    <div className="col-md-9 mb-3"></div>
                    <div className="col-md-3 mb-3">
                        <input
                            name="imageName"
                            className="form-control w-100"
                            placeholder={`${this.props.router.t("search")}...`}
                            type="search"
                            onChange={(event) => this.setState({searchKey: event.target.value}, () => this.onSearch())}
                        />
                    </div>
                </div>
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <DataTable
                                    columns={this.getTableColumns}
                                    data={this.state.showingImages}
                                    noHeader
                                    fixedHeader
                                    defaultSortAsc={false}
                                    pagination
                                    highlightOnHover
                                    selectableRows
                                    selectableRowsSingle={this.props.isModal && !this.props.isMulti}
                                    onSelectedRowsChange={selected => this.onSelect(selected.selectedRows)}
                                    selectableRowsComponent={ThemeFormCheckBox}
                                    clearSelectedRows={this.state.checkedRowsClear}
                                    noDataComponent={
                                        <h5>
                                            {this.props.router.t("noRecords")}<i
                                            className="mdi mdi-emoticon-sad-outline"></i>
                                        </h5>
                                    }
                                    paginationComponentOptions={{
                                        noRowsPerPage: true,
                                        rangeSeparatorText: "/",
                                        rowsPerPageText: "",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageGalleryList;
