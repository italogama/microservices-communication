# Documentação dos endpoints

* The Auth-API application has only one endpoint, the authentication.
* The Product-API application has 3 modules with various endpoints, for products, categories and suppliers.
* The Sales-API application has only 4 endpoints.

# Auth-API

## Base URL: http://localhost:8080 ou https://italogamainc-auth-api.herokuapp.com

### **GET** - **/api/initial-data** - Create application initial data (does not need transactionid and Authorization headers)

```json
{
    "message": "Data created."
}
```

### **POST** - **/api/user/auth** - Generate an access token

Headers:
```
Content-Type: application/json
```

Body:

```json
{
    "email": "testeuser1@gmail.com",
    "password": "123456"
}
```

Response:

```json
{
    "status": 200,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6eyJpZCI6MSwibmFtZSI6IlVzZXIgVGVzdCIsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIn0sImlhdCI6MTY1MzQ3OTY4OCwiZXhwIjoxNjUzNTY2MDg4fQ.-a0l6MrN6gM5RwykgvzEvKnAqXvbiW8YaDsUrucypW4"
}
```

**Note: all Product-API and Sales-API service endpoints need authorization header and transactionid:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6eyJpZCI6MSwibmFtZSI6IlVzZXIgVGVzdCIsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIn0sImlhdCI6MTY1MzQ3OTY4OCwiZXhwIjoxNjUzNTY2MDg4fQ.-a0l6MrN6gM5RwykgvzEvKnAqXvbiW8YaDsUrucypW4
transactionid: 843e5420-e767-45f3-aee3-ca9a16233352
```

If **the transactionid was not sent**, the response will be:

```json
{
    "status": 400,
    "message": "The transactionid header is required."
}
```

If **the token was not sent**, the response will be:

```json
{
    "status": 401,
    "message": "The access token was not informed."
}
```

If you send an **invalid token**, the response will be:

```json
{
    "status": 401,
    "message": "Error while trying to proccess the Access Token."
}
```

# Product-API

## Base URL: http://localhost:8081 ou https://italogamainc-product-api.herokuapp.com/

---

## Product Module

### **POST** - **/api/product** - Create a new product

Body:

```json
{
    "name": "Superman - As Quatro Estações",
    "quantity_available": 3,
    "supplierId": 1000,
    "categoryId": 1000
}
```

Response:

```json
{
    "id": 1,
    "name": "Superman - As Quatro Estações",
    "supplier": {
        "id": 1000,
        "name": "Panini Comics"
    },
    "category": {
        "id": 1000,
        "description": "Comic Books"
    },
    "quantity_available": 3,
    "created_at": "25/05/2022 09:15:03"
}
```

### **PUT** - **/api/product/{id}** - Update a product

Body:

```json
{
    "name": "Superman - As Quatro Estações 2",
    "quantity_available": 3,
    "supplierId": 1000,
    "categoryId": 1000
}
```

Response (parameter id = 1001):

```json
{
    "id": 1001,
    "name": "Superman - As Quatro Estações 2",
    "supplier": {
        "id": 1000,
        "name": "Panini Comics"
    },
    "category": {
        "id": 1000,
        "description": "Comic Books"
    },
    "quantity_available": 3,
    "created_at": null
}
```

### **DELETE** - **/api/product/{id}** - Remove a product

Response (parameter id = 2):

```json
{
    "status": 200,
    "message": "The product was deleted."
}
```

### **GET** - **/api/product** - Search all products

Response:

```json
[
    {
        "id": 1001,
        "name": "Crise nas Infinitas Terras",
        "supplier": {
            "id": 1000,
            "name": "Panini Comics"
        },
        "category": {
            "id": 1000,
            "description": "Comic Books"
        },
        "quantity_available": 9,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1002,
        "name": "Interestelar",
        "supplier": {
            "id": 1001,
            "name": "Amazon"
        },
        "category": {
            "id": 1001,
            "description": "Movies"
        },
        "quantity_available": 4,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1003,
        "name": "Harry Potter E A Pedra Filosofal",
        "supplier": {
            "id": 1001,
            "name": "Amazon"
        },
        "category": {
            "id": 1002,
            "description": "Books"
        },
        "quantity_available": 2,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1,
        "name": "Superman - As Quatro Estações",
        "supplier": {
            "id": 1000,
            "name": "Panini Comics"
        },
        "category": {
            "id": 1000,
            "description": "Comic Books"
        },
        "quantity_available": 3,
        "created_at": "25/05/2022 09:15:03"
    }
]
```

### **GET** - **/api/product/{id}** - Search for a product by ID

Response (parameter id = 1001):

```json
{
    "id": 1001,
    "name": "Crise nas Infinitas Terras",
    "supplier": {
        "id": 1000,
        "name": "Panini Comics"
    },
    "category": {
        "id": 1000,
        "description": "Comic Books"
    },
    "quantity_available": 9,
    "created_at": "25/05/2022 09:15:03"
}
```

### **GET** - **/api/product/name/{name}** - Search for a product by name without case sensitive

Response (parameter name = have):

```json
[
    {
        "id": 1001,
        "name": "Crise nas Infinitas Terras",
        "supplier": {
            "id": 1000,
            "name": "Panini Comics"
        },
        "category": {
            "id": 1000,
            "description": "Comic Books"
        },
        "quantity_available": 9,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1002,
        "name": "Interestelar",
        "supplier": {
            "id": 1001,
            "name": "Amazon"
        },
        "category": {
            "id": 1001,
            "description": "Movies"
        },
        "quantity_available": 4,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1003,
        "name": "Harry Potter E A Pedra Filosofal",
        "supplier": {
            "id": 1001,
            "name": "Amazon"
        },
        "category": {
            "id": 1002,
            "description": "Books"
        },
        "quantity_available": 2,
        "created_at": "25/05/2022 09:15:03"
    }
]
```

### **GET** - **/api/product/category/{categoryId}** - Search for a product by category ID

Response (parameter categoryId = 1000):

```json
[
    {
        "id": 1001,
        "name": "Crise nas Infinitas Terras",
        "supplier": {
            "id": 1000,
            "name": "Panini Comics"
        },
        "category": {
            "id": 1000,
            "description": "Comic Books"
        },
        "quantity_available": 9,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1,
        "name": "Superman - As Quatro Estações",
        "supplier": {
            "id": 1000,
            "name": "Panini Comics"
        },
        "category": {
            "id": 1000,
            "description": "Comic Books"
        },
        "quantity_available": 3,
        "created_at": "25/05/2022 09:15:03"
    }
]
```

### **GET** - **/api/product/supplier/{supplierId}** - Search for a product by supplier ID

Response (parameter supplierId = 1001):

```json
[
    {
        "id": 1002,
        "name": "Interestelar",
        "supplier": {
            "id": 1001,
            "name": "Amazon"
        },
        "category": {
            "id": 1001,
            "description": "Movies"
        },
        "quantity_available": 4,
        "created_at": "25/05/2022 09:15:03"
    },
    {
        "id": 1003,
        "name": "Harry Potter E A Pedra Filosofal",
        "supplier": {
            "id": 1001,
            "name": "Amazon"
        },
        "category": {
            "id": 1002,
            "description": "Books"
        },
        "quantity_available": 2,
        "created_at": "25/05/2022 09:15:03"
    }
]
```


### **POST** - **/api/product/check-stock** - Checks the stock of an array of products

Body:

```json
{
    "products": [
        {
            "productId": 1001,
            "quantity": 1
        },
        {
            "productId": 1002,
            "quantity": 1
        },
        {
            "productId": 1003,
            "quantity": 1
        }
    ]
}
```

Response:

```json
{
    "status": 200,
    "message": "The stock is ok!"
}
```

### **GET** - **/api/product/{productId}/sales** - Search for the product with all the IDs of the orders made by it

Response:

```json
{
    "id": 1001,
    "name": "Superman - As Quatro Estações 2",
    "supplier": {
        "id": 1000,
        "name": "Panini Comics"
    },
    "category": {
        "id": 1000,
        "description": "Comic Books"
    },
    "sales": [
        "6161cd32560fbede60d48efc",
        "6161cd32560fbede60d48efe",
        "6161d007560fbede60d48f01"
    ],
    "quantity_available": 3,
    "created_at": "25/05/2022 09:15:03"
}
```

---

## Suppliers Module

### **POST** - **/api/supplier** - Create a new supplier

Body:

```json
{
    "name": "Amazon Brasil"
}
```

Response:

```json
{
    "id": 1,
    "name": "Amazon Brasil"
}
```

### **PUT** - **/api/supplier/{id}** - Update a supplier

Body:

```json
{
    "name": "Amazon BR"
}
```

Response (parameter id = 1):

```json
{
    "id": 1,
    "name": "Amazon BR"
}
```

### **DELETE** - **/api/supplier/{id}** - Delete a supplier

Response (parameter id = 1):

```json
{
    "status": 200,
    "message": "The supplier was deleted."
}
```

### **GET** - **/api/supplier** - Search all suppliers

Response: 

```json
[
    {
        "id": 1000,
        "name": "Panini Comics"
    },
    {
        "id": 1001,
        "name": "Amazon"
    }
]
```

### **GET** - **/api/supplier/{id}** - Search for a supplier by ID

Response (parameter id = 1000):

```json
{
    "id": 1000,
    "name": "Panini Comics"
}
```

### **GET** - **/api/supplier/name/{name}** - Search for a supplier by name without case sensitive

Response (parameter name = pani): 

```json
[
    {
        "id": 1000,
        "name": "Panini Comics"
    }
]
```

---

## Categories Module

### **POST** - **/api/category** - Create a new category

Body:

```json
{
    "description": "Comic Books"
}
```

Response:

```json
{
    "id": 2,
    "description": "Comic Books"
}
```

### **PUT** - **/api/category/{id}** - Update a category

Body:

```json
{
    "description": "Comics"
}
```

Response (parameter id = 2):

```json
{
    "id": 2,
    "name": "Comics"
}
```

### **DELETE** - **/api/cateogry/{id}** - Delete a category

Response (parameter id = 2):

```json
{
    "status": 200,
    "message": "The category was deleted."
}
```

### **GET** - **/api/category** - Search all categories

Response: 

```json
[
    {
        "id": 1000,
        "description": "Comic Books"
    },
    {
        "id": 1001,
        "description": "Movies"
    },
    {
        "id": 1002,
        "description": "Books"
    }
]
```

### **GET** - **/api/category/{id}** - Search a category by ID

Response (parameter id = 1000):

```json
{
    "id": 1000,
    "description": "Comic Books"
}
```

### **GET** - **/api/category/description/{description}** - Search a category by description without case sensitive

Response (parameter description = book): 

```json
[
    {
        "id": 1000,
        "description": "Comic Books"
    },
    {
        "id": 1002,
        "description": "Books"
    }
]
```

# Sales-API

## Base URL: http://localhost:8082 ou https://italogamainc-sales-api.herokuapp.com/

### **GET** - **/api/initial-data** - Create initial application data (no transactionid and Authorization headers required)

```json
{
    "message": "Data created."
}
```

### **POST** - **/api/order/create** - Create an order

Body:
```json
{
  "products": [
    {
      "productId": 1001,
      "quantity": 1
    },
    {
      "productId": 1002,
      "quantity": 1
    },
    {
      "productId": 1003,
      "quantity": 1
    }
  ]
}
```

Response:

```json
{
    "status": 200,
    "createdOrder": {
        "products": [
            {
                "productId": 1001,
                "quantity": 1
            },
            {
                "productId": 1002,
                "quantity": 1
            },
            {
                "productId": 1003,
                "quantity": 1
            }
        ],
        "user": {
            "id": 1,
            "name": "User Test 1",
            "email": "testeuser1@gmail.com"
        },
        "status": "PENDING",
        "createdAt": "2022-05-25T11:32:06.757Z",
        "updatedAt": "2022-05-25T11:32:06.757Z",
        "transactionid": "2f8c72e0-03f0-4098-823e-4e8065ff665a",
        "serviceid": "e1e1f138-5e5d-4d44-a044-70ef46206812",
        "_id": "628e13b6966337bc255a2575",
        "__v": 0
    }
}
```

### **GET** - **/api/orders** - Search all orders

Response:

```json
{
    "status": 200,
    "orders": [
        {
            "_id": "628e20ad92c090279a63a4c2",
            "products": [
                {
                    "productId": 1001,
                    "quantity": 2
                },
                {
                    "productId": 1002,
                    "quantity": 1
                },
                {
                    "productId": 1003,
                    "quantity": 1
                }
            ],
            "user": {
                "id": "a1sd1as5d165ads1s6",
                "name": "User Test",
                "email": "usertest@gmail.com"
            },
            "status": "APPROVED",
            "createdAt": "2022-05-25T12:27:25.247Z",
            "updatedAt": "2022-05-25T12:27:25.247Z",
            "transactionid": "d8296054-9142-48d4-b610-f77f0dacca29",
            "serviceid": "7ad347bc-76b4-4fe5-8f8f-faeed6c297a1",
            "__v": 0
        },
        {
            "_id": "628e20ad92c090279a63a4c4",
            "products": [
                {
                    "productId": 1001,
                    "quantity": 4
                },
                {
                    "productId": 1003,
                    "quantity": 2
                }
            ],
            "user": {
                "id": "asd1as9d1asd1asd1as5d",
                "name": "User Test 2",
                "email": "usertest2@gmail.com"
            },
            "status": "REJECTED",
            "createdAt": "2022-05-25T12:27:25.404Z",
            "updatedAt": "2022-05-25T12:27:25.404Z",
            "transactionid": "05297342-c2b0-4866-952c-cebc45d216a7",
            "serviceid": "a55cdd60-2d37-401a-8893-ba1ee1ebeaf4",
            "__v": 0
        }
    ]
}
```

### **GET** - **/api/order/{orderId}** - Search for an order by ID

Response (parameter orderId = 628e20ad92c090279a63a4c2):

```json
{
    "status": 200,
    "existingOrder": {
        "_id": "628e20ad92c090279a63a4c2",
        "products": [
            {
                "productId": 1001,
                "quantity": 2
            },
            {
                "productId": 1002,
                "quantity": 1
            },
            {
                "productId": 1003,
                "quantity": 1
            }
        ],
        "user": {
            "id": "a1sd1as5d165ads1s6",
            "name": "User Test",
            "email": "usertest@gmail.com"
        },
        "status": "APPROVED",
        "createdAt": "2022-05-25T12:27:25.247Z",
        "updatedAt": "2022-05-25T12:27:25.247Z",
        "transactionid": "d8296054-9142-48d4-b610-f77f0dacca29",
        "serviceid": "7ad347bc-76b4-4fe5-8f8f-faeed6c297a1",
        "__v": 0
    }
}
```

### **GET** - **/api/orders/product/{productId}** - Search all orders for a product

Response (parameter productId = 1001):

```json
{
    "status": 200,
    "salesIds": [
        "628e20ad92c090279a63a4c2",
        "628e20ad92c090279a63a4c4"
    ]
}
```