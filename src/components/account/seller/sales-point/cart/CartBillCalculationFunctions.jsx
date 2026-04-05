const getVATAmount = (cartItems, cashDiscounts, workBranchVATRate) => {
  const taxableSubTotal = cartItems?.reduce((acc, item) => {
    if (taxfreeProduct(item)) return acc; // skip tax calculation for tax-free products
    const costPerItem = itemUnitCost(item) * item.quantity;
    return acc + costPerItem;
  }, 0);
  const totalTaxable =
    taxableSubTotal - getTotalCashOfferDiscount(cashDiscounts, cartItems); // apply cash discounts before calculating VAT
  const vatAmount = (totalTaxable * workBranchVATRate) / 100;
  return vatAmount || 0;
};

const getTotalCashOfferDiscount = (cashDiscounts, cartItems) => {
  const totalCashDiscount = cashDiscounts.reduce((total, offer) => {
    const discountValue = offer?.amountDiscount || 0;
    const discountPercentage = offer?.percentageDiscount || 0;
    const totalCashDiscount =
      discountValue + (discountPercentage / 100) * subtotal(cartItems);
    return total + totalCashDiscount;
  }, 0);
  return totalCashDiscount;
};

const getTotal = (cartItems, cashDiscounts, productsTax, workBranchVATRate) => {
  const vatAmount = getVATAmount(cartItems, cashDiscounts, workBranchVATRate);
  const total =
    subtotal(cartItems) -
    getTotalCashOfferDiscount(cashDiscounts, cartItems) +
    productsTax(cartItems) +
    vatAmount;
  return total;
};

const productsTax = (cartItems) =>
  cartItems?.reduce((acc, item) => {
    return acc + productItemTax(item) * item.quantity;
  }, 0);

const handleOptionAdditionalCost = (item) => {
  const optionAdditionalCost = item?.choices?.reduce((acc, obj) => {
    const additionalCost = obj.choice?.additionalPrice || 0;
    return acc + additionalCost;
  }, 0);
  return optionAdditionalCost;
};

const itemUnitCost = (item) => {
  const basePrice = item?.product?.price || 0;
  const itemTotalPrice = basePrice + handleOptionAdditionalCost(item);
  return itemTotalPrice;
};

const itemTotalCost = (item) => {
  const unitCost = itemUnitCost(item);
  const totalCost = unitCost * item?.quantity;
  return totalCost;
};

const productItemTax = (item) => {
  const taxableTaxRate = item?.product?.productTax?.baseTax || 0;
  const additionalTaxAmount =
    item?.product?.productTax?.additionalTaxAmount || 0;
  const unitCost = itemUnitCost(item);
  const taxAmount = (unitCost * taxableTaxRate) / 100;
  return taxAmount + additionalTaxAmount;
};

const subtotal = (cartItems) =>
  cartItems?.reduce((acc, item) => {
    return acc + itemTotalCost(item);
  }, 0);

const taxfreeProduct = (item) => {
  return item?.product?.productTax?.isTaxExcluded || false;
};

export {
  getVATAmount,
  getTotalCashOfferDiscount,
  getTotal,
  productsTax,
  itemUnitCost,
  itemTotalCost,
  productItemTax,
  subtotal,
  handleOptionAdditionalCost,
  taxfreeProduct,
};
