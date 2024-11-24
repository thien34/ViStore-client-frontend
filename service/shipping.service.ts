// shipping.service.ts
export const calculateShippingFee = async (data: any) => {
    try {
        const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Token: process.env.NEXT_PUBLIC_GHN_TOKEN || '',
                ShopId: process.env.NEXT_PUBLIC_GHN_SHOP_ID || ''
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Lỗi khi tính phí vận chuyển')
        }

        return result.data
    } catch (error: any) {
        throw new Error(`Lỗi tính phí vận chuyển: ${error.message}`)
    }
}
