const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    sku: { type: String, required: [true, 'SKU is required'], trim: true, uppercase: true },
    category: { type: String, trim: true, default: '' },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

productSchema.index({ sku: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
