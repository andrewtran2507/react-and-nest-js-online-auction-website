import { Button, Col, ConfigProvider, Form, Input, Modal, Row, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ItemType } from '../type';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'state/store';
import { useSelector } from 'react-redux';
import { createBid } from 'slice/bid/action';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 11 },
};

type BidModalType = {
  item: ItemType;
};

const BidModal = ({ item }: BidModalType) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [isTimesUp, setIsTimesUp] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Bid Item Successful. Please wait 5 seconds to take the next bid',
    });
  };
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Bid Item Fail. Please wait 5 seconds to try again',
    });
  };
  
  useEffect(() => {
    if (item.duration === '') {
      setIsTimesUp(true);
    }
  }, [item.duration]);

  const handleOk = async (e: any) => {
    e.preventDefault();
    try {
      const fData = await form.validateFields();
      const payload = {
        auction_id: item.id,
        price: +fData.price,
        user_id: userInfo?.id,
      };
      console.log('ITEM PICK', item);
      console.log('bid payload', payload);
      const res = await dispatch(createBid(payload));

      setConfirmLoading(true);
      setTimeout(() => {
        setConfirmLoading(false);
        setOpen(false);
      }, 1000);
      //button bid
      setLoading(true);
      setIsTimesUp(true);

      setTimeout(() => {
        setLoading(false);
        setIsTimesUp(false);
      }, 5000);
      // clearTimeout();
      
      console.log('  res ', res);

      if (res?.payload?.id) {
        success();
      } else {
        error();
      }
    } catch (e) {
      console.log(e)
    }
  };
  const showModal = () => {
    setConfirmLoading(false);
    setOpen(true);
    form.setFieldsValue({price: ''});
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      {contextHolder}
      <Button
        onClick={showModal}
        className="primaryBtn"
        disabled={isTimesUp || !!item.is_owner}
        loading={loading}>
        Bid
      </Button>
      <Modal
        width={400}
        title={
          <div
            style={{
              fontSize: '1.5em',
              width: '100%',
              cursor: 'move',
            }}
            className="mb-2"
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}>
            {item.name}
          </div>
        }
        open={open}
        // onOk={handleOk}
        onCancel={handleCancel} //modal close on click outside modal
        // confirmLoading={confirmLoading}
        okText="Submit"
        footer={[
          <Row key={'r-add_a_bid-1'} gutter={40} justify="end">
            <Col>
              <Button size="large" key="back" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                size="large"
                key="submit"
                type="primary"
                loading={confirmLoading}
                onClick={handleOk}>
                Submit
              </Button>
            </Col>
          </Row>,
        ]}
        modalRender={(modal) => <div>{modal}</div>}>
        <Form
          initialValues={{
            price: '',
          }}
          form={form}
          name="add_a_bid"
          style={{ maxWidth: 600 }}
          layout="vertical">
          <Form.Item
            {...formItemLayout}
            labelAlign="left"
            name="price"
            label="Bid Price"
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Please input bid price',
              },
              {
                pattern: new RegExp(/^(0|[1-9][0-9]*)$/),
                message: 'Input number only',
              },
              {
                min: 3,
              },
              {
                validator: (_, value) => {
                  if (
                    value &&
                    ((value <= item.started_price && item?.bids?.length === 0) ||
                      value <= item.bids[0]?.price)
                  ) {
                    return Promise.reject('Input must be higher than current price');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}>
            <Input placeholder="Pice" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default BidModal;
