import React, {Component} from "react";
import {Modal, Tab, Tabs} from "react-bootstrap";
import PageGalleryList from "pages/gallery/list";
import PageGalleryUpload from "pages/gallery/upload";
import {PagePropCommonDocument} from "types/app/pageProps";
import {PermissionId} from "constants/index";
import permissionUtil from "utils/permission.util";

type PageState = {
    formActiveKey: string
    uploadedImages: string[]
};

type PageProps = {
    onClose: () => void
    isShow: boolean
    onSubmit: (images: string[]) => void
    isMulti?: boolean
} & PagePropCommonDocument;

class ThemeChooseImageGallery extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: "list",
            uploadedImages: []
        }
    }

    render() {
        return (
            <Modal
                size="xl"
                centered
                fullscreen
                show={this.props.isShow}
                backdrop={true}
                onHide={() => {
                    this.props.onClose();
                }}
            >
                <Modal.Header
                    className="border-bottom-0">
                    <div className="w-100 text-end">
                    <button className="btn btn-gradient-dark" onClick={() => {
                        this.props.onClose();
                    }}><i className="fa fa-close"></i></button>
                    </div>
                </Modal.Header>
                <Modal.Body className="m-0 p-0" >
                    <div className="card">
                        <div className="card-body">
                            <div className="theme-tabs">
                                <Tabs
                                    onSelect={(key: any) => this.setState({formActiveKey: key})}
                                    activeKey={this.state.formActiveKey}
                                    className="mb-5"
                                    transition={false}>
                                    {
                                        permissionUtil.checkPermission(
                                            this.props.getSessionData.roleId,
                                            this.props.getSessionData.permissions,
                                            PermissionId.GalleryEdit
                                        ) ? <Tab eventKey="upload" title={"Upload"}>
                                            <PageGalleryUpload
                                                {...this.props}
                                                uploadedImages={uploadedImages => this.setState({uploadedImages: uploadedImages})}
                                                isModal
                                            />
                                        </Tab> : null
                                    }
                                    <Tab eventKey="list" title={"List"}>
                                        <PageGalleryList
                                            {...this.props}
                                            isModal
                                            uploadedImages={this.state.uploadedImages}
                                        />
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ThemeChooseImageGallery;