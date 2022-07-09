import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import {
    ThemeFormType,
    ThemeFormSelect,
    ThemeForm
} from "../../components/form"
import Services from "../../../../../services";
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import {
    PostTermTypeId,
    StatusId
} from "../../../../../public/static";
import {GlobalFunctions} from "../../../../../config/global";
import V from "../../../../../library/variable";
import SweetAlert from "react-sweetalert2";
import HandleForm from "../../../../../library/react/handles/form";
import {NavigateGetParamDocument} from "../../../../../modules/services/get/navigate";
import {NavigatePostParamDocument} from "../../../../../modules/services/post/navigate";
import {NavigatePutParamDocument} from "../../../../../modules/services/put/navigate";

type PageState = {
    formActiveKey: string
    navigates: { value: number, label: string }[]
    status: { value: number, label: string }[]
    isSubmitting: boolean
    mainTitle: string
    formData: {
        navigateId: number
        langId: number
        mainId: number
        statusId: number
        title: string
        order: number
        url: string
    },
    isSuccessMessage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageNavigateAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: `general`,
            navigates: [],
            status: [],
            isSubmitting: false,
            mainTitle: "",
            formData: {
                navigateId: this.props.getPageData.searchParams.navigateId,
                langId: this.props.getPageData.mainLangId,
                mainId: 0,
                statusId: 0,
                title: "",
                order: 0,
                url: "",
            },
            isSuccessMessage: false,
        }
    }

    componentDidMount() {
        this.getNavigates();
        this.getStatus();
        if (this.props.getPageData.searchParams.navigateId > 0) {
            this.getNavigate();
        }
        this.setPageTitle();
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if(this.state.formData.langId != this.props.getPageData.langId){
            this.setState((state: PageState) => {
                state.formData.langId = this.props.getPageData.langId;
                return state;
            }, () => this.getNavigate())
        }
    }

    setPageTitle() {
        let titles: string[] = [
            this.props.router.t("navigates"),
            this.props.router.t((this.state.formData.navigateId) > 0 ? "edit" : "add")
        ];
        if(this.state.formData.navigateId > 0) {
            titles.push(this.state.mainTitle)
        }
        this.props.setBreadCrumb(titles);
    }

    getStatus() {
        this.setState((state: PageState) => {
            state.status = GlobalFunctions.getStatusForSelect([
                StatusId.Active,
                StatusId.InProgress,
                StatusId.Pending
            ], this.props.getSessionData.langId);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    getNavigates() {
        let params: NavigateGetParamDocument = {
            langId: this.props.getPageData.mainLangId,
            statusId: StatusId.Active
        };
        let resData = Services.Get.navigate(params);
        if (resData.status) {
            this.setState((state: PageState) => {
                state.navigates = [{value: 0, label: this.props.router.t("notSelected")}];
                resData.data.orderBy("navigateOrder", "asc").forEach(item => {
                    if (!V.isEmpty(this.props.getPageData.searchParams.navigateId)) {
                        if (this.props.getPageData.searchParams.navigateId == item.navigateId) return;
                    }
                    state.navigates.push({value: item.navigateId, label: item.navigateContentTitle || this.props.router.t("[noLangAdd]")});
                });
                return state;
            })
        }
    }

    getNavigate() {
        let params: NavigateGetParamDocument = {
            navigateId: this.state.formData.navigateId,
            langId: this.state.formData.langId,
            getContents: true
        };
        let resData = Services.Get.navigate(params);
        console.log(resData)
        if (resData.status) {
            if (resData.data.length > 0) {
                const navigate = resData.data[0];
                this.setState((state: PageState) => {
                    state.formData = {
                        navigateId: navigate.navigateId,
                        langId: state.formData.langId,
                        mainId: navigate.navigateMainId,
                        statusId: navigate.navigateStatusId,
                        order: navigate.navigateOrder,
                        title: navigate.navigateContentTitle || "",
                        url: navigate.navigateContentUrl || "",
                    }

                    if(this.props.getPageData.langId == this.props.getPageData.mainLangId) {
                        state.mainTitle = state.formData.title;
                    }
                    return state;
                })
            } else {
                this.navigateTermPage();
            }
        }
    }

    navigateTermPage() {
        let path = pageRoutes.navigate.path() + pageRoutes.navigate.list.path()
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        let params: NavigatePostParamDocument & NavigatePutParamDocument = Object.assign({

        }, this.state.formData);
        ((params.navigateId > 0)
            ? Services.Put.navigate(params)
            : Services.Post.navigate(params)).then(resData => {
                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.isSuccessMessage = true;
                    }

                    state.isSubmitting = false;
                    return state;
                });
        });
    }

    onCloseSuccessMessage() {
        this.setState({
            isSuccessMessage: false
        });
        if (!V.isEmpty(this.props.getPageData.searchParams.termId)) {
            this.navigateTermPage()
        }
    }

    Messages = () => {
        return (
            <SweetAlert
                show={this.state.isSuccessMessage}
                title={this.props.router.t("successful")}
                text={`${this.props.router.t((V.isEmpty(this.props.getPageData.searchParams.termId)) ? "itemAdded" : "itemEdited")}!`}
                icon="success"
                timer={1000}
                timerProgressBar={true}
                didClose={() => this.onCloseSuccessMessage()}
            />
        )
    }

    TabOptions = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("status")}
                        name="statusId"
                        options={this.state.status}
                        value={this.state.status?.findSingle("value", this.state.formData.statusId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("order")}
                        name="order"
                        type="number"
                        required={true}
                        value={this.state.formData.order}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
            </div>
        );
    }

    TabGeneral = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("title")}*`}
                        name="title"
                        type="text"
                        required={true}
                        value={this.state.formData.title}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("url")}*`}
                        name="url"
                        type="text"
                        required={true}
                        value={this.state.formData.url}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={`
                            ${this.props.router.t("main")} 
                            ${this.props.router.t((this.props.getPageData.searchParams.termTypeId == PostTermTypeId.Category) ? "category" : "tag")}
                       `}
                        name="mainId"
                        placeholder="Choose Main Navigate"
                        options={this.state.navigates}
                        value={this.state.navigates.findSingle("value", this.state.formData.mainId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="page-post-term">
                <this.Messages/>
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-dark btn-lg btn-icon-text"
                            onClick={() => this.navigateTermPage()}>
                        <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                    </button>
                </div>
                <div className="gird-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <ThemeForm
                                isActiveSaveButton={true}
                                saveButtonText={this.props.router.t("save")}
                                saveButtonLoadingText={this.props.router.t("loading")}
                                isSubmitting={this.state.isSubmitting}
                                formAttributes={{onSubmit: (event) => this.onSubmit(event)}}
                            >
                                <div className="theme-tabs">
                                    <Tabs
                                        onSelect={(key: any) => this.setState({formActiveKey: key})}
                                        activeKey={this.state.formActiveKey}
                                        className="mb-5"
                                        transition={false}>
                                        <Tab eventKey="general" title={this.props.router.t("general")}>
                                            <this.TabGeneral/>
                                        </Tab>
                                        <Tab eventKey="options" title={this.props.router.t("options")}>
                                            <this.TabOptions/>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </ThemeForm>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageNavigateAdd;