import type { AnyObject, Widen } from './types'
import { StyleInterpolation, Styles } from './baseSystemTypes'
import { Component, DefineComponent, VNode, VNodeRef } from 'vue'

export type JSX = {
  [K in keyof JSX.IntrinsicElements as string extends K ? never : K]: JSX.IntrinsicElements[K]
}

export type Provider = (props: { children: VNode }) => VNode

export type ExtractElement = VNode

export type NativeComponent =
  | keyof JSX
  | Component<AnyObject>
  // magic
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function

export type ComponentProps<T> = T extends keyof JSX
  ? JSX[T]
  : T extends
      | DefineComponent<infer Props, any, any, any, any, any, any, any>
      | ((props: infer Props) => JSX.Element)
  ? Props
  : {}

export type StyledProps<As extends NativeComponent, Variants, Vars extends string> = {
  ref?: VNodeRef
} & ComponentProps<As> & {
    as?: As
    variants?: {
      [key in keyof Variants]?: Widen<Variants[key]>
    }
    vars?: {
      [key in Vars]?: string | number
    }
  }

export type StyledComponent<Component extends NativeComponent, Variants, Vars extends string> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Variants, Vars>
) => VNode

export interface Styled<Theme> {
  <
    Component extends NativeComponent,
    VariantsKey extends PropertyKey = '',
    VariantsValue extends PropertyKey = '',
    Vars extends string = ''
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, VariantsKey, VariantsValue, Vars>
  ): StyledComponent<
    Component extends StyledComponent<infer T, AnyObject, string> ? T : Component,
    { [key in VariantsKey as '' extends key ? never : key]: VariantsValue },
    Vars
  >
}
