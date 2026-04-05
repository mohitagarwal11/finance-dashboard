import './Pagination.css';

function Pagination({ txnPerPage, setCurrPage, totalTxn }) {
  let pages = [];
  for (let i = 1; i <= (totalTxn + 1) / txnPerPage; i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      {pages.map((page, index) => (
        <button className="pagination__button" key={index} onClick={() => setCurrPage(page)}>
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;