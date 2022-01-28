import React, { createContext, useContext } from 'react';
import { usePagination } from '../../hooks/pagination';
import { NavLink } from "react-router-dom";

export const ResultContext = createContext({ results: [] });
export const useResultContext = () => useContext(ResultContext); // ResultContext used in TransResults.jsx

export default function Paginator({ methodName, userAddress, options, children }) {

    const {
        totalPages,
        setCurrPage,
        currPage,
        nextPage,
        prevPage,
        results,
        numResults,
    } = usePagination(methodName, userAddress, options);

    const address = userAddress;

    console.log("results from pagination via Paginator : ", results);

    return (
        <>
            <div className="container p-box">
                <div className="m-auto bg-white border border-0 radius-30 w-100 h-50 p-16px mw-900 card">
                    <div className="card-header border-0" style={{ borderRadius: "20px 20px 0 0" }}>
                        <ul className="nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to={`/address/${address}/main`} >
                                    Transactions
                                </NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to={`/address/${address}/erc20`} >
                                    ERC20 Token Txns
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to={`/address/${address}/tokenBalance`} >
                                    Token Balances
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 flex-md-row flex-column">
                        <div><b>A total of {numResults} transactions found</b></div>
                        <div>
                            <button className="btn btn-youwhogray text-primary btn-sm ms-1" onClick={() => setCurrPage(1)}>
                                First
                            </button>
                            <button className="btn btn-youwhogray text-primary btn-sm ms-1" onClick={prevPage}>
                                {"<"}
                            </button>
                            <span className="btn btn-youwhogray btn-sm ms-1">
                            KeyPress                      Page {currPage} of {totalPages}
                            </span>
                            <button className="btn btn-youwhogray text-primary btn-sm ms-1" onClick={nextPage}>
                                {">"}
                            </button>
                            <button className="btn btn-youwhogray text-primary btn-sm ms-1" onClick={() => setCurrPage(totalPages)}>
                                Last
                            </button>
                        </div>
                    </div>
                    <ResultContext.Provider value={{ results }}>
                        {children}
                    </ResultContext.Provider>
                </div>
            </div>
        </>
    )
}