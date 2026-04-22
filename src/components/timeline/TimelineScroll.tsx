import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { TimelineNode } from './TimelineNode';
import { YouAreHere } from './YouAreHere';
import type { Feast } from '../../engine/feasts';
import { Colors } from '../../constants/colors';

interface Props {
  feasts: Feast[];
  currentDate: Date;
  onFeastPress?: (feast: Feast) => void;
}

type Item =
  | { kind: 'feast'; feast: Feast; state: 'past' | 'active' | 'upcoming' }
  | { kind: 'now' };

const NODE_WIDTH = 130;
const NOW_WIDTH = 110;

export function TimelineScroll({ feasts, currentDate, onFeastPress }: Props) {
  const ref = useRef<FlatList<Item>>(null);

  const items: Item[] = useMemo(() => {
    const sorted = [...feasts].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const result: Item[] = [];
    let inserted = false;
    for (const f of sorted) {
      const start = new Date(f.startDate.getFullYear(), f.startDate.getMonth(), f.startDate.getDate());
      const end = new Date(f.endDate.getFullYear(), f.endDate.getMonth(), f.endDate.getDate());

      if (!inserted && today.getTime() < start.getTime()) {
        result.push({ kind: 'now' });
        inserted = true;
      }
      let state: 'past' | 'active' | 'upcoming' = 'upcoming';
      if (today.getTime() > end.getTime()) state = 'past';
      else if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) state = 'active';

      result.push({ kind: 'feast', feast: f, state });
    }
    if (!inserted) result.push({ kind: 'now' });
    return result;
  }, [feasts, currentDate]);

  useEffect(() => {
    const idx = items.findIndex((i) => i.kind === 'now' || (i.kind === 'feast' && i.state === 'active'));
    if (idx > 0 && ref.current) {
      // Center on now / active feast
      const offset = Math.max(0, idx * NODE_WIDTH - 120);
      setTimeout(() => {
        ref.current?.scrollToOffset({ offset, animated: true });
      }, 350);
    }
  }, [items.length]);

  return (
    <View style={{ paddingVertical: 16 }}>
      <FlatList
        ref={ref}
        horizontal
        data={items}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, alignItems: 'flex-start', gap: 4 }}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        keyExtractor={(item, i) => (item.kind === 'now' ? `now-${i}` : `f-${item.feast.key}-${item.feast.startDate.toISOString()}`)}
        renderItem={({ item }) => {
          if (item.kind === 'now') {
            return (
              <View style={{ width: NOW_WIDTH, alignItems: 'center' }}>
                <YouAreHere />
              </View>
            );
          }
          return (
            <TimelineNode
              feast={item.feast}
              state={item.state}
              onPress={() => onFeastPress?.(item.feast)}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={{ width: 1, height: 56, backgroundColor: Colors.border, marginTop: 28 }} />
        )}
      />
    </View>
  );
}
