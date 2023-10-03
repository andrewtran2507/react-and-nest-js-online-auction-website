import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'state/store';
import { useSelector } from 'react-redux';

import { createAuction, updateAuction } from 'slice/auction/action';
import { IPayloadAuction, UPayloadAuction } from 'slice/auction/types';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 11 },
};

const def = {
  name: '',
  started_price: '',
  time_window: '',
};

const CreateItemModal: React.FC<any> = ({ itemEditData, setItemEditData }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((store: any) => store.user.userInfo);

  const showModal = () => {
    setOpen(true);
    const nData = itemEditData || def;
    form.setFieldsValue({
      name: nData.name,
      started_price: nData.started_price.toString(),
      time_window: nData.time_window ? (nData.time_window / (60 * 1000)).toString() : '',
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setItemEditData(null);
    form.setFieldsValue(def);
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: `${itemEditData ? 'Update' : 'Create'} Item Successful`,
    });
  };
  const error = () => {
    messageApi.open({
      type: 'error',
      content: `${itemEditData ? 'Update' : 'Create'} Item Fail`,
    });
  };

  const handleOk = async (e: any) => {
    e.preventDefault();
    try {
      const formData = await form.validateFields();

      let payload: IPayloadAuction = {
          name: formData.name,
          started_price: Number(formData.started_price),
          time_window: (+formData.time_window) * 60 * 1000,
          user_id: userInfo?.id,
        },
        res;
      if (itemEditData) {
        const uPayload: UPayloadAuction = {
          ...payload,
          id: itemEditData.id,
        };
        res = await dispatch(updateAuction(uPayload));
      } else {
        res = await dispatch(createAuction(payload));
      }
      console.log({ payload, formData });

      setConfirmLoading(true);
      setTimeout(() => {
        handleCancel();
        setConfirmLoading(false);
      }, 1000);

      if (res?.payload?.id) {
        success();
      } else {
        error();
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (itemEditData) {
      showModal();
    }
  }, [itemEditData]);

  return (
    <>
      {contextHolder}
      <Button onClick={showModal} className="primaryBtn">
        Create Item
      </Button>
      <Modal
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
            Create Item
          </div>
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Create"
        footer={[
          <Row key={`r-1-f`} gutter={40} justify="end">
            <Col>
              <Button size="large" key="back" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button size="large" key="submit" type="primary" loading={loading} onClick={handleOk}>
                {`${itemEditData ? 'Update' : 'Create'}`}
              </Button>
            </Col>
          </Row>,
        ]}
        modalRender={(modal) => <div>{modal}</div>}>
        <Form
          initialValues={def}
          form={form}
          name="create_new_item"
          style={{ maxWidth: 600 }}
          layout="vertical">
          <Form.Item
            {...formItemLayout}
            labelAlign="left"
            name="name"
            label="Name"
            wrapperCol={{ span: 24 }}
            rules={[
              { required: true, message: 'Please input item name!' },
              { max: 188, message: 'Maximum length is 188 characters' },
            ]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            labelAlign="left"
            name="started_price"
            label="Start Price"
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Please input start price',
              },
              {
                pattern: new RegExp(/^(0|[1-9][0-9]*)$/),
                message: 'Input number only',
              },
              {
                min: 3,
              },
            ]}>
            <Input placeholder="Start Price ($)" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            labelAlign="left"
            name="time_window"
            label="Time Window"
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: 'Please fill time window!',
              },
              {
                pattern: new RegExp(/^(0|[1-9][0-9]*)$/),
                message: 'Input number only',
              },
              {
                min: 2,
              },
            ]}>
            <Input placeholder="Time Window (minutes)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateItemModal;
