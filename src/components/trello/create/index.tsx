import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";

const Create = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div>
      <Button onClick={_ => setOpenModal(true)}>Create</Button>
      <Modal open={openModal} onCancel={_ => setOpenModal(false)} title="Criar board">
        <Form>
          <Form.Item label="Nome do board">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Create;