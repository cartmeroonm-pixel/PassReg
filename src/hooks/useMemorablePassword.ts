'use client';

import { useState, useCallback, useEffect } from 'react';

export interface MemorableConfig {
  useSymbols: boolean;  // спецсимволы вроде ! @ # $ % .
  useDashes: boolean;   // дефис и подчёркивание - _
  useDigits: boolean;   // цифры 0–9
}

// Прилагательные — визуальные, легко представить
const ADJECTIVES = [
  'Silent', 'Brave', 'Red', 'Wild', 'Dark', 'Swift', 'Cool',
  'Bright', 'Sharp', 'Calm', 'Bold', 'Tiny', 'Giant', 'Loud',
  'Fast', 'Warm', 'Cold', 'Soft', 'Hard', 'Deep', 'High', 'Old',
  'Wise', 'Kind', 'True', 'Free', 'Blue', 'Gold', 'Iron', 'Storm',
];

// Существительные — конкретные объекты, животные, природа
const NOUNS = [
  'Tiger', 'Fox', 'Lake', 'Sun', 'Moon', 'Star', 'Tree', 'Rock',
  'Fire', 'Wind', 'Rain', 'Snow', 'Wolf', 'Bear', 'Hawk', 'Frog',
  'Ship', 'Bell', 'Drum', 'Gate', 'Road', 'Lamp', 'Coin', 'Book',
  'Cake', 'Fish', 'Bird', 'Leaf', 'Rose', 'Sand', 'Wave', 'Dust',
];

// Глаголы — действия в 3-м лице ед.ч. (Present Simple)
const VERBS = [
  'Eats', 'Runs', 'Jumps', 'Flies', 'Swims', 'Rides', 'Hunts',
  'Hides', 'Sings', 'Walks', 'Climbs', 'Digs', 'Pulls', 'Holds',
  'Drops', 'Kicks', 'Lifts', 'Throws', 'Bites', 'Leads',
];

const SPECIAL_SYMBOLS = ['.', '#', '$', '%', '!', '@'];
const DASHES         = ['-', '_'];

// Криптографически безопасный случайный индекс через Web Crypto API
function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function pick<T>(arr: T[]): T {
  return arr[randomIndex(arr.length)];
}

// 6 случайных порядков слов — атакующий не знает структуру
type WordOrder = (a: string, v: string, n: string, g1: string, g2: string) => string;
const WORD_ORDERS: WordOrder[] = [
  (a, v, n, g1, g2) => `${a}${g1}${v}${g2}${n}`,
  (a, v, n, g1, g2) => `${n}${g1}${a}${g2}${v}`,
  (a, v, n, g1, g2) => `${v}${g1}${a}${g2}${n}`,
  (a, v, n, g1, g2) => `${a}${g1}${n}${g2}${v}`,
  (a, v, n, g1, g2) => `${n}${g1}${v}${g2}${a}`,
  (a, v, n, g1, g2) => `${v}${g1}${n}${g2}${a}`,
];

// Строит «склейку» между словами из включённых типов разделителей
function buildGlue(sepPool: string[], useDigits: boolean): string {
  const sep = sepPool.length > 0 ? pick(sepPool) : '';
  const dig = useDigits
    ? `${randomIndex(10)}${randomIndex(10)}`
    : '';

  if (sep && dig) {
    // Случайный порядок: символ перед цифрами или после
    return randomIndex(2) === 0 ? `${sep}${dig}` : `${dig}${sep}`;
  }
  return `${sep}${dig}`;
}

export function useMemorablePassword() {
  const [config, setConfig] = useState<MemorableConfig>({
    useSymbols: true,
    useDashes:  false,
    useDigits:  true,
  });
  const [password, setPassword] = useState('');
  const [hint,     setHint]     = useState('');

  const generate = useCallback(() => {
    const adj      = pick(ADJECTIVES);
    const verb     = pick(VERBS);
    const noun     = pick(NOUNS);
    const hintNoun = pick(NOUNS.filter((n) => n !== noun));

    // Пул разделителей из включённых типов
    const sepPool: string[] = [];
    if (config.useSymbols) sepPool.push(...SPECIAL_SYMBOLS);
    if (config.useDashes)  sepPool.push(...DASHES);

    const g1 = buildGlue(sepPool, config.useDigits);
    const g2 = buildGlue(sepPool, config.useDigits);

    const order = pick(WORD_ORDERS);
    const pwd   = order(adj, verb, noun, g1, g2);

    // Мнемоника всегда в одном формате — запоминаем слова, не их порядок
    const mnemonic = `a ${adj.toLowerCase()} ${noun.toLowerCase()} `
                   + `${verb.toLowerCase()} ${hintNoun.toLowerCase()}`;

    setPassword(pwd);
    setHint(mnemonic);
  }, [config]);

  // Автоперегенерация при смене галочек (как в Random)
  useEffect(() => {
    generate();
  }, [generate]);

  // Реалистичная энтропия: против большого английского словаря + поправка +20
  const sepPoolSize =
    (config.useSymbols ? SPECIAL_SYMBOLS.length : 0) +
    (config.useDashes  ? DASHES.length          : 0);

  let glueEntropy = 0;
  if (sepPoolSize > 0 && config.useDigits) {
    // Каждая склейка: pick(sep) × pick(digits 0–99) × pick(порядок 2)
    glueEntropy = 2 * Math.log2(sepPoolSize * 100 * 2);
  } else if (sepPoolSize > 0) {
    glueEntropy = 2 * Math.log2(sepPoolSize);
  } else if (config.useDigits) {
    glueEntropy = 2 * Math.log2(100);
  }

  // Структурный бонус: «атакующий не знает что это склейка слов»
  // Берём МАКСИМУМ из включённых типов — добавление любого типа не может ухудшить результат.
  // Дефисы (-_) идут первыми в Hashcat best64.rule → бонус 8
  // Цифры между словами — полупредсказуемый паттерн  → бонус 12
  // Спецсимволы (!@#$) — нестандартные, редко в word-combo правилах → бонус 20
  const structuralBonus = Math.max(
    config.useSymbols ? 20 : 0,
    config.useDigits  ? 12 : 0,
    config.useDashes  ?  8 : 0,
  );

  const entropy =
    Math.log2(8_000)              +  // прилагательных в большом словаре
    Math.log2(6_000)              +  // глаголов
    Math.log2(40_000)             +  // существительных
    glueEntropy                   +  // два разделителя (sym/dash/dig)
    Math.log2(WORD_ORDERS.length) +  // случайный порядок слов
    structuralBonus;                 // насколько предсказуем тип разделителя

  return { password, hint, generate, entropy, config, setConfig };
}
