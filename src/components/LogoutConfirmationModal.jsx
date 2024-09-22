/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useState, useEffect } from "react";

export default function AlertDialogModal({
  logoutUser,
  logoutModelOpen,
  handleLogoutModelClose,
}) {
  const [open, setOpen] = useState(false);

  // Synchronize `open` state with `logoutModelOpen` prop
  useEffect(() => {
    if (logoutModelOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [logoutModelOpen]);

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClick={() => {
          setOpen(false);
          handleLogoutModelClose();
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>Are you sure want to Logout ?</DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={logoutUser}>
              Logout
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                setOpen(false);
                handleLogoutModelClose();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
