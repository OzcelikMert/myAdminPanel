import React, {Component} from 'react';
import {GlobalFunctions, GlobalPaths} from "../../../../../config/global";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import ThemeChartBar from "../../components/charts/bar";
import ThemeChartDonut from "../../components/charts/donut";
import {PostDocument} from "../../../../../modules/ajax/result/data";
import Services from "../../../../../services";
import {PostGetParamDocument} from "../../../../../modules/services/get/post";
import DataTable, {TableColumn} from "react-data-table-component";
import {PostTermTypeId, PostTypeContents, PostTypeId, StatusContents} from "../../../../../public/static";
import {pageRoutes} from "../../../routes";

type PageState = {
    chartData: {
        visitorCount: {
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
        },
        visitorDevices: {
            labels: string[]
            data: {
                data: any[],
                backgroundColor?: any[],
                hoverBackgroundColor?: any[],
                borderColor?: any[],
                legendColor?: any[]
            }[]
        }
    }
    lastPosts: PostDocument[]
};

type PageProps = {} & PagePropCommonDocument;

class PageDashboard extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            chartData: {
                visitorCount: {
                    labels: [],
                    data: []
                },
                visitorDevices: {
                    labels: [],
                    data: []
                }
            },
            lastPosts: []
        }
    }

    componentDidMount() {
        this.setPageTitle()
        this.chartInit();
        this.getLastPosts();
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("dashboard")])
    }

    getLastPosts() {
        let params: PostGetParamDocument = {
            langId: this.props.getPageData.mainLangId,
            maxCount: 10
        }
        let resData = Services.Get.posts(params);
        if(resData.status){
            this.setState({
                lastPosts: resData.data
            })
        }
    }

    chartInit() {
        let ctx = (document.getElementById('visitSaleChart') as HTMLCanvasElement).getContext("2d") as CanvasFillStrokeStyles;
        let gradientBar1 = ctx.createLinearGradient(0, 0, 0, 181)
        gradientBar1.addColorStop(0, 'rgba(218, 140, 255, 1)')
        gradientBar1.addColorStop(1, 'rgba(154, 85, 255, 1)')

        var gradientBar2 = ctx.createLinearGradient(0, 0, 0, 360)
        gradientBar2.addColorStop(0, 'rgba(54, 215, 232, 1)')
        gradientBar2.addColorStop(1, 'rgba(177, 148, 250, 1)')

        var gradientBar3 = ctx.createLinearGradient(0, 0, 0, 300)
        gradientBar3.addColorStop(0, 'rgba(255, 191, 150, 1)')
        gradientBar3.addColorStop(1, 'rgba(254, 112, 150, 1)')

        var gradientdonut1 = ctx.createLinearGradient(0, 0, 0, 181)
        gradientdonut1.addColorStop(0, 'rgba(54, 215, 232, 1)')
        gradientdonut1.addColorStop(1, 'rgba(177, 148, 250, 1)')

        var gradientdonut2 = ctx.createLinearGradient(0, 0, 0, 50)
        gradientdonut2.addColorStop(0, 'rgba(6, 185, 157, 1)')
        gradientdonut2.addColorStop(1, 'rgba(132, 217, 210, 1)')

        var gradientdonut3 = ctx.createLinearGradient(0, 0, 0, 300)
        gradientdonut3.addColorStop(0, 'rgba(254, 124, 150, 1)')
        gradientdonut3.addColorStop(1, 'rgba(255, 205, 150, 1)')

        this.setState((state: PageState) => {
            state.chartData.visitorCount = {
                labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
                data: [
                    {
                        label: "CHN",
                        borderColor: gradientBar1,
                        backgroundColor: gradientBar1,
                        hoverBackgroundColor: gradientBar1,
                        legendColor: gradientBar1,
                        pointRadius: 0,
                        fill: false,
                        borderWidth: 1,
                        data: [20, 40, 15, 35, 25, 50, 30, 20]
                    },
                    {
                        label: "USA",
                        borderColor: gradientBar2,
                        backgroundColor: gradientBar2,
                        hoverBackgroundColor: gradientBar2,
                        legendColor: gradientBar2,
                        pointRadius: 0,
                        fill: false,
                        borderWidth: 1,
                        data: [40, 30, 20, 10, 50, 15, 35, 40]
                    },
                    {
                        label: "UK",
                        borderColor: gradientBar3,
                        backgroundColor: gradientBar3,
                        hoverBackgroundColor: gradientBar3,
                        legendColor: gradientBar3,
                        pointRadius: 0,
                        fill: false,
                        borderWidth: 1,
                        data: [70, 10, 30, 40, 25, 50, 15, 30]
                    }
                ]
            };
            state.chartData.visitorDevices = {
                labels: ['Search Engines', 'Direct Click', 'Bookmarks Click'],
                data: [{
                    data: [30, 30, 40],
                    backgroundColor: [
                        gradientdonut1,
                        gradientdonut2,
                        gradientdonut3
                    ],
                    hoverBackgroundColor: [
                        gradientdonut1,
                        gradientdonut2,
                        gradientdonut3
                    ],
                    borderColor: [
                        gradientdonut1,
                        gradientdonut2,
                        gradientdonut3
                    ],
                    legendColor: [
                        gradientdonut1,
                        gradientdonut2,
                        gradientdonut3
                    ]
                }]
            };
            return state;
        })
    }

    navigateTermPage(type: "termEdit" | "edit" | "listPost", postTypeId: number, itemId = 0, termTypeId = 0) {
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
                            src={GlobalFunctions.getUploadedImageSrc(row.postContentImage)}
                            alt={row.postContentTitle}
                            className="post-image"
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("type"),
                selector: row => row.postTypeId,
                sortable: true,
                cell: row => (
                    <label
                        onClick={() => this.navigateTermPage("listPost", row.postTypeId, row.postId)}
                        className={`badge badge-gradient-primary cursor-pointer`}
                    >
                        {
                            GlobalFunctions.getStaticContent(PostTypeContents, "typeId", row.postTypeId, this.props.getSessionData.langId)
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("title"),
                selector: row => row.postContentTitle || this.props.router.t("[noLangAdd]"),
                sortable: true
            },
            {
                name: this.props.router.t("category"),
                cell: row => (
                    row.postTermContents.map(item => (item.postTermTypeId == PostTermTypeId.Category)
                        ? <label
                            onClick={() => this.navigateTermPage("termEdit", row.postTypeId, item.postTermId, PostTermTypeId.Category)}
                            className={`badge badge-gradient-success me-1 cursor-pointer`}
                        >{item.postTermContentTitle || this.props.router.t("[noLangAdd]")}</label>
                        : null
                    )
                )
            },
            {
                name: this.props.router.t("views"),
                selector: row => row.postViews,
                sortable: true
            },
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${GlobalFunctions.getStatusClassName(row.postStatusId)}`}>
                        {
                            GlobalFunctions.getStaticContent(StatusContents, "statusId", row.postStatusId, this.props.getSessionData.langId)
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("edit"),
                button: true,
                width: "70px",
                cell: row => (
                    <button
                        onClick={() => this.navigateTermPage("edit", row.postTypeId, row.postId)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i></button>
                )
            }
        ];
    }

    VisitorWithNumber = () => {
        return (
            <div className="row">
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-danger card-img-holder text-white">
                        <div className="card-body">
                            <img src={require("../../../../../assets/images/dashboard/circle.png")}
                                 className="card-img-absolute" alt="circle"/>
                            <h4 className="font-weight-normal mb-3">Weekly Sales <i
                                className="mdi mdi-chart-line mdi-24px float-end"></i>
                            </h4>
                            <h2 className="mb-5">$ 15,0000</h2>
                            <h6 className="card-text">Increased by 60%</h6>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-info card-img-holder text-white">
                        <div className="card-body">
                            <img src={require("../../../../../assets/images/dashboard/circle.png")}
                                 className="card-img-absolute" alt="circle"/>
                            <h4 className="font-weight-normal mb-3">Weekly Orders <i
                                className="mdi mdi-bookmark-outline mdi-24px float-end"></i>
                            </h4>
                            <h2 className="mb-5">45,6334</h2>
                            <h6 className="card-text">Decreased by 10%</h6>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 stretch-card grid-margin">
                    <div className="card bg-gradient-success card-img-holder text-white">
                        <div className="card-body">
                            <img src={require("../../../../../assets/images/dashboard/circle.png")}
                                 className="card-img-absolute" alt="circle"/>
                            <h4 className="font-weight-normal mb-3">Visitors Online <i
                                className="mdi mdi-diamond mdi-24px float-end"></i>
                            </h4>
                            <h2 className="mb-5">95,5741</h2>
                            <h6 className="card-text">Increased by 5%</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    VisitorWithChart = () => {
        return (
            <div className="row">
                <div className="col-md-7 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="clearfix mb-4">
                                <h4 className="card-title float-start">Visit And Sales Statistics</h4>
                                <div id="visit-sale-chart-legend"
                                     className="rounded-legend legend-horizontal legend-top-right float-end">
                                    <ul>
                                        <li>
                                            <span className="legend-dots bg-primary"></span> CHN
                                        </li>
                                        <li>
                                            <span className="legend-dots bg-danger"></span> USA
                                        </li>
                                        <li>
                                            <span className="legend-dots bg-info"></span>UK
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="chart-container">
                                <ThemeChartBar data={{
                                    datasets: this.state.chartData.visitorCount.data,
                                    labels: this.state.chartData.visitorCount.labels
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Traffic Sources</h4>
                            <div className="chart-container doughnut">
                                <ThemeChartDonut data={{
                                    datasets: this.state.chartData.visitorDevices.data,
                                    labels: this.state.chartData.visitorDevices.labels
                                }}/>
                            </div>
                            <div id="traffic-chart-legend"
                                 className="rounded-legend legend-vertical legend-bottom-left pt-4 mt-3">
                                <ul>
                                    <li>
                                        <span className="legend-dots bg-info"></span> Search Engines
                                        <span className="float-end">30%</span>
                                    </li>
                                    <li>
                                        <span className="legend-dots bg-success"></span> Direct Click
                                        <span className="float-end">30%</span>
                                    </li>
                                    <li>
                                        <span className="legend-dots bg-danger"></span> Bookmarks Click
                                        <span className="float-end">40%</span>
                                    </li>
                                </ul>
                            </div>
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
                            <h4 className="card-title">Last Posts</h4>
                            <div className="table-post">
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.lastPosts}
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
        return (
            <div className="page-dashboard">
                <this.VisitorWithNumber/>
                <this.VisitorWithChart/>
                <this.LastPost/>
            </div>
        );
    }
}

export default PageDashboard;