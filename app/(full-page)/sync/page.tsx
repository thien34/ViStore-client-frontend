'use client'
import { Button } from '@/components/ui/button'
import { District, Province, Ward } from '@/interface/address.interface'
import addressService from '@/service/address.service'
import { getDistricts, getProvinces, getWards } from '@/service/shipping.service'
import { useState } from 'react'

const Sync = () => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const [provincesID, setProvincesID] = useState<number[]>([])
    const [districtID, setDistrictID] = useState<number[]>([])

    const handleSyncProvinces = async () => {
        try {
            const provincesData = await getProvinces()
            const provinces: Province[] = provincesData.map(({ ProvinceID, ProvinceName }) => ({
                ProvinceID,
                ProvinceName
            }))
            setProvincesID(provinces.map((province) => province.ProvinceID))
            await addressService.syncProvinces(provinces)
            console.log('Đồng bộ tỉnh thành công')
        } catch (error) {
            console.error('Không thể đồng bộ danh sách tỉnh/thành')
            throw error
        }
    }

    const handleSyncDistrictsForProvince = async (provinceId: number) => {
        try {
            await delay(200)
            const districtsData = await getDistricts(provinceId)
            const districts: District[] = districtsData.map((district: any) => ({
                DistrictID: district.DistrictID,
                DistrictName: district.DistrictName,
                ProvinceID: district.ProvinceID
            }))
            setDistrictID((prevIds) => [...prevIds, ...districts.map((district) => district.DistrictID)])
            await addressService.syncDistricts(districts)
            console.log(`Đồng bộ quận/huyện cho tỉnh ${provinceId} thành công`)
        } catch (error) {
            console.error(`Không thể đồng bộ danh sách quận/huyện cho tỉnh ${provinceId}`)
        }
    }

    const handleSyncAllDistrictsForProvinces = async () => {
        try {
            for (let i = 0; i < provincesID.length; i++) {
                await handleSyncDistrictsForProvince(provincesID[i])
            }
            console.log('Đồng bộ toàn bộ quận/huyện thành công')
        } catch (error) {
            console.error('Lỗi trong quá trình đồng bộ')
        }
    }

    const handleSyncWardsForDistrict = async (districtId: number) => {
        try {
            await delay(200)
            const wardData = await getWards(districtId)
            const ward: Ward[] = wardData.map((ward: any) => ({
                WardCode: ward.WardCode,
                WardName: ward.WardName,
                DistrictID: ward.DistrictID
            }))
            await addressService.syncWards(ward)
            console.log(`Đồng bộ xã cho huyện ${districtId} thành công`)
        } catch (error) {
            console.error(`Không thể đồng bộ xã cho huyện ${districtId}`)
        }
    }

    const handleSyncAllWardsForDistrict = async () => {
        try {
            for (let j = 0; j < districtID.length; j++) {
                await handleSyncWardsForDistrict(districtID[j])
            }
            console.log('Đồng bộ toàn bộ xã thành công')
        } catch (error) {
            console.error('Lỗi trong quá trình đồng bộ xã')
        }
    }

    return (
        <div className='flex gap-4'>
            <Button onClick={handleSyncProvinces}>Đồng bộ Tỉnh</Button>
            <Button onClick={handleSyncAllDistrictsForProvinces}>Đồng bộ Toàn Bộ Quận/Huyện</Button>
            <Button onClick={handleSyncAllWardsForDistrict}>Đồng bộ Toàn Bộ Xã</Button>
        </div>
    )
}

export default Sync
