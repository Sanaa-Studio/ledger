import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  useState,
  type SubmitEvent,
  type SetStateAction,
  type Dispatch,
} from "react";
import {
  CreateAccountSchema,
  AccountSchema,
  type Account,
  AccountType,
} from "@ledger/contracts";
import axios from "axios";
import { env } from "../../config/env";
import { ZodError } from "zod";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 300,
  bgcolor: "purple",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 8,
  p: 4,
};

type AccountTypeValue = (typeof AccountType)[keyof typeof AccountType];

type AccountCreateFormProps = {
  setAccounts: Dispatch<SetStateAction<Account[]>>;
};

const AccountCreateForm = ({ setAccounts }: AccountCreateFormProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const accountTypes = Object.values(AccountType) as AccountTypeValue[];

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError(null);

      const formData = new FormData(e.currentTarget);

      const query = {
        name: formData.get("accountName"),
        openingBalance: Number(formData.get("openingBalance")),
        type: formData.get("accountType"),
      };

      const createAccountQuery = CreateAccountSchema.parse(query);

      const resposne = await axios.post(env.accountsUrl, createAccountQuery);

      const parsedResponse = AccountSchema.parse(resposne.data.data);

      setAccounts((currentAccounts) => [...currentAccounts, parsedResponse]);

      handleClose();
      setSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            error.message ??
            "Failed to create account",
        );
      } else if (error instanceof ZodError) {
        console.error(error.issues);
        setError("Account data is invalid");
      } else {
        setError("Unexpected error while creating account");
      }
    }
  };

  return (
    <>
      <div>
        <Button onClick={handleOpen}>Create Account</Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="create account modal"
          aria-describedby="modal to create an account"
        >
          <Box sx={style}>
            <Typography id="create-account-title" variant="h6" component="h2">
              Create an Account
            </Typography>

            <br></br>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="accountName"
                placeholder="Account name"
                required
              />

              <br></br>
              <br></br>

              <input
                type="text"
                step="0.01"
                name="openingBalance"
                placeholder="Opening balance"
                required
              />

              <br></br>
              <br></br>

              <label htmlFor="accountType">Account type</label>

              <select id="accountType" name="accountType" required>
                {accountTypes.map((accountType) => (
                  <option key={accountType} value={accountType}>
                    {accountType}
                  </option>
                ))}
              </select>

              <br></br>
              <br></br>

              <Button type="submit">Create</Button>

              {error && <p>{error}</p>}
            </form>
          </Box>
        </Modal>
      </div>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Account created successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default AccountCreateForm;
