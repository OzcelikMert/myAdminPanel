import React, {Component} from "react";
import {Modal, Tab, Tabs} from "react-bootstrap";
import PageGalleryList from "../../pages/gallery/list";
import PageGalleryUpload from "../../pages/gallery/upload";
import {PagePropCommonDocument} from "../../../../modules/app/admin/pageProps";

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
                    className="border-bottom-0"
                    closeButton>

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
                                    <Tab eventKey="upload" title={"Upload"}>
                                        <PageGalleryUpload
                                            {...this.props}
                                            uploadedImages={uploadedImages => this.setState({uploadedImages: uploadedImages})}
                                            isModal
                                        />
                                    </Tab>
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