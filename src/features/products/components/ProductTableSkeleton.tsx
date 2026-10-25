interface ProductTableSkeletonProps {
  rowCount?: number
}

export function ProductTableSkeleton({ rowCount = 7 }: ProductTableSkeletonProps) {
  const rows = Array.from({ length: rowCount })

  return (
    <tbody className="divide-y divide-slate-100 animate-pulse">
      {rows.map((_, index) => (
        <tr key={index} className="border-b border-slate-100">
          <td className="w-12 px-4 py-3.5 text-center">
            <div className="w-4 h-4 bg-slate-200 rounded mx-auto" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <div className="w-11 h-11 bg-slate-200 rounded-lg" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-4 w-40 bg-slate-200 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-4 w-12 bg-slate-200 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </td>
          <td className="px-4 py-3.5">
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
          </td>
          <td className="px-4 py-3.5 text-center">
            <div className="w-5 h-5 bg-slate-200 rounded mx-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  )
}

export default ProductTableSkeleton

