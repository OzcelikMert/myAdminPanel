import React, {Component} from 'react'
import DataTable, {TableProps} from "react-data-table-component";
import {PagePropCommonDocument} from "types/app/pageProps";
import {ThemeFormCheckBox, ThemeFormType} from "../../form";

type PageState = {
    selectedItems: any[],
    clearSelectedRows: boolean
    searchKey: string
};

type PageProps<T> = {
    t: PagePropCommonDocument["router"]["t"],
    onSelect?: (rows: T[]) => void
    onSearch?: (searchKey: string) => void
    isSearchable?: boolean
    isSelectable?: boolean
    isAllSelectable?: boolean
    isMultiSelectable?: false
    selectedRows?: T[]
} & TableProps<T>;

export default class ThemeDataTable<T> extends Component<PageProps<T>, PageState> {
    listPage: number = 0;
    listPagePerCount: number = 10;

    constructor(props: PageProps<any>) {
        super(props);
        this.state = {
            clearSelectedRows: false,
            selectedItems: this.props.selectedRows ?? [],
            searchKey: ""
        }
    }

    componentDidUpdate(prevProps: Readonly<PageProps<T>>, prevState: Readonly<PageState>) {
        if(JSON.stringify(prevProps.selectedRows) !== JSON.stringify(this.props.selectedRows)){
            this.setState({
                selectedItems: this.props.selectedRows ?? []
            })
        }
    }

    get getItemListForPage() {
        return this.props.data.slice(this.listPagePerCount * this.listPage, (this.listPage + 1) * this.listPagePerCount);
    }

    get isCheckedSelectAll() {
        let items = this.getItemListForPage;
        return this.props.data.length > 0 && items.every(item => this.state.selectedItems.includes(item));
    }

    onSelectAll() {
        let items = this.getItemListForPage;
        for (const item of items) {
            this.onSelect(item, this.isCheckedSelectAll);
        }
    }

    onSelect(item: T, remove: boolean = true) {
        this.setState((state: PageState) => {
            let findIndex = state.selectedItems.indexOfKey("", item);

            if (findIndex > -1) {
                if (remove) state.selectedItems.remove(findIndex)
            } else {
                if(this.props.isMultiSelectable === false){
                    state.selectedItems = [];
                }
                state.selectedItems.push(item);
            }

            return state;
        }, () => {
            if (this.props.onSelect) this.props.onSelect(this.state.selectedItems);
        })
    }

    setSelectable() {
        return [
            {
                name: !this.props.isAllSelectable ? null : (
                    <div>
                        <ThemeFormCheckBox
                            name="selectAll"
                            checked={this.isCheckedSelectAll}
                            onChange={e => this.onSelectAll()}
                        />
                    </div>
                ),
                width: "75px",
                cell: row => (
                    <div>
                        <ThemeFormCheckBox
                            checked={this.state.selectedItems.includes(row)}
                            onChange={e => this.onSelect(row)}
                        />
                    </div>
                )
            },
            ...this.props.columns
        ];
    }

    onSearch(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            searchKey: event.target.value
        }, () => {
            if(this.props.onSearch) this.props.onSearch(this.state.searchKey)
        });
    }

    render() {
        return (
            <div>
                { this.props.isSearchable ?
                    <div className="row pt-2 pb-2 m-0">
                        <div className="col-md-8"></div>
                        <div className="col-md-4">
                            <ThemeFormType
                                title={`${this.props.t("search")}`}
                                type="text"
                                value={this.state.searchKey}
                                onChange={e => this.onSearch(e)}
                            />
                        </div>
                    </div> : null
                }
                <div className="table-responsive">
                    <DataTable
                        columns={this.props.isSelectable ? this.setSelectable() : this.props.columns}
                        data={this.props.data}
                        noHeader
                        fixedHeader
                        defaultSortAsc={false}
                        pagination
                        highlightOnHover
                        onChangePage={(page: number, totalRows: number) => {
                            this.listPage = page - 1;
                            this.setState({clearSelectedRows: !this.state.clearSelectedRows})
                        }}
                        clearSelectedRows={this.state.clearSelectedRows}
                        noDataComponent={
                            <h5>
                                {this.props.t("noRecords")}<i className="mdi mdi-emoticon-sad-outline"></i>
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
        )
    }
}
