import { useEffect, useState } from 'react';
import { Button, Divider, Input, message, Select, SelectProps, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { SearchDomain } from '@refly/openapi-schema';
import { DataFetcher } from '@refly-packages/ai-workspace-common/modules/entity-selector/utils';
import { useFetchOrSearchList } from '@refly-packages/ai-workspace-common/modules/entity-selector/hooks';
import { HiOutlinePlus } from 'react-icons/hi2';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import getClient from '@refly-packages/ai-workspace-common/requests/proxiedRequest';
import { getPopupContainer } from '@refly-packages/ai-workspace-common/utils/ui';

interface SearchSelectProps extends SelectProps {
  domain: SearchDomain;
  fetchData?: DataFetcher;
  allowCreateNewEntity?: boolean;
  defaultValue?: any;
}

export const SearchSelect = (props: SearchSelectProps) => {
  const { t } = useTranslation();
  const { domain, fetchData, allowCreateNewEntity = false, defaultValue, onChange, onSelect, ...selectProps } = props;

  const { loadMore, dataList, setDataList, isRequesting, handleValueChange, resetState } = useFetchOrSearchList({
    domain,
    fetchData,
  });

  const [newEntityName, setNewEntityName] = useState('');

  const options = dataList?.map((item) => ({
    label: item?.title,
    value: item?.id,
  }));

  useEffect(() => {
    loadMore();
    return () => {
      resetState();
    };
  }, []);

  const [value, setValue] = useState<any>(defaultValue);
  const [popupVisible, setPopupVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateNewEntity = async () => {
    if (domain !== 'project') {
      return;
    }

    if (!newEntityName) {
      message.warning(t('entitySelector.createEntity.newProjectNameIsEmpty'));
      return;
    }

    setCreateLoading(true);
    const { data, error } = await getClient().createProject({
      body: {
        title: newEntityName,
      },
    });
    setCreateLoading(false);

    if (!data || error) {
      return;
    }

    const { projectId, title } = data.data;
    setDataList([{ id: projectId, title, domain }, ...dataList]);
    setValue(projectId);
    setPopupVisible(false);
    setNewEntityName('');
    onChange?.(projectId, { label: title, value: projectId });
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    // 检查是否滚动到底部附近(距离底部20px内)
    if (currentTarget.scrollTop + currentTarget.clientHeight >= currentTarget.scrollHeight - 20) {
      loadMore();
    }
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Select
      size="middle"
      className="w-full"
      getPopupContainer={getPopupContainer}
      allowClear
      showSearch
      placeholder={t(`entitySelector.placeholder.${domain}`)}
      defaultValue={defaultValue}
      filterOption={false}
      // popupVisible={popupVisible}
      options={options}
      loading={isRequesting}
      onSearch={(value) => {
        handleValueChange(value, [domain]);
      }}
      onClick={() => {
        if (props.disabled) return;
        setPopupVisible(!popupVisible);
      }}
      value={value}
      onChange={(value, option) => {
        console.log('onChange value', value);
        console.log('onChange option', option);
        setValue(value);
        if (props.mode !== 'multiple') {
          setPopupVisible(false);
        }
        if (onChange) {
          onChange(value, option);
        }
      }}
      onPopupScroll={handlePopupScroll}
      dropdownRender={(menu) => (
        <div>
          {menu}
          {allowCreateNewEntity && (
            <>
              <Divider style={{ margin: 0 }} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                }}
              >
                <Input
                  allowClear
                  size="small"
                  placeholder={t(`entitySelector.createEntity.${domain}`)}
                  style={{ marginRight: 8 }}
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  onPressEnter={handleCreateNewEntity}
                />
                <Button className="text-sm py-1" type="text" size="small" onClick={handleCreateNewEntity}>
                  {createLoading ? (
                    <AiOutlineLoading3Quarters />
                  ) : (
                    <Tooltip
                      getPopupContainer={getPopupContainer}
                      placement="right"
                      title={t(`entitySelector.createEntity.${domain}`)}
                    >
                      <HiOutlinePlus />
                    </Tooltip>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {...selectProps}
    />
  );
};
