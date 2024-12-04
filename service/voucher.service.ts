import { Voucher } from '@/interface/voucher.interface'
import http from '@/lib/http'

class VoucherService {
    private basePath = '/api/admin/vouchers'

    async getAllIsPublished() {
        const response = await http.get<Voucher[]>(
            `${this.basePath}?discountTypeId=ASSIGNED_TO_ORDER_TOTAL&isPublished=true&status=ACTIVE`
        )
        return response
    }

    async validateCoupons(couponCodes: string[]) {
        const path = `/validate-coupons`
        const data = { couponCodes }
        const response = await http.post(path, data)
        return response.payload
    }
}

const voucherService = new VoucherService()
export default voucherService
