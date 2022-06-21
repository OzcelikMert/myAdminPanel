import React, {Component} from 'react'
import {GlobalFunctions, setPageData} from "../../../../../config/global";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import Services from "../../../../../services";
import Carousel, {Modal, ModalGateway} from "react-images";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Swal from "sweetalert2";
import {GalleryDeleteParamDocument} from "../../../../../modules/services/delete/gallery";
import {ThemeFormCheckBox} from "../../components/form";

type PageState = {
    isSelectedAll: boolean
    images: string[]
    showingImages: PageState["images"]
    selectedImages: PageState["images"]
    selectedImageIndex: number
    isOpenViewer: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageGalleryList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        let images = Services.Get.gallery().data;
        this.state = {
            isSelectedAll: false,
            images: images,
            showingImages: images,
            selectedImages: [],
            selectedImageIndex: 0,
            isOpenViewer: false
        }
    }

    setPageTitle() {
        setPageData({
            title: this.props.router.t("gallery")
        })
    }

    onSelect(type: "select" | "unSelect" | "show", image: string) {
        switch (type) {
            case `select`:
            case `unSelect`:
                this.setState((state: PageState) => {
                    let findIndex = state.selectedImages.indexOfKey("", image);

                    if (findIndex > -1) {
                        state.selectedImages.remove(findIndex);
                    } else {
                        state.selectedImages.push(image);
                    }

                    if (state.images.length > 0) {
                        state.isSelectedAll = state.images.length === state.selectedImages.length;
                    }

                    return state;
                })
                break;
            case `show`:
                let findIndex = this.state.showingImages.indexOfKey("", image);
                this.setState({
                    selectedImageIndex: findIndex,
                    isOpenViewer: true
                })
                break;
        }
    }

    onSelectAll() {
        this.setState((state: PageState) => {
            state.selectedImages = [];
            state.isSelectedAll = !state.isSelectedAll;

            if (state.isSelectedAll) {
                state.images.forEach(image => {
                    state.selectedImages.push(image);
                });
            }

            return state;
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
                let params: GalleryDeleteParamDocument = {
                    images: this.state.selectedImages
                }
                Services.Delete.gallery(params).then(resData => {
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.images = state.images.filter(image => !state.selectedImages.includes(image));
                            state.showingImages = state.showingImages.filter(image => !state.selectedImages.includes(image));
                            state.selectedImages = [];
                            return state;
                        })
                    }
                })
            }
        })
    }

    onCloseViewer() {
        this.setState({
            isOpenViewer: false
        })
    }

    onSearch(searchValue: string) {
        this.setState((state: PageState) => {
            state.showingImages = state.images.filter(image => image.search(searchValue) > -1);
            return state;
        })
    }

    Image = (props: { image: string }) => {
        return (
            <div className="col-md-2 gallery-item">
                {
                    this.state.selectedImages.includes(props.image) ?
                        <div className="bg-gradient-success item-selected">
                            <i className="mdi mdi-check"></i>
                        </div> : null
                }
                <LazyLoadImage
                    className="gallery-img"
                    effect="blur"
                    alt={props.image}
                    src={process.env.REACT_APP_UPLOADS_IMAGE_PATH + props.image} // use normal <img> attributes as props
                />
                <div className="item-info">
                    <p className="title">{props.image}</p>
                    <div className="overlay"></div>
                    <div className="buttons">
                        {
                            this.state.selectedImages.includes(props.image)
                                ? <button type="button" className="btn btn-gradient-danger btn-icon-text me-3"
                                          onClick={() => this.onSelect("unSelect", props.image)} datatype="unselect">
                                    <i className="mdi mdi-close btn-icon-append"></i> {this.props.router.t("unSelect")}
                                </button>
                                : <button type="button" className="btn btn-gradient-success btn-icon-text me-3"
                                          onClick={() => this.onSelect("select", props.image)} datatype="select">
                                    <i className="mdi mdi-check btn-icon-append"></i> {this.props.router.t("select")}
                                </button>
                        }
                        <button type="button" className="btn btn-gradient-info btn-icon-text"
                                onClick={() => this.onSelect("show", props.image)}
                                datatype="show">
                            <i className="mdi mdi-eye btn-icon-append"></i> {this.props.router.t("show")}
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        this.setPageTitle();
        return (
            <div className="page-gallery">
                <ModalGateway>
                    {this.state.isOpenViewer ? (
                        <Modal onClose={() => this.onCloseViewer()} closeOnBackdropClick={false}>
                            <Carousel
                                currentIndex={this.state.selectedImageIndex}
                                views={this.state.showingImages.map(image => ({
                                    alt: image,
                                    source: process.env.REACT_APP_UPLOADS_IMAGE_PATH + image,
                                    caption: image
                                }))}
                            />
                        </Modal>
                    ) : null}
                </ModalGateway>
                <div className="gird-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-9 mb-4">
                                    <ThemeFormCheckBox
                                        onChange={() => this.onSelectAll()}
                                        checked={this.state.isSelectedAll}
                                        title={this.props.router.t("selectAll").toCapitalizeCase()}
                                    />
                                    {
                                        this.state.selectedImages.length > 0
                                            ? <button type="button" className="btn btn-gradient-danger btn-icon-text ms-5"
                                                      onClick={() => this.onDelete()}>
                                                <i className="mdi mdi-trash-can btn-icon-prepend"></i>Delete
                                            </button> : null
                                    }
                                </div>
                                <div className="col-md-3">
                                    <input
                                        className="form-control w-100"
                                        placeholder={`${this.props.router.t("search")}...`}
                                        type="search"
                                        onChange={(event) => this.onSearch(event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                {
                                    this.state.showingImages.map((item, index) => {
                                        return <this.Image
                                            key={index}
                                            image={item}
                                        />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageGalleryList;
