import React, {Component} from 'react';
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import ThemeChartBar from "../../components/charts/bar";
import DataTable, {TableColumn} from "react-data-table-component";
import {PostTermTypeId, PostTypeId, PostTypes, Status, StatusId} from "../../../../constants";
import {pageRoutes} from "../../../routes";
import Thread from "../../../../library/thread";
import Spinner from "../../tools/spinner";
import PostDocument from "../../../../types/services/post";
import postService from "../../../../services/post.service";
import WorldMap from "react-svg-worldmap";
import viewService from "../../../../services/view.service";
import {ViewNumberDocument, ViewStatisticsDocument} from "../../../../types/services/view";
import imageSourceUtil from "../../../../utils/functions/imageSource.util";
import classNameUtil from "../../../../utils/functions/className.util";
import permissionUtil from "../../../../utils/functions/permission.util";

type PageState = {
    chartData: {
        visitorStatisticsForDay: {
            labels: string[]
            data: {
                label?: string,
                borderColor?: any,
                backgroundColor?: any,
                hoverBackgroundColor?: any,
                legendColor?: any,
                pointRadius?: number,
                fill?: boolean,
                borderWidth?: number,
                data: any[]
            }[]
        }
    }
    lastPosts: PostDocument[]
    visitorData: {
        number: ViewNumberDocument,
        statistics: ViewStatisticsDocument
    }
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

class PageDashboard extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            chartData: {
                visitorStatisticsForDay: {
                    labels: [],
                    data: []
                },
            },
            lastPosts: [],
            visitorData: {
                number: {
                    liveTotal: 0,
                    weeklyTotal: 0,
                    averageTotal: 0
                },
                statistics: {
                    day: [],
                    country: []
                }
            },
            isLoading: true
        }
    }

    componentDidMount() {
        this.setPageTitle();
        Thread.start(() => {
            this.getViewNumber();
            this.getViewStatistics();
            this.getLastPosts();
            this.setState({
                isLoading: false
            }, () => {
                this.chartInit();
                this.timerReportOne();
            })
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("dashboard")])
    }

    timer: any;

    timerReportOne() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
            this.getViewNumber();
        }, 10000)
    }

    getViewNumber() {
        viewService.getNumber().then(resData => {
            if (resData.status) {
                if (JSON.stringify(this.state.visitorData.number) != JSON.stringify(resData.data)) {
                    this.setState((state: PageState) => {
                        state.visitorData.number = resData.data;
                        return state;
                    })
                }
            }
        });
    }

    getViewStatistics() {
        let resData = viewService.getStatistics();

        if (resData.status) {
            this.setState((state: PageState) => {
                state.visitorData.statistics = resData.data;
                return state;
            })
        }
    }

    getLastPosts() {
        let resData = postService.get({
            langId: this.props.getPageData.mainLangId,
            maxCount: 10
        });
        if (resData.status) {
            this.setState({
                lastPosts: resData.data
            })
        }
    }

    chartInit() {
        let ctx = (document.createElement("canvas") as HTMLCanvasElement).getContext("2d") as CanvasFillStrokeStyles;

        let gradientBar = ctx.createLinearGradient(0, 0, 0, 181)
        gradientBar.addColorStop(0, 'rgba(218, 140, 255, 1)')
        gradientBar.addColorStop(1, 'rgba(154, 85, 255, 1)')

        this.setState((state: PageState) => {
            state.chartData.visitorStatisticsForDay = {
                labels: this.state.visitorData.statistics.day.map(view => view._id),
                data: [
                    {
                        borderColor: gradientBar,
                        backgroundColor: gradientBar,
                        hoverBackgroundColor: gradientBar,
                        legendColor: gradientBar,
                        pointRadius: 0,
                        fill: false,
                        borderWidth: 1,
                        data: this.state.visitorData.statistics.day.map(view => view.total)
                    }
                ]
            };

            return state;
        })
    }

    navigateTermPage(type: "termEdit" | "edit" | "listPost", postTypeId: number, itemId = "", termTypeId = 0) {
        let path = (type === "edit")
            ? pageRoutes.post.path(postTypeId) + pageRoutes.post.edit.path(itemId)
            : (type === "listPost")
                ? pageRoutes.post.path(postTypeId) + pageRoutes.post.list.path()
                : pageRoutes.postTerm.path(postTypeId, termTypeId) + pageRoutes.postTerm.edit.path(itemId);
        path = (postTypeId != PostTypeId.Page) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["lastPosts"][0]>[] {
        return [
            {
                name: this.props.router.t("image"),
                width: "75px",
                cell: row => (
                    <div className="image pt-2 pb-2">
                        <img
                            src={imageSourceUtil.getUploadedImageSrc(row.contents?.image)}
                            alt={row.contents?.title}
                            className="post-image"
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("type"),
                selector: row => row.typeId,
                sortable: true,
                cell: row => (
                    <label
                        onClick={() => this.navigateTermPage("listPost", row.typeId, row._id)}
                        className={`badge badge-gradient-primary cursor-pointer`}
                    >
                        {
                            this.props.router.t(PostTypes.findSingle("id", row.typeId).langKey)
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("title"),
                selector: row => row.contents?.title || this.props.router.t("[noLangAdd]"),
                sortable: true
            },
            {
                name: this.props.router.t("category"),
                cell: row => (
                    row.terms.map(item => {
                            if (item.typeId == PostTermTypeId.Category) {
                                return <label
                                    onClick={() => this.navigateTermPage("termEdit", row.typeId, item._id, item.typeId)}
                                    className={`badge badge-gradient-success me-1 cursor-pointer`}
                                >{item.contents.title || this.props.router.t("[noLangAdd]")}</label>
                            }
                            return null;
                        }
                    )
                )
            },
            {
                name: this.props.router.t("views"),
                selector: row => row.views,
                sortable: true
            },
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.statusId)}`}>
                        {
                            this.props.router.t(Status.findSingle("id", row.statusId).langKey)
                        }
                    </label>
                )
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => permissionUtil.checkPermission(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    permissionUtil.getPermissionIdForPostType(row.typeId, "Edit")
                ) ? (
                    <button
                        onClick={() => this.navigateTermPage("edit", row.typeId, row._id)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i></button>
                ) : null
            }
        ];
    }

    ReportOne = () => {
        return (
            <div className="col-12 grid-margin">
                <div className="card card-statistics">
                    <div className="row">
                        <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
                            <div className="card-body">
                                <div
                                    className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="mdi mdi-account-multiple-outline text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("currentVisitors")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">{this.state.visitorData.number.liveTotal}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
                            <div className="card-body">
                                <div
                                    className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="mdi mdi-target text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("dailyAverageVisitors")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">{this.state.visitorData.number.averageTotal}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
                            <div className="card-body">
                                <div
                                    className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="mdi mdi-calendar-week text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("weeklyTotalVisitors")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">{this.state.visitorData.number.weeklyTotal}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col col-xl-3 col-lg-3 col-md-3 col-6">
                            <div className="card-body">
                                <div
                                    className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="mdi mdi-google-analytics text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("lifeTimeVisitors")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">
                                                <a target="_blank" className="text-info fs-6 text-decoration-none"
                                                   href="https://analytics.google.com/">{this.props.router.t("clickToSee")}</a>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    ReportTwo = () => {
        return (
            <div className="row">
                <div className="col-md-7 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="clearfix mb-4">
                                <h4 className="card-title float-start">{this.props.router.t("weeklyVisitorsStatistics")}</h4>
                            </div>
                            <div className="chart-container">
                                <ThemeChartBar data={{
                                    datasets: this.state.chartData.visitorStatisticsForDay.data,
                                    labels: this.state.chartData.visitorStatisticsForDay.labels
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body overflow-auto">
                            <h4 className="card-title">{this.props.router.t("weeklyVisitorsStatistics")}</h4>
                            <WorldMap
                                color="#b66dff"
                                value-suffix="people"
                                size="lg"
                                data={this.state.visitorData.statistics.country.map(view => ({
                                    country: view._id.toLowerCase(),
                                    value: view.total
                                }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    LastPost = () => {
        return (
            <div className="row page-post">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">{this.props.router.t("lastPosts")}</h4>
                            <div className="table-post">
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.lastPosts}
                                        conditionalRowStyles={[
                                            {
                                                when: row => row.statusId != StatusId.Active || new Date().diffDays(new Date(row.dateStart)) > 0,
                                                classNames: ["bg-gradient-danger-light"]
                                            }
                                        ]}
                                        noHeader
                                        fixedHeader
                                        defaultSortAsc={false}
                                        pagination={false}
                                        highlightOnHover
                                        noDataComponent={
                                            <h5>
                                                {this.props.router.t("noRecords")} <i
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
            </div>
        )
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-dashboard">
                <this.ReportOne/>
                <this.ReportTwo/>
                <this.LastPost/>
            </div>
        );
    }
}

export default PageDashboard;