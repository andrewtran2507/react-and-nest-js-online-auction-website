import { useEffect, useState } from 'react';
import {
  Dropdown,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from 'slice/user';
import Avatar from '../../assets/avatar.jpg';

import { Col, Form, Input, Modal, Row, message, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'state/store';
import { useSelector } from 'react-redux';
import { getDepositItem, createDeposit } from 'slice/deposit/action';
import { MakeDeposit } from 'slice/deposit/type';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 11 },
};

const Header = ({ pageName = '', role = '', userInfo = { email: '', id: '' } }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isGetDepositData, setIsGetDepositData] = useState(false);
  
  const [disabled, setDisabled] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const dispatch = useDispatch<AppDispatch>();
  const depositInfo = useSelector((state: any) => state.deposit.depositInfo);

  const toggle = () => setDropdownOpen((prevState: boolean) => !prevState);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    dispatch(logout());
    navigate('/login');
  };

  const showModal = () => {
    setConfirmLoading(false);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Make Deposit Successful',
    });
  };
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Make Deposit Fail',
    });
  };

  const handleOk = async (e: any) => {
    e.preventDefault();
    try {
      const fData = await form.validateFields();
      const payload: MakeDeposit = {
        amount: +fData.amount,
        user_id: userInfo.id,
      };
      const res = await dispatch(createDeposit(payload));
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
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
    const tmCall = setTimeout(() => {
      if (userInfo?.id && !isGetDepositData) {
        console.log({ userInfo });
        dispatch(getDepositItem(userInfo?.id));
        setIsGetDepositData(true);
      }
    }, 555);
    return () => {
      clearTimeout(tmCall);
    }
  }, [userInfo?.id, isGetDepositData])

  return (
    <>
      <Navbar dark style={{ backgroundColor: `rgba(55,56,57,0.9)` }}>
        <NavbarBrand href="/">{pageName}</NavbarBrand>
        <Nav style={{ alignItems: 'center' }}>
          <NavItem>
            <NavLink href="#" active style={{ color: 'white' }}>
              <span style={{ margin: '0 0.25em' }}>Balance:</span>
              <span style={{ margin: '0 0.25em' }}>{depositInfo?.amount || 0}$</span>
            </NavLink>
          </NavItem>
          <Dropdown
            nav
            isOpen={dropdownOpen}
            toggle={toggle}
            onMouseOver={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}>
            <DropdownToggle nav>
              <img
                alt="logo"
                src={Avatar}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: '50%',
                }}
              />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem disabled>
                <p>Welcome, {userInfo?.email}</p>
              </DropdownItem>
              <DropdownItem disabled={pageName === 'Home Page'}>
                <NavLink href="/home">Home Page</NavLink>
              </DropdownItem>
              <DropdownItem disabled={pageName === 'New Item'}>
                <NavLink href="/item">Create New Item</NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink onClick={showModal}>Deposit</NavLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>
                <NavLink onClick={handleLogout}>Logout</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
        {contextHolder}
        {
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
                Deposit
              </div>
            }
            open={open}
            // onOk={handleOk}
            onCancel={handleCancel} //modal close on click outside modal
            // confirmLoading={confirmLoading}
            okText="Deposit"
            footer={[
              <Row key={`r-t-d-001`} gutter={40} justify="end">
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
                    Deposit
                  </Button>
                </Col>
              </Row>,
            ]}
            modalRender={(modal) => <div>{modal}</div>}>
            <Form
              initialValues={{ amount: '' }}
              form={form}
              name="add_deposit"
              style={{ maxWidth: 600 }}
              layout="vertical">
              <Form.Item
                {...formItemLayout}
                labelAlign="left"
                name="amount"
                label="Amount"
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Please input deposit amount',
                  },
                  {
                    pattern: new RegExp(/^\d*\.?\d*$/),
                    min: 0,
                    message: 'Input number only',
                  },
                ]}>
                <Input placeholder="Amount" />
              </Form.Item>
            </Form>
          </Modal>
        }
      </Navbar>
    </>
  );
};

export default Header;
