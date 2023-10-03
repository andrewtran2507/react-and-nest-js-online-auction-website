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
import { login, register } from 'slice/user/action';
import { UserRegister } from 'slice/user/types';
import { AppDispatch } from 'state/store';
import { emailFormat } from '../../utils/uString';

const Register = () => {
  const navigate = useNavigate();
  const [rSelected, setRSelected] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [isGetCurrentData, setIsGetCurrentData] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [passwordStatus, setPasswordStatus] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [hiddenTooltip, setHiddenTooltip] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    //min 8 characters, at least 1 number, 1 letter, 1 uppercase, 1 special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(value)) {
      setPasswordStatus('invalid');
    } else {
      setPasswordStatus('valid');
    }
  };

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
  };
  //email input status
  useEffect(() => {
    // const regex = /\S+@\S+\.\S+/
    const regex = emailFormat;
    if (regex.test(email)) {
      const delayDisplay = setTimeout(() => {
        setEmailStatus('available');
      }, 250);
      return () => clearTimeout(delayDisplay);
    } else if (email === '' || !regex.test(email)) {
      const delayDisplay = setTimeout(() => {
        setEmailStatus('');
      }, 300);
      return () => clearTimeout(delayDisplay);
    }
  }, [email]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    //check status of email and password input
    if (emailStatus === 'unavailable' || passwordStatus === 'invalid') {
      setHiddenTooltip(false);
      console.log('INPUT INVALID');
      return;
    }
    try {
      console.log('INPUT VALID');
      const payload: UserRegister = {
        email,
        password,
      };
      const res = await dispatch(register(payload));
      console.log('RESPONSE REGISTER', res);
      if (res) {
        setEmailStatus('available');
        if (res?.payload?.id) {
          const loginData = await dispatch(login(payload));
          if (localStorage.getItem('accessToken') && loginData?.payload?.token) {
            navigate('/home');
            return;
          }
        }
        return alert('Something went wrong!')
      } else {
        setEmailStatus('unavailable');
        setHiddenTooltip(false);
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  };

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
        <h1>Register</h1>
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
                  // className="w-75 ml-3"
                  className="w-100"
                  value={email}
                  onChange={(e) => {
                    handleEmailChange(e);
                    setHiddenTooltip(true);
                  }}
                  onBlur={() => {
                    setHiddenTooltip(true);
                  }}
                  invalid={emailStatus === 'unavailable' ? true : false}
                  valid={emailStatus === 'available' ? true : false}
                />
                <FormFeedback
                  tooltip
                  hidden={hiddenTooltip}
                  style={{ fontSize: '0.8em', borderRadius: '0.5em', opacity: 0.7 }}>
                  Email is already taken
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
                    setHiddenTooltip(false);
                  }}
                  onBlur={() => {
                    setHiddenTooltip(true);
                  }}
                  invalid={passwordStatus === 'invalid' ? true : false}
                  valid={passwordStatus === 'valid' ? true : false}
                />
                <FormFeedback
                  tooltip
                  hidden={hiddenTooltip}
                  style={{ fontSize: '0.8em', borderRadius: '0.5em', opacity: 0.7 }}>
                  Minimum eight characters, at least 1 capitalize, one letter, one number and one
                  special character
                </FormFeedback>
                <FormFeedback tooltip valid hidden>
                  Valid
                </FormFeedback>
              </InputGroup>
            </div>
          </FormGroup>
          <div className="text-center">
            <Button className="w-50  mt-5" color="primary">
              Register
            </Button>
            <div style={{ margin: '1em 0' }}>
              <p
                style={{ fontSize: '1.1em', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate('/login')}>
                Login
              </p>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Register;
