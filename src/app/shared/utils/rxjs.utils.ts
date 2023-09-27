import {catchError, forkJoin, Observable, of, Subject, takeUntil} from "rxjs";

export function ForkJoinHelper(
  ctx: Observable<void>[],
  destroyer$: Subject<any>,
  onComplete: () => void
) {
  forkJoin(ctx).pipe(
    takeUntil(destroyer$),
    catchError(() => {
      return of(null)
    }),
  ).subscribe({
    complete: () => onComplete()
  })
}
