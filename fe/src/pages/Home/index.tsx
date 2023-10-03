import { useEffect, useState } from 'react';
import { Nav, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import { Button, Table } from 'antd';
import { AppDispatch, useAppSelector } from 'state/store';
import { useDispatch } from 'react-redux';

import { ItemAuction } from 'slice/auction/types';
import BidModal from './components/Bid';
import { ColumnsType } from 'antd/es/table/interface';
import Header from '../../components/Header';
import { getAllData } from 'slice/auction/action';

const currency = '$';

const Home = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState<string>('1');
  const [onGoingItemList, setOnGoingItemList] = useState<ItemAuction[]>([]);
  const [completedItemList, setCompletedItemList] = useState<ItemAuction[]>([]);
  const [isGetAllData, setIsGetAllData] = useState<boolean>(false);

  const { loading, userInfo } = useAppSelector((state) => state.user);
  const bidInfo = useAppSelector((state) => state.bid.bidInfo);
  const auctionList = useAppSelector((state) => state.auction.auctionList);

  const dispatch = useDispatch<AppDispatch>();

  const columns: ColumnsType<ItemAuction> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name_ongoing',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'Current Price',
      dataIndex: 'started_price',
      key: 'started_price_ongoing',
      align: 'center',
      ellipsis: true,
      render: (_, item) => {
        return (
          (item.bids?.length > 0 ? item.bids[0].price : item.started_price.toFixed(1)) + currency
        );
      },
    },
    {
      title: 'Duration (Minutes)',
      dataIndex: 'time_window',
      key: 'duration_ongoing',
      align: 'center',
      render: (_, item) => {
        const newDate = new Date().getTime();
        const updatedAt = new Date(item.updated_at).getTime();
        const range = newDate - updatedAt;
        if (range >= item.time_window) {
          return 'Finished';
        } else {
          return ((item.time_window - range) / (60 * 1000)).toFixed(1);
        }
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'action_ongoing',
      render: (_action, item: any) => {
        return (
          <Row gutter={12} justify="center">
            <Col>
              <BidModal item={{ ...item, is_owner: userInfo.id === item.user_id }}></BidModal>
            </Col>
          </Row>
        );
      },
    },
  ];

  const completedColumns: ColumnsType<ItemAuction> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name_completed',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'Current Price',
      dataIndex: 'started_price',
      key: 'started_price_completed',
      align: 'center',
      ellipsis: true,
      render: (value) => {
        return value.toFixed(1) + currency;
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'action_completed',
      render: (_action, item) => {
        return (
          <Row gutter={12} justify="center">
            <Col>
              <Button>Detail</Button>
            </Col>
          </Row>
        );
      },
    },
  ];

  const toggleTab = (tab: any) => {
    if (currentActiveTab !== tab) {
      setCurrentActiveTab(tab);
    }
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
    };
  }, [userInfo?.id, isGetAllData]);

  useEffect(() => {
    console.log({ bidInfo });
    if (Object.keys(bidInfo).length > 0 && bidInfo?.id) {
      setOnGoingItemList(newItems => {
        return newItems.map((d: any) => {
          if (d.id === bidInfo?.auction_id) {
            return {
              ...d,
              bids: [{...bidInfo}]
            }
          }
          return d;
        })
      });
      // dispatch(bidChangeToAuction(newAuctionList));
    }
  }, [bidInfo]);

  useEffect(() => {
    if (auctionList && auctionList?.count > 0) {
      setOnGoingItemList(auctionList?.items.filter((d) => d.status === 1));
      setCompletedItemList(auctionList?.items.filter((d) => d.status === 2));
    }
  }, [auctionList]);

  console.log({ onGoingItemList, completedItemList });

  if (loading) return <></>;

  return (
    <>
      <Header pageName="Home Page" role="Admin" userInfo={userInfo} />
      <div className="mt-3 mb-3 px-4">
        <div className="mt-3 mb-3">
          <Nav tabs style={{ borderBottom: 'none' }}>
            <Row>
              <Col>
                <NavLink
                  style={{ cursor: 'pointer', width: '7em', textAlign: 'center', color: '#6e87a1' }}
                  className={currentActiveTab === '1' ? 'activeTab' : 'buttonStyle'}
                  onClick={() => {
                    toggleTab('1');
                  }}>
                  Ongoing
                </NavLink>
              </Col>
              <Col>
                <NavLink
                  style={{ cursor: 'pointer', width: '7em', textAlign: 'center', color: '#6e87a1' }}
                  className={currentActiveTab === '2' ? 'activeTab' : 'buttonStyle'}
                  onClick={() => {
                    toggleTab('2');
                  }}>
                  Completed
                </NavLink>
              </Col>
            </Row>
          </Nav>
        </div>
        <div className="mt-3">
          <TabContent activeTab={currentActiveTab}>
            <TabPane tabId="1">
              <Table
                columns={columns}
                dataSource={onGoingItemList}
                rowClassName={() => 'rowClassName1'}
                rowKey={(record) => record.id}
              />
            </TabPane>
            <TabPane tabId="2">
              <Table
                columns={completedColumns}
                dataSource={completedItemList}
                rowClassName={() => 'rowClassName1'}
                rowKey={(record) => record.id}
              />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default Home;
