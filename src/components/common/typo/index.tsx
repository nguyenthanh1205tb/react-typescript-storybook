import React from 'react'
import { cn } from '@/src/lib/utils'

interface ITypo extends React.DOMAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}
function Typo({ children, className, ...attr }: ITypo) {
  return (
    <p className={className} {...attr}>
      {children}
    </p>
  )
}

interface IHeading1 extends ITypo {}
function H1({ children, className, ...attr }: IHeading1) {
  return (
    <h1 className={cn('tw-text-xl tw-font-bold', className)} {...attr}>
      {children}
    </h1>
  )
}

interface IHeading2 extends ITypo {}
function H2({ children, className, ...attr }: IHeading2) {
  return (
    <h2 className={cn('tw-text-base tw-font-bold', className)} {...attr}>
      {children}
    </h2>
  )
}

interface IHeading3 extends ITypo {}
function H3({ children, className, ...attr }: IHeading3) {
  return (
    <h3 className={cn('tw-text-sm tw-font-bold', className)} {...attr}>
      {children}
    </h3>
  )
}

interface IHeading4 extends ITypo {}
function H4({ children, className, ...attr }: IHeading4) {
  return (
    <h4 className={cn('tw-text-xs tw-font-medium', className)} {...attr}>
      {children}
    </h4>
  )
}

interface ILabel extends ITypo {}
function Label({ children, className, ...attr }: ILabel) {
  return (
    <p className={cn('tw-text-tiny tw-font-medium tw-block', className)} {...attr}>
      {children}
    </p>
  )
}

interface ISecondaryBtn extends ITypo {}
function SecondaryBtn({ children, className, ...attr }: ISecondaryBtn) {
  return (
    <p className={cn('text-tiny tw-font-bold tw-block', className)} {...attr}>
      {children}
    </p>
  )
}

interface ISecondaryBtn extends ITypo {
  light?: boolean
}
function Paragraph({ children, light = false, className, ...attr }: ISecondaryBtn) {
  const cls = !light ? 'tw-text-sm tw-font-medium' : 'tw-text-xs tw-font-light'
  return (
    <p className={cn(cls, className)} {...attr}>
      {children}
    </p>
  )
}

Typo.H1 = H1
Typo.H2 = H2
Typo.H3 = H3
Typo.H4 = H4
Typo.Label = Label
Typo.PrimaryBtn = H3
Typo.SecondaryBtn = SecondaryBtn
Typo.Paragraph = Paragraph
export default Typo
