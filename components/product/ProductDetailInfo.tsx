import { ProductDetail } from '@/interface/product.interface'

export default function ProductDetailInfo({ product }: { product: ProductDetail }) {
    return (
        <section className='w-full py-4'>
            <div className='font-semibold mb-5'>PRODUCT DETAIL</div>
            <div className='w-full md:w-1/2 px-4'>
                <p className='text-base text-gray-500'>
                    Category: <span className='text-black'>{product.categoryName}</span>
                </p>
                <p className='text-base text-gray-500'>
                    Stock: <span className='text-black'>{product.quantitySum}</span>
                </p>
                <p className='text-base text-gray-500'>
                    Weight: <span className='text-black'>{product.weight} gr</span>
                </p>
                {product.fullDescription && (
                    <>
                        <div className='font-semibold mb-5'>PRODUCT DETAIL</div>
                        <p className='text-base text-gray-500'>Description: {product.fullDescription}</p>
                    </>
                )}
            </div>
        </section>
    )
}
