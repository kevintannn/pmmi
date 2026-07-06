import { revalidatePath, revalidateTag } from 'next/cache';
import { SITE_CONTENT_TAG } from '@/lib/content';

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

/**
 * Editable contact info feeds the footer (on every page) and the contact page.
 * Invalidating the tag refreshes all of them on their next visit.
 */
export function revalidateSiteContent() {
  revalidateTag(SITE_CONTENT_TAG);
}
