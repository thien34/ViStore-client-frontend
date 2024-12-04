import { OWNER_EMAIL } from '@/lib/constants'

export default function ReturnRefundPolicy() {
    return (
        <section className='flex flex-col gap-2 px-2 py-4'>
            <h2 className='p-4 text-3xl font-medium'>Chính sách đổi trả và hoàn tiền</h2>
            <section>
                <h3 className='p-2 text-2xl'>Sản phẩm thủ công</h3>
                <p className='p-2'>
                    Tại Aman Enterprise, chúng tôi tự hào cung cấp các sản phẩm thủ công, nơi có thể xảy ra sự khác biệt
                    nhỏ về chi tiết. Những bất thường nhỏ trong in ấn và dệt này góp phần tạo nên sự độc đáo và đẹp mắt
                    của mỗi chiếc túi thủ công và không thể được dán nhãn là khuyết tật.
                </p>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Độ bền màu</h3>
                <p className='p-2'>
                    Chúng tôi không đảm bảo về độ bền màu. Màu tự nhiên, chẳng hạn như chàm, có thể bị chảy máu trong
                    lần giặt đầu tiên. Do đó, chúng tôi không hoàn lại tiền hoặc trao đổi trong những trường hợp như
                    vậy.
                </p>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Hướng dẫn chăm sóc</h3>
                <p className='p-2'>
                    Túi thủ công cần được chăm sóc đặc biệt để giữ gìn vẻ đẹp và sức mạnh của chúng. Chúng tôi khuyên
                    bạn nên đọc hướng dẫn sử dụng giặt và chăm sóc trước khi sử dụng túi. Yêu cầu thay thế hoặc hoàn lại
                    tiền túi sẽ không được coi là hợp lệ nếu phương pháp giặt và chăm sóc không đúng cách gây hư hỏng.
                </p>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Sự hài lòng của khách hàng</h3>
                <p className='p-2'>
                    Sự hài lòng của bạn là điều quan trọng hàng đầu đối với chúng tôi. Nếu bạn không hài lòng với giao
                    dịch mua của mình, chúng tôi sẵn sàng thay thế sản phẩm khi các thông số trong chính sách hoàn trả
                    của chúng tôi được đáp ứng.
                </p>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Trong sự kiện hiếm gặp mà</h3>
                <ul className='list-disc p-2'>
                    <li>
                        Sản phẩm đã được giao sai cho bạn (tức là kích thước hoặc màu sắc khác với tùy chọn bạn đã
                        chọn).
                    </li>
                    <li>Sản phẩm bạn nhận được bị lỗi.</li>
                    <li>
                        Những khác biệt nhỏ do cài đặt màn hình phải được đo như bình thường và không thể quay trở lại.
                    </li>
                </ul>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Các bước thông báo cho chúng tôi</h3>
                <p className='p-2'>Vui lòng thông báo ngay cho chúng tôi bằng cách làm theo các bước dưới đây:</p>
                <ol className='list-disc p-2'>
                    <li>
                        Gửi email đến <a href={`mailto:${OWNER_EMAIL}`}>${OWNER_EMAIL}</a> cùng với một bức ảnh của sản
                        phẩm bị hư hỏng.
                    </li>
                    <li>
                        Biểu mẫu Trả lại và Trao đổi cũng được yêu cầu với các thông tin cần thiết. (
                        <a href='#'>Để tải xuống biểu mẫu, hãy nhấp vào đây</a>)
                    </li>
                </ol>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Thủ tục trả hàng</h3>
                <ul className='list-disc p-2'>
                    <li>
                        Hàng hóa có thể trả lại trong vòng 48 giờ kể từ khi nhận hàng, miễn là chúng có thẻ gốc và hóa
                        đơn bán hàng và trong tình trạng chưa sử dụng.
                    </li>
                    <li>
                        Chọn bất kỳ dịch vụ chuyển phát nhanh đáng tin cậy nào hoặc đặt yêu cầu nhận hàng với đối tác
                        chuyển phát nhanh của chúng tôi. Nhóm của chúng tôi sẽ điều phối quy trình nếu dịch vụ có sẵn
                        trong khu vực của bạn.
                    </li>
                    <li>
                        Đóng gói các gói trả lại một cách an toàn để loại bỏ khả năng hư hỏng thêm trong quá trình vận
                        chuyển. Việc hoàn tiền và thay thế sẽ bị vô hiệu khi sản phẩm bị hư hỏng đến nơi.
                    </li>
                </ul>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Sau khi nhận được gói hàng</h3>
                <p className='p-2'>
                    Nhóm của chúng tôi sẽ quyết định xem sản phẩm có đủ điều kiện để hoàn tiền hoặc thay thế hay không
                    và thông báo cho bạn qua email.
                </p>
                <ul className='list-disc p-2'>
                    <li>
                        Nếu đủ điều kiện để trả lại, mặt hàng sẽ được thay thế miễn phí (tùy thuộc vào tình trạng sẵn
                        có) hoặc chi phí hàng hóa (không bao gồm phí vận chuyển) sẽ được hoàn lại vào thẻ ghi nợ tín
                        dụng được sử dụng để mua.
                    </li>
                    <li>
                        Phí vận chuyển hàng trả lại hàng hóa sẽ được khấu trừ dựa trên biểu giá được xác định trước của
                        chúng tôi, tùy thuộc vào vị trí của bạn. Nếu đối tác chuyển phát nhanh của chúng tôi có liên
                        quan, không cần thanh toán thêm cho dịch vụ.
                    </li>
                    <li>Nếu sản phẩm được coi là không phù hợp để trả lại, hàng hóa sẽ được giao lại cho bạn.</li>
                </ul>
            </section>

            <section>
                <h3 className='p-2 text-2xl'>Thời gian xử lý</h3>
                <p className='p-2'>
                    Có thể mất đến 10 ngày kể từ khi chúng tôi kết thúc quá trình xử lý và kết thúc vấn đề hoàn tiền.
                </p>
                <p className='p-2'>
                    Cho phép một chu kỳ thanh toán cho các khoản tín dụng được phát hành vào thẻ tín dụng ghi nợ của bạn
                    xuất hiện trên bảng sao kê của bạn.
                </p>
                <p className='p-2'>
                    Ngân hàng phát hành quản lý tài khoản của chủ thẻ. Chúng tôi không chịu trách nhiệm về bất kỳ sự
                    chậm trễ nào trong số tiền được ghi có vào tài khoản ngân hàng. Thời gian hoàn tiền xuất hiện trên
                    tài khoản của chủ thẻ có thể khác nhau tùy thuộc vào ngân hàng.
                </p>
            </section>
        </section>
    )
}
