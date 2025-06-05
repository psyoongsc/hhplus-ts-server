import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { randomSeed, randomIntBetween } from './k6-utils.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  vus: 100,
  duration: '2m',
};

// 📊 Custom Metrics
const favoriteProductSuccess = new Counter('favorite_product_success');
const favoriteProductFail = new Counter('favorite_product_fail');

const orderSuccess = new Counter('order_success');
const orderConflict = new Counter('order_conflict');
const orderFail = new Counter('order_fail');

const orderCheckSuccess = new Counter('order_check_success');

// 🔧 상품 생성
function generateProductItems(count = 3) {
  const productIds = new Set();
  while (productIds.size < count) {
    const id = randomIntBetween(1, 90000);
    productIds.add(id);
  }
  return Array.from(productIds).map((id) => ({
    id,
    price: id,
    amount: 1,
  }));
}

export default function () {
  randomSeed(__VU * 100000 + __ITER);

  const memberId = randomIntBetween(1, 90000);

  // 1. 인기 상품 조회
  const favoriteProductRes = http.get('http://175.209.95.166:3000/productsalesstat/top5');
  if (favoriteProductRes.status === 200) {
    favoriteProductSuccess.add(1);
  } else {
    favoriteProductFail.add(1);
  }

  // 2. 주문 생성
  const orderBody = {
    memberId,
    products: generateProductItems(randomIntBetween(2, 5)),
  };
  const orderRes = http.post('http://175.209.95.166:3000/order', JSON.stringify(orderBody), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!orderRes) {
    orderFail.add(1);
    console.error('❌ 주문 응답 없음');
    return;
  }

  if (orderRes.status === 409) {
    orderConflict.add(1);
    console.warn(`💡 주문 충돌 (409): memberId=${memberId}`);
    console.warn(`↳ 사유: ${orderRes.body}`);
    return;
  }

  if (orderRes.status !== 201) {
    orderFail.add(1);
    console.warn(`❌ 주문 실패 (${orderRes.status}): ${orderRes.body}`);
    return;
  }

  orderSuccess.add(1);

  let orderId;
  try {
    orderId = orderRes.json('id');
  } catch (e) {
    orderFail.add(1);
    console.error('주문 응답 파싱 실패:', e.message);
    return;
  }

  if (!orderId) {
    orderFail.add(1);
    return;
  }

  // 3. 주문 조회
  const orderCheckRes = http.get(`http://175.209.95.166:3000/order/${orderId}`);
  if (orderCheckRes.status === 200 && orderCheckRes.json('id') === orderId) {
    orderCheckSuccess.add(1);
  }
}

export function handleSummary(data) {
  return {
    stdout: `
📊 K6 Load Test Summary

- 인기 상품 조회 성공    : ${data.metrics.favorite_product_success?.values.count || 0}
- 인기 상품 조회 실패    : ${data.metrics.favorite_product_fail?.values.count || 0}

- 주문 생성 성공        : ${data.metrics.order_success?.values.count || 0}
- 주문 생성 실패        : ${data.metrics.order_fail?.values.count || 0}
- 주문 충돌 (409)       : ${data.metrics.order_conflict?.values.count || 0}

- 주문 조회 성공        : ${data.metrics.order_check_success?.values.count || 0}

${textSummary(data, { indent: ' ', enableColors: true })}
`
  };
}
