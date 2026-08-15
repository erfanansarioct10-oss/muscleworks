import { StoreInfoSchema } from '../lib/validations/store';
import { FAQItemSchema } from '../lib/validations/common';
import storeInfoData from '../../data/store-info.json';
import faqsData from '../../data/faqs.json';

console.log('🔍 Validating data/store-info.json against StoreInfoSchema...');
const parsedStoreInfo = StoreInfoSchema.parse(storeInfoData);
console.log(`✅ data/store-info.json validated successfully! Store name: "${parsedStoreInfo.name}" (${parsedStoreInfo.address.streetAddress}, ${parsedStoreInfo.address.city})`);

console.log('🔍 Validating data/faqs.json against FAQItemSchema.array()...');
const parsedFaqs = FAQItemSchema.array().parse(faqsData);
console.log(`✅ data/faqs.json validated successfully! Total FAQs: ${parsedFaqs.length}`);
