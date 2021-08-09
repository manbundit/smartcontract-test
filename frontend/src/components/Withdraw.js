import { useState, useEffect } from 'react';
import { useWeb3Context } from '../web3/Web3Provider';
import { Modal, FormControl, Button } from 'react-bootstrap'
import { useToastContext } from './Toast';

export default function WithdrawModal({
  show,
  handleClose,
  callback = () => {}
}) {
  const [value, setValue] = useState(0)
  const { contract, accounts, client: web3 } = useWeb3Context()
  const { setShow: setShowToast } = useToastContext()
  const confirmWithdraw = async () => {
    try {
      await contract.methods.withdraw(web3.utils.toWei(value.toString(), "ether")).send({from: accounts[0] })
      callback()
    } catch(_) {
      setShowToast(true)
    } finally {
      handleClose(true)
    }
  }
  useEffect(() => {
    if(!show) setValue(0)
  }, [show])
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl onChange={(e) => setValue(e.target.value)} type="number" placeholder="Enter Amount in ETH" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" disabled={!value} onClick={confirmWithdraw}>
            Withdraw
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}