// External
import { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';

// Internal
import { EntityProps } from './types';
import styles from './index.module.scss';

export const Entity: FC<PropsWithChildren<EntityProps>> = observer(
  ({ entity, viewModel, className }) => {
    const isOpened = entity.parentId === null ? true : entity.isOpened;
    const leftOffsetStyle = entity.parentId !== null ? styles.root : '';

    const handleEntityClick = () => {
      entity.type === 'folder' && viewModel.toggleVisibility(entity.id);

      if (entity.type === 'file') {
        // handle file-click action
      }
    };

    return (
      <div className={className}>
        <h3 className={styles.name} onClick={handleEntityClick}>
          {entity.title}
        </h3>
        {isOpened && entity.type === 'folder' && (
          <div className={leftOffsetStyle}>
            {viewModel.getChildrenOf(entity.id).map((child) => {
              return (
                <Entity entity={child} viewModel={viewModel} key={child.id} />
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
