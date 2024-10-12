import { CreateProductInput } from '@/validators/create-product.schema';
import isEmpty from 'lodash/isEmpty';

export const customFields = [
  { label: '', value: '' },
];
export const locationShipping = [
  { name: '', shippingCharge: '' },
];
export const productVariants = [
  { label: '', value: '' },
];

export function defaultValues(product?: CreateProductInput) {
  const arabicTranslation = product?.product_translations?.find(translation => translation.locale === 'ar');
  return {
    name: product?.name ?? '',
    name_ar: arabicTranslation?.name ?? '',
    sku: product?.sku ?? '',
    type: product?.type ?? '',
    categories: product?.cat_id ? { value: product.cat_id, label: product.category?.name } : '',
    description: product?.description ?? '',
    description_ar: arabicTranslation?.description ?? '',
    price: product?.price ?? undefined,
    costPrice: product?.CostPrice ?? undefined,
    salePrice: product?.SalePrice ?? undefined,
    priceAfterDiscount: product?.PriceAfterDiscount ?? undefined,
    inventoryTracking: product?.inventoryTracking ?? '',
    currentStock: product?.AtStock ?? '',
    lowStock: product?.lowStock ?? '',
    productAvailability: product?.productAvailability ?? '',
    productImages: product?.product_image?.map(img => ({ name: img.image, url: `https://partspluseg.com/${img.image}`, size: 0 })) ?? [],
    tradeNumber: product?.tradeNumber ?? '',
    manufacturerNumber: product?.manufacturerNumber ?? '',
    brand: product?.brand ?? '',
    upcEan: product?.upcEan ?? '',
    customFields: isEmpty(product?.customFields) ? customFields : product?.customFields,
    freeShipping: product?.freeShipping ?? false,
    shippingPrice: product?.shippingPrice ?? undefined,
    locationBasedShipping: product?.locationBasedShipping ?? false,
    locationShipping: isEmpty(product?.locationShipping) ? locationShipping : product?.locationShipping,
    pageTitle: product?.pageTitle ?? '',
    metaDescription: product?.metaDescription ?? '',
    metaKeywords: product?.metaKeywords ?? '',
    productUrl: product?.productUrl ?? '',
    isPurchaseSpecifyDate: product?.isPurchaseSpecifyDate ?? false,
    isLimitDate: product?.isLimitDate ?? false,
    dateFieldName: product?.dateFieldName ?? '',
    productVariants: isEmpty(product?.product_variants)
      ? productVariants
      : product?.product_variants.map((variant) => ({
          label: variant.sku,
          value: variant.size,
        })),
    tags: product?.tags ?? [],
  };
}
