# Copilot Instructions — Task Management Platform

## 1. Project Overview

This project is a backend application built with NestJS and TypeScript.

The project is intentionally being developed as a learning project, but it should
follow practices commonly used in professional backend teams.

The architecture must prioritize:

- Maintainability
- Testability
- Security
- Separation of responsibilities
- Simplicity
- Consistency
- Clear and predictable architecture
- Easy future extension

The goal is not to over-engineer the application.

Prefer simple solutions that solve the current problem correctly and can evolve
later when the project requires additional complexity.

---

# 2. Technology Stack

The main technology stack is:

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- TypeORM
- Jest
- Swagger / OpenAPI
- JWT
- Redis
- Docker

Use the existing versions and configuration defined in `package.json` and the
project configuration files unless there is a clear technical reason to change
them.

Do not introduce new dependencies without first explaining:

1. Why the dependency is needed.
2. What problem it solves.
3. Whether the problem can be solved using the existing stack.
4. The advantages and disadvantages of introducing it.
5. Whether introducing it increases architectural complexity.

Do not introduce a library simply because it is popular or convenient.

---

# 3. General Development Principles

Follow these principles throughout the project:

- Keep responsibilities clearly separated.
- Prefer composition over unnecessary inheritance.
- Avoid duplicated business logic.
- Prefer simple and explicit code over clever abstractions.
- Follow the DRY principle when duplication represents the same responsibility.
- Do not apply DRY when it creates unnecessary coupling.
- Follow the Single Responsibility Principle.
- Keep modules cohesive.
- Avoid unnecessary abstractions.
- Avoid premature optimization.
- Avoid premature generalization.
- Prefer predictable code that another backend developer can understand quickly.
- Keep naming consistent across the entire project.

When there are multiple valid approaches, prefer the one that:

1. Is easier to understand.
2. Is easier to test.
3. Has fewer dependencies.
4. Has fewer side effects.
5. Keeps responsibilities separated.
6. Can evolve without requiring a major refactor.

---

# 4. Architecture

The project follows a modular architecture based on NestJS.

Each feature should be organized inside its corresponding module.

The current project structure separates responsibilities into concepts such as:

- Modules
- Controllers
- Services
- DTOs
- Responses
- Entities
- Guards
- Interceptors
- Decorators
- Common
- Testing

A feature should generally follow this flow:

Request
   ↓
Controller
   ↓
DTO / Validation
   ↓
Service
   ↓
Repository / Persistence
   ↓
Database

The response should flow back through the service and controller.

Keep the architecture simple and avoid introducing additional layers unless
there is a clear technical reason.



2. Feature-Based Separation

Do NOT create one large controller containing every endpoint.

Do NOT create one large service containing every use case.

Instead, separate the module by use case.

The preferred structure is:

comments/
├── controllers/
│   ├── create-comment.controller.ts
│   ├── get-comment-by-id.controller.ts
│   ├── get-comments-by-task.controller.ts
│   ├── get-my-comments.controller.ts
│   ├── update-comment.controller.ts
│   └── delete-comment.controller.ts
│
├── services/
│   ├── create-comment.service.ts
│   ├── get-comment-by-id.service.ts
│   ├── get-comments-by-task.service.ts
│   ├── get-my-comments.service.ts
│   ├── update-comment.service.ts
│   └── delete-comment.service.ts
│
├── dto/
│   ├── create-comment.dto.ts
│   └── update-comment.dto.ts
│
├── response/
│   └── comment.response.ts
│
├── entity/
│   └── Comment.entity.ts
│
├── testing/
│   ├── create-comment.service.spec.ts
│   ├── get-comment-by-id.service.spec.ts
│   ├── get-comments-by-task.service.spec.ts
│   ├── get-my-comments.service.spec.ts
│   ├── update-comment.service.spec.ts
│   └── delete-comment.service.spec.ts
│
└── comments.module.ts

Use the existing project's naming conventions if they differ.

3. One Use Case = One Main Responsibility

Each service should represent one application use case.

Use:

CreateCommentService
GetCommentByIdService
GetCommentsByTaskService
GetMyCommentsService
UpdateCommentService
DeleteCommentService

Do not create:

CommentsService

containing all comment operations.

The reason is to keep each service:

Small
Focused
Easy to test
Easy to understand
Easy to modify
Easy to mock
4. Controllers

Each controller should expose one primary use case.

For example:

CreateCommentController
        ↓
CreateCommentService
GetCommentByIdController
        ↓
GetCommentByIdService
UpdateCommentController
        ↓
UpdateCommentService

Controllers should remain extremely thin.

A controller should primarily:

Receive the HTTP request.
Obtain route/query/body data.
Obtain the authenticated user when necessary.
Delegate to the corresponding service.
Return the appropriate response.

Controllers must NOT:

Query repositories.
Implement business rules.
Verify organization membership directly.
Verify comment ownership directly.
Perform database operations.
Contain complex conditionals.
Implement authorization business logic.

Example conceptual responsibility:

HTTP Request
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Database
5. Services

Each service should implement one application use case.

For example:

CreateCommentService

is responsible for the complete create-comment use case.

It may:

Validate that the task exists.
Verify organization membership.
Create the comment.
Persist the comment.

But it should not also contain:

Get comment by ID.
Update comment.
Delete comment.
Get comments by task.

Those are different use cases.

6. Avoid Excessive Service Duplication

Although services must be separated by use case, do not duplicate complex
authorization or persistence logic unnecessarily.

If multiple use cases genuinely share the same domain operation, identify the
shared responsibility first.

For example, if several operations need to verify organization membership,
do not automatically duplicate a large block of logic in every service.

However, DO NOT create generic abstractions such as:

CommentHelper
CommentUtils
CommentManager
CommentValidator
GenericAuthorizationService

without a real responsibility.

Before introducing a shared service or abstraction, explain:

What duplication exists.
Why the duplication represents the same responsibility.
Why extraction improves the design.
Whether extraction increases coupling.

Avoid creating abstractions just to make files smaller.

7. Dependency Injection

Use NestJS dependency injection.

Each service should explicitly declare the dependencies it needs.

For example, a service that only retrieves comments should not receive
dependencies it does not use.

Prefer:

GetCommentByIdService
    ↓
Comment Repository

over:

GetCommentByIdService
    ↓
EverythingRepository
    ↓
Multiple unrelated dependencies

Keep dependencies minimal.

8. DTO Separation

Create DTOs according to their responsibility.

At minimum:

CreateCommentDto
UpdateCommentDto

CreateCommentDto should contain only data required from the client.

For example:

{
  "taskId": "uuid",
  "content": "Comment"
}

Do not accept:

userId
organizationId
createdAt
updatedAt

from the client.

The authenticated user comes from JWT.

The organization should be derived through the task and its relationships.

UpdateCommentDto should contain only fields that are allowed to change.

For example:

{
  "content": "Updated comment"
}
9. Response Separation

Keep API response formatting separate from database entities.

Do not expose TypeORM entities directly.

Use a response structure consistent with the existing project.

For example:

{
  "message": "Comment retrieved successfully",
  "data": {}
}

The response should expose only information required by the API.

Do not automatically serialize complete User or Task entities.

---

# 5. Modules

NestJS modules are used to organize application features and responsibilities.

Each module should represent a meaningful application feature or bounded area.

Examples:

- Users
- Organizations
- Tasks
- Invitations
- Authentication
- MembersOrganization
- RefreshToken

Modules should:

- Group related functionality.
- Encapsulate feature-specific dependencies.
- Define controllers.
- Define providers/services.
- Register required repositories.
- Export only what other modules actually need.

Avoid creating modules that only group unrelated functionality.

Avoid unnecessary dependencies between modules.

Prefer explicit module dependencies over hidden coupling.

---

# 6. Controllers

Controllers are responsible for handling HTTP requests and returning HTTP
responses.

Controllers should:

- Define REST endpoints.
- Receive request DTOs.
- Trigger request validation through the NestJS validation mechanism.
- Call the appropriate service.
- Use appropriate HTTP methods.
- Use appropriate HTTP status codes.
- Return a consistent API response.

Controllers should remain thin.

Controllers must NOT:

- Contain business logic.
- Access repositories directly.
- Perform database operations.
- Implement business rules.
- Contain complex validation logic manually.
- Perform complex data transformations.
- Coordinate unrelated application operations.

The expected responsibility is:

Controller
    ↓
Receive request
    ↓
Validate input
    ↓
Call service
    ↓
Return response

The controller should primarily coordinate HTTP concerns.

---

# 7. Services

Services contain the application's business logic.

Services should:

- Implement business rules.
- Coordinate repositories when necessary.
- Coordinate domain/application operations.
- Perform business validations.
- Coordinate transactions when required.
- Decide what operation should happen based on application rules.

Services must NOT depend on HTTP-specific concepts when they can be avoided.

Avoid placing business logic inside:

- Controllers
- Entities
- DTOs
- Repositories

Services should be easy to unit test independently from the database.

When a service requires external dependencies such as repositories,
those dependencies should be mockable.

---

# 8. DTOs

DTOs define the API contract between the client and the application.

Use DTOs for:

- Request bodies.
- Query parameters.
- Route parameters when appropriate.
- Data entering application boundaries.
- Data leaving application boundaries when appropriate.

DTOs should not represent database entities.

DTOs should:

- Validate incoming data.
- Define the expected API structure.
- Prevent clients from controlling fields they should not control.
- Keep the API contract independent from the persistence model.

Use appropriate validation decorators.

Do not expose persistence entities directly through REST endpoints.

---

# 9. Responses

API responses should be consistent throughout the project.

Controllers should return a predictable response structure.

The response should generally contain:

- A meaningful message.
- The requested or resulting data when applicable.

For example:

{
  "message": "User created successfully",
  "data": {}
}

Do not expose internal implementation details in API responses.

Do not expose:

- Passwords.
- Password hashes.
- Refresh token values.
- Internal database details.
- Sensitive information that the client does not need.

Response formatting should remain consistent across modules.

If a response requires a specific structure, prefer a dedicated response DTO
rather than exposing an entity directly.

---

# 10. Entities

Entities represent the persistence model of the application.

The project uses TypeORM entities with PostgreSQL.

Entities should primarily represent:

- Persistent state.
- Database relationships.
- Persistence-related configuration.
- Entity-specific behavior when appropriate.

Entities should NOT become containers for unrelated application business logic.

Be careful with:

- `@OneToMany`
- `@ManyToOne`
- `@OneToOne`
- `@ManyToMany`
- Cascades
- Lazy/eager loading
- Foreign keys
- Nullable fields
- Database constraints
- Indexes
- Entity lifecycle hooks

Avoid blindly adding cascades.

Avoid unnecessary bidirectional relationships.

Avoid exposing TypeORM entities directly through REST APIs.

Use DTOs and response objects to control the public API contract.

When modifying relationships, explain the consequences for:

- Database structure.
- Query behavior.
- Performance.
- Serialization.
- Testing.
- Data integrity.

---

# 11. Repositories and Database Access

Repositories are responsible for persistence operations.

Repositories should:

- Query the database.
- Persist entities.
- Update entities.
- Delete entities.
- Encapsulate persistence-specific operations when appropriate.

Repositories must NOT contain application business rules.

Business decisions belong in services.

Avoid performing repository operations directly from controllers.

Prefer TypeORM repository APIs for simple queries.

Use QueryBuilder when the query genuinely requires:

- Multiple conditions.
- Dynamic filters.
- Joins.
- Aggregations.
- Complex ordering.
- Queries that are difficult or inefficient with repository methods.

Do not use QueryBuilder simply because it is available.

---

# 12. Transactions

Use database transactions when multiple database operations must succeed or
fail together.

A transaction should be considered when:

- Multiple related records are modified.
- Data consistency requires atomicity.
- A business operation consists of several database changes.

Example:

Accept invitation
    ↓
Validate invitation
    ↓
Create membership
    ↓
Update invitation status
    ↓
Commit transaction

If any required operation fails:

    Rollback

Do not introduce transactions for simple single-operation queries without a
technical reason.

---

# 13. Authentication and Security

Security is a primary concern.

The application uses JWT-based authentication.

Security-sensitive operations should be handled carefully.

Never expose:

- Passwords.
- Password hashes.
- JWT secrets.
- Refresh token secrets.
- Environment variables containing credentials.
- Internal security configuration.

Authentication and authorization must be separated conceptually.

Authentication answers:

"Who is the user?"

Authorization answers:

"Is this user allowed to perform this operation?"

Use:

- Guards for request authorization/authentication concerns.
- Decorators for reusable metadata or request-related abstractions.
- Services for authentication business logic.

Do not implement authorization rules directly inside controllers.

---

# 14. Guards

Guards are responsible for deciding whether a request is allowed to continue.

Use guards for concerns such as:

- Authentication.
- Authorization.
- Role-based access control.
- Permission checks.

Guards should not contain unrelated business logic.

If authorization requires complex business decisions, the guard should delegate
the appropriate logic instead of becoming a large service.

---

# 15. Interceptors

Interceptors should be used for cross-cutting concerns.

Examples include:

- Response transformation.
- Logging.
- Execution timing.
- Removing sensitive fields from responses when appropriate.

Interceptors should not contain business rules.

Do not use interceptors to hide business logic that belongs in services.

---

# 16. Decorators

Custom decorators should be introduced when they provide a clear abstraction
or improve consistency.

Examples:

- Retrieving the authenticated user.
- Defining metadata.
- Reusing request-related behavior.

Do not create custom decorators merely to reduce a few lines of code.

A decorator should have a clear responsibility and predictable behavior.

---

# 17. Common

The `common` area should contain functionality genuinely shared across multiple
features.

Possible examples:

- Shared utilities.
- Shared constants.
- Shared enums.
- Shared exceptions.
- Shared types.
- Shared infrastructure helpers.

Do not use `common` as a dumping ground.

If functionality belongs to a specific feature, keep it inside that feature.

---

# 18. Testing

Testing is a core part of the project.

The application uses Jest.

Tests should prioritize behavior and responsibilities rather than implementation
details.

The testing strategy should include:

- Unit tests.
- Integration tests when appropriate.
- End-to-end tests for important application flows.

Unit tests should isolate the component being tested.

For example:

Service
   ↓
Mock Repository

The unit test should not require a real PostgreSQL database unless the purpose
of the test is specifically to verify database integration.

Repositories and external dependencies should be mockable.

Tests should cover:

- Successful operations.
- Validation failures.
- Business rule failures.
- Exceptions.
- Important edge cases.
- Interactions with dependencies when relevant.

Avoid writing tests only to increase code coverage.

The goal is confidence in the behavior of the application.

---

# 19. Testability

Code should be designed so that important components can be tested
independently.

Prefer:

- Dependency injection.
- Small services.
- Explicit dependencies.
- Pure functions when appropriate.
- Limited side effects.

Avoid:

- Hidden global state.
- Hard-coded dependencies.
- Direct creation of infrastructure dependencies inside services.
- Large methods with multiple responsibilities.

When proposing an architectural decision, consider how easily the resulting
code can be tested.

---

# 20. Error Handling

Use NestJS exceptions for HTTP-layer errors when appropriate.

Examples:

- `BadRequestException`
- `UnauthorizedException`
- `ForbiddenException`
- `NotFoundException`
- `ConflictException`

Do not use generic errors when a more meaningful application exception exists.

Errors should provide useful information to the client without exposing
internal implementation details.

Business errors should be predictable and consistently handled.

---

# 21. Validation

Validate external input at the application boundary.

Use DTOs and NestJS validation mechanisms.

Validation should protect the application from invalid or unexpected input.

Do not rely exclusively on frontend validation.

Database constraints should also be used for important data integrity rules.

Application validation and database constraints complement each other.

---

# 22. API Documentation

Swagger / OpenAPI is used to document the REST API.

Endpoints should have appropriate documentation including:

- Description.
- Request DTOs.
- Response structures.
- HTTP status codes.
- Authentication requirements when applicable.

Swagger documentation should remain consistent with the actual API behavior.

Do not document behavior that the application does not implement.

---

# 23. Naming and Consistency

Use consistent naming conventions throughout the project.

Prefer descriptive names over abbreviations.

Examples:

Good:

- `CreateUserService`
- `AcceptInvitationService`
- `UserResponseDto`

Avoid ambiguous names such as:

- `Manager`
- `Helper`
- `Utils`
- `Data`
- `Handler`

unless the responsibility is genuinely clear from the context.

Follow the naming conventions already established in the project.

Do not introduce a different naming convention for a new feature without a
technical reason.

---

# 24. Environment Configuration

Environment-specific configuration must not be hard-coded.

Sensitive configuration must be stored outside the source code.

Examples:

- Database credentials.
- JWT secrets.
- Redis configuration.
- API keys.
- External service credentials.

The application should support different environments such as:

- Development
- Testing
- Production

Do not assume that development configuration is suitable for production.

When introducing environment-specific behavior, explain why the separation is
necessary.

---

# 25. Docker and Infrastructure

Docker may be used to provide consistent development and deployment environments.

Infrastructure configuration should remain separate from application business
logic.

Do not introduce infrastructure complexity unless it provides a clear benefit.

When adding infrastructure such as Redis, Docker services, queues, or cloud
services, explain:

1. What problem it solves.
2. Why the existing architecture is insufficient.
3. What operational complexity it introduces.
4. How it affects development and testing.
5. Whether it is necessary at the current stage of the project.

---

# 26. Architectural Decision Process

This project is also being used to learn backend architecture.

When introducing a new technical concept, pattern, library, or architectural
decision:

DO NOT immediately generate the implementation.

First explain:

1. What the concept is.
2. What problem it solves.
3. Why it is relevant to this project.
4. Why it should be used here.
5. What alternatives exist.
6. The advantages and disadvantages.
7. How it affects maintainability.
8. How it affects testability.
9. How it affects security.
10. Whether it introduces unnecessary complexity.

Only generate code after the reasoning is understood or when explicitly asked
to implement it.

The purpose is to understand the architectural decision, not simply copy code.

---

# 27. Avoid Overengineering

The project should evolve progressively.

Do not introduce:

- Microservices without a real need.
- Complex design patterns without a clear problem.
- Additional abstractions only for theoretical flexibility.
- Additional libraries when the existing stack is sufficient.
- Generic frameworks inside the application.
- Excessive interfaces without a meaningful abstraction.
- Multiple layers that only forward method calls.

A design pattern should be introduced because it solves a real problem.

Do not use a pattern simply because it is considered a "best practice."

---

# 28. Code Generation Rules

Before generating significant code, verify:

- Which module owns the functionality.
- Which layer is responsible for it.
- Whether an existing service can be extended.
- Whether an existing DTO can be reused or should be specialized.
- Whether the functionality requires a new dependency.
- Whether the functionality requires a transaction.
- Whether authentication or authorization is involved.
- How the functionality will be tested.

Do not duplicate existing functionality.

Do not modify unrelated modules unless necessary.

Prefer incremental changes over large architectural rewrites.

When modifying existing code, preserve the project's established conventions.

---

# 29. Priority Order

When making architectural or implementation decisions, prioritize:

1. Correctness
2. Security
3. Maintainability
4. Testability
5. Simplicity
6. Consistency
7. Performance optimization when justified

Do not sacrifice maintainability or security for premature performance
optimization.

---

# 30. Expected Development Style

The code should resemble code produced in a professional backend team.

Prefer code that is:

- Explicit.
- Readable.
- Testable.
- Consistent.
- Modular.
- Secure.
- Easy to review.

Avoid code that is:

- Clever without reason.
- Highly abstracted.
- Duplicated.
- Tightly coupled.
- Difficult to test.
- Dependent on unnecessary libraries.

Every architectural decision should have a reason.



Actualiza las instrucciones de arquitectura del proyecto para incorporar explícitamente el siguiente estándar de transacciones con TypeORM.

## Transaction Implementation Standard

Cuando una operación de negocio implique múltiples escrituras en PostgreSQL que deban considerarse una sola unidad atómica, utiliza una transacción explícita mediante `DataSource` y `QueryRunner`.

El patrón esperado es:

```text
Business Operation
        ↓
QueryRunner
        ↓
queryRunner.manager
        ├── Database operation A
        ├── Database operation B
        └── Database operation C
        ↓
COMMIT
```

Si alguna operación obligatoria falla:

```text
ROLLBACK
```

### 1. QueryRunner

Para operaciones transaccionales:

```ts
const queryRunner = this.dataSource.createQueryRunner();

await queryRunner.connect();
await queryRunner.startTransaction();

try {
  // database operations

  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw error;
} finally {
  await queryRunner.release();
}
```

Siempre liberar el `QueryRunner` dentro de `finally`.

No crear transacciones manualmente sin necesidad.

No utilizar `QueryRunner` para operaciones simples que solamente realizan una escritura independiente.

### 2. EntityManager transaccional

Todas las operaciones de PostgreSQL que deban pertenecer a la misma transacción deben utilizar:

```ts
queryRunner.manager
```

Por ejemplo:

```ts
const taskRepository =
  queryRunner.manager.getRepository(Tasks);
```

No utilizar el repository inyectado normalmente para una operación que debe formar parte de la transacción.

Incorrecto:

```ts
await this.taskRepository.save(task);
```

Correcto:

```ts
const taskRepository =
  queryRunner.manager.getRepository(Tasks);

await taskRepository.save(task);
```

La razón es que el repository normal puede utilizar una conexión diferente al `QueryRunner` y, por lo tanto, quedar fuera de la transacción.

### 3. Transacciones entre servicios

Si un servicio transaccional necesita llamar a otro servicio que también realiza operaciones de PostgreSQL dentro de la misma unidad atómica, el `EntityManager` transaccional debe propagarse explícitamente.

Ejemplo:

```ts
await this.createNotificationService.createNotification(
  notificationDto,
  queryRunner.manager,
);
```

El servicio llamado debe aceptar el `EntityManager`:

```ts
async createNotification(
  dto: NotificationCreateDto,
  manager: EntityManager,
) {
  const userRepository = manager.getRepository(User);
  const notificationRepository =
    manager.getRepository(Notification);

  // database operations
}
```

No crear un nuevo `QueryRunner` dentro del servicio secundario si la intención es formar parte de la misma transacción.

No crear una segunda transacción independiente para una operación que debe ser atómica con la operación principal.

La transacción debe ser controlada por el servicio que coordina el caso de uso principal.

### 4. Responsabilidad de la transacción

El servicio principal del caso de uso debe controlar:

```text
connect
startTransaction
commitTransaction
rollbackTransaction
release
```

Los servicios secundarios deben recibir el `EntityManager` cuando necesiten ejecutar operaciones dentro de esa transacción.

Ejemplo conceptual:

```text
CreateTaskService
        ↓
QueryRunner
        ↓
EntityManager
        ├── Create Task
        └── Create Notification
```

Esto permite que ambas operaciones tengan el mismo:

```text
COMMIT
```

o el mismo:

```text
ROLLBACK
```

### 5. Ejemplo de caso de uso

Si crear una tarea implica crear una notificación para el usuario asignado:

```text
BEGIN

Create Task
      ↓
Create Notification

COMMIT
```

Si la notificación falla:

```text
ROLLBACK
```

La tarea tampoco debe quedar persistida.

La misma regla puede aplicarse a casos como:

```text
Update Task + Notification
Accept Invitation + Create Membership
Accept Invitation + Notification
Create Comment + Notification
```

siempre que la consistencia del negocio requiera que las operaciones sean atómicas.

### 6. Validaciones antes de iniciar la transacción

Las consultas de validación que no modifican datos pueden realizarse antes de iniciar la transacción cuando no necesiten formar parte de la unidad atómica.

Por ejemplo:

```text
Validate organization
Validate user membership
Validate assigned user
Validate business rules
        ↓
START TRANSACTION
        ↓
Perform writes
```

Sin embargo, si una consulta debe estar protegida por el mismo aislamiento transaccional debido a una condición de concurrencia o integridad, debe realizarse utilizando:

```ts
queryRunner.manager
```

La decisión debe basarse en la consistencia requerida por el caso de uso.

### 7. Redis y otras infraestructuras externas

Redis NO forma parte de una transacción PostgreSQL.

No asumir que:

```ts
queryRunner.rollbackTransaction()
```

puede revertir operaciones realizadas en Redis.

Por ejemplo:

```text
PostgreSQL Transaction
        ├── Task
        └── Notification

COMMIT
        ↓
Redis cache invalidation
```

Cuando una operación modifica PostgreSQL y posteriormente debe invalidar una caché Redis, la invalidación debe realizarse después de un `COMMIT` exitoso siempre que sea posible.

Ejemplo:

```ts
await queryRunner.commitTransaction();

await this.redisService.delete(cacheKey);
```

No invalidar Redis antes del `COMMIT` cuando esto pueda provocar inconsistencias si posteriormente ocurre un rollback.

### 8. No convertir todos los servicios en transaccionales

No todos los servicios necesitan `QueryRunner`.

Usar transacciones cuando exista una necesidad real de atomicidad.

Ejemplos que normalmente NO requieren una transacción explícita:

```text
GET Task
GET Comment
GET User
Create User
Update simple field
```

si solamente existe una operación de escritura independiente y la base de datos ya garantiza la integridad necesaria.

Ejemplos que pueden requerir transacción:

```text
Create Task + Notification
Update Task + Notification
Accept Invitation + Membership
Accept Invitation + Notification
Create Comment + Notification
```

La decisión debe basarse en la relación entre las operaciones y los requisitos de consistencia, no simplemente en la cantidad de queries.

### 9. Testing de transacciones

Las operaciones transaccionales deben considerar pruebas para:

* Caso exitoso.
* Commit correcto.
* Error durante una operación intermedia.
* Rollback.
* Verificar que no queden registros parciales.
* Interacciones con servicios secundarios.
* Invalidación de Redis después del commit cuando corresponda.

Los unit tests no necesitan ejecutar PostgreSQL real si solamente se está probando la lógica del servicio.

Las pruebas de integración deben utilizarse cuando sea necesario comprobar el comportamiento real de la transacción y la persistencia.

### 10. Regla general

Antes de implementar una operación que modifica múltiples recursos, determinar:

1. ¿Todas las operaciones utilizan PostgreSQL?
2. ¿Deben tener éxito o fallar juntas?
3. ¿Existe riesgo de dejar datos parciales?
4. ¿Algún servicio secundario también modifica PostgreSQL?
5. ¿Debe recibir el mismo `EntityManager`?
6. ¿Existen operaciones externas como Redis que deben ejecutarse después del commit?

Si la respuesta indica que las operaciones deben ser atómicas, utilizar el patrón:

```text
DataSource
    ↓
QueryRunner
    ↓
EntityManager
    ↓
Repositories
    ↓
COMMIT / ROLLBACK
```

Mantener la implementación simple y explícita. No introducir Unit of Work, repositories transaccionales genéricos, decorators personalizados u otras abstracciones únicamente para ocultar el funcionamiento de `QueryRunner`, salvo que el proyecto llegue a un punto donde exista una necesidad real y repetitiva que justifique dicha abstracción.
