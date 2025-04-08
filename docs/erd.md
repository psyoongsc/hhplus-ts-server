# ERD

```mermaid
erDiagram
    MEMBER_COUPON }|..|| COUPON : included
    MEMBER ||..|{ MEMBER_COUPON : has
    MEMBER ||..o{ ORDER : has
    MEMBER_COUPON |o..|| ORDER : has
    ORDER ||..|{ ORDER_PRODUCT : includes
    PRODUCT ||..|{ ORDER_PRODUCT : included
    PRODUCT ||..o{ PRODUCT_SALES_STAT : places
    
    MEMBER {
        int id PK "AI"
        string name "NN"
        int balance "NN"
    }
    MEMBER_COUPON {
        int id PK "AI"
        int memberId FK "NN"
        int couponId FK "NN"
        bool isUsed "NN"
    }
    COUPON {
        int id PK "AI"
        string name "NN"
        string type "NN"
        int offFigure "NN"
        int stock "NN"
    }
    ORDER {
        int id PK "AI"
        int memberId FK "NN"
        int couponId FK 
        int totalSales "NN"
        int discountedSales "NN"
        string status "NN"
    }
    ORDER_PRODUCT {
        int id PK "AI"
        int orderId FK "NN"
        int productId FK "NN"
        int amount "NN"
    }
    PRODUCT {
        int id PK "AI"
        string name "NN"
        int stock "NN"
        int price "NN"
    }
    PRODUCT_SALES_STAT {
		    int id PK "AI"
		    int productID FK "NN"
		    date salesDate "NN"
		    int total_amount "NN"
		    int total_sales "NN"
    }
```