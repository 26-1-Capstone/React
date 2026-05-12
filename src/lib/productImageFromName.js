/**
 * 상품명 등 문자열에 포함된 키워드에 따라 대표 이미지 URL을 반환합니다.
 * API의 imageUrl은 키워드가 없을 때만 사용합니다.
 */
const KEYWORD_IMAGES = [
    { keyword: '딸기', src: '/images/product-ddalgi.png' },
    { keyword: '라면', src: '/images/product-ramen.png' },
    { keyword: '휴지', src: '/images/product-tissue.png' },
    { keyword: '사과', src: '/images/product-apple.png' },
]

export function getProductImageUrl(text, fallbackUrl) {
    if (text && typeof text === 'string') {
        for (const { keyword, src } of KEYWORD_IMAGES) {
            if (text.includes(keyword)) return src
        }
    }
    return fallbackUrl || ''
}
