const norm = (v) => String(v ?? ''); //normalise to string

// Every product in the reward, whichever shape the server sent for either single product or multiple products
export const getOfferProducts = (offer) => {
  if (Array.isArray(offer?.freeProducts) && offer.freeProducts.length > 0)
    return offer.freeProducts;

  return offer?.freeProduct?._id ? [offer.freeProduct] : [];
};

// How many of those products the customer gets
export const getOfferPick = (offer) => {
  const total = getOfferProducts(offer).length;
  if (offer?.pick?.mode === 'any') {
    const count = Math.min(
      Math.max(parseInt(offer.pick.count) || 1, 1),
      Math.max(total, 1)
    );
    return { mode: 'any', count, total, mustChoose: count < total };
  }
  return { mode: 'all', count: total, total, mustChoose: false };
};

// The till's own copy of the product, narrowed to the components (and ingredient choices) the reward allows
export const resolveOfferProduct = (products, freeProduct) => {
  const product = (products || []).find(
    (p) => norm(p._id) === norm(freeProduct?._id)
  );
  if (!product) return { freeProduct, product: null, components: [] };

  const allowed = freeProduct.allowedComponents || [];
  const components = (product.components || [])
    .map((component) => {
      const rule = allowed.find((a) => norm(a._id) === norm(component._id));
      if (!rule) return null;
      const ids = (rule.allowedMaterialChoices || []).map(norm);
      return {
        ...component,
        materialChoices: (component.materialChoices || []).filter((m) =>
          ids.includes(norm(m?.material?._id))
        ),
      };
    })
    .filter(Boolean);
  return { freeProduct, product, components };
};

// Every product handed over across the applied product rewards, flattened for bill and receipt screens
export const flattenProductOffers = (appliedOffers = []) =>
  appliedOffers
    .filter((o) => o.type === 'product')
    .flatMap((offer) =>
      (offer.productDetails?.picks || []).map((p) => ({
        offerId: offer._id,
        description: offer.description,
        product: p.product,
        quantity: p.quantity,
        selectedChoices: Object.values(p.selectedChoices || {}).filter(
          (c) => c && c !== ' '
        ),
      }))
    );

// One line per applied cash offer, for bill and receipt screens.
// amount uses the same rule as getTotalCashOfferDiscount: fixed amount + percentage of the subtotal.
// -> [{ offerId, description, label: '10% off' | '£5.00 off' | '10% + £5.00 off', amount }]
export const getCashOfferLines = (appliedOffers = [], itemsSubtotal = 0) =>
  (appliedOffers || [])
    .filter((o) => o?.type === 'cash')
    .map((offer) => {
      const amountOff = offer?.amountDiscount || 0;
      const percentOff = offer?.percentageDiscount || 0;
      const parts = [];
      if (percentOff > 0) parts.push(`${+percentOff.toFixed(2)}%`);
      if (amountOff > 0)
        parts.push(`${offer?.currency || ''}${amountOff.toFixed(2)}`);
      return {
        offerId: offer?._id,
        description: offer?.description || 'Discount',
        label: parts.length ? `${parts.join(' + ')} off` : '',
        amount: amountOff + (percentOff / 100) * itemsSubtotal,
      };
    })
    .filter((line) => line.amount > 0);

// What the server needs to take the free items out of stock and judge the sale:
// [{ rewardId, products: [{ productId, selectedOptions: [{ optionId, quantity, optionAdditionalPrice }] }] }]
export const buildRewardSelections = (appliedOffers = []) =>
  appliedOffers
    .filter((o) => o.type === 'product')
    .map((offer) => ({
      rewardId: offer._id,
      products: (offer.productDetails?.picks || []).map((p) => ({
        productId: p.product?._id,
        selectedOptions: Object.values(p.selectedChoices || {})
          .filter((c) => c && c !== ' ' && c.material?._id)
          .map((c) => ({
            optionId: c.material._id,
            quantity: c.quantity || 0,
            optionAdditionalPrice: c.additionalPrice || 0,
          })),
      })),
    }));
