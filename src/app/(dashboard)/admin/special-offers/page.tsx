import { getSpecialOffers, getAllSpecialOffers } from '@/actions/specialOffer'
import { createSpecialOffer } from '@/actions/specialOffer'
import { getProducts } from '@/actions/product'
import { redirect } from 'next/navigation'
import SpecialOffersTable from './SpecialOffersTable'
import SpecialOfferForm from './SpecialOfferForm'

export default async function SpecialOffersPage() {
  const specialOffers = await getAllSpecialOffers()
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Create New Special Offer</h2>
        <SpecialOfferForm 
          products={products}
          onSubmit={async (formData: FormData) => {
            'use server'
            await createSpecialOffer(formData)
            redirect('/admin/special-offers')
          }}
        />
      </div>

      <SpecialOffersTable specialOffers={specialOffers} products={products} />
    </div>
  )
}
