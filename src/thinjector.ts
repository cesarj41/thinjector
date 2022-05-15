import { ComponentType, ReactNode, createContext, createElement, useContext } from 'react'

export function createServiceContainer<T>(services: T) {
  const TServiceContext = createContext<T>(services)
  const useService = () => {
    const context = useContext(TServiceContext)
    if (context === undefined) {
      throw new Error('useService must be used within a ServiceProvider')
    }
    return context
  }
  return {
    useService,
    ServiceProvider: ({ children, partial }: { children?: ReactNode, partial?: Partial<T> }) => {
      return createElement(TServiceContext.Provider, {
        value: partial as T || services,
        children,
      })

    },
    withService: <P extends { services: T }>(WrappedComponent: ComponentType<P>) => {
      const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

      const ComponentWithService = (props: Omit<P, 'services'>) => {
        const services = useService()
        return createElement(WrappedComponent, {
          ...props,
          services,
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
