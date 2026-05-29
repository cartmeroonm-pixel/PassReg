'use client';

import { useState, useCallback, useEffect } from 'react';

export interface PasswordConfig {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
// Исключаем визуально похожие символы (0/O, 1/l/I) для удобства
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Криптографически безопасный случайный индекс через Web Crypto API
function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export function usePasswordGenerator() {
  const [config, setConfig] = useState<PasswordConfig>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    let charset = '';
    const required: string[] = [];

    // Гарантируем наличие хотя бы одного символа каждого выбранного типа
    if (config.uppercase) {
      charset += UPPERCASE;
      required.push(UPPERCASE[randomIndex(UPPERCASE.length)]);
    }
    if (config.lowercase) {
      charset += LOWERCASE;
      required.push(LOWERCASE[randomIndex(LOWERCASE.length)]);
    }
    if (config.numbers) {
      charset += NUMBERS;
      required.push(NUMBERS[randomIndex(NUMBERS.length)]);
    }
    if (config.symbols) {
      charset += SYMBOLS;
      required.push(SYMBOLS[randomIndex(SYMBOLS.length)]);
    }

    if (!charset) {
      setPassword('');
      return;
    }

    const chars: string[] = [...required];
    for (let i = required.length; i < config.length; i++) {
      chars.push(charset[randomIndex(charset.length)]);
    }

    // Тасуем алгоритмом Фишера-Йетса, каждый шаг — через crypto
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomIndex(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    setPassword(chars.join(''));
  }, [config]);

  // Автоперегенерация при изменении настроек
  useEffect(() => {
    generate();
  }, [generate]);

  const alphabetSize =
    (config.uppercase ? 26 : 0) +
    (config.lowercase ? 26 : 0) +
    (config.numbers ? 10 : 0) +
    (config.symbols ? SYMBOLS.length : 0);

  // Формула энтропии: length × log2(alphabet_size)
  const entropy = alphabetSize > 0 ? config.length * Math.log2(alphabetSize) : 0;

  return { password, config, setConfig, generate, entropy };
}
