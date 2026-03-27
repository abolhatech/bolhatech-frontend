'use client';

import { Pagination } from 'bolhatech-design-system/server';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function NewsPagination({ currentPage, totalPages }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(nextPage) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Pagination
      className="pagination"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
