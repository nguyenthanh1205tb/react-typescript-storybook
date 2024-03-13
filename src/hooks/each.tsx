import { Children, ReactNode } from 'react';

interface EachProps<T> {
  render: (item: T, index: number) => ReactNode;
  of: T[];
}
/**
 * Lưu ý: Đối với những component dùng key để xử lý logic thì dùng component Each sẽ gây ra lỗi
 * @param of Array
 * @param render (item: T, index: number) => ReactNode
 * @returns ReactNode
 */
function Each<T>({ render, of }: EachProps<T>) {
  return Children.toArray(of.map((item, index) => render(item, index)));
}
export default Each;
