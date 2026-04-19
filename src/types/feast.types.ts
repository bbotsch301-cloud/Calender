export type { Feast, FeastKey } from '../engine/feasts';

export interface FeastMetadataStatic {
  key: string;
  name: string;
  hebrewName: string;
  leviticusRef: string;
  description: string;
  biblicalMeaning: string;
  instructions: string[];
  scriptures: string[];
  colorAccent: string;
  icon: string;
}

export interface ScriptureRef {
  reference: string;
  text: string;
}
