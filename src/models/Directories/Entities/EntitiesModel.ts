// Internal
import { IEntitiesModel, FilteredTree } from './types.ts';

export class EntitiesModel implements IEntitiesModel {
  private _tree: Map<number, Directories.ExtendedEntity> = new Map();
  private _filteredTree: FilteredTree = new Map();

  constructor(tree: Directories.Entity[]) {
    const treeMap = new Map();

    tree.forEach((entity) => {
      treeMap.set(entity.id, { ...entity, isOpened: false });
    });

    this.setTree(treeMap);
    this.setFilteredTree(new Map(treeMap));
  }

  // Setters

  private setTree(tree: Map<number, Directories.ExtendedEntity>) {
    this._tree = tree;
  }

  setFilteredTree(tree: FilteredTree) {
    this._filteredTree = tree;
  }

  // Getters
  get filteredTree(): FilteredTree {
    return this._filteredTree;
  }
  get tree(): Map<number, Directories.ExtendedEntity> {
    return this._tree;
  }

  // Handlers

  // gets matched entities and chain of its parents up to the root folder
  filter(input: string): void {
    this.filteredTree.clear();

    // if user clears the input, copy contents of the origin dir tree to the filtered dir tree
    if (!input) {
      for (const entity of this._tree.values()) {
        this.filteredTree.set(entity.id, entity);
      }

      return;
    }

    const matchedEntities = this._findMatchedEntities(input);

    matchedEntities.forEach((matchedEntity) => {
      // get parent directories of the found entity
      const parentDirectories = this.getParentDirectoriesOf(matchedEntity);

      // consecutively add parent entities to the set
      parentDirectories.forEach((parentEntity) => {
        this.filteredTree.set(parentEntity.id, {
          ...parentEntity,
          isOpened: true,
        });
      });

      // add the found directory entity to the set
      if (!this.filteredTree.has(matchedEntity.id)) {
        this.filteredTree.set(matchedEntity.id, {
          ...matchedEntity,
        });
      }
    });
  }

  getParentDirectoriesOf(
    entity: Directories.ExtendedEntity
  ): Directories.ExtendedEntity[] {
    let targetEntity = entity;
    const parentDirectories: Directories.ExtendedEntity[] = [];

    while (targetEntity.parentId !== null) {
      const parent = this.tree.get(targetEntity.parentId)!;

      parentDirectories.unshift(parent);
      targetEntity = parent;
    }

    return parentDirectories;
  }

  getNextChildrenLayerOf(targetEntityId: number): Directories.ExtendedEntity[] {
    const targetEntity = this.tree.get(targetEntityId)!;

    if (targetEntity.type === 'file') {
      throw new Error(
        `Attempt to select file ${targetEntity.title} as a parent folder`
      );
    }

    const children: Directories.ExtendedEntity[] = [];

    this._filteredTree.forEach((entity) => {
      if (targetEntity.id === entity.parentId) children.push(entity);
    });

    // move folders to the top of the list
    const sortedChildren = children.sort((currentChild, nextChild) => {
      if (currentChild.type === 'folder' && nextChild.type === 'file') {
        return -1;
      }
      if (currentChild.type === 'file' && nextChild.type === 'folder') {
        return 1;
      }

      return 0;
    });

    return sortedChildren;
  }

  delete(id: number): void {
    const targetEntity = this.tree.get(id)!;

    if (targetEntity) {
      this.tree.delete(targetEntity.id);

      // if it's a folder, recursively delete its contents
      if (targetEntity.children?.length && targetEntity.type === 'folder') {
        targetEntity.children.forEach((entityId) => {
          this.delete(entityId);
        });
      }
    }
  }

  move(targetId: number, destinationId: number): void {
    const targetEntity = this.tree.get(targetId)!;
    const destinationEntity = this.tree.get(destinationId)!;

    if (destinationEntity.type === 'file') {
      throw new Error(
        `Attempt to select file ${destinationEntity.title} as a destination`
      );
    }

    targetEntity.parentId = destinationId;
  }

  getRootEntityOf(tree: FilteredTree): Directories.ExtendedEntity | null {
    let rootEntity: Directories.ExtendedEntity | null = null;

    for (const entity of tree.values()) {
      if (entity.parentId === null) {
        rootEntity = entity;
        break;
      }
    }

    return rootEntity;
  }

  private _findMatchedEntities(input: string): Directories.ExtendedEntity[] {
    const matchedEntities: Directories.ExtendedEntity[] = [];

    this._tree.forEach((entity) => {
      // extract first n characters where n is input length
      const titleSubstring = entity.title.substring(0, input.length);

      if (titleSubstring === input) {
        matchedEntities.push(entity);
      }
    });

    return matchedEntities;
  }
}
