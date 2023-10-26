export enum InventoryStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Removed = 'REMOVED',
}

export const selectableInventoryStatuses = new Map([
  [InventoryStatus.Active, 'Active'],
  [InventoryStatus.Inactive, 'Inactive'],
]);

export const inventoryStatuses = new Map([
  ...selectableInventoryStatuses.entries(),
  [InventoryStatus.Removed, 'Removed'],
]);
