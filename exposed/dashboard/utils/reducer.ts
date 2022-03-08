interface Model {
  id: string;
}

export type ReducerHooks<S> = Record<
  string,
  (state: S, action: any) => S
>;

export const createReducer = <S>(initialState: S, reducerHooks: ReducerHooks<S>) => {
  const reducer = (state: S = initialState, action: any): S => {
    const fn = reducerHooks[action.type] || null;
    if (!fn) {
      return state;
    };
    return fn(state, action);
  };
  return reducer;
};

export const updateModel = <T extends Model>(array: T[], model: T): T[] => {
  return array.map((item) => {
    if (item.id === model.id) {
      return model;
    }
    return item;
  });
};

export const removeModel = <T extends Model>(array: T[], model: T): T[] => {
  return array.filter(({id}) => {
    return id !== model.id;
  });
};
