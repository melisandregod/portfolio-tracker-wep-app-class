"use client"

import { useState, useMemo } from "react"

export function usePagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  // slice data ของแต่ละหน้า
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  // ค่าช่วยให้ UI รู้ว่ากำลังโชว์แถวไหน
  const startIdx = (page - 1) * pageSize + 1
  const endIdx = Math.min(page * pageSize, data.length)

  return {
    page,
    setPage,
    totalPages,
    pageSize,
    paginatedData,
    startIdx,
    endIdx,
  }
}
