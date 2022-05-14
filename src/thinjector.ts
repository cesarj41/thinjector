import { createContext, useContext, createElement, ReactNode, ComponentType } from 'react'

export function createServiceContainer<T>(services: T) {
  const TServiceContext = createContext<T | undefined>(undefined)
  const useService = () => {
    const context = useContext(TServiceContext)
    if (context === undefined) {
      throw new Error('useService must be used within a ServiceProvider')
    }
    return context
  }
  return {
    useService,
    ServiceProvider: ({ children }: { children?: ReactNode }) => {
      return createElement(TServiceContext.Provider, {
        value: services,
        children,
      })
    },
    withService: <P extends { service: T }>(WrappedComponent: ComponentType<P>) => {
      const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

      const ComponentWithService = (props: Omit<P, 'service'>) => {
        const service = useService()
        return createElement(WrappedComponent, {
          ...props,
          service,
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
        const services = useService()

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
