import React from 'react'

const ProductComponentsPriceAndTaxDetails = ({productData, setProductData}) => {
    const [activeTab, setActiveTab] = React.useState('components-and-price');

    const tabs = [ 
        {label: 'Components and Prices', value: 'components-and-price'}, 
        {label: 'Components and Accessories', value: 'components-and-accessories'}, 
        {label: 'Tax Details', value: 'tax-details'} 
    ];

  return (
    <div className='text-sm'>
        {/* Navigation Tabs */}
        <div className='flex flex-row gap-4 mb-4 border-b'>
            {tabs.map((tab) => (
                <button 
                    key={tab.value}
                    className={`py-2 text-sm font-semibold ${activeTab === tab.value ? 'text-brand-green border-b-2 border-brand-green' : 'bg-transparent text-text-gray'} hover:border-b-2 transition`}
                    onClick={() => setActiveTab(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div>
            {activeTab === 'components-and-price' && (
                <div>
                    <h2 className='text-sm text-brand-green mb-4'>Components and Price Details by price bands</h2>
                    <div>
                        {/* Base prices of product by bands */}
                        <div>
                            <p className='font-semibold'>Base prices of product by bands:</p>
                            {productData?.pricing?.length > 0 ? (
                                <div className='w-full text-text-gray'>
                                    <table className='w-full mb-3'>
                                        <thead>
                                            <tr className='bg-background-2 font-semibold border-y border-y-gray-border'>
                                                <th className='p-1 text-left'>Price Band</th>
                                                <th className='p-1 text-left'>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                           {productData.pricing.map((band, index) => (
                                                <tr key={index} className='border-b'>
                                                    <td className='p-1'>{band?.band || 'Unnamed Band'}</td>
                                                    <td className='p-1'>{band?.price ? `#${band.price.toFixed(2)}` : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className='text-text-gray'>No price bands available for this product.</p>
                            )}
                        </div>

                        {productData?.components?.length > 0 ? (
                            <div className=''>
                                <h2 className='flex flex-row justify-between items-center mb-1'>
                                    <span className='font-semibold'>Components and Price Details for options</span>
                                    <span className='text-text-gray'>{productData.components.length} Components</span>
                                </h2>
                                {productData.components.map((component, index) => (
                                    <div key={index} className='mb-3 p-3 rounded-lg'>
                                        
                                        <div className='border w-full p-1'>
                                            <div className='flex flex-row justify-between items-center w-full'>
                                                <h3 className=' '>{component?.categoryName || 'Unnamed Category'}</h3>
                                                <span className='text-text-gray'>Alternatives: {component?.materialChoices?.length || 0}</span>
                                            </div>
                                            <ul className='mt-2 p-3 flex flex-row flex-wrap gap-1'>
                                            {component?.materialChoices && component?.materialChoices.length > 0 ? (
                                                component.materialChoices.map((material, idx) => (
                                                    <li key={idx} className='flex flex-row items-center'>
                                                        <span className='border p-2 rounded-lg flex flex-col gap-1'>
                                                            <span>{material?.material?.name || 'Unnamed Material'}</span>
                                                            <span className='text-text-gray'>Qty: {material?.quantity || 0}</span>
                                                            <span>
                                                                <span className='text-xs font-semibold text-text-gray'>Additional price for alternatives</span>
                                                                <span>
                                                                    {material.additionalPrice?.length > 0 && material.additionalPrice.map((priceBand, pIdx) => (
                                                                        <span key={pIdx} className='flex flex-row gap-1 text-sm text-text-gray justify-between'>
                                                                            <span>{priceBand?.band || 'Unnamed Band'}</span>
                                                                            <span>{priceBand?.price ? `#${priceBand.price.toFixed(2)}` : '+0.00'}</span>
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </span>
                                                        </span>
                                                        {component.materialChoices.length - 1 !== idx && <span className='mx-1'> or </span>}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No materials available</li>
                                            )}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-text-gray'>No components available for this product.</p>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'components-and-accessories' && (
                <div>
                    {/* Content for Components and Accessories Tab */}
                </div>
            )}
            {activeTab === 'tax-details' && (
                <div>
                    {/* Content for Tax Details Tab */}
                </div>
            )}
        </div>
    </div>
  )
}

export default ProductComponentsPriceAndTaxDetails;