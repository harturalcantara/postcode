import React, { useState } from "react";
import { Modal, Form } from "antd";

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
      <h3> Start a new chat </h3>
      <hr></hr>
      <h5> User list to star a talk: </h5>
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

        <div className="wrap-input100 validate-input m-t-27" style={{ display: "flex" }}>
          <input
            className="input100"
            onChange={handleInputChange}
            value={newEmail}
            placeholder="Write the e-mail to start chat..."
          />
          <span className="focus-input100"></span>
          <button style={{ width: "100px" }} className="login100-form-btn" onClick={handleAddNewContact}>
            Add
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateChatModal;
