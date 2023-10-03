import React, { useEffect, useRef, useState } from 'react';
import type { InputRef, TableProps } from 'antd';
import { Button, Col, Input, Row, Space, Table, message } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from 'state/store';

import Header from '../../components/Header';
import CreateItemModal from './components';

import { getAllData } from 'slice/auction/action';
import { updateAuction } from 'slice/auction/action';
import { ItemAuction, UPayloadAuction } from 'slice/auction/types';

//latest create time stand first
const currency = '$';

const Item: React.FC = ({ direction, ...args }: any) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [itemEditData, setItemEditData] = useState(null);
  const [isGetAllData, setIsGetAllData] = useState<boolean>(false);
  const [data, setData] = useState<ItemAuction[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const searchInput = useRef<InputRef>(null);
  
  const { loading, userInfo } = useAppSelector((state) => state.user);
  const auctionList = useAppSelector((state) => state.auction);

  const dispatch = useDispatch<AppDispatch>();

  const handleChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined rev={undefined} />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}>
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} rev={undefined} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ?.toString()
        .toLocaleLowerCase()
        .includes((value as string).toLowerCase()) as boolean;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Current Price',
      dataIndex: 'started_price',
      key: 'started_price',
      align: 'center',
      ellipsis: true,
      render: (value) => {
        return value.toFixed(1) + currency;
      },
    }, 
    {
      title: 'Time Window',
      dataIndex: 'time_window',
      key: 'time_window',
      align: 'center',
      ellipsis: true,
      render: (value) => {
        return (value / (60 * 1000)).toFixed(1);
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'action',
      render: (_action, item) => {
        return (
          <Row gutter={12} justify="center">
            <Col>
              <Button disabled={item.status > 0} style={{ width: '5em' }} key={1} onClick={() => onPublish(item)}>
                Publish
              </Button>
            </Col>
            <Col>
              <Button disabled={item.status > 0} style={{ width: '5em' }} key={2} onClick={() => onEdit(item)}>
                Edit
              </Button>
            </Col>
          </Row>
        );
      },
    },
  ];

  const onEdit = (item: any) => {
    console.log('ITEM EIDTED', item);
    setItemEditData(item);
  };

  const onPublish = async (item: UPayloadAuction) => {

    const payload: UPayloadAuction = {
      user_id: userInfo?.user_id,
      name: item.name,
      started_price: item.started_price,
      time_window: item.time_window,
      status: 1,
      id: item.id
    };
    const res = await dispatch(updateAuction(payload));
    if (res?.payload?.id) {
        success();
      } else {
        error();
      }
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: `Publish Item Successful`,
    });
  };
  const error = () => {
    messageApi.open({
      type: 'error',
      content: `Publish Item Fail`,
    });
  };

  useEffect(() => { 
    const tmCall = setTimeout(() => {
      if (userInfo?.id && !isGetAllData) {
        console.log({ userInfo });
        dispatch(getAllData());
        setIsGetAllData(true);
      }
    }, 555);
    return () => {
      clearTimeout(tmCall);
    }
  }, [userInfo?.id, isGetAllData])

  useEffect(() => {
    if (auctionList?.auctionList && auctionList?.auctionList?.count > 0) {
      /// setOnGoingItemList(auctionList?.auctionList?.items.filter(d => d.status === 1));
      setData(auctionList?.auctionList?.items.filter(d => d.user_id === userInfo?.id))
    }
  }, [auctionList?.auctionList])

  if (loading) return <></>

  return (
    <>
      {contextHolder}      
      <Header pageName="New Item" userInfo={userInfo} />
      <div className="px-4">
        <div className="mt-3 mb-3 px-4">
          <CreateItemModal itemEditData={itemEditData} setItemEditData={setItemEditData} />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          onChange={handleChange}
          rowClassName={() => 'rowClassName1'}
          rowKey={record => record.id}
        />
      </div>
    </>
  );
};

export default Item;
