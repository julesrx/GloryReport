import type { InjectionKey, ShallowRef } from 'vue';

export const encountersKey: InjectionKey<ShallowRef<EncounterAggregateResult[]>> =
    Symbol('encounters');
