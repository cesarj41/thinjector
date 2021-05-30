import { createElement, ComponentType } from 'react'

export function createServiceContainer<T>(services: T) {
  return {
    useService: () => {
      return services;
    },
    withService: <P extends { service: T }>(WrappedComponent: ComponentType<P>) => {
      const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

      const ComponentWithService = (props: Omit<P, 'service'>) => {
        return createElement(WrappedComponent, {
          ...props,
          service: services,
        } as P)
      }

      ComponentWithService.displayName = `withService(${displayName})`

      return ComponentWithService
    },
    inject: <P, Exclude>(
      WrappedComponent: ComponentType<P>,
      inject: (toInject: T) => { [key in keyof Exclude]: unknown }
    ) => {
      const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

      const ComponentWithInject = (props: Omit<P, keyof Exclude>) => {
        return createElement(WrappedComponent, {
          ...props,
          ...inject(services),
        } as unknown as P)
      }

      ComponentWithInject.displayName = `inject(${displayName})`

      return ComponentWithInject
    },
  }
}
