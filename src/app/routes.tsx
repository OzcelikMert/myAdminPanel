import React, {Component, Suspense} from 'react';
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Spinner from '../app/views/tools/spinner';
import {PagePropCommonDocument} from "../types/app/pageProps";
import PageRoutes from "../constants/pageRoutes";
import PagePaths from "../constants/pagePaths";

type PageState = {} & any;

type PageProps = {
    isPageLoading: boolean
} & PagePropCommonDocument;

class AppRoutes extends Component<PageProps, PageState> {
    render() {
        return this.props.isPageLoading ? <Spinner/> : (
            <Suspense fallback={<Spinner/>}>
                <Routes>
                    {
                        PageRoutes.map(route => <Route path={route.path} element={<route.element {...this.props}/>}/>)
                    }
                    <Route path="*" element={<Navigate to={PagePaths.dashboard()}/>}/>
                </Routes>
            </Suspense>
        );
    }
}

export default AppRoutes;