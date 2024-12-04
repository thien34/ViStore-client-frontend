import { ProductDetail } from '@/interface/product.interface'

export default function ProductDetailInfo({ product }: { product: ProductDetail }) {
    return (
        <section className='w-full py-4'>
            <div className='font-semibold mb-5'>CHI TIẾT SẢN PHẨM</div>
            <div className='w-full md:w-1/2 px-4'>
                <p className='text-base text-gray-500'>
                    Loại: <span className='text-black'>{product.categoryName}</span>
                </p>
                <p className='text-base text-gray-500'>
                    Kho: <span className='text-black'>{product.quantitySum}</span>
                </p>
                <p className='text-base text-gray-500'>
                    Trọng lượng: <span className='text-black'>{product.weight} gr</span>
                </p>
                {product.fullDescription && (
                    <>
                        <div className='font-semibold mb-5'>CHI TIẾT SẢN PHẨM</div>
                        <p className='text-base text-gray-500'>Mô tả: {product.fullDescription}</p>
                    </>
                )}
            </div>
        </section>
    )
}
