# Products

- Product object

```
{
  id: integer
  name: string
  description: text
  image: string
  price: float
  discount: float
  stock: int
}
```

## **GET /products**

Returns all products in the system.

- **URL Params**  
  None
- **Data Params**  
  None
- **Headers**  
  Content-Type: application/json
- **Success Response:**
- **Code:** 200  
  **Content:**

```
{
  products: [
           {<product_object>},
           {<product_object>},
           {<product_object>}
         ]
}
```

## **GET /product/:id**

Returns the specified product.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**  
  None
- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
- **Code:** 200  
  **Content:** `{ <product_object> }`
- **Error Response:**
  - **Code:** 404  
    **Content:** `{ error : "Product doesn't exist" }`  
    OR
  - **Code:** 401  
    **Content:** `{ error : error : "You are unauthorized to make this request." }`

## **POST /product**

Creates a new Product and returns the new object.

- **URL Params**  
  None
- **Headers**  
  Content-Type: application/json
- **Data Params**

```
{
  id: integer
  name: string
  description: text
  image: string
  price: float
  discount: float
  stock: int
}
```

- **Success Response:**
- **Code:** 200  
  **Content:** `{ <product_object> }`

## **PATCH /products/:id**

Updates fields on the specified product and returns the updated object.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**

```
{
  id: integer
  name: string
  description: text
  image: string
  price: float
  discount: float
  stock: int
}
```

- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
- **Code:** 200  
  **Content:** `{ <product_object> }`
- **Error Response:**
  - **Code:** 404  
    **Content:** `{ error : "Product doesn't exist" }`  
    OR
  - **Code:** 401  
    **Content:** `{ error : error : "You are unauthorized to make this request." }`

## **PATCH /stocks/:id**

Decrement the stock of the specified product and returns the updated object.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**

```
{
  id: integer
  name: string
  description: text
  image: string
  price: float
  discount: float
  stock: int
}
```

- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
- **Code:** 200  
  **Content:** `{ <product_object> }`
- **Error Response:**
  - **Code:** 404  
    **Content:** `{ error : "Product doesn't exist" }`

## **DELETE /product/:id**

Deletes the specified product.

- **URL Params**  
  _Required:_ `id=[integer]`
- **Data Params**  
  None
- **Headers**  
  Content-Type: application/json  
  Authorization: Bearer `<OAuth Token>`
- **Success Response:**
  - **Code:** 200
- **Error Response:**
  - **Code:** 404  
    **Content:** `{ error : "Product doesn't exist" }`  
    OR
  - **Code:** 401  
    **Content:** `{ error : error : "You are unauthorized to make this request." }`

## **GET /search/:query**

Search a product.

- **URL Params**  
   _Required:_ `query=[string]`
- **Headers**  
  Content-Type: application/json
- **Data Params**
  None

- **Success Response:**
- **Code:** 200  
  **Content:** `{ <product_object> }`
