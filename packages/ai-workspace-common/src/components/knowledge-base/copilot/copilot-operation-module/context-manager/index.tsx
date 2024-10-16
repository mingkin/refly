import { useState, useEffect } from 'react';
import { ContextItem } from './context-item';
import { ContextPreview } from './context-preview';

// hooks
import { useProcessContextItems } from './hooks/use-process-context-items';
import { useProcessContextFilter } from '@refly-packages/ai-workspace-common/components/knowledge-base/copilot/copilot-operation-module/context-manager/hooks/use-process-context-filter';
import { useSelectedMark } from '@refly-packages/ai-workspace-common/modules/content-selector/hooks/use-selected-mark';

// components
import { AddBaseMarkContext } from './components/add-base-mark-context';
import './index.scss';

// components
import { ResetContentSelectorBtn } from './reset-content-selector-btn';
import { ContextFilter } from './components/context-filter/index';
import { SaveToKnowledgeBase } from './components/save-to-knowledge-base/index';
// stores
import { useContextPanelStoreShallow } from '@refly-packages/ai-workspace-common/stores/context-panel';
import { useKnowledgeBaseStore } from '@refly-packages/ai-workspace-common/stores/knowledge-base';
import { useNoteStore } from '@refly-packages/ai-workspace-common/stores/note';

// types
import { Collection, Note, Resource, SearchDomain, SearchResult } from '@refly/openapi-schema';
import {
  backendBaseMarkTypes,
  BaseMarkType,
  frontendBaseMarkTypes,
  Mark,
  SelectedTextDomain,
  selectedTextDomains,
} from '@refly/common-types';

import { mapSelectionTypeToContentList } from './utils/contentListSelection';
import { getRuntime } from '@refly-packages/ai-workspace-common/utils/env';

const mapMarkToSearchResult = (marks: Mark[]): SearchResult[] => {
  let searchResults: SearchResult[] = [];

  searchResults = marks
    .filter((item) => backendBaseMarkTypes.includes(item?.type as BaseMarkType))
    .map((mark) => ({
      id: mark.id,
      domain: mark.type as SearchDomain,
      title: mark.title,
      url: mark.url,
    }));

  return searchResults;
};

export const ContextManager = () => {
  const [activeItemId, setActiveItemId] = useState(null);
  const { processedContextItems } = useProcessContextItems();
  const {
    addMark,
    removeMark,
    toggleMarkActive,
    clearMarks,
    updateMark,
    currentSelectedMarks,
    filterIdsOfCurrentSelectedMarks,
    filterErrorInfo,
  } = useContextPanelStoreShallow((state) => ({
    addMark: state.addMark,
    removeMark: state.removeMark,
    toggleMarkActive: state.toggleMarkActive,
    clearMarks: state.clearMarks,
    updateMark: state.updateMark,
    currentSelectedMarks: state.currentSelectedMarks,
    filterIdsOfCurrentSelectedMarks: state.filterIdsOfCurrentSelectedMarks,
    filterErrorInfo: state.filterErrorInfo,
  }));
  const runtime = getRuntime();
  const isWeb = runtime === 'web';

  console.log('processedContextItems', processedContextItems);

  const handleToggleItem = (id) => {
    toggleMarkActive(id);
    setActiveItemId((prevId) => (prevId === id ? null : id));
  };

  const handleRemoveItem = (id) => {
    removeMark(id);
    if (activeItemId === id) {
      setActiveItemId(null);
    }
  };

  const activeItem = processedContextItems.find((item) => item.id === activeItemId);

  const handleExpandItem = (id) => {
    // 这里可以添加展开项目的逻辑
    console.log(`Expanding item with id: ${id}`);
    // 例如，可以设置一个新的状态来跟踪展开的项目
    // setExpandedItems(prev => [...prev, id]);
  };

  const handleAddItem = (newMark: Mark) => {
    console.log('newMark', newMark);
    // 检查项目是否已经存在于 store 中
    const existingMark = currentSelectedMarks.find((mark) => mark.id === newMark.id && mark.type === newMark.type);

    if (!existingMark) {
      // 如果项目不存在，添加到 store

      addMark(newMark);
    } else {
      removeMark(existingMark.id);
      // 如果项目已存在，可以选择更新它或者不做任何操作
      // 这里我们选择不做任何操作，但您可以根据需求进行调整
      console.log('Item already exists in the store');
    }
  };

  const selectedItems = processedContextItems?.filter((item) =>
    [...backendBaseMarkTypes, ...frontendBaseMarkTypes].includes(item?.type as BaseMarkType),
  );

  const processContextFilterProps = useProcessContextFilter(true);

  const currentKnowledgeBase = useKnowledgeBaseStore((state) => state.currentKnowledgeBase);
  const currentResource = useKnowledgeBaseStore((state) => state.currentResource);
  const currentNote = useNoteStore((state) => state.currentNote);
  const { initMessageListener } = useSelectedMark();

  const currentSelectedContentList =
    (currentSelectedMarks || []).filter(
      (mark) =>
        selectedTextDomains?.includes(mark?.domain) || selectedTextDomains.includes(mark?.type as SelectedTextDomain),
    ) || [];

  const buildEnvContext = (data: Collection | Resource | Note, type: 'collection' | 'resource' | 'note'): Mark[] => {
    if (!data) return [];

    const typeMap = {
      resource: 'resourceId',
      collection: 'collectionId',
      note: 'noteId',
    };

    const idKey = typeMap[type];
    const id = data[idKey];

    if (!id) return [];

    return [
      {
        title: data.title,
        type,
        id,
        entityId: id,
        data: type === 'collection' ? (data as Collection).description : (data as Resource | Note).content,
        onlyForCurrentContext: true,
        isCurrentContext: true,
        url: (data as Resource)?.data?.url || '',
      },
    ];
  };

  const removeNotCurrentContext = (type: string) => {
    currentSelectedMarks
      .filter((mark) => mark.type === type)
      .forEach((mark) => {
        if (mark.onlyForCurrentContext) {
          removeMark(mark.id);
        } else if (mark.isCurrentContext) {
          updateMark({ ...mark, isCurrentContext: false });
        }
      });
  };

  const handleAddCurrentContext = (newMark: Mark) => {
    removeNotCurrentContext(newMark.type);

    const existingMark = currentSelectedMarks.find((mark) => mark.id === newMark.id && mark.type === newMark.type);

    if (!existingMark) {
      addMark(newMark);
    } else {
      newMark.onlyForCurrentContext = existingMark.onlyForCurrentContext;
      updateMark(newMark);
    }
  };

  const updateContext = (item: any, type: 'collection' | 'resource' | 'note') => {
    const envContext = buildEnvContext(item, type);
    const contextItem = envContext?.[0];
    if (contextItem) {
      handleAddCurrentContext(contextItem);
    } else {
      removeNotCurrentContext(type);
    }
  };

  useEffect(() => {
    updateContext(currentKnowledgeBase, 'collection');
  }, [currentKnowledgeBase?.collectionId]);

  useEffect(() => {
    updateContext(currentResource, 'resource');
  }, [currentResource?.resourceId]);

  useEffect(() => {
    updateContext(currentNote, 'note');
  }, [currentNote?.noteId]);

  useEffect(() => {
    const clearEvent = initMessageListener();

    return () => {
      clearEvent?.();
    };
  }, []);

  return (
    <div className="context-manager">
      <div className="context-content">
        <div className="context-items-container">
          <AddBaseMarkContext handleAddItem={handleAddItem} selectedItems={selectedItems} />

          <ResetContentSelectorBtn />

          <ContextFilter processContextFilterProps={processContextFilterProps} />

          {!isWeb && currentSelectedContentList?.length > 0 && <SaveToKnowledgeBase />}

          {processedContextItems.map((item) => (
            <ContextItem
              key={item.id}
              item={item}
              disabled={(filterIdsOfCurrentSelectedMarks || []).includes(item.id)}
              isLimit={!!filterErrorInfo?.[mapSelectionTypeToContentList(item.type)]}
              isActive={item.id === activeItemId}
              onToggle={handleToggleItem}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {activeItem && (
          <ContextPreview
            item={activeItem}
            onClose={() => setActiveItemId(null)}
            onRemove={handleRemoveItem}
            onOpenUrl={(url) => {
              if (typeof url === 'function') {
                url(); // 执行跳转函数
              } else {
                window.open(url, '_blank'); // 打开外部链接
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
