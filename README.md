# Deel - Above and Beyond API Challenge

Simple Deel Fragment API built with [Nest.js/TypeScript](https://nestjs.com/) and [Sequelize](https://sequelize.org/), using Clean Architecture, and SOLID principles.

The API allows users to create, read, update and delete profile contracts and jobs.
>In order to make operations make sure that you are passing ```profile_id``` header for all requests.

To run this API locally, you can use the container environment created for this project using [Docker Compose](https://docs.docker.com/compose/) with the right version of [Node.js](https://nodejs.org/en/) and [Sequelize](https://sequelize.org/). Check the configuration section below.

An API documentation with requests and responses examples is available on [https://localhost:3001/api](https://localhost:3001/api). This documentation was generated using [Swagger/OpenAPI](https://swagger.io/specification/) so you can interact with API from OpenAPI UI.

## Architecture

To separate concerns, the application was built with a **Clean Architecture**. It is divided into **Domain**, **Application**, and **Infrastructure** layers: There is also a **Presentation** layer, which is the entry point of the API.

The main tool used for testing is [Jest](https://facebook.github.io/jest/).

> Due to a lack of time, the tests were implemented just for ProfileUseCases class. And integration tests needs to be written :(
>

### Domain Layer

The **Domain** layer is the layer that contains the business logic of the application. It contains the **Entities**, which are the classes that represent the data of the API. This layer is isolated from outer layers concerns.

### Application Layer

The **Application** layer is the layer that contains the _application specific_ business rules. It implements all the use cases of the API, it uses the domain classes, but it is isolated from the details and implementation of outer layers, such as databases, adapters, etc. This layer just holds interfaces to interact with the outside world.

I also defined interfaces for each use case, in order to make the application more testable, since I'm using these interfaces to create stubs for testing the controllers and middlewares in the infrastructure layer.

### Infrastructure Layer

The **Infrastructure** layer is the layer that contains all the concrete implementations of the application. It contains repositories, database, controllers, middlewares, etc.  It also contains the validators, which are used to validate the data of the controllers.

### Presentation Layer

The **Presentation** layer is the entry point of the application. It is the layer that contains the Nest.js app, and where all the routing is defined. In this layer I also compose all the controllers, middlewares, and use cases, injecting the dependencies that are needed using Nest.js IoC DI.

## Configuration

To clone and run this application, you’ll need to have [Git](https://git-scm.com), [Docker](https://www.docker.com), [Docker Compose](https://docs.docker.com/compose), and [npm](https://www.npmjs.com) installed on your computer.

From your command line:

```bash
# Clone this repository
$ git clone https://github.com/unckleg/deel-above-and-beyond.git

# Go into the repository folder
$ cd deel-above-and-beyond/server

# Start the application 
# NOTE: Database will be seeded automatically once app is started
$ npm run start:dev

# Or if you want application to be run with docker use docker compose from root directory.
$ cd deel-above-and-beyond
$ docker-compose up
```
To run the tests, use the following commands:

```bash
$ npm run test
```

Use the following command to run [ESLint](https://eslint.org) from the command line:

```bash
$ npm run lint
```

## Going with Kubernetes & Skaffold
- Skaffold - [Installation](https://skaffold.dev/docs/install/)
- Kubernetes, Kubectl - If you are on M1 install Minikube [Installation](https://minikube.sigs.k8s.io/docs/start/)

```bash
$ skaffold dev --port-forward # Will run k8s cluster, expose ports (3000 Client, 3001 Server) 
```

## Improvements

Some improvements that could be made in the future:
- Improve architecture overall in project, add Repository pattern, ValueObjects
- Add Unit tests for all units in codebase and add test coverage
- Add GitHub actions for running tests and prettier check on push to repository
- Add ElasticUI and use Admin like template to interact with API
