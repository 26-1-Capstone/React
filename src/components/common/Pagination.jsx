import './Pagination.css'

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
    if (totalPages <= 1) return null

    // Generate page numbers
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    return (
        <div className="pagination">
            <button
                className="pagination-btn nav-btn"
                onClick={handlePrev}
                disabled={currentPage === 1}
            >
                이전
            </button>

            {pages.map(page => (
                <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className="pagination-btn nav-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                다음
            </button>
        </div>
    )
}
