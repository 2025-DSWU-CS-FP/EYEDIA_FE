import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';

import mutationFactory from '@/services/mutationFactory';

type Opts = {
  invalidate?: boolean;
  extraInvalidateKeys?: QueryKey[];
};

export default function useAddBookmark(exhibitionId: number, opts?: Opts) {
  const qc = useQueryClient();
  const invalidate = opts?.invalidate ?? true;

  return useMutation({
    mutationFn: mutationFactory.addBookmark(exhibitionId),
    onSuccess: () => {
      if (!invalidate) return;
      const keys: QueryKey[] = [
        ['exhibitionVisitRecent'],
        ['popularExhibitions'],
        ['popularExhibitionsTop'],
        ['popularExhibitionsSuggest'],
        ['popularExhibitionDetail', exhibitionId],
        ['exhibitionVisitDetail', exhibitionId],
        ...(opts?.extraInvalidateKeys ?? []),
      ];
      keys.forEach(k => qc.invalidateQueries({ queryKey: k }));
    },
  });
}
