import { Request, Response } from 'express';
import { Service } from '../models/service.model.js';
import { SubService } from '../models/subService.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Helper to make URL-friendly slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * Seed initial services matching the reference UI image if DB is empty
 */
export const seedInitialServicesIfEmpty = async () => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) return;

    console.log('Seeding initial printing services matching reference UI...');

    const initialData = [
      {
        name: 'VISITING CARDS',
        slug: 'visiting-cards',
        image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600&auto=format&fit=crop',
        description: 'Premium visiting cards & business stationery with custom matte, gloss, and embossed finishes.',
        badge: null,
        displayOrder: 1,
        subServices: [
          { name: 'Visiting Card Design 1 (Minimalist Matte)', slug: 'visiting-card-design-1', price: 299, image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600&auto=format&fit=crop', description: 'Clean modern monochrome card with smooth velvet matte lamination.' },
          { name: 'Visiting Card Design 2 (Gold Foil Luxury)', slug: 'visiting-card-design-2', price: 499, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop', description: 'Metallic gold embossed accents on heavy 450gsm textured stock.' },
          { name: 'Visiting Card Design 3 (Spot UV Executive)', slug: 'visiting-card-design-3', price: 399, image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop', description: 'Raised gloss spot UV overlay highlight on corporate brand logo.' }
        ]
      },
      {
        name: 'PAMPHLETS',
        slug: 'pamphlets',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
        description: 'Vibrant single & double-sided marketing flyers, leaflets, and promotional pamphlets.',
        badge: null,
        displayOrder: 2,
        subServices: [
          { name: 'A5 Gloss Promotional Flyer', slug: 'a5-gloss-flyer', price: 699, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop', description: 'High-gloss A5 leaflets printed on 170gsm art paper.' },
          { name: 'A4 Event Pamphlet', slug: 'a4-event-pamphlet', price: 899, image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop', description: 'Full-color A4 double-sided informative event handbills.' }
        ]
      },
      {
        name: 'ENVELOPES',
        slug: 'envelopes',
        image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=600&auto=format&fit=crop',
        description: 'Corporate branded envelopes and secure correspondence mailers with self-seal adhesive.',
        badge: null,
        displayOrder: 3,
        subServices: [
          { name: 'Standard #10 Business Envelope', slug: 'standard-10-envelope', price: 450, image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=600&auto=format&fit=crop', description: 'Classic corporate envelope with logo placement and secure peel-and-seal.' },
          { name: 'A4 Document Mailer Envelope', slug: 'a4-document-mailer', price: 650, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', description: 'Heavyweight brown/white document folder envelope.' }
        ]
      },
      {
        name: 'Website Development',
        slug: 'website-development',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        description: 'Custom modern responsive websites, corporate web portals, and e-commerce stores.',
        badge: 'NEW',
        displayOrder: 4,
        subServices: [
          { name: 'Business Landing Page', slug: 'business-landing-page', price: 9999, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', description: 'Fast, high-converting one-page responsive website with contact form and SEO setup.' },
          { name: 'Corporate Multi-Page Website', slug: 'corporate-multi-page-website', price: 19999, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', description: 'Full 5-10 page corporate website with CMS, analytics, and custom domain.' },
          { name: 'E-Commerce Storefront', slug: 'ecommerce-storefront', price: 29999, image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=600&auto=format&fit=crop', description: 'Complete online store with payment gateway, product inventory, and customer portal.' }
        ]
      },
      {
        name: 'POSTERS',
        slug: 'posters',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
        description: 'High-resolution vibrant posters printed on premium photographic and satin cardstock.',
        badge: null,
        displayOrder: 5,
        subServices: [
          { name: 'A3 Glossy Showcase Poster', slug: 'a3-glossy-poster', price: 250, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop', description: 'Vibrant indoor exhibition and shopfront window poster.' },
          { name: 'Large Format A2 Wall Art Poster', slug: 'large-format-a2-poster', price: 450, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop', description: 'Stunning HD high-density wall posters.' }
        ]
      },
      {
        name: 'LETTER HEADS',
        slug: 'letter-heads',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
        description: 'Official corporate executive letterheads printed on 100gsm to 120gsm bond paper.',
        badge: null,
        displayOrder: 6,
        subServices: [
          { name: 'Executive Bond Letterhead', slug: 'executive-bond-letterhead', price: 799, image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop', description: 'Smooth 100gsm royal executive bond paper with razor-sharp vector logos.' }
        ]
      },
      {
        name: 'DOCTOR FILES',
        slug: 'doctor-files',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop',
        description: 'Custom medical case sheet folders, clinic patient records, and doctor prescription files.',
        badge: null,
        displayOrder: 7,
        subServices: [
          { name: 'Clinic Case Sheet Folder', slug: 'clinic-case-sheet-folder', price: 1200, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop', description: 'Heavy laminated card file with inner prescription pockets.' }
        ]
      },
      {
        name: 'ATM POUCH',
        slug: 'atm-pouch',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
        description: 'Protective custom branded ATM card covers, PVC sleeves, and secure debit card pouches.',
        badge: null,
        displayOrder: 8,
        subServices: [
          { name: 'PVC Waterproof Card Sleeve', slug: 'pvc-card-sleeve', price: 15, image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop', description: 'Tear-resistant clear and frosted card cover with bank/brand logo.' }
        ]
      },
      {
        name: 'Bill Book',
        slug: 'bill-book',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
        description: 'Custom duplicate & triplicate carbonless NCR invoice books, receipts, and order pads.',
        badge: null,
        displayOrder: 9,
        subServices: [
          { name: 'Duplicate 1+1 NCR Bill Book (100 Sets)', slug: 'duplicate-bill-book', price: 350, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop', description: 'Carbonless self-copying numbered receipt books with micro-perforations.' },
          { name: 'Triplicate 1+2 GST Invoice Book', slug: 'triplicate-gst-invoice', price: 480, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop', description: '3-part white/pink/yellow invoice book with tax columns.' }
        ]
      },
      {
        name: 'SAMPLE FILES',
        slug: 'sample-files',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
        description: 'Corporate sample presentation binders, product swatch folders, and portfolio kits.',
        badge: null,
        displayOrder: 10,
        subServices: [
          { name: 'Presentation Swatch Binder', slug: 'presentation-swatch-binder', price: 850, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', description: 'Rigid hardbound binder with custom ring clips for product swatches.' }
        ]
      },
      {
        name: 'NFC Cards',
        slug: 'nfc-cards',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        description: 'Next-gen smart NFC digital business cards with instant tap-to-share contact & profile details.',
        badge: 'NEW',
        displayOrder: 11,
        subServices: [
          { name: 'Matte Black Smart NFC Card', slug: 'matte-black-nfc-card', price: 999, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', description: 'Sleek matte PVC card embedded with NTAG216 chip + dynamic digital profile.' },
          { name: 'Stainless Steel Metal NFC Card', slug: 'metal-nfc-card', price: 2499, image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600&auto=format&fit=crop', description: 'Ultra-luxurious laser-engraved real metal smart card.' }
        ]
      },
      {
        name: 'Brochures',
        slug: 'brochures',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop',
        description: 'Tri-fold, bi-fold, and multi-page marketing product brochures with premium coating.',
        badge: null,
        displayOrder: 12,
        subServices: [
          { name: 'Tri-Fold Corporate Brochure', slug: 'tri-fold-corporate-brochure', price: 899, image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop', description: '6-panel tri-fold brochure printed on 250gsm gloss art card.' },
          { name: 'Bi-Fold Company Profile Booklet', slug: 'bi-fold-company-profile', price: 1250, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop', description: '4-page executive bi-fold folder brochure.' }
        ]
      },
      {
        name: 'Paper Bags',
        slug: 'paper-bags',
        image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600&auto=format&fit=crop',
        description: 'Eco-friendly branded kraft paper bags, luxury gift carry bags with twisted and rope handles.',
        badge: null,
        displayOrder: 13,
        subServices: [
          { name: 'Luxury Boutique Paper Bag with Rope Handle', slug: 'luxury-boutique-bag', price: 45, image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600&auto=format&fit=crop', description: 'Heavyweight laminated paper bag with golden rope handle.' },
          { name: 'Eco-Friendly Brown Kraft Bag', slug: 'eco-kraft-bag', price: 18, image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=600&auto=format&fit=crop', description: 'Recycled brown kraft paper bag with reinforced handles.' }
        ]
      }
    ];

    for (const item of initialData) {
      const { subServices, ...serviceData } = item;
      const createdService = await Service.create(serviceData);
      if (subServices && subServices.length > 0) {
        for (let i = 0; i < subServices.length; i++) {
          await SubService.create({
            ...subServices[i],
            serviceId: createdService._id,
            displayOrder: i + 1,
            isActive: true
          });
        }
      }
    }

    console.log('Successfully seeded initial printing services and sub-services.');
  } catch (err) {
    console.error('Error seeding initial services:', err);
  }
};

/* ==========================================================================
   PUBLIC APIS
   ========================================================================== */

/**
 * GET /api/services
 * Get all active services with sub-services count
 */
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean();

  // Attach sub-services count
  const serviceIds = services.map(s => s._id);
  const subServicesCounts = await SubService.aggregate([
    { $match: { serviceId: { $in: serviceIds }, isActive: true } },
    { $group: { _id: '$serviceId', count: { $sum: 1 } } }
  ]);

  const countMap = new Map(subServicesCounts.map(item => [item._id.toString(), item.count]));

  const result = services.map(s => ({
    ...s,
    subServicesCount: countMap.get(s._id.toString()) || 0
  }));

  res.status(200).json(new ApiResponse(200, result, 'Services fetched successfully'));
});

/**
 * GET /api/services/:slug
 * Get a single service by slug or id, with all its active sub-services
 */
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  const service = isObjectId
    ? await Service.findOne({ _id: slug, isActive: true })
    : await Service.findOne({ slug: slug.toLowerCase(), isActive: true });

  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Service not found'));
  }

  const subServices = await SubService.find({ serviceId: service._id, isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 })
    .lean();

  res.status(200).json(new ApiResponse(200, {
    service,
    subServices
  }, 'Service details fetched successfully'));
});

/**
 * GET /api/services/:serviceSlug/sub-services/:subSlug
 * Get a specific sub-service details
 */
export const getSubServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { serviceSlug, subSlug } = req.params;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(serviceSlug);
  const service = isObjectId
    ? await Service.findOne({ _id: serviceSlug, isActive: true })
    : await Service.findOne({ slug: serviceSlug.toLowerCase(), isActive: true });

  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Main service not found'));
  }

  const isSubObjectId = /^[0-9a-fA-F]{24}$/.test(subSlug);
  const subService = isSubObjectId
    ? await SubService.findOne({ _id: subSlug, serviceId: service._id, isActive: true })
    : await SubService.findOne({ slug: subSlug.toLowerCase(), serviceId: service._id, isActive: true });

  if (!subService) {
    return res.status(404).json(new ApiResponse(404, null, 'Sub-service not found'));
  }

  res.status(200).json(new ApiResponse(200, {
    service,
    subService
  }, 'Sub-service fetched successfully'));
});

/* ==========================================================================
   ADMIN APIS - MAIN SERVICES
   ========================================================================== */

/**
 * GET /api/admin/services
 * Get all services (active & inactive) with sub-service count
 */
export const getAdminServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 }).lean();

  const serviceIds = services.map(s => s._id);
  const subCounts = await SubService.aggregate([
    { $match: { serviceId: { $in: serviceIds } } },
    { $group: { _id: '$serviceId', count: { $sum: 1 } } }
  ]);

  const countMap = new Map(subCounts.map(item => [item._id.toString(), item.count]));

  const result = services.map(s => ({
    ...s,
    subServicesCount: countMap.get(s._id.toString()) || 0
  }));

  res.status(200).json(new ApiResponse(200, result, 'Admin services fetched successfully'));
});

/**
 * POST /api/admin/services
 * Create main service
 */
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { name, image, imagePublicId, description, badge, displayOrder, isActive } = req.body;

  if (!name || !image) {
    return res.status(400).json(new ApiResponse(400, null, 'Name and image are required'));
  }

  let slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
  // Ensure unique slug
  const existing = await Service.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const maxOrderDoc = await Service.findOne().sort({ displayOrder: -1 }).select('displayOrder');
  const order = displayOrder !== undefined ? Number(displayOrder) : ((maxOrderDoc?.displayOrder || 0) + 1);

  const service = await Service.create({
    name: name.trim(),
    slug,
    image: image.trim(),
    imagePublicId: imagePublicId || '',
    description: description ? description.trim() : '',
    badge: badge ? badge.trim() : null,
    displayOrder: order,
    isActive: isActive !== undefined ? Boolean(isActive) : true
  });

  res.status(201).json(new ApiResponse(201, service, 'Service created successfully'));
});

/**
 * PUT /api/admin/services/:id
 * Update main service
 */
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, image, imagePublicId, description, badge, displayOrder, isActive } = req.body;

  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Service not found'));
  }

  if (name) service.name = name.trim();
  if (image) service.image = image.trim();
  if (imagePublicId !== undefined) service.imagePublicId = imagePublicId;
  if (description !== undefined) service.description = description.trim();
  if (badge !== undefined) service.badge = badge ? badge.trim() : null;
  if (displayOrder !== undefined) service.displayOrder = Number(displayOrder);
  if (isActive !== undefined) service.isActive = Boolean(isActive);

  if (req.body.slug && req.body.slug !== service.slug) {
    const newSlug = slugify(req.body.slug);
    const existing = await Service.findOne({ slug: newSlug, _id: { $ne: id } });
    if (!existing) service.slug = newSlug;
  }

  await service.save();
  res.status(200).json(new ApiResponse(200, service, 'Service updated successfully'));
});

/**
 * DELETE /api/admin/services/:id
 * Delete main service and all its sub-services
 */
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Service not found'));
  }

  await SubService.deleteMany({ serviceId: id });
  await Service.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, null, 'Service and associated sub-services deleted successfully'));
});

/**
 * PATCH /api/admin/services/:id/status
 */
export const updateServiceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const service = await Service.findByIdAndUpdate(
    id,
    { isActive: Boolean(isActive) },
    { new: true }
  );

  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Service not found'));
  }

  res.status(200).json(new ApiResponse(200, service, 'Service status updated successfully'));
});

/**
 * PATCH /api/admin/services/reorder
 */
export const reorderServices = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as { items: Array<{ id: string; displayOrder: number }> };

  if (!Array.isArray(items)) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid items array'));
  }

  await Promise.all(
    items.map(item => Service.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder }))
  );

  const services = await Service.find().sort({ displayOrder: 1 });
  res.status(200).json(new ApiResponse(200, services, 'Services reordered successfully'));
});

/* ==========================================================================
   ADMIN APIS - SUB-SERVICES
   ========================================================================== */

/**
 * GET /api/admin/services/:serviceId/sub-services
 * Get all sub-services for a main service
 */
export const getAdminSubServices = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Main service not found'));
  }

  const subServices = await SubService.find({ serviceId }).sort({ displayOrder: 1, createdAt: 1 });
  res.status(200).json(new ApiResponse(200, { service, subServices }, 'Sub-services fetched successfully'));
});

/**
 * POST /api/admin/services/:serviceId/sub-services
 * Create sub-service under main service
 */
export const createSubService = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const { name, image, imagePublicId, description, price, features, displayOrder, isActive } = req.body;

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, 'Main service not found'));
  }

  if (!name || !image) {
    return res.status(400).json(new ApiResponse(400, null, 'Name and image are required'));
  }

  let slug = req.body.slug ? slugify(req.body.slug) : slugify(name);
  const existing = await SubService.findOne({ serviceId, slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const maxOrderDoc = await SubService.findOne({ serviceId }).sort({ displayOrder: -1 }).select('displayOrder');
  const order = displayOrder !== undefined ? Number(displayOrder) : ((maxOrderDoc?.displayOrder || 0) + 1);

  const subService = await SubService.create({
    serviceId,
    name: name.trim(),
    slug,
    image: image.trim(),
    imagePublicId: imagePublicId || '',
    description: description ? description.trim() : '',
    price: price ? Number(price) : 0,
    features: Array.isArray(features) ? features : (features ? [features] : []),
    displayOrder: order,
    isActive: isActive !== undefined ? Boolean(isActive) : true
  });

  res.status(201).json(new ApiResponse(201, subService, 'Sub-service created successfully'));
});

/**
 * PUT /api/admin/services/sub-services/:id
 * Update sub-service
 */
export const updateSubService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, image, imagePublicId, description, price, features, displayOrder, isActive } = req.body;

  const subService = await SubService.findById(id);
  if (!subService) {
    return res.status(404).json(new ApiResponse(404, null, 'Sub-service not found'));
  }

  if (name) subService.name = name.trim();
  if (image) subService.image = image.trim();
  if (imagePublicId !== undefined) subService.imagePublicId = imagePublicId;
  if (description !== undefined) subService.description = description.trim();
  if (price !== undefined) subService.price = Number(price);
  if (features !== undefined) subService.features = Array.isArray(features) ? features : [features];
  if (displayOrder !== undefined) subService.displayOrder = Number(displayOrder);
  if (isActive !== undefined) subService.isActive = Boolean(isActive);

  if (req.body.slug && req.body.slug !== subService.slug) {
    const newSlug = slugify(req.body.slug);
    const existing = await SubService.findOne({ serviceId: subService.serviceId, slug: newSlug, _id: { $ne: id } });
    if (!existing) subService.slug = newSlug;
  }

  await subService.save();
  res.status(200).json(new ApiResponse(200, subService, 'Sub-service updated successfully'));
});

/**
 * DELETE /api/admin/services/sub-services/:id
 * Delete a sub-service
 */
export const deleteSubService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subService = await SubService.findByIdAndDelete(id);
  if (!subService) {
    return res.status(404).json(new ApiResponse(404, null, 'Sub-service not found'));
  }

  res.status(200).json(new ApiResponse(200, null, 'Sub-service deleted successfully'));
});

/**
 * PATCH /api/admin/services/sub-services/:id/status
 */
export const updateSubServiceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const subService = await SubService.findByIdAndUpdate(
    id,
    { isActive: Boolean(isActive) },
    { new: true }
  );

  if (!subService) {
    return res.status(404).json(new ApiResponse(404, null, 'Sub-service not found'));
  }

  res.status(200).json(new ApiResponse(200, subService, 'Sub-service status updated successfully'));
});
