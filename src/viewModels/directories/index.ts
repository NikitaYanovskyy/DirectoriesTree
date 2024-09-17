// External
import { ChangeEvent } from 'react';
import {
  action,
  makeObservable,
  observable,
  computed,
  when,
  reaction,
  runInAction,
} from 'mobx';
import { UseFormReturn } from 'react-hook-form';

// Internal
import { EntitiesModel } from '@/models/Directories/Entities/EntitiesModel';
import { fetchDirectoriesTree } from '@/api/directories';

interface FormFields {
  search: string;
}

export class DirectoriesVM {
  isLoading: boolean = true;
  // we set the model as soon as the directories tree is fetched
  // @ts-ignore
  entitiesModel: EntitiesModel;
  searchInput: string = '';

  // not observed
  fetchedEntities: Directories.Entity[] = [];
  form: UseFormReturn<FormFields, any, undefined> | undefined;

  constructor() {
    makeObservable(this, {
      // observables
      isLoading: observable,
      searchInput: observable,

      // actions
      setIsLoading: action.bound,
      setSearchInput: action.bound,

      // Computed
      rootEntity: computed,

      // event handlers
      handleSearchInputChange: action.bound,
    });

    // fetch initial directories and set up the model
    const disposer = when(
      () => this.isLoading === true,
      async () => {
        const fetchedDirectories = await fetchDirectoriesTree();
        this.setEntitiesModel(new EntitiesModel(fetchedDirectories));
        this.setIsLoading(false);

        // convert filteredTree array to an observable in the model
        this.entitiesModel.setFilteredTree(
          observable.map(this.entitiesModel.filteredTree)
        );

        // clean up the reaction after a successful request
        disposer();

        // subscribe to "isOpen" prop change of every item in the filteredTree array
        reaction(
          () =>
            Array.from(this.entitiesModel.filteredTree.values()).map(
              (item) => item.isOpened
            ),
          // no action is needed after "isOpened" value change, so we leave the callback empty
          () => {}
        );
      }
    );
  }

  private setEntitiesModel(model: EntitiesModel) {
    this.entitiesModel = model;
  }

  setSearchInput(input: string) {
    this.searchInput = input;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
  setForm(form: UseFormReturn<FormFields, any, undefined>) {
    this.form = form;
  }

  getChildrenOf(entityId: number): Directories.ExtendedEntity[] {
    return this.entitiesModel.getNextChildrenLayerOf(entityId);
  }

  get rootEntity(): Directories.ExtendedEntity | null {
    return this.entitiesModel.getRootEntityOf(this.entitiesModel.filteredTree);
  }

  handleSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
    this.setSearchInput(e.target.value);
    this.entitiesModel.filter(e.target.value);
  }

  toggleVisibility(entityId: number) {
    const targetEntity = this.entitiesModel.filteredTree.get(entityId);

    if (targetEntity) {
      // using runInAction to ensure that we update a prop within a mobx action
      runInAction(() => {
        targetEntity.isOpened = !targetEntity.isOpened;
      });
    }
  }
}
