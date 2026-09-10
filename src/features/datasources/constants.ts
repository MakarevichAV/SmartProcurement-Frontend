export const CANONICAL_ENTITIES = [
  "item",
  "warehouse",
  "stock_level",
  "supplier",
  "item_supplier",
  "price",
  "lead_time",
  "purchase_order",
  "consumption",
  "production_demand",
  "quality_record",
] as const;

export const SOURCE_KINDS = ["erp", "mes", "wms", "db", "api", "file", "other"] as const;

export const CONNECTOR_TYPES = ["file", "rest", "sql"] as const;
