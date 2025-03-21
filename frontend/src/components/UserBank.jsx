import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Box } from "@mui/system";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch} from "@mui/material";
import toast from "react-hot-toast";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const UserBank = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:3000/account_details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBanks(response.data.accounts);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (accountId, currentStatus) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(`http://localhost:3000/account/${accountId}/toggle-status`,
        { status: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBanks(prevBanks =>
          prevBanks.map(bank =>
            bank._id === accountId ? { ...bank, status: !currentStatus } : bank
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Box className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <Box className="w-full max-w-4xl flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-semibold">Your Bank Accounts</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Account
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} className="shadow-lg rounded-lg w-full max-w-4xl">
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell className="font-semibold">Bank Name</TableCell>
                <TableCell className="font-semibold">Account Number</TableCell>
                <TableCell className="font-semibold">IFSC Code</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banks.length > 0 ? (
                banks.map((bank) => (
                  <TableRow key={bank._id} className="hover:bg-gray-100">
                    <TableCell>{bank.bankName}</TableCell>
                    <TableCell>{bank.accountNumber}</TableCell>
                    <TableCell>{bank.ifscCode}</TableCell>
                    <TableCell>
                      <Switch
                        checked={bank.status}
                        onChange={() => toggleStatus(bank._id, bank.status)}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No accounts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Account Dialog */}
      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  fullWidth
  maxWidth="md"
  PaperProps={{
    style: { boxShadow: "none", background: "transparent", overflow: "hidden" },
  }}
>
  {/* Add Component without Margins */}
  <Box className="p-0">
    <Add />
  </Box>

  {/* DialogActions for Close Button */}
  <DialogActions className="flex justify-end p-2">
    <Button
      onClick={() => setOpen(false)}
      className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
};

export default UserBank;


const Add=()=>{
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    balance: "",
    accountType: "",
    ifscCode: "",
    status: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:3000/user/add_account", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccess("Account added successfully!");
        toast.success(response.data.message);
        setFormData({
          bankName: "",
          accountNumber: "",
          accountHolder: "",
          accountBalance: "",
          accountType: "",
          ifscCode: "",
          status: false,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={3} className="w-full max-w-md p-6 rounded-lg">
        <Typography variant="h5" className="text-center font-semibold mb-4">
          Add New Bank Account
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Bank Name" name="bankName" fullWidth required value={formData.bankName} onChange={handleChange} />
          <TextField label="Account Number" name="accountNumber" fullWidth required value={formData.accountNumber} onChange={handleChange} />
          <TextField label="Account Holder" name="accountHolder" fullWidth required value={formData.accountHolder} onChange={handleChange} />
          <TextField label="Account Balance" name="balance" type="number" fullWidth required value={formData.balance} onChange={handleChange} />
          
          <FormControl fullWidth required>
            <InputLabel>Account Type</InputLabel>
            <Select name="accountType" value={formData.accountType} onChange={handleChange}>
              <MenuItem value="current">Current</MenuItem>
              <MenuItem value="saving">Saving</MenuItem>
            </Select>
          </FormControl>
          
          <TextField label="IFSC Code" name="ifscCode" fullWidth required value={formData.ifscCode} onChange={handleChange} />
          
          <div className="flex items-center">
            <input type="checkbox" name="status" id="status" checked={formData.status} onChange={handleChange} className="mr-2" />
            <label htmlFor="status">Set as Primary Account</label>
          </div>
          
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} className="mt-2">
            {loading ? <CircularProgress size={24} color="inherit" /> : "Add Account"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
