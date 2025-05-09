# STEP09. 동시성 이슈 해결 보고서

## 부제: 다중 인스턴스 환경에서 공유 자원(DB)에 접근 시 Race Condition에 대한 해결 전략 보고서

---

## 보고서의 목적

- 다중 애플리케이션 인스턴스 환경에서의 Race Condition 해결
- 데이터 정합성 유지, 성능 확보, 확장성 확보
- 락 전략과 트랜잭션을 상황에 따라 정교하게 설계
- 테스트 코드와 커버리지를 포함한 품질 관리 강화

---

### 1. 개요

- 현재 시스템은 NestJS 기반의 애플리케이션들이 Pisma ORM 을 사용하여 단일 MySQL 데이터베이스에 접근하는 구조이다. 다중 애플리케이션 혹은 다중 인스턴스에서 동시 접근이 빈번하게 발생하면서 Race Condition이 발생할 수 있음을 확인했고, 이에 대한 대응 전략으로 `락 매커니즘`을 적용한다.

---

### 2. 개념

- Race Condition
    - 정의: 둘 이상의 프로세스나 쓰레드가 동시에 같은 자원에 접근할 때, 실행 순서에 따라 결과가 달라지는 현상
    - 문제점: 처리 순서를 제어하지 않으면 데이터가 꼬이거나, 중복 처리, 누락 등의 데이터 물결성 문제가 발생함
    - 예시: 두 명의 사용자가 동시에 같은 상품을 구매 하면서 재고가 음수가 되는 현상
- 비관적 락
    - 정의: 데이터를 읽는 시점에 미리 락을 걸어, 다른 트랜잭션의 접근을 차단하는 방식
    - 장점: 충돌이 확실히 방지됨. 데이터 무결성이 최우선인 상황에서 유리함
    - 단점: 락을 거는 동안 다른 요청은 대기해야 하므로 성능 저하 우려가 있음
    - 사용 예시: 재고 차감, 결제 승인 등 중복 처리가 절대 발생하면 안 되는 시나리오
- 낙관적 락
    - 정의: 데이터 충돌이 자주 발생하지 않을 것이라 가정하고, 업데이트 시점에만 충돌 여부를 검사하는 방식
    - 전제 조건: version 필드나 updatedAt 필드 등 변경 여부를 체크할 수 있는 기준이 필요함
    - 장점: 락을 미리 걸지 않아 성능이 좋고 병목이 적음
    - 단점: 충돌 발생 시 실패로 간주되어 재시도 처리 로직이 필요함
    - 사용 예시: 유저 정보 수정, 게시글 수정 등 경합 가능성은 낮지만 정합성이 중요한 경우
- 트랜잭션
    - 정의: DB에서 수행되는 하나의 작업 단위로, 여러 쿼리를 하나의 묶음으로 처리하며, 이 과정에서 모두 성공하거나 모두 실패해야 함을 보장함.
    - ACID 원칙
        - Atomicity(원자성) - 트랜잭션 내 모든 작업은 모두 성공하거나 모두 실패함
        - Consistency(일관성) - 트랜잭션 처리 전과 후에 데이터는 일관된 상태를 유지해야 함
        - Isolation(격리성) - 여러 트랜잭션이 동시에 수행돼도 서로 간섭하면 안 됨
        - Durability(지속성) - 트랜잭션이 완료되면 그 결과는 DB에 영구 반영되어야 함.
- 데이터 무결성
    - 정의: 데이터가 일관되고 정확하며, 변경이 올바르게 반영되었음을 의미함
    - 중요성: 무결성이 깨지면 시스템 전체의 신뢰도가 무너짐
    - 보장 방식: 트랜잭션, 제약조건, 락, 유효성 검사 등을 통해 보장함
- 확장성
    - 정의: 시스템이 더 많은 요청이나 트래픽, 데이터 양을 문제 없이 처리할 수 있는 능력
    - 수평 확장 vs 수직 확장
        - 수평 확장: 인스턴스를 여러 개로 늘림 (ex. 여러 NestJS 인스턴스)
        - 수직 확장: 서버 자체의 사양을 높임 (ex. CPU, RAM 업그레이드)
        - 해당 상황에서는 수평 확장을 고려하는 중
    - Race Condition과의 관계: 확장성이 높아질수록 동시성 이슈가 증가할 수 있으므로, 락 전략이 필수적으로 따라와야 함.

---

### 3. AS-IS (현재 구조 분석)

- 시스템 구성
    - Backend Framework: NestJS
    - ORM: Prisma
    - Database: MySQL
    - Deployment: 다중 애플리케이션 인스턴스에서 하나의 MySQL DB 공유
- 문제점
    - 동시성 이슈로 인해 동일한 데이터에 대해 동시에 접근하거나 수정 유청이 들어오는 경우 데이터 무결성이 깨짐
    - 대표적인 예시:
        - 상품 재고 감소 시 중복 차감 발생
        - 선착순 쿠폰 발행 시 중복 발행 발생
- 해결 방안
    - DB Lock 전략을 적용하여 Race Condition 해결이 필요함

---

### 4. TO-BE (개선 방향 및 아키텍처)

- 개선 전략
    - 비관적 락(Pessimistic Lock): 확실한 동시 제어가 필요한 트랜잭션에 적용
    예) 주문 처리, 재고 차감, 쿠폰 발행
    - 낙관적 락(Optimistic Lock): 동시 접근은 적지만 무결성이 중요한 경우 적용
    예) 유저 정보 업데이트
    - Bottleneck 방지를 위한 트랜잭션 경계 설정
        - 트랜잭션을 가능한 짧고 명확하게 유지
        - 외부 API 호출 또는 I/O 작업은 트랜잭션 외부에서 처리
        - DB 락 유지 시간을 줄여 데드락과 병목 방지
    - 트랜잭션 경계 및 Propagation 전략
        - NestJS에서는 서비스 단위에서 트랜잭션 경계를 명확히 구분
        - 트랜잭션 전파를 통해 하위 로직이 상위 트랜잭션에 종속되는지 여부를 정의
- 기술적 적용 방법
    - 비관적 락 (Pessimistic Lock)
        - Prisma는 비관적 락을 직접 지원하지 않지만, raw SQL 또는 transaction 내 `SELECT … FOR UPDATE` 방식으로 적용 가능
        
        ```jsx
        await prisma.$transaction(async (tx) => {
          const item = await tx.$queryRaw`
            SELECT * FROM Member WHERE id = ${itemId} FOR UPDATE
          `;
          // 이후 업데이트 로직
        });
        ```
        
    - 낙관적 락 (Optimistic Lock)
        - 일반적으로 `version` 필드를 두고, 업데이트 시 version 이 동일한 경우에만 반영되도록 처리
        
        ```jsx
        await prisma.member.updateMany({
          where: {
            id: itemId,
            version: currentVersion
          },
          data: {
            ...updatedData,
            version: { increment: 1 }
          }
        });
        
        ```
        

---

### 5. AS-IS / TO-BE 비교 분석

| 항목 | AS-IS | TO-BE |
| --- | --- | --- |
| 동시성 제어 | 없음 | 상황에 따라 락 적용 |
| 데이터 무결성 | 손상 가능성 있음 | 트랜잭션 충돌 방지 및 정합성 보장 |
| 확장성 | 불안정 | 병렬 처리 안정성 증가 |
| 유지 보수 | 단순하지만 서비스 장애 가능성 높음 | 복잡하지만 서비스 안정성 확보 |

---

### 6. 실험 및 결과 시각화

- Race Condition 발생 구조 (AS-IS)
    
    ```jsx
    [요청1] ---\
               --> [DB] --> 충돌 발생
    [요청2] ---/
    ```
    
- TO-BE: 비관적 락 흐름
    
    ```jsx
    [Client] --> SELECT FOR UPDATE --> 처리 완료 --> COMMIT
    ```
    
- TO-BE: 낙관적 락 흐름
    
    ```jsx
    1. 데이터 조회 (version = 3)
    2. 업데이트 시 조건부 쿼리 (WHERE version = 3)
    3. 업데이트 성공 → version 4 / 실패 시 재시도 or 사용자 알림
    ```
    

---

### 7. 테스트 및 커버리지 전략

- 테스트 코드의 명확성
    - 각 동시성 케이스를 단위 테스트, 통합 테스트로 분리
        - 단위 테스트
            - 낙관적 락 로직의 version check 작동 여부
            - 에러 발생 시 적절한 에러 처리
            - DB 쿼리 호출을 적절히 하고 있는지 mock 기반 검증
        - 통합 테스트
            - 실제 DB 기반, 병렬 요청 시뮬레이션
    - Race Condition 시뮬레이션을 위한 병렬 요청 통합 테스트 작성
        
        ```jsx
        // 예: 비관적 락 충돌 테스트
        await Promise.all([
          service.processOrder(userA),
          service.processOrder(userB),
        ]);
        ```
        
- 커버리지 관리
    - Lock 충돌 시나리오 포함 여부 확인
    - 비관적/낙관적 로직 모두 테스트 포함
    - 테스트 커버리지 도구 활용 (ex. Jest + `—coverage`)

---

### 8. 결론 및 기대 효과

- Race Condition으로 인한 데이터 충돌 및 무결성 손실 문제를 근본적으로 해결
- 상황별 락 전략 적용으로 성능과 안정성 간 균형 확보
- 운영 중인 서비스의 신뢰성 향상, 장애 발생률 감소 기대