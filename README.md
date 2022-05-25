# Microservices Communication

## Technologies

* **Javascript ES6**
* **Node.js 14**
* **ES6 Modules**
* **Express.js**
* **Java 11**
* **Spring Boot**
* **API REST**
* **PostgreSQL (Container e Heroku Postgres)**
* **MongoDB (Container e Cloud MongoDB)**
* **RabbitMQ (Container e CloudAMQP)**
* **Docker**
* **docker-compose**
* **JWT**
* **Spring Cloud OpenFeign**
* **Heroku**
* **Axios**
* **Coralogix Logging**
* **Kibana**

## Proposed Architecture

Following Architecture:

![Proposed Architecture](https://github.com/italogama/microservices-communication/blob/master/content/proposedarchitecture.png)

We will have 3 APIs:

* **Auth-API**: Authentication API with Node.js 14, Express.js, Sequelize, PostgreSQL, JWT and Bcrypt.
* **Sales-API**: Sales API with Node.js 14, Express.js, MongoDB, Mongoose, JWT validation, RabbitMQ and Axios for HTTP clients.
* **Product-API**: Product API with Java 11, Spring Boot, Spring Data JPA, PostgreSQL, JWT validation, RabbitMQ and Spring Cloud OpenFeign for HTTP clients.

We will also have the entire architecture running in docker containers via docker-compose.

### Flow of executing an order

The flow for placing an order will depend on communications **synchronous** (HTTP calls via REST) e **asynchronous** (messaging with RabbitMQ).

The flow is described below:

* 01 - The start of the flow will be by making a request to the order creation endpoint.
* 02 - The input payload (JSON) will be a list of products informing the ID and the desired quantity.
* 03 - Before creating the order, a REST call will be made to the Products API to validate that there is stock for the purchase of all products.
* 04 - If any product is out of stock, the Products API will return an error, and the Sales API will throw an error message stating that there is no stock.
* 05 - If there is stock, then an order will be created and saved in MongoDB with pending status (PENDING).
* 06 - When saving the order, a message will be published on RabbitMQ informing the ID of the created order, and the products with their respective IDs and quantities.
* 07 - The Products API will be listening to the queue, so it will receive the message.
* 08 - Upon receiving the message, the API will revalidate the stock of the products, and if all are ok, it will update the stock of each product.
* 09 - If the stock is updated successfully, the Products API will post a message to the sales confirmation queue with status APPROVED.
* 10 - If there is a problem with the update, the Products API will post a message in the sales confirmation queue with status REJECTED.
* 11 - Finally, the order API will receive the confirmation message and update the order with the status returned in the message.

## API logging and tracing

All endpoints need a header called **transactionid**, 
because it will represent the ID that will go through the entire request in the service, and, if this application calls other microservices, this **transactionid** will be passed on. All input and output endpoints will log the input data (JSON or parameters) and the **transactionid**. 

For each request for each microservice, we will have an attribute **serviceid** generated only for the logs of that service itself. We will then have the **transactionid** which will circulate among all microservices involved in the request, and each microservice will have its own **serviceid**.

Tracing flow in requests:

**POST** - **/api/order** with **transactionid**: 2f8c72e0-03f0-4098-823e-4e8065ff665a

```
service-1:
transactionid: 2f8c72e0-03f0-4098-823e-4e8065ff665a
serviceid    : e1e1f138-5e5d-4d44-a044-70ef46206812
|
| HTTP Request
|----------------> service-2:
                   transactionid: 2f8c72e0-03f0-4098-823e-4e8065ff665a
                   serviceid    : 4e1261c1-9a0c-4a5d-bfc2-49744fd159c6
                   |
                   | HTTP Request
                   |----------------> service-3: /api/check-stock
                                      transactionid: 2f8c72e0-03f0-4098-823e-4e8065ff665a
                                      serviceid    : bdcec281-d4f6-4ec8-8d41-3bf585174de7
```

As we can see in the flow above, the **transactionid** 2f8c72e0-03f0-4098-823e-4e8065ff665a remained the same in the 3 services, and each service has
your own **serviceid**.

Example of a complete flow calling 5 services and generating **transactionid** and **serviceid**:

![Tracing](https://github.com/italogama/microservices-communication/blob/master/content/tracing.png)

Example of logs in the developed APIs:

Auth-API:

```
Request to POST login with data {"email":"testuser@gmail.com","password":"123456"} | [transactionID: 0e839b68-b3e8-4f8f-a1ae-f27d9de9998f | serviceID: 6b3f83e5-732f-48b5-b650-5b4544ae3525]

Response to POST login with data {"status":200,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6eyJpZCI6MSwibmFtZSI6IlVzZXIgVGVzdCIsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIn0sImlhdCI6MTY1MzQ3OTY4OCwiZXhwIjoxNjUzNTY2MDg4fQ.-a0l6MrN6gM5RwykgvzEvKnAqXvbiW8YaDsUrucypW4"} | [transactionID: 0e839b68-b3e8-4f8f-a1ae-f27d9de9998f | serviceID: 6b3f83e5-732f-48b5-b650-5b4544ae3525]
```

Product-API:

```
Request to POST product stock with data{"products":[{"productId":1001,"quantity":1},{"productId":1002,"quantity":1},{"productId":1003,"quantity":1}]} | [transactionID: 2f8c72e0-03f0-4098-823e-4e8065ff665a | serviceID: bdcec281-d4f6-4ec8-8d41-3bf585174de7]

Response to POST product stock with data{"status":200,"message":"The stock is ok!"} | [transactionID: 2f8c72e0-03f0-4098-823e-4e8065ff665a | serviceID: bdcec281-d4f6-4ec8-8d41-3bf585174de7]
```

Sales-API:

```
Request to POST new order with data {"products":[{"productId":1001,"quantity":1},{"productId":1002,"quantity":1},{"productId":1003,"quantity":1}]} | [transactionID: 2f8c72e0-03f0-4098-823e-4e8065ff665a | serviceID: e1e1f138-5e5d-4d44-a044-70ef46206812]

Response to POST login with data {"status":200,"createdOrder":{"products":[{"productId":1001,"quantity":1},{"productId":1002,"quantity":1},{"productId":1003,"quantity":1}],"user":{"id":1,"name":"User Test","email":"testuser@gmail.com"},"status":"PENDING","createdAt":"2022-05-25T11:32:06.757Z","updatedAt":"2022-05-25T11:32:06.757Z","transactionid":"2f8c72e0-03f0-4098-823e-4e8065ff665a","serviceid":"e1e1f138-5e5d-4d44-a044-70ef46206812","_id":"628e13b6966337bc255a2575","__v":0}} | [transactionID: 2f8c72e0-03f0-4098-823e-4e8065ff665a | serviceID: e1e1f138-5e5d-4d44-a044-70ef46206812]
```

RabbitMQ:

```
Sending message to product update stock: {"salesId":"628e13b6966337bc255a2575","products":[{"productId":1001,"quantity":1},{"productId":1002,"quantity":1},{"productId":1003,"quantity":1}],"transactionid":"2f8c72e0-03f0-4098-823e-4e8065ff665a"}

Recieving message with data: {"salesId":"628e13b6966337bc255a2575","products":[{"productId":1001,"quantity":1},{"productId":1002,"quantity":1},{"productId":1003,"quantity":1}],"transactionid":"2f8c72e0-03f0-4098-823e-4e8065ff665a"} and TransactionID: 2f8c72e0-03f0-4098-823e-4e8065ff665a

Sending message: {"salesId":"628e13b6966337bc255a2575","status":"APPROVED","transactionid":"2f8c72e0-03f0-4098-823e-4e8065ff665a"}

Receiving message from queue: {"salesId":"628e13b6966337bc255a2575","status":"APPROVED","transactionid":"2f8c72e0-03f0-4098-823e-4e8065ff665a"}
```

## Endpoint documentation

You can read the API documentation here [API_DOCS.md](https://github.com/italogama/microservices-communication/blob/master/API_DOCS.md).

## Heroku Deploy

The 3 APIs were published on Heroku, the repository that were published are these:

* Auth-API    - https://github.com/italogamainc/auth-api (PostgreSQL e Coralogix Logging)
* Product-API - https://github.com/italogamainc/product-api (Coralogix Logging, Cloud MongoDB e CloudAQMP)
* Sales-API   - https://github.com/italogamainc/sales-api (Coralogix Logging Heroku Postgres e CloudAQMP)

As URL base são:

* Auth-API    - https://italogamainc-auth-api.herokuapp.com/
* Product-API - https://italogamainc-product-api.herokuapp.com/
* Sales-API   - https://italogamainc-sales-api.herokuapp.com/

## Tracing com Coralogix Logging e Kibana

Coralogix Logging is a Heroku add-on for adding a status dashboard and viewing application logs.

Dashboard example of Coralogix Logging from Product-API:

![Dashboard Product-API](https://github.com/italogama/microservices-communication/blob/master/content/dashCoralogix.png)

On Heroku, we were able to trace the application through our header **TransactionID** which is required on all endpoints.

Below is an example of tracing performed with an order created for the **TransactionID** with value **2f8c72e0-03f0-4098-823e-4e8065ff665a**.

![Request](https://github.com/italogama/microservices-communication/blob/master/content/orderCreate.png)

After making the request, we go to our Kibana provided by Coralogix Logging from Sales-API application and we will search the logs by value **2f8c72e0-03f0-4098-823e-4e8065ff665a**:

![Kibana Sales-API](https://github.com/italogama/microservices-communication/blob/master/content/TracingSalesApi.png)

We can see multiple input and output logs, containing input and output JSON. We can also see that a call was made to the Product-API microservice via HTTP REST, and also a communication via Rabbit message, and we can see these logs being received there in the Product-API application:

![Kibana Product-API](https://github.com/italogama/microservices-communication/blob/master/content/TracingProductApi.png)


We were able to track all input and output data from the endpoints, the transaction ID that circulates between them via REST call and via message, facilitating the monitoring of logs of a specific request and, mainly, the troubleshooting process.

## Commands Docker

Below are some of the commands executed to create the containers
from the PostgreSQL, MongoDB and RabbitMQ message broker databases:

#### Container Auth-DB

`docker run --name auth-db -p 5432:5432 -e POSTGRES_DB=auth-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123456 postgres:11`

#### Container Product-DB

`docker run --name product-db -p 5433:5432 -e POSTGRES_DB=product-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123456 postgres:11`

#### Container Sales-DB

`docker run --name sales-db -p 27017:27017 -p 28017:28017 -e MONGODB_USER="admin" -e MONGODB_DATABASE="sales" -e MONGODB_PASS="123456" -v  c:/db tutum/mongodb`

#### Connection in Mongoshell

`mongo "mongodb://admin:123456@localhost:27017/sales"`

#### Container RabbitMQ

`docker run --name sales_rabbit -p 5672:5672 -p 25676:25676 -p 15672:15672 rabbitmq:3-management`

### Execution docker-compose

`docker-compose up --build`

To ignore the logs, add the flag `-d`.

## Author

### Ítalo Gama
### Fullstack Developer
