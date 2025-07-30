import React from 'react'
import './Pagination.css'

interface PaginationProps {
    currentPage: number;
    number: number;
    selectPage: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, number, selectPage }) => {

    function handleSelectPage(pageNumber: number){
        selectPage(pageNumber)
    }

return (
    <li className={currentPage + 1 === number? 'pagination__btn_active' : 'pagination__btn'} onClick={() => handleSelectPage(number)}>
        <p>{number}</p>
    </li>
)
}

export default Pagination;
