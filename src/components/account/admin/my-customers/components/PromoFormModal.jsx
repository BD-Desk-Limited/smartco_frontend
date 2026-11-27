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

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await searchPromoProductsService(search.trim());
      setResults(res.data || []);
      setLoading(false);
    };

    if (search && search.length >= 3) run();
  }, [search]);

  return (
    <div className="flex flex-col gap-1">
      <div className="h-8 px-2 border border-gray-border rounded-md flex items-center">
        <FaSearch aria-hidden="true" />
        <input
          type="text"
          placeholder="Enter at least 3 characters to search"
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
  // the free products. Each: { _id, name, quantity, components (null until loaded), allowed: { componentId: [materialId] } }
  const [freeProducts, setFreeProducts] = useState(
    (promo?.offer?.freeProducts || []).map((fp) => ({
      _id: String(fp._id),
      name:
        lookups.products.find((p) => String(p._id) === String(fp._id))?.name ||
        'Free product',
      quantity: fp.quantity || 1,
      components: null,
      allowed: Object.fromEntries(
        (fp.allowedComponents || []).map((a) => [
          a._id,
          a.allowedMaterialChoices.map(String),
        ])
      ),
    }))
  );
  // how many of them the customer gets: every one, or any N that they choose at the till
  const [pick, setPick] = useState({
    mode: promo?.offer?.pick?.mode || 'all',
    count: promo?.offer?.pick?.count || 1,
  });

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
      name:
        lookups.products.find((p) => String(p._id) === String(id))?.name ||
        'Product',
    })),
    match: c.products?.match || 'any',
    count: c.products?.count || 1,
    minQuantity: c.products?.minQuantity || 1,
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

  // when editing a draft, load each free product's components so its choices can be changed
  useEffect(() => {
    const missing = freeProducts.filter((fp) => !fp.components);
    if (missing.length === 0 || started) return undefined;
    let cancelled = false;
    missing.forEach((fp) =>
      searchPromoProductsService(fp.name).then((res) => {
        const found = (res.data || []).find((p) => p._id === fp._id);
        if (cancelled || !found) return;
        setFreeProducts((prev) =>
          prev.map((x) =>
            x._id === fp._id ? { ...x, components: found.components } : x
          )
        );
      })
    );
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // add or remove a free product; a new one starts with every option allowed (untick the ones that should not be free)
  const toggleFreeProduct = (product) =>
    setFreeProducts((prev) =>
      prev.some((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [
            ...prev,
            {
              _id: product._id,
              name: product.name,
              quantity: 1,
              components: product.components,
              allowed: Object.fromEntries(
                product.components.map((comp) => [
                  comp._id,
                  comp.materialChoices.map((m) => m.materialId),
                ])
              ),
            },
          ]
    );
  const updateFreeProduct = (id, patch) =>
    setFreeProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...patch } : p))
    );
  const toggleChoice = (productId, componentId, materialId) =>
    setFreeProducts((prev) =>
      prev.map((p) => {
        if (p._id !== productId) return p;
        const list = p.allowed[componentId] || [];
        return {
          ...p,
          allowed: {
            ...p.allowed,
            [componentId]: list.includes(materialId)
              ? list.filter((x) => x !== materialId)
              : [...list, materialId],
          },
        };
      })
    );
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
                freeProducts: freeProducts.map((fp) => ({
                  productId: fp._id,
                  quantity: Number(fp.quantity),
                  allowedComponents: Object.entries(fp.allowed)
                    .filter(([, choices]) => choices.length > 0)
                    .map(([componentId, allowedMaterialChoices]) => ({
                      componentId,
                      allowedMaterialChoices,
                    })),
                })),
                pick:
                  freeProducts.length > 1
                    ? { mode: pick.mode, count: Number(pick.count) }
                    : { mode: 'all', count: 1 },
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
            match: buy.match,
            count: Number(buy.count),
            minQuantity: Number(buy.minQuantity),
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
    <div className="relative bg-white px-5 pb-5 rounded-none sm:rounded-lg shadow-lg w-full h-full sm:h-auto sm:w-[780px] sm:max-w-[96vw] sm:max-h-[92vh] overflow-y-auto scrollbar-thin text-sm text-text-gray flex flex-col gap-3">
      <h2 className="text-lg py-2 font-semibold text-text-black sticky top-0 bg-text-white">
        {editing ? 'Edit promo' : 'Create promo'}{' '}
        <button
          onClick={onClose}
          title="Close"
          className="absolute top-2 right-2 p-1 rounded-full bg-brand-gray hover:bg-error"
        >
          <FaTimes className="text-text-white" />
        </button>
      </h2>
      {started && (
        <p className="border border-gray-border rounded-md p-2 bg-blue-shadow10">
          This promo has started, so its offer, rules, dates and branches are
          locked. You can change its name, description, end date and limits. To
          change anything else, end it and create a new promo.
        </p>
      )}

      <Section title="Basics">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                multiple
                selected={freeProducts}
                onToggle={toggleFreeProduct}
              />
            )}
            {freeProducts.length === 0 && (
              <p className="italic">
                Search and tick the products to give away. You can choose
                several.
              </p>
            )}

            {freeProducts.map((fp) => (
              <div
                key={fp._id}
                className="border border-gray-border rounded-md p-2 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <strong className="text-text-black">{fp.name}</strong>
                  <label className="flex items-center gap-2">
                    Quantity
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={fp.quantity}
                      disabled={lock}
                      onChange={(e) =>
                        updateFreeProduct(fp._id, { quantity: e.target.value })
                      }
                      className={`${field} h-8 w-20`}
                    />
                  </label>
                  {!lock && (
                    <button
                      type="button"
                      onClick={() => toggleFreeProduct({ _id: fp._id })}
                      className="text-error underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {fp.components?.length > 0 && !lock && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs">
                      Tick the options the customer may choose from for each
                      part of {fp.name}.
                    </p>
                    {fp.components.map((comp) => (
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
                                checked={(fp.allowed[comp._id] || []).includes(
                                  m.materialId
                                )}
                                onChange={() =>
                                  toggleChoice(fp._id, comp._id, m.materialId)
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
            ))}

            {freeProducts.length > 1 && (
              <div className="border border-gray-border rounded-md p-2 flex flex-col gap-2">
                <p className="font-medium text-text-black">
                  How many of these does the customer get?
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={pick.mode === 'all'}
                    disabled={lock}
                    onChange={() => setPick((v) => ({ ...v, mode: 'all' }))}
                  />
                  All {freeProducts.length} of them
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={pick.mode === 'any'}
                    disabled={lock}
                    onChange={() => setPick((v) => ({ ...v, mode: 'any' }))}
                  />
                  They choose any
                  <input
                    type="number"
                    min="1"
                    max={freeProducts.length}
                    value={pick.count}
                    disabled={lock || pick.mode !== 'any'}
                    onChange={(e) =>
                      setPick((v) => ({ ...v, count: e.target.value }))
                    }
                    className={`${field} h-8 w-20`}
                  />
                  of the {freeProducts.length} (different products)
                </label>
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
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={buy.match === 'any'}
                  disabled={lock}
                  onChange={() => setBuy((v) => ({ ...v, match: 'any' }))}
                />
                Any
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, buy.products.length)}
                  value={buy.count}
                  disabled={lock || buy.match !== 'any'}
                  onChange={(e) =>
                    setBuy((v) => ({ ...v, count: e.target.value }))
                  }
                  className={`${field} h-8 w-20`}
                />
                of the chosen products (different products)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={buy.match === 'all'}
                  disabled={lock}
                  onChange={() => setBuy((v) => ({ ...v, match: 'all' }))}
                />
                Every one of the chosen products
              </label>
              <label className="flex items-center gap-2">
                A product counts once the customer has bought at least
                <input
                  type="number"
                  min="1"
                  value={buy.minQuantity}
                  disabled={lock}
                  onChange={(e) =>
                    setBuy((v) => ({ ...v, minQuantity: e.target.value }))
                  }
                  className={`${field} h-8 w-20`}
                />
                unit(s) of it
              </label>
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
