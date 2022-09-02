import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import {
    ThemeFormType,
    ThemeFormSelect,
    ThemeForm
} from "../../components/form"
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import {
    PermissionId,
    PostTermTypeId,
    StatusId
} from "../../../../public/static";
import V from "../../../../library/variable";
import SweetAlert from "react-sweetalert2";
import HandleForm from "../../../../library/react/handles/form";
import navigateService from "../../../../services/navigate.service";
import Thread from "../../../../library/thread";
import Spinner from "../../tools/spinner";
import permissionUtil from "../../../../utils/functions/permission.util";
import staticContentUtil from "../../../../utils/functions/staticContent.util";

type PageState = {
    formActiveKey: string
    navigates: { value: number, label: string }[]
    status: { value: number, label: string }[]
    isSubmitting: boolean
    isLoading: boolean
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
            isLoading: true,
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
        if(!permissionUtil.checkPermissionAndRedirect(
            this.props.getSessionData.roleId,
            this.props.getSessionData.permissions,
            this.props.getPageData.searchParams.navigateId > 0 ? PermissionId.NavigateEdit : PermissionId.NavigateAdd,
            this.props.router.navigate
        )) return;
        this.setPageTitle();
        Thread.start(() => {
            this.getNavigates();
            this.getStatus();
            if (this.props.getPageData.searchParams.navigateId > 0) {
                this.getNavigate();
            }
            this.setState({
                isLoading: false
            })
        });
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if(this.state.formData.langId != this.props.getPageData.langId){
            this.setState((state: PageState) => {
                state.formData.langId = this.props.getPageData.langId;
                state.isLoading = true;
                return state;
            }, () => {
                Thread.start(() => {
                    this.getNavigate()
                    this.setState({
                        isLoading: false
                    })
                })
            })
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
            state.status = staticContentUtil.getStatusForSelect([
                StatusId.Active,
                StatusId.InProgress,
                StatusId.Pending
            ]);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    getNavigates() {
        let resData = navigateService.get({
            langId: this.props.getPageData.mainLangId,
            statusId: StatusId.Active
        });
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
        let resData = navigateService.get({
            navigateId: this.state.formData.navigateId,
            langId: this.state.formData.langId,
            getContents: true
        });
        if (resData.status) {
            if (resData.data.length > 0) {
                const navigate = resData.data[0];
                this.setState((state: PageState) => {
                    state.formData = Object.assign(state.formData, {
                        mainId: navigate.navigateMainId,
                        statusId: navigate.navigateStatusId,
                        order: navigate.navigateOrder,
                        title: navigate.navigateContentTitle || "",
                        url: navigate.navigateContentUrl || "",
                    });

                    if(this.props.getPageData.langId == this.props.getPageData.mainLangId) {
                        state.mainTitle = state.formData.title;
                    }
                    return state;
                }, () => {
                    this.setPageTitle();
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
        this.setState({
            isSubmitting: true
        }, () => {
            let params = this.state.formData;

            ((params.navigateId > 0)
                ? navigateService.update(params)
                : navigateService.add(params)).then(resData => {
                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.isSuccessMessage = true;
                    }

                    state.isSubmitting = false;
                    return state;
                });
            });
        })
    }

    onCloseSuccessMessage() {
        this.setState({
            isSuccessMessage: false
        });

        if (this.state.formData.navigateId === 0) {
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
                        placeholder={this.props.router.t("chooseMainNavigate")}
                        options={this.state.navigates}
                        value={this.state.navigates.findSingle("value", this.state.formData.mainId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
            </div>
        );
    }

    render() {
        return this.state.isLoading ? <Spinner /> : (
            <div className="page-post-term">
                <this.Messages/>
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-dark btn-lg btn-icon-text"
                            onClick={() => this.navigateTermPage()}>
                        <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                    </button>
                </div>
                <div className="grid-margin stretch-card">
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