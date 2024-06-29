import { Button, DatePicker, Input, Select, Switch, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { ChangeEvent, useCallback, useState } from "react";
import styled from "styled-components";
import { v4 as uuid4 } from 'uuid';

import DragSplitView from "../drag-split-view";
import { rgbArrToHex } from "../palette2";
import './bg-image.png';

type RGB = [number, number, number];

interface IReaction {
  value: string;
  amount: number;
}

interface IUser {
  cellphone: string;
  savedName?: string;
  originalName?: string;
  picture?: string;
  color: string;
  id: string;
}

const initialUser: IUser = {
  id: uuid4(),
  cellphone: '+5500123456789',
  color: '#000000',
}

interface IMessage {
  id: string;
  contents: string;
  reactions: IReaction[];
  timestamp: string;
  userIndex: number;
  mentionIndex?: number;
}

const initialMessage: IMessage = {
  id: uuid4(),
  contents: '',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: -1
}

const WHATSAPP_COLORS: RGB[] = [
  [37, 195, 97], // green
  [53, 152, 229], // blue
  [226, 106, 182], // pink
  [203, 144, 106], // sand
  [219, 163, 55], // beige
  [106, 129, 242] // purple
]

const User1: IUser = {
  id: uuid4(),
  cellphone: '+5521987654321',
  savedName: 'Employee',
  picture: 'https://br.web.img3.acsta.net/pictures/18/07/25/22/08/5179819.jpg',
  color: rgbArrToHex(WHATSAPP_COLORS[0])
}

const User2: IUser = {
  id: uuid4(),
  cellphone: '+5521912345678',
  originalName: 'Boss',
  picture: 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/95/02/75/20372972.jpg',
  color: rgbArrToHex(WHATSAPP_COLORS[1])
}

const Message1: IMessage = {
  id: uuid4(),
  contents: 'Boss, I lost all my files.',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 0
}

const Message2: IMessage = {
  id: uuid4(),
  contents: 'You do know what to do now, right?',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 1,
  mentionIndex: 0
}

const Message3: IMessage = {
  id: uuid4(),
  contents: 'No, what?',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 0,
  mentionIndex: 1
}

const Message4: IMessage = {
  id: uuid4(),
  contents: 'You need to start from the ground LOL',
  reactions: [],
  timestamp: new Date().toISOString(),
  userIndex: 1,
  mentionIndex: 2
}

const extraZero = (s: string) =>  `${s.length === 1 ? '0' : ''}${s}`;

type IdT<T> = T & {
  id: string;
}

function useObjList<T>(initialList: IdT<T>[]) {
  const [state, setState] = useState<IdT<T>[]>(initialList);

  const onChange = useCallback((name: keyof T, index: number) => (value: keyof T) => {
    setState((list: IdT<T>[]) => {
      // remark: list[index][name] had a TS warning
      list[index] = {
        ...list[index],
        [name]: value
      };
      return [ ...list ];
    });
  }, []);

  const handleChange = useCallback((index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof T, index)(value as keyof T);
  }, []);

  const onDelete = useCallback((index: number) => (_: any) => {
    setState((list: IdT<T>[]) => {
      return list.filter((_, i) => i !== index);
    })
  }, []);

  const onPush = useCallback((newItem: IdT<T>) => {
    setState((list: IdT<T>[]) => [
      ...list,
      { ...newItem }
    ]);
  }, []);

  return {
    editable: (name: keyof T, index: number) => {
      const value = state[index][name] as string;
      return (
        <Tooltip title={value} key={String(name)}>
          <Input
            name={name as string}
            onChange={handleChange(index)}
            value={value}
          />
        </Tooltip>
      )
    },
    viewable: state,
    onChange,
    removable: (index: number) => (
        <Button onClick={onDelete(index)} danger>
          delete
        </Button>
    ),
    onPush
  }
}

// const careful = parseInt(process.env.REACT_APP_CAREFUL || '0') === 1;
const careful = false;

const FakeWhatsapp = () => {
  const [myUser, setMyUser] = useState<number>(1);
  const [warning, setWarning] = useState<boolean>(careful);

  const {
    editable: InputUser,
    viewable: users,
    onChange: onChangeUser,
    removable: RemovableUser,
    onPush:   onPushUser
  } = useObjList<IUser>([User1, User2]);
  
  const {
    editable: InputMessage,
    viewable: messages,
    onChange: onChangeMessage,
    removable: RemovableMessage,
    onPush:   onPushMessage
  } = useObjList<IMessage>([Message1, Message2, Message3, Message4]);

  const onChangeUserColor        = (index: number) => onChangeUser('color', index);
  const onChangeMessageTimestamp = (index: number) => onChangeMessage('timestamp', index);
  const onChangeMessageUserIndex = (index: number) => onChangeMessage('userIndex', index);
  const onChangeMessageMention   = (index: number) => onChangeMessage('mentionIndex', index);

  const UserSelect = useCallback((messageIndex: number) => {
    return (
      <MinWidthSelect<any> allowClear
        onChange={onChangeMessageUserIndex(messageIndex)}
        defaultValue={messages[messageIndex].userIndex}>
        {users.map((user, userIndex) => {
          return (
            <Select.Option key={userIndex} value={userIndex}>
              <span style={{ color: user.color }}>
                {user.savedName || user.originalName || user.cellphone}
              </span>
            </Select.Option>
          )
        })}
      </MinWidthSelect>
    );
  }, [users, messages]);

  const MessageMentionSelect = useCallback((messageIndex: number) => {
    return ( 
      <MinWidthSelect<any> className="message-mention" allowClear
        onChange={onChangeMessageMention(messageIndex)}
        defaultValue={messages[messageIndex].mentionIndex}>
        {messages.filter((_, _index) => _index < messageIndex).map((message, index) => {
          return (
            <Select.Option key={index} value={index}>
              {message.contents}
            </Select.Option>
          )
        })}
      </MinWidthSelect>
    );
  }, [messages]);

  const messagesJSX = messages.filter(m => m.userIndex !== -1).map((message, messageIndex) => {
    const user = message.userIndex < users.length ? users[message.userIndex] : null;

    if (user === null) {
      return <></>;
    }
    
    const messageMentioned = message.mentionIndex === undefined ? undefined : messages[message.mentionIndex] ;
    const userMentioned = messageMentioned && messageMentioned.userIndex < users.length && users[messageMentioned.userIndex];
    const isMe = message.userIndex === myUser;
    const previousMessage = messageIndex > 0 ? messages[messageIndex-1] : null;
    const moreMarginTop = previousMessage && previousMessage.userIndex !== message.userIndex;

    return (
      <MessageContainer key={messageIndex} me={isMe} className={`mx-5 mt-${moreMarginTop ? 3 : 1} py-1 px-2 d-flex flex-column`}>
        <MessageUsername color={user.color}>
          <span className="primary">
            {user.savedName || user.cellphone}
          </span>
          {!user.savedName && (
            <span className="ms-1 secondary">
              ~{user.originalName}
            </span>
          )}
        </MessageUsername>
        <MessageBody className="">
          {message.mentionIndex !== undefined && userMentioned && (
            <MessageMention me={isMe} color={userMentioned?.color} className="my-1 px-2 py-1">
              <MessageUsername color={userMentioned?.color}>
                <span className="primary">
                  {userMentioned.savedName || userMentioned.cellphone}
                </span>
                {!userMentioned.savedName && (
                  <span className="ms-1 secondary">
                    ~{userMentioned.originalName}
                  </span>
                )}
              </MessageUsername>
              {messageMentioned && messageMentioned.contents}
            </MessageMention>
          )}
          {message.contents}
        </MessageBody>
        <MessageTimestamp>
          {extraZero(String(new Date(message.timestamp).getHours()))}
          :
          {extraZero(String(new Date(message.timestamp).getMinutes()))}
        </MessageTimestamp>
      </MessageContainer>
    )
  });

  const handleNewUser = useCallback(() => {
    onPushUser(initialUser);
  }, []);

  const handleNewMessage = useCallback(() => {
    onPushMessage(initialMessage);
  }, []);

  const handleSetWarning = useCallback((value: boolean) => {
    if (careful) {
      return;
    } else {
      setWarning(value);
    }
  }, []);
  
  return (
    <div className="h-100 d-flex">
      {/* to-do: splitted view with drag cursor */}
      <DragSplitView parts={[
        <Edition className="w-100 h-100 p-5" key="edition">
          
          <label>
            Set fake news warning
            <Switch className="ms-2" checked={warning} onChange={handleSetWarning} />
          </label>
          <h1>Users</h1>
          <Table<IUser> dataSource={users} pagination={false} key="messages"
            rowKey="id"
            columns={[
              {
                dataIndex: 'cellphone',
                title: 'Cellphone',
                render: (_, __, index) => InputUser('cellphone', index)
              },
              {
                dataIndex: 'savedName',
                title: 'Saved Name',
                render: (_, __, index) => InputUser('savedName', index)
              },
              {
                dataIndex: 'originalName',
                title: 'Original name',
                render: (_, __, index) => InputUser('originalName', index)
              },
              {
                dataIndex: 'color',
                title: 'Color',
                render: (value, _, index) => (
                  <MinWidthSelect<any> onChange={onChangeUserColor(index)} defaultValue={value} key={index}>
                    {WHATSAPP_COLORS.map(color => {
                      const rgb = rgbArrToHex(color);
                      return (
                        <Select.Option key={rgb} value={rgb}>
                          <span style={{ color: rgb }}>{rgb}</span>
                        </Select.Option>
                      )
                    })}
                  </MinWidthSelect>
                )
              },
              {
                dataIndex: "actions",
                title: 'Actions',
                render: (_, __, index) => RemovableUser(index)
              }
            ]}
          />
          <Button className="mt-2" onClick={handleNewUser}>New user</Button>

          <h1 className="mt-5">Messages</h1>
          <Table<IMessage> dataSource={messages} pagination={false} key="users"
            rowKey="id"
            columns={[
              {
                dataIndex: "author",
                title: 'Author',
                render: (_, __, index) => UserSelect(index)
              },
              {
                dataIndex: 'timestamp',
                title: 'Timestamp',
                render: (value, _, index) => (
                  <DatePicker value={dayjs(value)} format="YYYY-MM-DD HH:mm" showTime={true}
                    onChange={onChangeMessageTimestamp(index) as any} allowClear={false}/>
                )
              },
              {
                dataIndex: "contents",
                title: 'Contents',
                render: (_, __, index) => InputMessage('contents', index)
              },
              {
                dataIndex: "mentions",
                title: 'Message mentioned',
                render: (_, __, index) => MessageMentionSelect(index)
              },
              {
                dataIndex: "actions",
                title: 'Actions',
                render: (_, __, index) => RemovableMessage(index)
              }
            ]}
          />
          <Button className="mt-2" onClick={handleNewMessage}>New message</Button>

        </Edition>,
        <Main className="w-100 h-100 d-flex flex-column" key="mes">
          <BackgroundImage className="w-100 h-100" />
          {messagesJSX}
          {warning && (
            <>
              <WarningBackground className="w-100 h-100" />
              <WarningText className="w-100 h-100 d-flex justify-content-center align-items-center">
                FAKE NEWS
              </WarningText>
            </>
          )}
        </Main>
      ]} />
    </div>
  );
}

const WarningBackground = styled.div`
  position: absolute;
  background: red;
  opacity: 0.1;
`;

const WarningText = styled.div`
  max-width: 200px;
  max-height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  font-size: 100px;
  transform: rotate(45deg);
  z-index: 1;
`

const Edition = styled.div`
  background: #005C4B;
  color: white;
  overflow-y: auto;

  &, h1 {
    color: white;
  }

  td, th {
    max-width: 180px;
    border: 1px solid gray;
    padding: 5px;
    input {
      max-width: 100%;
      color: black; 
    }
    &.short-input input {
      max-width: 30px;
      text-align: center;
    }
    &.datetime-input input {
      min-width: 120px;
    }
  }

  .message-mention {
    width: 100px;
  }
`;

const Main = styled.div`
  position: relative;
  background: #0B141A;
`;

const BackgroundImage = styled.div`
  position: absolute;
  background-image: url("/static/media/bg-image.39f53e74f66d348d9f7c.png");
  opacity: 0.06;
`;

const MessageContainer = styled.div<{
  me: boolean
}>`
  min-width: 200px;
  max-width: 50%;
  margin-${({ me }) => me ? 'left': 'right'}: auto !important;
  background: ${({ me }) => me ? '#005C4B' : '#202C33'};
  border-radius: 5px;
  z-index: 0;
`

const MessageUsername = styled.div<{
  color: string;
}>`
  &:hover {
    cursor: pointer;
  }

  .primary {
    color: ${({ color }) => color};
  }

  .primary:hover,
  .secondary:hover {
    text-decoration: underline;
    &.primary {
      text-decoration-color: ${({ color }) => color};
    }
    &.secondary {
      text-decoration-color: #757F84;
    }
  }

  .secondary {
    color: #757F84;
  }
`;

const MessageBody = styled.div<{

}>`
  color: white;
`

const MessageMention = styled.div<{
  color: string;
  me: boolean;
}>`
  background: ${({ me }) => me ? '#025144' : '#1D282F'};
  border-radius: 5px;
  border-left: 4px solid ${({ color }) => color};
  color: #A5A9AC;
  margin-left: -5px;
`;

// to-do: timestamp with negative margin and element above with almost-zero margin-right

const MessageTimestamp = styled.div`
  font-size: 12px;
  color: #90959A;
  text-align: right;
`;

const MinWidthSelect = styled(Select)`
  min-width: 80px;
  .ant-select-item-option-content {
    text-align: center !important;
  }
`

export default FakeWhatsapp;