import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './RootNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name]
): void {
  if (navigationRef.isReady()) {
    // The navigate overloads require conditional param presence; easiest
    // to satisfy by routing through a permissive unknown cast.
    (navigationRef.navigate as unknown as (n: Name, p?: RootStackParamList[Name]) => void)(
      name,
      params
    );
  }
}
