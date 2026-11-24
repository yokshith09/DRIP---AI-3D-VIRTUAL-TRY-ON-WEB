import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import { scoreProduct, getTopMatches } from '../src/lib/productMatcher';
import { analyzeBodyShape } from '../src/lib/bodyAnalysis';
import { balanceOutfitProducts, retrieveProducts } from '../src/lib/rag';
import { isPrivateIP } from '../src/app/api/import-product/route';
import { Product, StyleDNA } from '../src/data/types';

// Sample mock product for testing
const mockProduct: Product = {
  id: 'test-item-1',
  name: 'Urban Oversized Hoodie',
  brand: 'DRIP Atelier',
  category: 'mens',
  subcategory: 'Shirts',
  price: '₹ 2,999',
  priceNumber: 2999,
  rating: 4.8,
  reviews: 24,
  image: '/images/hero/cat-shirts.png',
  fit: 'Oversized Fit',
  material: 'Organic Cotton Fleece',
  tags: ['streetwear', 'hoodie', 'oversized'],
  bodyShapeSuitable: ['rectangle', 'inverted-triangle'],
  skinToneSuitable: ['warm', 'neutral'],
};

test('productMatcher - scoreProduct default score when onboarding not completed', () => {
  const uncompletedDNA: StyleDNA = { completedOnboarding: false };
  const score = scoreProduct(mockProduct, uncompletedDNA);
  assert.ok(score >= 85 && score <= 95, `Expected score between 85 and 95, got ${score}`);
});

test('productMatcher - scoreProduct with matching Style DNA profile', () => {
  const perfectDNA: StyleDNA = {
    completedOnboarding: true,
    bodyShape: 'rectangle',
    skinToneCategory: 'warm',
    styleVibe: 'streetwear',
    fitPreference: 'Oversized Fit',
    budgetRange: [1000, 5000],
  };

  const score = scoreProduct(mockProduct, perfectDNA);
  assert.ok(score >= 95, `Expected high score (>=95) for matching profile, got ${score}`);
});

test('productMatcher - scoreProduct with non-matching Style DNA penalizes score', () => {
  const mismatchDNA: StyleDNA = {
    completedOnboarding: true,
    bodyShape: 'pear',
    skinToneCategory: 'cool',
    styleVibe: 'formal',
    fitPreference: 'Slim Fit',
    budgetRange: [500, 1500], // product is 2999, which is over budget
  };

  const score = scoreProduct(mockProduct, mismatchDNA);
  assert.ok(score <= 70, `Expected lower score (<=70) for mismatching profile, got ${score}`);
});

test('productMatcher - getTopMatches returns products sorted by matchScore', () => {
  const dna: StyleDNA = {
    completedOnboarding: true,
    bodyShape: 'rectangle',
    skinToneCategory: 'warm',
    styleVibe: 'streetwear',
  };

  const item2: Product = {
    ...mockProduct,
    id: 'test-item-2',
    bodyShapeSuitable: ['pear'],
    skinToneSuitable: ['cool'],
    tags: ['formal'],
  };

  const top = getTopMatches([item2, mockProduct], dna, 2);
  assert.equal(top[0].id, 'test-item-1');
  assert.ok(top[0].matchScore >= top[1].matchScore);
});

test('bodyAnalysis - classifies correctly according to shoulder-hip ratio', async () => {
  const inverted = await analyzeBodyShape(1.20);
  assert.equal(inverted.bodyShape, 'inverted-triangle');

  const pear = await analyzeBodyShape(0.85);
  assert.equal(pear.bodyShape, 'pear');

  const hourglass = await analyzeBodyShape(1.02);
  assert.equal(hourglass.bodyShape, 'hourglass');

  const rectangle = await analyzeBodyShape(0.95);
  assert.equal(rectangle.bodyShape, 'rectangle');

  const apple = await analyzeBodyShape(1.08);
  assert.equal(apple.bodyShape, 'apple');
});

test('rag - balanceOutfitProducts balances tops, bottoms, and accessories', () => {
  const top1: Product = { ...mockProduct, id: 'top-1', subcategory: 'Shirts' };
  const top2: Product = { ...mockProduct, id: 'top-2', subcategory: 'Shirts' };
  const top3: Product = { ...mockProduct, id: 'top-3', subcategory: 'Shirts' };
  const top4: Product = { ...mockProduct, id: 'top-4', subcategory: 'Shirts' };
  const bottom1: Product = { ...mockProduct, id: 'bot-1', subcategory: 'Jeans' };
  const bottom2: Product = { ...mockProduct, id: 'bot-2', subcategory: 'Pants' };
  const acc1: Product = { ...mockProduct, id: 'acc-1', subcategory: 'Accessories' };

  const balanced = balanceOutfitProducts([top1, top2, top3, top4, bottom1, bottom2, acc1], 6);
  
  const subcategories = balanced.map(p => p.subcategory);
  assert.ok(subcategories.includes('Shirts'), 'Should include tops');
  assert.ok(subcategories.includes('Jeans') || subcategories.includes('Pants'), 'Should include bottoms');
  assert.ok(subcategories.includes('Accessories'), 'Should include accessories');
  assert.equal(balanced.length, 6);
});

test('rag - retrieveProducts returns results matching search query', () => {
  const results = retrieveProducts('Bear House Shirt', { completedOnboarding: false }, 5);
  assert.ok(results.length > 0);
  assert.ok(results.some(p => p.name.includes('BUCK') || p.brand.toLowerCase().includes('bear house')));
});

test('security - isPrivateIP accurately identifies SSRF attack targets and allows public IPs', () => {
  // Loopback / Localhost
  assert.equal(isPrivateIP('127.0.0.1'), true);
  assert.equal(isPrivateIP('127.255.255.255'), true);
  
  // RFC 1918 Private Ranges
  assert.equal(isPrivateIP('10.0.0.1'), true);
  assert.equal(isPrivateIP('172.16.0.1'), true);
  assert.equal(isPrivateIP('172.31.255.255'), true);
  assert.equal(isPrivateIP('192.168.1.1'), true);
  
  // Cloud Metadata / Link-local
  assert.equal(isPrivateIP('169.254.169.254'), true);
  
  // Carrier-Grade NAT (RFC 6598)
  assert.equal(isPrivateIP('100.64.0.1'), true);
  assert.equal(isPrivateIP('100.127.255.255'), true);

  // IPv6 Loopback & Link-local
  assert.equal(isPrivateIP('::1'), true);
  assert.equal(isPrivateIP('fe80::1'), true);

  // IPv4-mapped IPv6 addresses
  assert.equal(isPrivateIP('::ffff:127.0.0.1'), true);
  assert.equal(isPrivateIP('::ffff:169.254.169.254'), true);
  assert.equal(isPrivateIP('::ffff:10.0.0.1'), true);

  // Public IP addresses must NOT be blocked
  assert.equal(isPrivateIP('8.8.8.8'), false);
  assert.equal(isPrivateIP('1.1.1.1'), false);
  assert.equal(isPrivateIP('93.184.216.34'), false); // example.com
});

test('security - constant-time HMAC payment signature verification', () => {
  const secret = 'rzp_test_secret_key_12345';
  const orderId = 'order_ABC123';
  const paymentId = 'pay_XYZ789';
  const verificationString = `${orderId}|${paymentId}`;

  const validSignature = crypto
    .createHmac('sha256', secret)
    .update(verificationString)
    .digest('hex');

  const tamperedSignature = validSignature.slice(0, -2) + '00';

  const verifySignature = (sig: string) => {
    const genBuf = Buffer.from(validSignature, 'utf8');
    const sigBuf = Buffer.from(sig, 'utf8');
    return genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);
  };

  assert.equal(verifySignature(validSignature), true, 'Valid signature must verify');
  assert.equal(verifySignature(tamperedSignature), false, 'Tampered signature must fail');
  assert.equal(verifySignature('short_signature'), false, 'Different length signature must fail');
});

import { checkRateLimit } from '../src/lib/rateLimit';

test('security - sliding window rate limiter throttles excessive requests', () => {
  const testKey = `test-ip-${Date.now()}`;
  const limit = 3;
  const windowMs = 1000;

  // First 3 requests must succeed
  assert.equal(checkRateLimit(testKey, limit, windowMs).success, true);
  assert.equal(checkRateLimit(testKey, limit, windowMs).success, true);
  const r3 = checkRateLimit(testKey, limit, windowMs);
  assert.equal(r3.success, true);
  assert.equal(r3.remaining, 0);

  // 4th request must be rejected
  const r4 = checkRateLimit(testKey, limit, windowMs);
  assert.equal(r4.success, false);
  assert.equal(r4.remaining, 0);
  assert.ok(r4.resetMs > 0);
});
