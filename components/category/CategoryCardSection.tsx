import CategoryCard from '@/components/category/CategoryCard'
import categoryService from '@/service/category.service'

export default async function CategoryCardSection() {
    const { payload: data } = await categoryService.getRootCategories()

    return (
        <section className='py-4 md:py-10'>
            <div className='grid grid-cols-1 justify-end gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4'>
                {data.map((category) => (
                    <CategoryCard
                        key={category.id}
                        title={category.name}
                        description={category.description}
                        image={category.linkImg}
                        link={`/category/${category.slug}`}
                    />
                ))}
            </div>
        </section>
    )
}
