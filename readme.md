# APP | Project seller

## Frontend

It's developed with React, but there are 4 languages to use it:

    - [ ] JavaScript
    - [ ] TypeScript
    - [ ] ReScript
    - [x] ClojureScript

Clojure has been selected because it's the functional/lisp way to build UIs.

## Backend

It's developed with Express, but it works with TypeScript.

## Usage

### Run frontend (app/) and backend (api/)

```bash
cd app ; npm run serve
# Then open http://localhost:1234 
```
```bash
cd api ; npm run serve
# Then open http://localhost:3000
```

### Build frontend (app/) and backend (api/)

```bash
cd app ; npm run build
# To clear the assets directory run:
npm run build:local
```
```bash
cd api ; npm run build
```

## Try endpoints

```bash
# Get all sell orders:
curl -L http://localhost:3000/sales

# Post new sell order:
curl -X POST -H "Content-Type: application/json" \
     -d '{"products":[],
          "buyerPhone":"213412213",
          "buyerEmail":"avenged@sevenfold.com",
          "shippingCity":"Guadalajara",
          "externalOrderNumber":"34244",
          "shippingRegion":"Jalisco",
          "buyerFullName":"Bruno Munari",
          "shippingCountry":"México",
          "shippingMethodId":"1",
          "shippingAddress":"Václavské nám. 5, Praha 1",
          "sellerStore":"The moon journey"
          }' \
    -L http://localhost:3000/sales

# Get all shipping methods:
curl -L http://localhost:3000/shipments
```