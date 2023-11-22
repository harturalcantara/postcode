import React, { useState } from "react";
import { Modal, Form } from "antd";
import "./styles.css";

const CreateChatModal = ({
  isOpen,
  setIsOpen,
  emails,
  setEmails,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [newEmail, setNewEmail] = useState("");

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
        <div className="email-list m-t-16">
          {emails && (
            <ul>
              {emails.map((email) => {
                return (
                  <li key={email}>
                    {" "}
                    <h5>{email}</h5>{" "}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="wrap-input100 validate-input m-t-27">
          <input
            className="input100"
            onChange={handleInputChange}
            value={newEmail}
            placeholder="Write the e-mail to start chat..."
          />
          <span className="focus-input100"></span>
        </div>

        <div className="container-login100-form-btn m-t-17 p-l-80 p-r-80">
          <button className="login100-form-btn" onClick={handleAddNewContact}>
            {" "}
            Add user{" "}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateChatModal;
