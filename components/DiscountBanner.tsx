import { getDiscountBanner } from '@/actions/site/discount-banner';
import DiscountBannerClient from './DiscountBannerClient';

export default async function DiscountBanner() {
  const banner = await getDiscountBanner();
  return <DiscountBannerClient banner={banner} />;
}
