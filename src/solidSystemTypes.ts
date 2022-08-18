import type { JSX, ComponentProps, Accessor } from 'solid-js'
import type { AnyObject } from './types'
import { NeverObeject, StyleInterpolation, Styles, Widen } from './baseSystemTypes'

export type UseSystem<Theme> = () => {
  mode: Accessor<string>
  setMode: (mode: string) => void
  theme: Accessor<Theme>
}

export type Provider = (props: { children: JSX.Element }) => JSX.Element

export type ExtractElement = Accessor<JSX.Element>[]

export type NativeComponent = keyof JSX.IntrinsicElements | ((...props: any[]) => JSX.Element)

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R } ? R : P) : P

type StyledProps<As extends NativeComponent, Variants, Vars> = Omit<ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<ComponentProps<As>>
  as?: As
  variants?: Variants
  vars?: Vars
}

type StyledComponent<Component extends NativeComponent, Variants, Vars> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Variants, Vars>
) => JSX.Element

export interface Styled<Theme> {
  <Component extends NativeComponent, Variants extends AnyObject = {}, Vars extends string = ''>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<
    Component extends StyledComponent<infer C, AnyObject, string> ? C : Component,
    NeverObeject<{ [key in keyof Variants]?: Widen<keyof Variants[key]> }>,
    NeverObeject<{ [key in Vars as '' extends key ? never : key]?: string | number }>
  >
}
