interface Model {
  id: string;
}

export const updateModel = <T extends Model>(array: T[], model: T): T[] => {
  return array.map((item) => {
    if (item.id === model.id) {
      return model;
    }
    return item;
  });
}

export const removeModel = <T extends Model>(array: T[], model: T): T[] => {
  return array.filter(({id}) => {
    return id !== model.id;
  });
}
