import React, { PropsWithChildren, useMemo } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/pagination'
import { renderPagination } from '@/src/lib/utils/common'
import { MAX_PAGINATE_BUTTON_SHOWED } from '@/src/configs'
import Each from '@/src/hooks/each'

interface Props {
  totalCount: number
  current: number
  limit: number
  onChangePage?: (page: number) => void
  onNext?: () => void
  onPrev?: () => void
}
function Paginate(props: PropsWithChildren<Props>) {
  const totalPage = Math.ceil(props.totalCount / props.limit)

  const onClickPrevNext = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, type: 'next' | 'prev') => {
    e.preventDefault()
    switch (type) {
      case 'prev':
        if (props.onPrev) props.onPrev()
        break
      case 'next':
        if (props.onNext) props.onNext()
        break
      default:
        return
    }
  }

  const onChangePage = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, page: number) => {
    e.preventDefault()
    if (props.onChangePage) {
      props.onChangePage(page)
    }
  }

  const item = (p: number) => (
    <PaginationItem>
      <PaginationLink href="#" isActive={props.current === p} onClick={e => onChangePage(e, p)}>
        {p}
      </PaginationLink>
    </PaginationItem>
  )

  const paginateListed = useMemo(
    () => renderPagination(MAX_PAGINATE_BUTTON_SHOWED)(props.current, totalPage),
    [totalPage, props.current],
  )

  return (
    <Pagination className="!tw-w-auto !tw-mx-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="tw-cursor-pointer" onClick={e => onClickPrevNext(e, 'prev')} />
        </PaginationItem>
        <Each
          of={paginateListed}
          render={val =>
            val === '#' ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              item(val as number)
            )
          }
        />

        <PaginationItem>
          <PaginationNext className="tw-cursor-pointer" onClick={e => onClickPrevNext(e, 'next')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
export default Paginate
