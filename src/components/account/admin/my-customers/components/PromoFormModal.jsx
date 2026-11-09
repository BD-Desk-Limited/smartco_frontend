import React, { useEffect, useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import {
  createPromoService,
  updatePromoService,
  searchPromoProductsService,
} from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';

const field =
  'w-full px-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring focus:border-brand-blue';

const Section = ({ title, hint, children }) => (
  <section className="border border-gray-border rounded-md p-3 flex flex-col gap-2">
    <h3 className="font-semibold text-text-black">{title}</h3>
    {hint && <p className="text-xs">{hint}</p>}
    {children}
  </section>
);

// search products, then pick one (single) or several (multiple)
const ProductPicker = ({ multiple, selected, onToggle }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const res = await searchPromoProductsService(search.trim());
    setResults(res.data || []);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="h-8 px-2 border border-gray-border rounded-md flex items-center">
        <FaSearch aria-hidden="true" />
        <input
          type="text"
          placeholder="Search products, then press Enter"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          className="focus:outline-none ml-2 w-full"
        />
      </div>
      {loading && <p className="italic">Searching...</p>}
      {results && results.length === 0 && (
        <p className="italic">No products found.</p>
      )}
      {results && results.length > 0 && (
        <ul className="border border-gray-border rounded-md max-h-36 overflow-y-auto">
          {results.map((p) => (
            <li
              key={p._id}
              className="border-b border-gray-border last:border-b-0"
            >
              <label className="flex items-center gap-2 p-2 cursor-pointer">
                <input
                  type={multiple ? 'checkbox' : 'radio'}
                  checked={selected.some((s) => s._id === p._id)}
                  onChange={() => onToggle(p)}
                />
                {p.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PromoFormModal = ({ promo, options, onClose, onSaved }) => {
  const editing = Boolean(promo);
  const started = editing && promo.status !== 'draft'; // rules are locked once a promo has started
  const lookups = promo?.lookups || { branches: [], products: [], groups: [] };
  const c = promo?.criteria || {};

  const [name, setName] = useState(promo?.name || '');
  const [description, setDescription] = useState(promo?.description || '');
  const [type, setType] = useState(promo?.type || 'cash');

  // the offer
  const [pct, setPct] = useState(
    promo?.offer?.percentageDiscount
      ? String(promo.offer.percentageDiscount)
      : ''
  );
  const [amount, setAmount] = useState(
    promo?.offer?.amountDiscount ? String(promo.offer.amountDiscount) : ''
  );
  const [offerText, setOfferText] = useState(promo?.offer?.description || '');
  const [freeProduct, setFreeProduct] = useState(
    promo?.offer?.freeProduct
      ? {
          _id: String(promo.offer.freeProduct._id),
          name:
            lookups.products.find((p) => p._id === promo.offer.freeProduct._id)
              ?.name || 'Free product',
          components: null,
        }
      : null
  );
  const [quantity, setQuantity] = useState(
    promo?.offer?.freeProduct?.quantity || 1
  );
  // componentId -> [materialId, ...] the customer may choose from
  const [allowed, setAllowed] = useState(
    Object.fromEntries(
      (promo?.offer?.freeProduct?.allowedComponents || []).map((a) => [
        a._id,
        a.allowedMaterialChoices,
      ])
    )
  );

  // the rules
  const [mode, setMode] = useState(c.mode || 'all');
  const [visit, setVisit] = useState({
    on: !!c.visitCount?.enabled,
    count: c.visitCount?.count || 5,
  });
  const [spend, setSpend] = useState({
    on: !!c.totalSpent?.enabled,
    amount: c.totalSpent?.amount || '',
  });
  const [visited, setVisited] = useState({
    on: !!c.branchesVisited?.enabled,
    branches: (c.branchesVisited?.branches || []).map(String),
    count: c.branchesVisited?.count || 1,
  });
  const [buy, setBuy] = useState({
    on: !!c.products?.enabled,
    products: (c.products?.products || []).map((id) => ({
      _id: String(id),
      name: lookups.products.find((p) => p._id === id)?.name || 'Product',
    })),
    count: c.products?.count || 1,
  });
  const [inGroups, setInGroups] = useState({
    on: !!c.customerGroups?.enabled,
    groups: (c.customerGroups?.groups || []).map(String),
  });

  // period, branches, limits
  const [startsAt, setStartsAt] = useState(
    promo ? formatDate(new Date(promo.startsAt)) : ''
  );
  const [endsAt, setEndsAt] = useState(
    promo ? formatDate(new Date(promo.endsAt)) : ''
  );
  const [validityDays, setValidityDays] = useState(promo?.validityDays || 30);
  const [isGlobal, setIsGlobal] = useState(promo ? promo.isGlobal : true);
  const [branchIds, setBranchIds] = useState(
    (promo?.branches || []).map((b) => String(b._id ?? b))
  );
  const [maxPerCustomer, setMaxPerCustomer] = useState(
    promo?.limits?.maxPerCustomer || 1
  );
  const [maxTotal, setMaxTotal] = useState(
    promo?.limits?.maxTotal ? String(promo.limits.maxTotal) : ''
  );

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // when editing a draft free-product promo, load the product's components so the choices can be changed
  useEffect(() => {
    if (!freeProduct || freeProduct.components) return undefined;
    let cancelled = false;
    searchPromoProductsService(freeProduct.name).then((res) => {
      if (cancelled) return;
      const found = (res.data || []).find((p) => p._id === freeProduct._id);
      if (found) setFreeProduct(found);
    });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pickFreeProduct = (product) => {
    setFreeProduct(product);
    // start with every option allowed; the admin unticks the ones that should not be free
    setAllowed(
      Object.fromEntries(
        product.components.map((comp) => [
          comp._id,
          comp.materialChoices.map((m) => m.materialId),
        ])
      )
    );
  };
  const toggleChoice = (componentId, materialId) =>
    setAllowed((prev) => {
      const list = prev[componentId] || [];
      return {
        ...prev,
        [componentId]: list.includes(materialId)
          ? list.filter((x) => x !== materialId)
          : [...list, materialId],
      };
    });
  const toggleIn = (list, setList) => (id) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const save = async () => {
    setError('');
    let payload;
    if (started) {
      payload = {
        name,
        description,
        endsAt,
        limits: {
          maxPerCustomer: Number(maxPerCustomer),
          maxTotal: maxTotal === '' ? null : Number(maxTotal),
        },
      };
    } else {
      payload = {
        name,
        description,
        type,
        offer:
          type === 'cash'
            ? {
                percentageDiscount: Number(pct) || 0,
                amountDiscount: Number(amount) || 0,
                description: offerText,
              }
            : {
                description: offerText,
                freeProduct: {
                  productId: freeProduct?._id,
                  quantity: Number(quantity),
                  allowedComponents: Object.entries(allowed)
                    .filter(([, choices]) => choices.length > 0)
                    .map(([componentId, allowedMaterialChoices]) => ({
                      componentId,
                      allowedMaterialChoices,
                    })),
                },
              },
        criteria: {
          mode,
          visitCount: { enabled: visit.on, count: Number(visit.count) },
          totalSpent: { enabled: spend.on, amount: Number(spend.amount) },
          branchesVisited: {
            enabled: visited.on,
            branches: visited.branches,
            count: Number(visited.count),
          },
          products: {
            enabled: buy.on,
            products: buy.products.map((p) => p._id),
            count: Number(buy.count),
          },
          customerGroups: { enabled: inGroups.on, groups: inGroups.groups },
        },
        startsAt,
        endsAt,
        validityDays: Number(validityDays),
        isGlobal,
        branches: isGlobal ? [] : branchIds,
        limits: {
          maxPerCustomer: Number(maxPerCustomer),
          maxTotal: maxTotal === '' ? null : Number(maxTotal),
        },
      };
    }
    setSaving(true);
    const res = editing
      ? await updatePromoService(promo._id, payload)
      : await createPromoService(payload);
    setSaving(false);
    if (res.error) return setError(String(res.error));
    onSaved(res.data);
  };

  const lock = started; // fields that cannot change after the start
  const ruleBox = (on, setOn, label, children) => (
    <div className="border border-gray-border rounded-md p-2">
      <label className="flex items-center gap-2 cursor-pointer font-medium text-text-black">
        <input
          type="checkbox"
          checked={on}
          disabled={lock}
          onChange={(e) => setOn(e.target.checked)}
        />
        {label}
      </label>
      {on && <div className="mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  );

  return (
    <div className="relative bg-white p-5 pt-0 rounded-xl shadow-lg w-[780px] max-w-[96vw] max-h-[92vh] overflow-y-auto scrollbar-thin text-sm text-text-gray flex flex-col gap-3">
      <div className="sticky top-0 bg-text-white py-2">
        <button
          onClick={onClose}
          title="Close"
          className="absolute top-0 right-0 p-1 rounded-full bg-brand-gray hover:bg-error"
        >
          <FaTimes className="text-text-white" />
        </button>
        <h2 className="text-lg font-semibold text-text-black">
          {editing ? 'Edit promo' : 'Create promo'}
        </h2>
      </div>
      {started && (
        <p className="border border-gray-border rounded-md p-2 bg-blue-shadow10">
          This promo has started, so its offer, rules, dates and branches are
          locked. You can change its name, description, end date and limits. To
          change anything else, end it and create a new promo.
        </p>
      )}

      <Section title="Basics">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            Name
            <input
              type="text"
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
          <label className="flex flex-col gap-1">
            Description (optional)
            <input
              type="text"
              value={description}
              maxLength={300}
              onChange={(e) => setDescription(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
        </div>
      </Section>

      <Section title="1. The reward">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={type === 'cash'}
              disabled={lock}
              onChange={() => setType('cash')}
            />{' '}
            Discount
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={type === 'product'}
              disabled={lock}
              onChange={() => setType('product')}
            />{' '}
            Free product
          </label>
        </div>

        {type === 'cash' ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              Percentage off (%)
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={pct}
                disabled={lock}
                onChange={(e) => setPct(e.target.value)}
                className={`${field} h-8`}
              />
            </label>
            <label className="flex flex-col gap-1">
              Amount off ({options.currency || 'currency'})
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                disabled={lock}
                onChange={(e) => setAmount(e.target.value)}
                className={`${field} h-8`}
              />
            </label>
            <p className="col-span-2 text-xs">
              Use either one or both. With both, the customer gets the amount
              plus the percentage of the bill.
            </p>
          </div>
        ) : (
          <>
            {!lock && (
              <ProductPicker
                selected={freeProduct ? [freeProduct] : []}
                onToggle={pickFreeProduct}
              />
            )}
            {freeProduct && (
              <div className="border border-gray-border rounded-md p-2 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <strong className="text-text-black">
                    {freeProduct.name}
                  </strong>
                  <label className="flex items-center gap-2">
                    Quantity
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={quantity}
                      disabled={lock}
                      onChange={(e) => setQuantity(e.target.value)}
                      className={`${field} h-8 w-20`}
                    />
                  </label>
                </div>
                {freeProduct.components?.length > 0 && !lock && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs">
                      Tick the options the customer may choose from for each
                      part of the product.
                    </p>
                    {freeProduct.components.map((comp) => (
                      <div key={comp._id}>
                        <p className="font-medium text-text-black">
                          {comp.categoryName || 'Component'}
                          {comp.isOptional ? ' (optional)' : ''}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {comp.materialChoices.map((m) => (
                            <label
                              key={m.materialId}
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={(allowed[comp._id] || []).includes(
                                  m.materialId
                                )}
                                onChange={() =>
                                  toggleChoice(comp._id, m.materialId)
                                }
                              />
                              {m.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
        <label className="flex flex-col gap-1">
          Wording shown at the till (optional, we write one if you leave it
          blank)
          <input
            type="text"
            value={offerText}
            maxLength={200}
            disabled={lock}
            onChange={(e) => setOfferText(e.target.value)}
            className={`${field} h-8`}
          />
        </label>
      </Section>

      <Section
        title="2. Who earns it"
        hint="Only fulfilled sales at the participating branches, inside the dates below, count. A visit is a day with a sale at a branch."
      >
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={mode === 'all'}
              disabled={lock}
              onChange={() => setMode('all')}
            />{' '}
            Customer must meet every rule I turn on
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={mode === 'any'}
              disabled={lock}
              onChange={() => setMode('any')}
            />{' '}
            Meeting any one rule is enough
          </label>
        </div>

        {ruleBox(
          visit.on,
          (on) => setVisit((v) => ({ ...v, on })),
          'Visits',
          <label className="flex items-center gap-2">
            Reward on every
            <input
              type="number"
              min="1"
              value={visit.count}
              disabled={lock}
              onChange={(e) =>
                setVisit((v) => ({ ...v, count: e.target.value }))
              }
              className={`${field} h-8 w-20`}
            />
            visit(s). Keeps repeating, up to the limit per customer below.
          </label>
        )}
        {ruleBox(
          spend.on,
          (on) => setSpend((v) => ({ ...v, on })),
          'Total spent',
          <label className="flex items-center gap-2">
            Spends at least {options.currency}
            <input
              type="number"
              min="0"
              step="any"
              value={spend.amount}
              disabled={lock}
              onChange={(e) =>
                setSpend((v) => ({ ...v, amount: e.target.value }))
              }
              className={`${field} h-8 w-32`}
            />
            in the period (earned once).
          </label>
        )}
        {ruleBox(
          visited.on,
          (on) => setVisited((v) => ({ ...v, on })),
          'Branches visited',
          <>
            <div className="flex flex-wrap gap-3">
              {options.branches.map((b) => (
                <label
                  key={b._id}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    disabled={lock}
                    checked={visited.branches.includes(b._id)}
                    onChange={() =>
                      setVisited((v) => ({
                        ...v,
                        branches: v.branches.includes(b._id)
                          ? v.branches.filter((x) => x !== b._id)
                          : [...v.branches, b._id],
                      }))
                    }
                  />
                  {b.name}
                </label>
              ))}
            </div>
            <label className="flex items-center gap-2">
              Must visit at least
              <input
                type="number"
                min="1"
                value={visited.count}
                disabled={lock}
                onChange={(e) =>
                  setVisited((v) => ({ ...v, count: e.target.value }))
                }
                className={`${field} h-8 w-20`}
              />
              of the ticked branches.
            </label>
          </>
        )}
        {ruleBox(
          buy.on,
          (on) => setBuy((v) => ({ ...v, on })),
          'Products bought',
          <>
            {!lock && (
              <ProductPicker
                multiple
                selected={buy.products}
                onToggle={(p) =>
                  setBuy((v) => ({
                    ...v,
                    products: v.products.some((x) => x._id === p._id)
                      ? v.products.filter((x) => x._id !== p._id)
                      : [...v.products, { _id: p._id, name: p.name }],
                  }))
                }
              />
            )}
            {buy.products.length > 0 && (
              <p>Chosen: {buy.products.map((p) => p.name).join(', ')}</p>
            )}
            <label className="flex items-center gap-2">
              Must buy at least
              <input
                type="number"
                min="1"
                value={buy.count}
                disabled={lock}
                onChange={(e) =>
                  setBuy((v) => ({ ...v, count: e.target.value }))
                }
                className={`${field} h-8 w-20`}
              />
              units of these products, combined.
            </label>
          </>
        )}
        {ruleBox(
          inGroups.on,
          (on) => setInGroups((v) => ({ ...v, on })),
          'Customer group',
          <div className="flex flex-wrap gap-3">
            {options.groups.length === 0 && (
              <p className="italic">There are no customer groups yet.</p>
            )}
            {options.groups.map((g) => (
              <label
                key={g._id}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  disabled={lock}
                  checked={inGroups.groups.includes(g._id)}
                  onChange={() =>
                    setInGroups((v) => ({
                      ...v,
                      groups: v.groups.includes(g._id)
                        ? v.groups.filter((x) => x !== g._id)
                        : [...v.groups, g._id],
                    }))
                  }
                />
                {g.name}
              </label>
            ))}
          </div>
        )}
      </Section>

      <Section title="3. When and where">
        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            Starts
            <input
              type="date"
              value={startsAt}
              disabled={lock}
              onChange={(e) => setStartsAt(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
          <label className="flex flex-col gap-1">
            Ends (whole day)
            <input
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
          <label className="flex flex-col gap-1">
            Each reward lasts (days)
            <input
              type="number"
              min="1"
              max="365"
              value={validityDays}
              disabled={lock}
              onChange={(e) => setValidityDays(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
        </div>
        <p className="text-xs">
          A reward expires that many days after it is earned, and never after
          the end date.
        </p>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isGlobal}
              disabled={lock}
              onChange={() => setIsGlobal(true)}
            />{' '}
            All branches
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isGlobal}
              disabled={lock}
              onChange={() => setIsGlobal(false)}
            />{' '}
            Selected branches
          </label>
        </div>
        {!isGlobal && (
          <div className="flex flex-wrap gap-3">
            {options.branches.map((b) => (
              <label
                key={b._id}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  disabled={lock}
                  checked={branchIds.includes(b._id)}
                  onChange={() => toggleIn(branchIds, setBranchIds)(b._id)}
                />
                {b.name}
              </label>
            ))}
          </div>
        )}
        <p className="text-xs">
          Only sales at these branches count towards the rules, and the reward
          can only be used there.
        </p>
      </Section>

      <Section title="4. Limits">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            Most rewards one customer can earn
            <input
              type="number"
              min="1"
              value={maxPerCustomer}
              onChange={(e) => setMaxPerCustomer(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
          <label className="flex flex-col gap-1">
            Most rewards across all customers (blank = no limit)
            <input
              type="number"
              min="1"
              value={maxTotal}
              onChange={(e) => setMaxTotal(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
        </div>
      </Section>

      {error && <p className="text-error">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={saving}
          className="py-2 px-3 rounded-lg border border-gray-border"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="py-2 px-4 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Save as draft'}
        </button>
      </div>
    </div>
  );
};

export default PromoFormModal;
