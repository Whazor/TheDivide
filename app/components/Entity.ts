module TD {
  export enum EntityType {
    Archer,
    Mage,
    Soldier };
  export interface Entity extends Position, BoundingBox, Draw {
    type: EntityType;

    toString();
  }
}
