import {
  DirectoriesTreeMock,
  expectedParentDirectories,
  expectedMatchedMobxEntities,
  expectedTreeWithMobxEntities,
  resultAfterDirectoryDeletion,
  resultAfterFileDeletion,
  resultAfterMovingAFile,
  expectedChildrenOfDirectory,
  DirectoriesTreeMock_asMap,
  expectedTreeWithFolderEntities,
  expectedTreeWithMobxJpgEntities,
} from '@/mocks/directories';
import { EntitiesModel as DirectoriesTreeModel } from '../EntitiesModel';

describe('DirectoriesTreeModel model', function () {
  it('makes a search by name via private method and returns only matched files', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);

    expect(directoriesTree['_findMatchedEntities']('mobx')).toEqual(
      expectedMatchedMobxEntities
    );
  });

  it('gets all parent directories of the provided entity', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);

    expect(
      directoriesTree.getParentDirectoriesOf({
        type: 'file',
        isOpened: false,
        id: 13,
        parentId: 2,
        title: 'mobx2.jpg',
      })
    ).toEqual(expectedParentDirectories);
  });

  it('makes a search from the begining of an entity name', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.filter('m');

    const searchResult_sortedById = [
      ...directoriesTree.filteredTree.values(),
    ].sort((currentEntity, nextEntity) => currentEntity.id - nextEntity.id);

    const expectedResult_sortedById = expectedTreeWithMobxEntities.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(searchResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('makes a search by empty string and returns original directories tree', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.filter('');

    const searchResult_sortedById = [
      ...directoriesTree.filteredTree.values(),
    ].sort((currentEntity, nextEntity) => currentEntity.id - nextEntity.id);

    const expectedResult_sortedById = DirectoriesTreeMock.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(searchResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('makes a search by "mobx.jpg" and returns filtered directories tree', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.filter('mobx.jpg');

    const searchResult_sortedById = [
      ...directoriesTree.filteredTree.values(),
    ].sort((currentEntity, nextEntity) => currentEntity.id - nextEntity.id);

    const expectedResult_sortedById = expectedTreeWithMobxJpgEntities.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(searchResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('makes a search by "mobx" and returns filtered directories tree', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.filter('mobx');

    const searchResult_sortedById = [
      ...directoriesTree.filteredTree.values(),
    ].sort((currentEntity, nextEntity) => currentEntity.id - nextEntity.id);

    const expectedResult_sortedById = expectedTreeWithMobxEntities.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(searchResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('makes a search by "folder" and returns filtered directories tree', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.filter('folder');

    const searchResult_sortedById = [
      ...directoriesTree.filteredTree.values(),
    ].sort((currentEntity, nextEntity) => currentEntity.id - nextEntity.id);

    const expectedResult_sortedById = expectedTreeWithFolderEntities.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(searchResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('deletes a folder and all its contents', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.delete(1);

    const deleteResult_sortedById = [...directoriesTree.tree.values()].sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    const expectedResult_sortedById = resultAfterDirectoryDeletion.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(deleteResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('deletes a file', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.delete(13);

    const deleteResult_sortedById = [...directoriesTree.tree.values()].sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    const expectedResult_sortedById = resultAfterFileDeletion.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(deleteResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('moves a file to other directory', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);
    directoriesTree.move(13, 0);

    const moveResult_sortedById = [...directoriesTree.tree.values()].sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    const expectedResult_sortedById = resultAfterMovingAFile.sort(
      (currentEntity, nextEntity) => currentEntity.id - nextEntity.id
    );

    expect(moveResult_sortedById).toEqual(expectedResult_sortedById);
  });

  it('does not allow to choose a file as move destination', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);

    expect(() => {
      directoriesTree.move(13, 10);
    }).toThrow('Attempt to select file example.png as a destination');
  });

  it('finds first layer of children and moves folders up in the list', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);

    const expectedResult = directoriesTree.getNextChildrenLayerOf(1);

    expect(expectedResult).toEqual(expectedChildrenOfDirectory);
  });

  it('does not allow to choose a file as a parent folder', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);

    expect(() => {
      directoriesTree.getNextChildrenLayerOf(11);
    }).toThrow('Attempt to select file user.png as a parent folder');
  });

  it('gets the root entity in a directories tree', () => {
    const directoriesTree = new DirectoriesTreeModel(DirectoriesTreeMock);

    expect(directoriesTree.getRootEntityOf(DirectoriesTreeMock_asMap)!.id).toBe(
      0
    );
  });
});
