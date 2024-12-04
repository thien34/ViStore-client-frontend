import CartProductCard from '@/components/cart/CartProductCard'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCartStore } from '@/store/useCartStore'

export default function CartOrderTable() {
    const { cart, removeFromCart, addToCart, deleteFromCart } = useCartStore()

    // Tính tổng số tiền
    const totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0)

    return (
        <div className='py-2'>
            <h1 className='p-2 text-2xl font-bold'>Giỏ hàng</h1>
            {cart.length > 0 ? (
                <div>
                    <div className='flex flex-col gap-2 py-2'>
                        {cart.map((product: , index: number) => (
                            <CartProductCard
                                key={product.id || index} // Tốt hơn nên dùng id của product
                                product={product}
                                removeFromCart={removeFromCart}
                                addToCart={addToCart}
                                deleteFromCart={deleteFromCart}
                            />
                        ))}
                    </div>
                    <div className='mt-4 flex flex-col gap-2'>
                        <h2 className='p-2 text-xl font-medium'>Tóm tắt đơn hàng</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>MÔ TẢ</TableHead>
                                    <TableHead className='text-right'>ĐƠN GIÁ</TableHead>
                                    <TableHead className='text-right'>SỐ LƯỢNG</TableHead>
                                    <TableHead className='text-right'>TỔNG TIỀN</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((product: Product, index: number) => (
                                    <TableRow key={product.id || index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell className='text-right'>₹{product.price.toFixed(2)}</TableCell>
                                        <TableCell className='text-right'>{product.quantity}</TableCell>
                                        <TableCell className='text-right'>
                                            ₹{(product.price * product.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3}>Tổng phụ</TableCell>
                                    <TableCell className='text-right'>₹{totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3}>Chi phí vận chuyển</TableCell>
                                    <TableCell className='text-right'>MIỄN PHÍ</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow className='text-primary'>
                                    <TableCell colSpan={3}>Tổng tiền</TableCell>
                                    <TableCell className='text-right'>₹{totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            ) : (
                <span className='p-2'>Giỏ hàng rỗng</span>
            )}
        </div>
    )
}
