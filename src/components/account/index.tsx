import { Button, Form, Input } from "antd";
import axios from "axios";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

interface ILogin {
  username: string;
  password: string;
}

interface INewAccount extends ILogin {
  confirmPassword: string;
}

const getUser = async (username: string, password: string) => {
  const response = await axios.get(`localhost:4000/users`, { params: { username, password } });
  return response.data;
}

const postUser = async (username: string, password: string) => {
  const response = await axios.post(`localhost:4000/users`, { username, password });
  return response.data;
}

const Account = () => {
  const { handleSubmit: handleLoginSubmit, control: loginControl } = useForm<ILogin>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const { handleSubmit: handleCreateSubmit, control: createControl } = useForm<INewAccount>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  });

  const handleLogin = useCallback(async (values: ILogin) => {
    const data = await getUser(values.username, values.password);
  }, []);

  const handleCreate = useCallback(async (values: ILogin) => {
    const data = await postUser(values.username, values.password);
  }, []);

  return (
    <div className="w-100 h-100 d-flex flex-column flex-md-row justify-content-around align-items-center">
      
      <div className="m-5 card">
        <div className="card-body">
          <h1>login</h1>
          <Form className="d-flex flex-column" 
              onFinish={handleLoginSubmit(handleLogin)}>

              <Form.Item label="Username">
                <Controller
                  name="username"
                  control={loginControl}
                  rules={{ required: true }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>

              <Form.Item label="Password">
                <Controller
                  name="password"
                  control={loginControl}
                  rules={{ required: true }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>

              <Form.Item className="d-flex justify-content-center">
                <Button htmlType="submit">
                  Login
                </Button>
              </Form.Item>
          </Form>
        </div>
      </div>

      <div className="m-5 card">
        <div className="card-body">
          <h1>create account</h1>
          <Form className="d-flex flex-column" 
              onFinish={handleCreateSubmit(handleCreate)}>

              <Form.Item label="Username">
                <Controller
                  name="username"
                  control={createControl}
                  rules={{ required: true }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>

              <Form.Item label="Password">
                <Controller
                  name="password"
                  control={createControl}
                  rules={{ required: true }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>

              <Form.Item label="Confirm password">
                <Controller
                  name="confirmPassword"
                  control={createControl}
                  rules={{ required: true }}
                  render={({ field }) => <Input {...field} />}
                />
              </Form.Item>

              <Form.Item className="d-flex justify-content-center">
                <Button htmlType="submit">
                  Create account
                </Button>
              </Form.Item>
          </Form>
        </div>
      </div>
      
    </div>
  );
}

export default Account;