// src/lib/mockData.js
// 임시 데이터 (API 연동 전까지 UI 작업용)

export const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "진라면 매운맛 1박스 (40봉)",
        price: 24000,
        categoryName: "대용량",
        imageUrl: "/images/product_bulk_box.png",
        stockQuantity: 150
    },
    {
        id: 2,
        name: "햇반 210g x 36개 세트",
        price: 36000,
        categoryName: "생필품",
        imageUrl: "/images/product_bulk_box.png",
        stockQuantity: 80
    },
    {
        id: 3,
        name: "제주 삼다수 2L x 12병",
        price: 11000,
        categoryName: "음료",
        imageUrl: "/images/product_bulk_box.png",
        stockQuantity: 300
    },
    {
        id: 4,
        name: "동원참치 라이트스탠다드 150g x 10캔",
        price: 18500,
        categoryName: "통조림",
        imageUrl: "/images/product_bulk_box.png",
        stockQuantity: 0 // Sold out test
    }
];

export const MOCK_GROUPS = [
    {
        id: 1,
        title: "자취생 필수품 라면+햇반 세트 공동구매",
        productName: "진라면 매운맛 1박스 (40봉)",
        typePrice: 20000, // Discounted
        targetQuantity: 100,
        currentQuantity: 85,
        dueDate: "2026-03-01T23:59:59"
    }
];
