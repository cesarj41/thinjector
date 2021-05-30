# Thinjector (React)

Minimalistic, super lightweight React service injection container extremely easy to use.

## Why
It's important to decouple your ui components from your services (fetching logic, biz logic, etc..) but the solutions out there are either using heavy weight state management tools (redux + redux saga, mobx, recoil, etc..) or full fledge dependency containers (inversifyjs, 
tsyringe) which for a lot of use cases are overkill so looking for lightweight solutions the ones I found which are awesome but didn't feel comfortable with the api, so I came with this very small solution.
### Features
- Built with Typescript.
- A hook for accessing services.

### Installation

```bash
npm install thinjector
```

### Usage

Set up your service container, create the file where you wish in your project folder structure, I will put it on services/index.ts.
```typescript
import { createServiceContainer } from 'thinjector'

// Service structure is up to you, this is just a simple example
interface UserService {
    login: VoidFunction
}
export interface IServices {
    userService: UserService
}

const services: IServices = {
    userService: {
        login: () => console.log('signing in....'),
    }
}

export const container =
  createServiceContainer<IServices>(services);
```

And ... that's it !, you can start accessing your services on your react components.

## Injecting services examples
### Using useService hook !
```typescript
import React from "react"
import container from "./services"

const { useService } = container;

const DemoPage = () => {
  const { userService } = useService(); // WoW, just like that
  return (
    <div onClick={() => userService.login()}>
      Demo Page
    </div>
  );
};

export default DemoPage;
```

Not a hook fan ? still using class components ?, don't worry, we got you covered with a HOC too !
### Using withService HOC !
```typescript
import React from "react"
import container, {IServices} from "./services"

const { withService } = container;

type Props = {
    service: IServices
}
const DemoPage = ({service}: Props) => {
  return (
    <div onClick={() => service.userService.login()}>
      Demo Page
    </div>
  );
};

export default withService(DemoPage);
```
Don't like the idea of injecting all services and prefer a solution to specify which services or functions you want like a redux mapToProps thing ? say no more:
### Using inject HOC !
```typescript
import React from "react"
import container, {IServices} from "./services"

const { inject } = container;

type Props = {
    login: IServices['userService']['login']
}
const DemoPage = ({login}: Props) => {
  return (
    <div onClick={() => login()}>
      Demo Page
    </div>
  );
};

export default inject(DemoPage, (services) => ({
    login: services.userService.login
}));
```
## TODO :
- Accessing services from within services.
- Make agnostic for any js framework or library.
