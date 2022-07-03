import React, {Component} from 'react'
import {GlobalFunctions, GlobalPaths} from "../../../../../config/global";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import Services from "../../../../../services";
import Carousel, {Modal, ModalGateway} from "react-images";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Swal from "sweetalert2";
import {GalleryDeleteParamDocument} from "../../../../../modules/services/delete/gallery";
import {ThemeFormCheckBox} from "../../components/form";
import HandleForm from "../../../../../library/react/handles/form";

type PageState = {
    isSelectedAll: boolean
    images: string[]
    selectedImages: PageState["images"]
    selectedImageIndex: number
    isOpenViewer: boolean
    formData: {
        imageName: string
    }
};

type PageProps = {
    isModal?: boolean
    isMulti?: boolean
    onSelected?: (images: string[]) => void
    uploadedImages?: string[]
} & PagePropCommonDocument;

export class PageGalleryList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        let images = Services.Get.gallery().data.orderBy("", "desc");
        this.state = {
            isSelectedAll: false,
            images: images,
            selectedImages: [],
            selectedImageIndex: 0,
            isOpenViewer: false,
            formData: {
                imageName: ""
            }
        }
    }

    componentDidMount() {
        this.setPageTitle()
    }

    componentDidUpdate(prevProps:Readonly<PageProps>, prevState:Readonly<PageState>) {
        if(
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

    onSelect(type: "select" | "unSelect" | "show", image: string, index: number) {
        switch (type) {
            case `select`:
            case `unSelect`:
                this.setState((state: PageState) => {
                    let findIndex = state.selectedImages.indexOfKey("", image);

                    if (findIndex > -1) {
                        state.selectedImages.remove(findIndex);
                    } else {
                        if(this.props.isModal && !this.props.isMulti){
                            state.selectedImages = [];
                        }
                        state.selectedImages.push(image);

                    }

                    if (state.images.length > 0) {
                        state.isSelectedAll = state.images.length === state.selectedImages.length;
                    }

                    return state;
                })
                break;
            case `show`:
                this.setState({
                    selectedImageIndex: index,
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
                            state.selectedImages = [];
                            return state;
                        })
                    }
                })
            }
        })
    }

    onSubmit() {
        if(this.props.onSelected){
            this.props.onSelected(this.state.selectedImages);
        }
    }

    onCloseViewer() {
        this.setState({
            isOpenViewer: false
        })
    }

    Image = (props: { image: string, index: number }) => {
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
                    src={GlobalPaths.uploads.images + props.image} // use normal <img> attributes as props
                />
                <div className="item-info">
                    <p className="title">{props.image}</p>
                    <div className="overlay"></div>
                    <div className="buttons">
                        {
                            this.state.selectedImages.includes(props.image)
                                ? <button type="button" className="btn btn-gradient-danger btn-icon-text me-3"
                                          onClick={() => this.onSelect("unSelect", props.image, 0)} datatype="unselect">
                                    <i className="mdi mdi-close btn-icon-append"></i> {this.props.router.t("unSelect")}
                                </button>
                                : <button type="button" className="btn btn-gradient-success btn-icon-text me-3"
                                          onClick={() => this.onSelect("select", props.image, 0)} datatype="select">
                                    <i className="mdi mdi-check btn-icon-append"></i> {this.props.router.t("select")}
                                </button>
                        }
                        <button type="button" className="btn btn-gradient-info btn-icon-text"
                                onClick={() => this.onSelect("show", props.image, props.index)}
                                datatype="show">
                            <i className="mdi mdi-eye btn-icon-append"></i> {this.props.router.t("show")}
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        return (
            <div className="page-gallery">
                <ModalGateway>
                    {this.state.isOpenViewer ? (
                        <Modal onClose={() => this.onCloseViewer()} closeOnBackdropClick={false}>
                            <Carousel
                                currentIndex={this.state.selectedImageIndex}
                                views={this.state.images.filter(image => image.search(this.state.formData.imageName) > -1).map(image => ({
                                    alt: image,
                                    source: GlobalPaths.uploads.images + image,
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
                                    {
                                        this.props.isMulti || typeof this.props.isMulti === "undefined"
                                            ? <ThemeFormCheckBox
                                                onChange={() => this.onSelectAll()}
                                                checked={this.state.isSelectedAll}
                                                title={this.props.router.t("selectAll").toCapitalizeCase()}
                                            /> : null
                                    }
                                    {
                                        this.state.selectedImages.length > 0
                                            ? (this.props.isModal)
                                                ? <button type="button" className="btn btn-gradient-success btn-icon-text ms-2"
                                                          onClick={() => this.onSubmit()}>
                                                    <i className="mdi mdi-check btn-icon-prepend"></i>Okay
                                                </button>
                                                : <button type="button" className="btn btn-gradient-danger btn-icon-text ms-2"
                                                      onClick={() => this.onDelete()}>
                                                    <i className="mdi mdi-trash-can btn-icon-prepend"></i>Delete
                                                </button>
                                            : null
                                    }
                                </div>
                                <div className="col-md-3">
                                    <input
                                        name="imageName"
                                        className="form-control w-100"
                                        placeholder={`${this.props.router.t("search")}...`}
                                        type="search"
                                        onChange={(event) => HandleForm.onChangeInput(event, this)}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                {
                                    this.state.images.filter(image => image.search(this.state.formData.imageName) > -1).map((item, index) => {
                                        return <this.Image
                                            key={index}
                                            image={item}
                                            index={index}
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
