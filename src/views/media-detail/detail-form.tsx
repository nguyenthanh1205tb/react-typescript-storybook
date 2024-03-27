/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCategory } from '@/src/hooks/useMedia'
import Checkbox from 'antd/es/checkbox/Checkbox'
import Form from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import Input from 'antd/es/input/Input'
import TextArea from 'antd/es/input/TextArea'
import Select from 'antd/es/select'
import TreeSelect from 'antd/es/tree-select'
import React, { useMemo } from 'react'

const { SHOW_PARENT } = TreeSelect

export const inputClassName =
  'tw-border-none !tw-bg-slate-900 tw-border-gray-300 tw-rounded-md tw-p-2 tw-w-full tw-h-10 tw-text-sm tw-placeholder-gray-400 tw-focus:tw-ring-2 tw-focus:tw-ring-primary tw-outline-none'

interface DetailMediaFormProps {
  form: any
  handleUpdateMedia: (values: any) => void
}

const DetailMediaForm = ({ form, handleUpdateMedia }: DetailMediaFormProps) => {
  const { getListCategories } = useCategory()
  const { data: categoriesData } = getListCategories()

  const categoryOptions = useMemo(() => {
    if (categoriesData) {
      const categories: any = categoriesData?.data
        ?.map(item => {
          return {
            key: item?.id,
            title: item.name,
            value: item.id,
            children: item.children
              ? item.children.map(child => ({ title: child.name, value: child.id, key: child.id }))
              : null,
          }
        })
        ?.map(item => {
          if (item.children === null) {
            const { children, ...newItem } = item
            return newItem
          }
          return item
        })

      return categories

      // const flatOptions = flatMapDeep(categories, item => {
      //   if (item.children) {
      //     return [item, ...flatMapDeep(item.children)]
      //   }
      //   return item
      // })
      // const newData = flatOptions.map(({ children, ...rest }) => rest)

      // return newData
    }
    return []
  }, [categoriesData])

  const tProps = {
    treeData: categoryOptions,
    // onChange,
    // treeCheckable: true,
    treeDefaultExpandAll: true,
    multiple: true,
    showCheckedStrategy: SHOW_PARENT,
    style: {
      width: '100%',
    },
  }
  return (
    <Form form={form} layout="vertical" className="detail-form" onFinish={handleUpdateMedia}>
      <FormItem label="Tiêu đề" name="name">
        <TextArea rows={5} />
      </FormItem>
      <FormItem label="Mô tả" name="description">
        <TextArea rows={5} />
      </FormItem>
      <FormItem label="Bản quyền" name="right">
        <Input className={inputClassName} />
      </FormItem>
      <FormItem name="isOnly" valuePropName="checked">
        <Checkbox /> <label className="tw-ml-2">Video độc quyền</label>
      </FormItem>
      <FormItem label="Tác giả" name="author">
        <Input className={inputClassName} />
      </FormItem>
      <FormItem label="Từ khoá" name="tags">
        <Select mode="tags" options={[]} />
      </FormItem>
      <FormItem label="Chuyên mục" name="categoryIds">
        <TreeSelect {...tProps} />
      </FormItem>
      <FormItem label="Thể loại" name="types">
        <Select options={[]} />
      </FormItem>
    </Form>
  )
}

export default DetailMediaForm
