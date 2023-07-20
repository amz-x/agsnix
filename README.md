# AGSNIX

AGSNIX (Angular, SASS, GraphQL, Next.js, & Nix)

- [Angular](https://angular.io/)
- [SASS/SCSS](https://sass-lang.com/)
- [GraphQL](https://graphql.org/)
- [Next.js](https://nestjs.com/)
- [Nix](https://nixos.org/explore.html)

## Setup

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

#### Setup (Recommended)

- [Nix Package Manager](https://nixos.org/install)
- [Nix Development Environment (Flake)](https://devenv.sh)
- [Directory Environment](https://direnv.net)

#### Setup (Alternative)

- [Node.js v20.X](https://nodejs.org/en/download)
- [PNPM v8](https://pnpm.io/installation)

## Development Environment

### Server

```bash
pnpm run api:dev
```

### Client

```bash
pnpm run app:dev
```

### Docker

**API Source Mount:** Update the **environment variable** and respective **volume** entry on the API container / section within the *docker-compose.yml* file.

Start Docker Containers

```bash
docker-compose up -d
```

Stop Docker Containers

```bash
docker-compose down
```

## Playground

Playground available via API following URL: [http://localhost:3000/graphql](http://localhost:3000/graphql)

___

### Query

Example query:

```text
query {
  getPathDirectoriesAndFiles(directoryPath: "/some/path", limit: 500) {
    path
    name
    type
    size
    read
    write
    execute
    createdAt
    modifiedAt
  }
}
```

Example results:

```json
{
  "data": {
    "getPathDirectoriesAndFiles": [
      {
        "path": "/some/path/item0",
        "name": "item0",
        "type": "file",
        "size": 1638,
        "read": true,
        "write": false,
        "execute": false,
        "createdAt": 1689492054782,
        "modifiedAt": 1689492054782
      },
      {
        "path": "/some/path/item1",
        "name": "item1",
        "type": "file",
        "size": 4291,
        "read": true,
        "write": false,
        "execute": false,
        "createdAt": 1686295916023,
        "modifiedAt": 1686295916023
      }
    ]
  }
}
```

___

### Subscription

Example subscription:

```text
subscription {
  fileSystemPathNotifier {
    path,
    action,
    result {
      path
      name
      type
      size
      read
      write
      execute
      createdAt
      modifiedAt
    }
  }
}
```

Example result:

```json
{
  "data": {
    "fileSystemPathNotifier": {
      "path": "/some/path",
      "action": "updated",
      "result": {
        "path": "/some/path/item500",
        "type": "file",
        "size": 66991,
        "read": true,
        "write": false,
        "execute": false,
        "createdAt": 1686295916023,
        "modifiedAt": 1686295916023
      }
    }
  }
}
```

___
