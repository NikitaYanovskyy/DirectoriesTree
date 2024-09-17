export interface IEntitiesModel {
  tree: Map<number, Directories.ExtendedEntity>;
  filteredTree: FilteredTree;

  filter: (input: string) => void;
  getParentDirectoriesOf: (
    Entity: Directories.ExtendedEntity
  ) => Directories.ExtendedEntity[];
  delete: (id: number) => void;
  move: (targetId: number, destinationId: number) => void;
}

export type FilteredTree = Map<number, Directories.ExtendedEntity>;
