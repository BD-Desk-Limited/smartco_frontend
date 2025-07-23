import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import Image from 'next/image';
import Link from 'next/link';
import PageDescription from '@/components/account/PageDescription';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext'; 
import ProductManagementSidebar from './ProductManagementSidebar';
import Spinner from '@/components/account/Spinner';

// Sample data for Product schema
const sampleProducts = [
    {
        name: "Executive Oak Desk",
        description: "Premium solid oak executive desk with brass hardware and leather inlay",
        profileImage: "https://example.com/images/oak-desk.jpg",
        key: "EXEC-OAK-001",
        components: [
            {
                material: "507f1f77bcf86cd799439011", // Oak wood material ID
                quantity: 1,
                isOptional: false,
                price: 500,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439012", // Mahogany alternative
                        additionalPrice: [
                            { band: "wholesale", price: 200 },
                            { band: "retail", price: 300 },
                            { band: "premium", price: 400 }
                        ],
                        isSelected: false
                    }
                ]
            },
            {
                material: "507f1f77bcf86cd799439013", // Brass hardware
                quantity: 8,
                isOptional: false,
                price: 50,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 8.5,
            taxAmount: 68
        },
        pricing: [
            { band: "wholesale", price: 800, currency: "USD" },
            { band: "retail", price: 1200, currency: "USD" },
            { band: "premium", price: 1500, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439020"
    },
    {
        name: "Modern Steel Bookshelf",
        description: "Contemporary powder-coated steel bookshelf with adjustable shelves",
        profileImage: "https://example.com/images/steel-bookshelf.jpg",
        key: "MOD-STL-002",
        components: [
            {
                material: "507f1f77bcf86cd799439014", // Steel frame
                quantity: 1,
                isOptional: false,
                price: 150,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439015", // Aluminum alternative
                        additionalPrice: [
                            { band: "wholesale", price: 100 },
                            { band: "retail", price: 150 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 6.0,
            taxAmount: 18
        },
        pricing: [
            { band: "wholesale", price: 300, currency: "USD" },
            { band: "retail", price: 450, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439020"
    },
    {
        name: "Leather Office Chair",
        description: "Ergonomic leather office chair with lumbar support",
        profileImage: "https://example.com/images/leather-chair.jpg",
        key: "LEA-CHR-003",
        components: [
            {
                material: "507f1f77bcf86cd799439016", // Leather upholstery
                quantity: 1,
                isOptional: false,
                price: 200,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439017", // Fabric alternative
                        additionalPrice: [
                            { band: "wholesale", price: -50 },
                            { band: "retail", price: -75 }
                        ],
                        isSelected: false
                    }
                ]
            },
            {
                material: "507f1f77bcf86cd799439018", // Aluminum base
                quantity: 1,
                isOptional: false,
                price: 80,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 7.25,
            taxAmount: 29
        },
        pricing: [
            { band: "wholesale", price: 400, currency: "USD" },
            { band: "retail", price: 600, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439021"
    },
    {
        name: "Glass Conference Table",
        description: "Tempered glass conference table with chrome legs",
        profileImage: "https://example.com/images/glass-table.jpg",
        key: "GLS-CNF-004",
        components: [
            {
                material: "507f1f77bcf86cd799439019", // Tempered glass top
                quantity: 1,
                isOptional: false,
                price: 300,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439020", // Chrome legs
                quantity: 4,
                isOptional: false,
                price: 50,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439021", // Steel legs
                        additionalPrice: [
                            { band: "wholesale", price: -20 },
                            { band: "retail", price: -30 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 8.0,
            taxAmount: 40
        },
        pricing: [
            { band: "wholesale", price: 500, currency: "USD" },
            { band: "retail", price: 750, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439022"
    },
    {
        name: "Pine Filing Cabinet",
        description: "Four-drawer pine filing cabinet with brass handles",
        profileImage: "https://example.com/images/pine-cabinet.jpg",
        key: "PIN-FIL-005",
        components: [
            {
                material: "507f1f77bcf86cd799439022", // Pine wood
                quantity: 1,
                isOptional: false,
                price: 120,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439011", // Oak upgrade
                        additionalPrice: [
                            { band: "wholesale", price: 80 },
                            { band: "retail", price: 120 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 5.5,
            taxAmount: 11
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439023"
    },
    {
        name: "Ergonomic Standing Desk",
        description: "Height-adjustable standing desk with electric motor",
        profileImage: "https://example.com/images/standing-desk.jpg",
        key: "ERG-STD-006",
        components: [
            {
                material: "507f1f77bcf86cd799439023", // Bamboo desktop
                quantity: 1,
                isOptional: false,
                price: 150,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439024", // Laminate alternative
                        additionalPrice: [
                            { band: "wholesale", price: -50 },
                            { band: "retail", price: -75 }
                        ],
                        isSelected: false
                    }
                ]
            },
            {
                material: "507f1f77bcf86cd799439025", // Electric motor
                quantity: 1,
                isOptional: false,
                price: 200,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 8.25,
            taxAmount: 49.5
        },
        pricing: [
            { band: "wholesale", price: 600, currency: "USD" },
            { band: "retail", price: 900, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439024"
    },
    {
        name: "Velvet Accent Chair",
        description: "Luxurious velvet accent chair with gold legs",
        profileImage: "https://example.com/images/velvet-chair.jpg",
        key: "VEL-ACC-007",
        components: [
            {
                material: "507f1f77bcf86cd799439026", // Velvet fabric
                quantity: 1,
                isOptional: false,
                price: 100,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439027", // Linen alternative
                        additionalPrice: [
                            { band: "wholesale", price: -30 },
                            { band: "retail", price: -45 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 7.0,
            taxAmount: 21
        },
        pricing: [
            { band: "wholesale", price: 300, currency: "USD" },
            { band: "retail", price: 450, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439025"
    },
    {
        name: "Industrial Bar Stool",
        description: "Reclaimed wood and steel industrial bar stool",
        profileImage: "https://example.com/images/bar-stool.jpg",
        key: "IND-BAR-008",
        components: [
            {
                material: "507f1f77bcf86cd799439028", // Reclaimed wood seat
                quantity: 1,
                isOptional: false,
                price: 40,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439029", // Steel frame
                quantity: 1,
                isOptional: false,
                price: 35,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 6.5,
            taxAmount: 9.75
        },
        pricing: [
            { band: "wholesale", price: 150, currency: "USD" },
            { band: "retail", price: 225, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439026"
    },
    {
        name: "Marble Coffee Table",
        description: "White marble top coffee table with brass base",
        profileImage: "https://example.com/images/marble-table.jpg",
        key: "MAR-COF-009",
        components: [
            {
                material: "507f1f77bcf86cd799439030", // Marble top
                quantity: 1,
                isOptional: false,
                price: 400,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439031", // Granite alternative
                        additionalPrice: [
                            { band: "wholesale", price: -100 },
                            { band: "retail", price: -150 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 8.75,
            taxAmount: 70
        },
        pricing: [
            { band: "wholesale", price: 800, currency: "USD" },
            { band: "retail", price: 1200, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439027"
    },
    {
        name: "Scandinavian Dining Chair",
        description: "Minimalist oak dining chair with cushioned seat",
        profileImage: "https://example.com/images/scandi-chair.jpg",
        key: "SCA-DIN-010",
        components: [
            {
                material: "507f1f77bcf86cd799439011", // Oak frame
                quantity: 1,
                isOptional: false,
                price: 80,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439032", // Foam cushion
                quantity: 1,
                isOptional: true,
                price: 20,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 7.5,
            taxAmount: 15
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439028"
    },
    {
        name: "Vintage Storage Trunk",
        description: "Distressed leather storage trunk with brass hardware",
        profileImage: "https://example.com/images/storage-trunk.jpg",
        key: "VIN-STO-011",
        components: [
            {
                material: "507f1f77bcf86cd799439033", // Distressed leather
                quantity: 1,
                isOptional: false,
                price: 120,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439013", // Brass hardware
                quantity: 6,
                isOptional: false,
                price: 30,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 6.25,
            taxAmount: 18.75
        },
        pricing: [
            { band: "wholesale", price: 300, currency: "USD" },
            { band: "retail", price: 450, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439029"
    },
    {
        name: "Acrylic Side Table",
        description: "Clear acrylic side table with curved edges",
        profileImage: "https://example.com/images/acrylic-table.jpg",
        key: "ACR-SID-012",
        components: [
            {
                material: "507f1f77bcf86cd799439034", // Clear acrylic
                quantity: 1,
                isOptional: false,
                price: 80,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439035", // Frosted acrylic
                        additionalPrice: [
                            { band: "wholesale", price: 20 },
                            { band: "retail", price: 30 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 8.0,
            taxAmount: 16
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439030"
    },
    {
        name: "Rustic Farmhouse Bench",
        description: "Reclaimed barn wood bench with iron brackets",
        profileImage: "https://example.com/images/farmhouse-bench.jpg",
        key: "RUS-FAR-013",
        components: [
            {
                material: "507f1f77bcf86cd799439036", // Barn wood
                quantity: 1,
                isOptional: false,
                price: 60,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439037", // Iron brackets
                quantity: 4,
                isOptional: false,
                price: 25,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 5.0,
            taxAmount: 10
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439031"
    },
    {
        name: "Mesh Office Chair",
        description: "Breathable mesh office chair with adjustable height",
        profileImage: "https://example.com/images/mesh-chair.jpg",
        key: "MES-OFF-014",
        components: [
            {
                material: "507f1f77bcf86cd799439038", // Mesh fabric
                quantity: 1,
                isOptional: false,
                price: 50,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439039", // Plastic base
                quantity: 1,
                isOptional: false,
                price: 30,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 7.75,
            taxAmount: 15.5
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439032"
    },
    {
        name: "Ceramic Garden Stool",
        description: "Hand-painted ceramic garden stool in blue and white",
        profileImage: "https://example.com/images/ceramic-stool.jpg",
        key: "CER-GAR-015",
        components: [
            {
                material: "507f1f77bcf86cd799439040", // Ceramic
                quantity: 1,
                isOptional: false,
                price: 70,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439041", // Porcelain upgrade
                        additionalPrice: [
                            { band: "wholesale", price: 50 },
                            { band: "retail", price: 75 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 6.0,
            taxAmount: 12
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439033"
    },
    {
        name: "Teak Outdoor Table",
        description: "Weather-resistant teak outdoor dining table",
        profileImage: "https://example.com/images/teak-table.jpg",
        key: "TEA-OUT-016",
        components: [
            {
                material: "507f1f77bcf86cd799439042", // Teak wood
                quantity: 1,
                isOptional: false,
                price: 300,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439043", // Marine varnish
                quantity: 1,
                isOptional: true,
                price: 50,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 8.5,
            taxAmount: 42.5
        },
        pricing: [
            { band: "wholesale", price: 500, currency: "USD" },
            { band: "retail", price: 750, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439034"
    },
    {
        name: "Upholstered Ottoman",
        description: "Round upholstered ottoman with storage compartment",
        profileImage: "https://example.com/images/ottoman.jpg",
        key: "UPH-OTT-017",
        components: [
            {
                material: "507f1f77bcf86cd799439044", // Fabric upholstery
                quantity: 1,
                isOptional: false,
                price: 40,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439016", // Leather upgrade
                        additionalPrice: [
                            { band: "wholesale", price: 60 },
                            { band: "retail", price: 90 }
                        ],
                        isSelected: false
                    }
                ]
            }
        ],
        productTax: {
            taxPercentage: 7.25,
            taxAmount: 14.5
        },
        pricing: [
            { band: "wholesale", price: 200, currency: "USD" },
            { band: "retail", price: 300, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439035"
    },
    {
        name: "Concrete Dining Table",
        description: "Modern concrete dining table with steel legs",
        profileImage: "https://example.com/images/concrete-table.jpg",
        key: "CON-DIN-018",
        components: [
            {
                material: "507f1f77bcf86cd799439045", // Concrete top
                quantity: 1,
                isOptional: false,
                price: 200,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439014", // Steel legs
                quantity: 4,
                isOptional: false,
                price: 40,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 8.0,
            taxAmount: 32
        },
        pricing: [
            { band: "wholesale", price: 400, currency: "USD" },
            { band: "retail", price: 600, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439036"
    },
    {
        name: "Rattan Hanging Chair",
        description: "Bohemian rattan hanging chair with cushions",
        profileImage: "https://example.com/images/rattan-chair.jpg",
        key: "RAT-HAN-019",
        components: [
            {
                material: "507f1f77bcf86cd799439046", // Rattan weave
                quantity: 1,
                isOptional: false,
                price: 150,
                choices: []
            },
            {
                material: "507f1f77bcf86cd799439047", // Cotton cushions
                quantity: 2,
                isOptional: true,
                price: 30,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 6.5,
            taxAmount: 19.5
        },
        pricing: [
            { band: "wholesale", price: 300, currency: "USD" },
            { band: "retail", price: 450, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439037"
    },
    {
        name: "Walnut Media Console",
        description: "Mid-century walnut media console with sliding doors",
        profileImage: "https://example.com/images/walnut-console.jpg",
        key: "WAL-MED-020",
        components: [
            {
                material: "507f1f77bcf86cd799439048", // Walnut wood
                quantity: 1,
                isOptional: false,
                price: 250,
                choices: [
                    {
                        material: "507f1f77bcf86cd799439011", // Oak alternative
                        additionalPrice: [
                            { band: "wholesale", price: -50 },
                            { band: "retail", price: -75 }
                        ],
                        isSelected: false
                    }
                ]
            },
            {
                material: "507f1f77bcf86cd799439049", // Sliding hardware
                quantity: 2,
                isOptional: false,
                price: 40,
                choices: []
            }
        ],
        productTax: {
            taxPercentage: 8.25,
            taxAmount: 49.5
        },
        pricing: [
            { band: "wholesale", price: 600, currency: "USD" },
            { band: "retail", price: 900, currency: "USD" }
        ],
        company_id: "507f1f77bcf86cd799439038"
    }
];

const ViewProducts = ({pageDescription}) => {

    const selectedSubMenu = {
      name: 'View All Products',
      link: '/',
    };
    
    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [selectedProduct, setSelectedProduct] = React.useState('');
    const [allProducts, setAllProducts] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [allCategories, setAllCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [exportContent, setExportContent] = React.useState(false);

    const Router = useRouter();
    const auth = useAuth();
    const loggedInUser = auth.user;

    React.useEffect(() => {
        setAllProducts(sampleProducts);
    }, [loggedInUser, Router]);

    const handleResetFilters = () => {
        setSearchInput('');
        setSelectedCategory('');
        setSelectedProduct('');
    };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'Product Management'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <ProductManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            {/* search bar and filters */}
            <div className='flex flex-row gap-5 w-full justify-between items-center'>
              <div className='h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full'>
                  <Image
                      src="/assets/search.png"
                      alt="search"
                      width={15}
                      height={15}
                  />
                  <input
                      type="text"
                      placeholder="Search product name or category ..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="focus:outline-none ml-2 w-full"
                  />
              </div>
              <div className="flex flex-row gap-2 text-sm min-w-fit text-text-gray">
                <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                  <Image
                    src="/assets/filter.png"
                    alt="sort"
                    width={15}
                    height={15}
                  />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="focus:outline-none cursor-pointer"
                  >
                    <option value={''}>All Categories</option>
                    {allCategories?.map((category) => (
                        <option key={category} value={category} className=''>{category}</option>
                    ))}
                  </select>
                </div>
                <button 
                    onClick={handleResetFilters}
                    className='h-8 px-1 border border-gray-border hover:bg-gray-shadow9 rounded-md flex flex-row items-center text-text-black'
                >
                    {`All Products - ${allProducts.length}`}
                </button>
                <button>
                  <Link href='/pages/account/admin/product-management/create-new-product' className='flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1'>
                      <Image
                          src="/assets/add.png"
                          alt="add"
                          width={15}
                          height={15}
                      />
                      <span className=''>create new product</span>
                  </Link>
                </button>
                <button 
                  className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1' 
                  onClick={() => setExportContent(true)}
                >
                  <Image
                    src={'/assets/export.png'}
                    alt="export"
                    width={15}
                    height={15}
                  />
                  <span className=''>Export</span>
                </button>
              </div>
            </div>



            {/* Table */}
            {loading? (<Spinner />):(
                <div>
                    this is the table
                </div>
            )}

        </div>
        <div className=''><PageDescription pageDescription={pageDescription}/></div>
      </div>
    </div>
  
    {/* exports etc */}
  </div>
  )
}

export default ViewProducts;