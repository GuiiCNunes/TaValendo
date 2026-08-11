"use client";

import { FormEvent, useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const initialItems: Item[] = [
  { id: 1, name: "Leite integral", price: 5.49, quantity: 2 },
  { id: 2, name: "Pão de forma", price: 8.9, quantity: 1 },
  { id: 3, name: "Café", price: 17.9, quantity: 1 },
];

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Home() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(event: FormEvent) {
    event.preventDefault();
    const parsedPrice = Number(price.replace(",", "."));

    if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Informe o produto e um valor válido.");
      return;
    }

    setItems((current) => [
      ...current,
      { id: Date.now(), name: name.trim(), price: parsedPrice, quantity: 1 },
    ]);
    setName("");
    setPrice("");
    setError("");
  }

  function updateQuantity(id: number, delta: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="page-shell">
      <section className="shopping-list">
        <div className="summary">
          <div>
            <h1>Minha compra</h1>
            <p>{itemCount} {itemCount === 1 ? "item" : "itens"}</p>
          </div>
          <div className="total" aria-live="polite">
            <span>Total</span>
            <strong>{money.format(total)}</strong>
          </div>
        </div>

        <form className="add-form" onSubmit={addItem}>
          <div className="field product-field">
            <label htmlFor="item-name">Produto</label>
            <input
              id="item-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Arroz"
              autoComplete="off"
            />
          </div>
          <div className="field value-field">
            <label htmlFor="item-price">Valor</label>
            <div className="price-input">
              <span>R$</span>
              <input
                id="item-price"
                inputMode="decimal"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          <button className="add-button" type="submit" aria-label="Adicionar item">+</button>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>

        <div className="items" aria-label="Itens da compra">
          {items.length === 0 ? (
            <div className="empty-state">
              <p>Sua compra está vazia.</p>
              <span>Adicione um produto acima para começar.</span>
            </div>
          ) : (
            items.map((item) => (
              <article className="item" key={item.id}>
                <div className="item-info">
                  <h2>{item.name}</h2>
                  <p>{money.format(item.price)} cada</p>
                </div>
                <div className="quantity" aria-label={`Quantidade de ${item.name}`}>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity === 1}
                    aria-label="Diminuir quantidade"
                  >−</button>
                  <strong>{item.quantity}</strong>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    aria-label="Aumentar quantidade"
                  >+</button>
                </div>
                <strong className="item-total">{money.format(item.price * item.quantity)}</strong>
                <button
                  className="delete-button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Excluir ${item.name}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
                  </svg>
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
