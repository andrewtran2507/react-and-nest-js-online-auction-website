import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  InputGroup,
} from 'reactstrap';
import { login } from 'slice/user/action';
import { AppDispatch } from 'state/store';
import { emailFormat } from '../../utils/uString';

const LoginPage = () => {
  const [email, setEmail] = useState<string>('thomas.edison@nb.vn');
  const [isGetCurrentData, setIsGetCurrentData] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('12313@3!tT');
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [passwordStatus, setPasswordStatus] = useState<string>('');
  const [hiddenTooltip, setHiddenTooltip] = useState<boolean>(false);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //check status of email input only
    if (emailStatus === 'unavailable') {
      setHiddenTooltip(false);
      console.log('INPUT INVALID');
      return;
    }
    try {
      const res = await dispatch(login({ email, password }));
      if (res) {
        if (localStorage.getItem('accessToken') && res?.payload?.token) {
          navigate('/home')
          return
        }
        return alert('Something went wrong!')
      } else {
        setEmailStatus('unavailable');
        setPasswordStatus('invalid');
        setHiddenTooltip(false);
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    let delayDisplay: any
    if (password !== '') {
      delayDisplay = setTimeout(() => {
        setPasswordStatus('valid');
      }, 250);
      
    } else {
      delayDisplay = setTimeout(() => {
        setPasswordStatus('');
      }, 300); 
    }
    return () => {
      delayDisplay && clearTimeout(delayDisplay);
    }
  }, [password]);

  useEffect(() => {
    // const regex = /\S+@\S+\.\S+/
    let delayDisplay: any
    const regex = emailFormat
    if (regex.test(email)) {
      delayDisplay = setTimeout(() => {
        setEmailStatus('available');
      }, 250);
      
    } else if (email === '' || !regex.test(email)) {
      delayDisplay = setTimeout(() => {
        setEmailStatus('');
      }, 300);
    }
    return () => {
      delayDisplay && clearTimeout(delayDisplay);
    }
  }, [email]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/home');
    } else {
      setIsGetCurrentData(false);
    }
  }, []);

  return isGetCurrentData ? (
    <>Loading ...</>
  ) : (
    <div className="w-50 container pt-15">
      <div className="d-flex flex-col justify-content-center align-items-center p-5 rounded shadow">
        <h1>Login</h1>
        <Form className="w-100" onSubmit={(e) => handleSubmit(e)}>
          <FormGroup className="d-flex flex-col align-items-center justify-center">
            <div style={{ width: '75%' }}>
              <Label for="exampleEmail" className="w-25">
                Email
              </Label>
              <InputGroup>
                <Input
                  id="exampleEmail"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setHiddenTooltip(true)}
                  invalid={emailStatus === 'unavailable' ? true : false}
                  valid={emailStatus === 'available' ? true : false}
                />
                <FormFeedback
                  tooltip
                  hidden={hiddenTooltip}
                  style={{ fontSize: '0.8em', borderRadius: '0.5em', opacity: 0.7 }}>
                  Email does not exist
                </FormFeedback>
                <FormFeedback tooltip valid hidden>
                  Email is available
                </FormFeedback>
              </InputGroup>
            </div>
          </FormGroup>
          <FormGroup className="d-flex flex-col align-items-center justify-center">
            <div style={{ width: '75%' }}>
              <Label for="examplePassword" className="w-25 text-left">
                Password
              </Label>
              <InputGroup>
                <Input
                  id="examplePassword"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  className="w-100"
                  value={password}
                  onChange={(e) => {
                    handlePasswordChange(e);
                  }}
                  onBlur={() => {
                    setHiddenTooltip(true);
                  }}
                  invalid={passwordStatus === 'invalid' ? true : false}
                  valid={passwordStatus === 'valid' ? true : false}
                />
                <FormFeedback
                  tooltip
                  style={{ fontSize: '0.8em', borderRadius: '0.5em', opacity: 0.7 }}>
                  Wrong Password
                </FormFeedback>
                <FormFeedback tooltip valid hidden>
                  Valid
                </FormFeedback>
              </InputGroup>
            </div>
          </FormGroup>
          <div className="text-center">
            <Button className="w-50  mt-5" color="primary">
              Login
            </Button>
            <div style={{ margin: '1em 0' }}>
              <p
                style={{ fontSize: '1.1em', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate('/register')}>
                Register
              </p>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default LoginPage;
