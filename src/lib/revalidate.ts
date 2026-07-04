import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation for the ISR public pages. Call after an admin mutation
 * so changes appear immediately instead of waiting for the revalidate interval.
 * The '[locale]' pattern refreshes every locale variant of the route.
 */
export function revalidateScrap() {
  revalidatePath('/[locale]/scrap', 'page');
}

export function revalidateCareers() {
  revalidatePath('/[locale]/career', 'page');
}
