// External
import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

// Internal
import { Entity } from '@/components/Directories/Entity';
import { DirectoriesVM } from '@/viewModels/directories';
import { TextInput } from '@/components/Form/TextInput';

export const directoriesViewModel = new DirectoriesVM();

export const Home: FC = observer(() => {
  const directoriesViewModel = useMemo<DirectoriesVM>(
    () => new DirectoriesVM(),
    []
  );

  const form = useForm({ defaultValues: { search: '' }, mode: 'all' });
  directoriesViewModel.setForm(form);

  if (directoriesViewModel.isLoading) return <h1>...Loading data</h1>;

  return (
    <>
      <TextInput
        control={form.control}
        name='search'
        onChange={directoriesViewModel.handleSearchInputChange}
        rules={{
          maxLength: {
            value: 10,
            message: "Can't exceed 10 characters",
          },
        }}
      />

      {directoriesViewModel.rootEntity && (
        <Entity
          entity={directoriesViewModel.rootEntity}
          viewModel={directoriesViewModel}
          key={directoriesViewModel.rootEntity.id}
        />
      )}
    </>
  );
});
