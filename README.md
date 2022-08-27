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

Set up your service container, create the file where you wish in your project folder structure, I will put it on src/services.ts in my react app
```typescript
import { createServiceContainer } from 'thinjector'

// Service structure is up to you, this is just a simple example

export interface Service {
    login: () => console.log('signing in....');
    logoout: VoidFunction;
    ...
} 

const services: Service = {
    login: () => console.log('signing in....'),
    logoutL () => console.log('signing out...')
}

export const { ServiceProvider, useService, withService, inject } =
  createServiceContainer<Service>(services);
```

And now lets configure the service container provider at the root of your React app, normally App.tsx

```typescript
import React from "react"
import { ServiceProvider } from "./services"

const App = () => {
  return (
    <ServiceProvider>
      {/* Your app.... */}
    </ServiceProvider>
  );
};

export default App;
```
And ... that's it, you can start accessing your services any part down the tree !.
## Injecting services examples
### Using useService hook !
```typescript
import React from "react"
import { useService } from "./services"

const DemoPage = () => {
  const { login } = useService(); // WoW, just like that
  return (
    <div onClick={login}>
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
import { withService, Service } from "./services"

type Props = {
    service: Service
}
const DemoPage = ({ service }: Props) => {
  return (
    <div onClick={service.login}>
      Demo Page
    </div>
  );
};

export default withService(DemoPage);
```
Don't like the idea of injecting all services and prefer a solution to specify which services or functions you want like a redux mapToProps thing ? don't say no more:
### Using inject HOC !
```typescript
import React from "react"
import { Service, inject } from "./services"

type Props = {
    login: Service['login']
}
const DemoPage = ({ login }: Props) => {
  return (
    <div onClick={login}>
      Demo Page
    </div>
  );
};

export default inject(DemoPage, (service) => ({
    login: service.login
}));
```
