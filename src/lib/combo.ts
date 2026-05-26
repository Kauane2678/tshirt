/**
 * Promoção "Compre Junto":
 *   3 camisetas por R$ 119,99 (total)
 *   Aplica a cada bloco de 3 unidades.
 *   Sobras pagam o preço cheio.
 *
 * Exemplos:
 *   1 unid:  preço cheio
 *   2 unid:  preço cheio (cada)
 *   3 unid:  R$ 119,99
 *   4 unid:  R$ 119,99 + 1× preço cheio
 *   6 unid:  R$ 119,99 × 2
 *   7 unid:  R$ 119,99 × 2 + 1× preço cheio
 */

export const COMBO_QTY      = 3;
export const COMBO_PRICE    = 119.99;
export const COMBO_PER_UNIT = +(COMBO_PRICE / COMBO_QTY).toFixed(2);

export interface ComboLineItem {
  productId: number;
  size:      string;
  quantity:  number;
  unitPrice: number;
}

export interface ComboCalc {
  totalQuantity: number;
  combos:        number;            // quantos blocos de COMBO_QTY foram montados
  remainder:     number;            // unidades fora dos blocos
  comboPrice:    number;            // R$ aplicado no(s) combo(s)
  remainderPrice:number;            // R$ pago pelas sobras (preço cheio)
  originalTotal: number;            // total se NÃO houvesse promo
  finalTotal:    number;            // total após promo
  discount:      number;            // economia
  hasCombo:      boolean;
  unitsToNext:   number;            // unidades faltando pra próxima promo
}

/**
 * Calcula o desconto aplicando o combo das unidades MAIS BARATAS primeiro
 * (regra padrão para promos progressivas — cliente sempre ganha).
 */
export function calcCombo(items: ComboLineItem[]): ComboCalc {
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const originalTotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  if (totalQuantity < COMBO_QTY) {
    return {
      totalQuantity,
      combos:         0,
      remainder:      totalQuantity,
      comboPrice:     0,
      remainderPrice: originalTotal,
      originalTotal,
      finalTotal:     originalTotal,
      discount:       0,
      hasCombo:       false,
      unitsToNext:    COMBO_QTY - totalQuantity,
    };
  }

  // Expand cart into individual units sorted by price ASC
  // → as N unidades MAIS BARATAS entram nos combos (vantagem para o cliente)
  const flat: number[] = [];
  for (const i of items) {
    for (let n = 0; n < i.quantity; n++) flat.push(i.unitPrice);
  }
  flat.sort((a, b) => a - b);

  const combos      = Math.floor(totalQuantity / COMBO_QTY);
  const remainder   = totalQuantity - combos * COMBO_QTY;
  const inCombo     = flat.slice(0, combos * COMBO_QTY);
  const outOfCombo  = flat.slice(combos * COMBO_QTY);

  const comboPrice    = +(combos * COMBO_PRICE).toFixed(2);
  const remainderPrice = +outOfCombo.reduce((s, p) => s + p, 0).toFixed(2);
  const finalTotal    = +(comboPrice + remainderPrice).toFixed(2);
  const discount      = +(originalTotal - finalTotal).toFixed(2);

  // Quantas unidades faltam pra fechar o próximo combo
  const unitsToNext = remainder === 0 ? COMBO_QTY : COMBO_QTY - remainder;

  // Sanity: o desconto nunca deve ser negativo (acontece se preço unitário < COMBO_PER_UNIT)
  // Nesse caso, mantemos preço cheio das unidades baratas (sem combo nelas)
  if (discount < 0) {
    return {
      totalQuantity,
      combos:         0,
      remainder:      totalQuantity,
      comboPrice:     0,
      remainderPrice: originalTotal,
      originalTotal,
      finalTotal:     originalTotal,
      discount:       0,
      hasCombo:       false,
      unitsToNext:    COMBO_QTY,
    };
  }

  // Suprime blocos não vantajosos
  const effectiveInCombo = inCombo.reduce((s, p) => s + p, 0);
  if (effectiveInCombo <= comboPrice) {
    // pagar preço cheio é mais barato — não aplica combo
    return {
      totalQuantity,
      combos:         0,
      remainder:      totalQuantity,
      comboPrice:     0,
      remainderPrice: originalTotal,
      originalTotal,
      finalTotal:     originalTotal,
      discount:       0,
      hasCombo:       false,
      unitsToNext:    COMBO_QTY,
    };
  }

  return {
    totalQuantity,
    combos,
    remainder,
    comboPrice,
    remainderPrice,
    originalTotal,
    finalTotal,
    discount,
    hasCombo: true,
    unitsToNext,
  };
}

/* Helpers de UI */

export function comboLabel() {
  return `Leve ${COMBO_QTY} por R$ ${COMBO_PRICE.toFixed(2).replace(".", ",")}`;
}

export function comboShort() {
  return `${COMBO_QTY} por R$ ${COMBO_PRICE.toFixed(2).replace(".", ",")}`;
}
