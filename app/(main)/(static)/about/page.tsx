import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us'
}

export default function About() {
    return (
        <section className='px-2 py-4'>
            <h2 className='p-4 text-3xl font-medium'>Về chúng tôi</h2>
            <ul className='flex list-inside list-disc flex-col gap-2'>
                <li>
                    Được thành lập vào năm 2003, Aman Enterprises đã là nền tảng trong việc sản xuất và phân phối túi và
                    túi chất lượng cao.
                </li>
                <li>
                    Ẩn mình trong cảnh quan cần cù của Tổng công ty Phát triển Công nghiệp Bang Uttar Pradesh,
                    Ghaziabad, Uttar Pradesh, hành trình của chúng tôi bắt đầu với tầm nhìn pha trộn truyền thống với
                    hiện đại, cung cấp các sản phẩm phù hợp với nhu cầu đa dạng của khách hàng.
                </li>
                <li>
                    Tại Aman Enterprises, chúng tôi tự hào về nhiều loại dịch vụ của mình, bao gồm túi cotton, vải bạt,
                    đay, túi denim, v.v. Cam kết của chúng tôi đối với chất lượng thủ công và sự chú ý đến từng chi tiết
                    khiến chúng tôi trở nên khác biệt trong ngành.
                </li>
                <li>
                    Mỗi sản phẩm đều được chế tác tỉ mỉ để đáp ứng các tiêu chuẩn cao nhất về độ bền, chức năng và kiểu
                    dáng.
                </li>
                <li>
                    Với nhiều năm kinh nghiệm và chuyên môn, chúng tôi đã vun đắp mối quan hệ bền chặt với khách hàng,
                    cả cá nhân và tổ chức.
                </li>
                <li>
                    Chúng tôi hiểu các yêu cầu riêng của khách hàng, đó là lý do tại sao chúng tôi cung cấp sự linh hoạt
                    của các đơn đặt hàng số lượng lớn cho các tổ chức đang tìm kiếm túi và túi chất lượng cao cho các
                    nhu cầu khác nhau của họ.
                </li>
                <li>
                    Sự cống hiến của chúng tôi đối với sự hài lòng của khách hàng thúc đẩy chúng tôi liên tục đổi mới và
                    cải tiến sản phẩm và dịch vụ của mình.
                </li>
                <li>
                    Cho dù bạn là một cá nhân đang tìm kiếm túi thân thiện với môi trường hay một tổ chức cần mua số
                    lượng lớn, Aman Enterprises là đối tác đáng tin cậy của bạn trong từng bước.
                </li>
                <li>
                    Là một thành viên đáng tự hào của cộng đồng, chúng tôi cam kết phát triển bền vững và các hoạt động
                    kinh doanh có đạo đức. Chúng tôi cố gắng giảm thiểu tác động đến môi trường và đóng góp tích cực cho
                    xã hội thông qua các hoạt động của mình.
                </li>
            </ul>
        </section>
    )
}
