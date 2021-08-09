import { useState } from 'react';
import { useWeb3Context } from '../web3/Web3Provider';
import { Modal, FormControl, Button } from 'react-bootstrap'
import { useToastContext } from './Toast';
import { useEffect } from 'react/cjs/react.development';

export default function DonateModal({
  show,
  postId,
  handleClose,
  callback = () => {}
}) {
  const [value, setValue] = useState(0)
  const { setShow: setShowToast } = useToastContext()
  const { contract, accounts, client: web3 } = useWeb3Context()
  const confirmDonate = async () => {
    try {
      await contract.methods.donate(postId).send({from: accounts[0], value: web3.utils.toWei(value.toString(), "ether")})
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
          <Modal.Title>Donate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl onChange={(e) => setValue(e.target.value)} type="number" placeholder="Enter Amount in ETH" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!value} onClick={confirmDonate}>
            Donate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}