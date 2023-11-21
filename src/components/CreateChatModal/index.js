import React, { useState } from "react";
import { Button, Modal, Form } from "antd";

const CreateChatModal = ({
  isOpen,
  setIsOpen,
  emails,
  setEmails,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [newEmail, setNewEmail] = useState("");

  // const isDisabled = (i) => {
  //   return emailAmount > 1 &&
  // }

  const handleInputChange = (e) => {
    setNewEmail(e.target.value);
  }; 

  const handleAddNewContact = () => {
    if (newEmail) {
      form.resetFields();
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleOk = () => {
    if (newEmail) {
      setEmails([...emails, newEmail]);
      onSubmit([...emails, newEmail]);
    } else {
      onSubmit(emails);
    }
    setNewEmail("");
    setEmails("");
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    setNewEmail("");
    setEmails([]);
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} onOk={handleOk}>
      <button className="close-btn"></button>
      <h3> Start a new chat </h3>

      <Form form={form}>
        <div className="email-list">
          {emails && (
            <ul>
              {emails.map((email) => {
                return <li key={email}>{email}</li>;
              })}
            </ul>
          )}

          <input
            placeholder="Email do Usuário"
            onChange={handleInputChange}
            value={newEmail}
          ></input>

          <Button className="add-user" onClick={handleAddNewContact}>
            Add another
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateChatModal;
