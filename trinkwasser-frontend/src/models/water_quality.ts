export interface WaterQuality {
  categories: Category[];
  zones: Zone[];
}

export type Category = CategoryParent | CategoryLeaf;

export interface CategoryParent {
  name: string;
  children: Category[]
}

export interface CategoryLeaf {
  name: string;
  zone: string
}

export interface Zone {
  id: string;
  name: string;
  measurements: Measurements[];
}

export interface Measurements {
  sodium: number | Range;
  potassium: number | Range;
  calcium: number | Range;
  magnesium: number | Range;
  chlorides: number | Range;
  nitrates: number | Range;
  hardness: number | Range;
  year: string;
  source: string;
  origin: string;
}

export interface Range {
  from: number;
  to: number;
}
