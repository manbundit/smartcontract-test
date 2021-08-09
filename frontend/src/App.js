import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Button, Card, Container, Navbar, Col, Row, Spinner, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Web3Provider, { useWeb3Context } from './web3/Web3Provider';
import DonateModal from './components/Donate';
import WithdrawModal from './components/Withdraw';
import ToastProvider from './components/Toast';

function App() {
  const {
    contract,
    accounts,
    client: web3,
    isContractReady,
    convertToETH,
    hexToUtf8,
    utf8ToHex
  } = useWeb3Context()

  const [value, setValue] = useState('')
  const [availableBalances, setAvailableBalances] = useState(0)
  const [balancesInWallet, setBalancesInWallet] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [posts, setPosts] = useState([])

  const getTotalPosts = useCallback(async () => {
    setTotalPosts(await contract.methods.totalPosts().call())
  }, [contract])

  const availableBalancesInETH = useMemo(() => (convertToETH(availableBalances)) || '0.0', [availableBalances, convertToETH])

  const getBalances = useCallback(async () => {
    setBalancesInWallet(await web3.eth.getBalance(accounts[0]))
    setAvailableBalances(await contract.methods.balances(accounts[0]).call())
  }, [contract, accounts, web3])

  useEffect(() => {
    if(isContractReady) {
      getTotalPosts()
    }
  }, [getTotalPosts, isContractReady])

  useEffect(() => {
    if(isContractReady) {
      getBalances()
    }
  }, [getBalances, isContractReady])

  const getPosts = useCallback(async () => {
    const temp = []
    for(let i = totalPosts; i > 0; i--) {
      const post = await contract.methods.posts(i).call()
      temp.push(post)
    }
    setPosts(temp)
  }, [totalPosts, contract])

  useEffect(() => {
    getPosts()
  }, [getPosts])

  const refresh = () => {
    getPosts()
    getBalances()
    setValue('')
  }

  const createPost = async () => {
    await contract.methods.createPost(utf8ToHex(value)).send({ from: accounts[0] })
    refresh()
  }

  const initialDonateState = {
    showModal: false,
    postId: 0,
  }
  const [donateState, setDonateState] = useState(initialDonateState);
  const closeDonateModal = () => setDonateState(initialDonateState);
  const openDonateModal = (postId) => setDonateState({
    showModal: true,
    postId,
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  if(!isContractReady) return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ height: 'calc(100vh - 80px)'}}>
        <Spinner animation="grow" variant="primary" />
      </Row>
    </Container>
  )

  return (
    <div className="App">
      <Navbar bg="dark" variant="light" style={{ height: 60 }}>
        <Container className="justify-content-center" style={{ color: 'white' }}>
          <Row className="align-items-center justify-content-center" style={{ flexWrap: 'wrap', width: '100%', margin: 0 }}>
            <Col xs={6} md={8} style={{ display: 'flex' }}>
              <div style={{ marginRight: 10 }}>Account:</div>
              <div style={{ maxWidth: 'calc(100% - 100px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {accounts[0]}
              </div>
            </Col>
            <Col xs={6} md={4} style={{ display: 'flex' }}>
              <div style={{ marginRight: 10 }}>
                Balances:
              </div>
              <div style={{ maxWidth: 'calc(100% - 100px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {convertToETH(balancesInWallet)}
              </div>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column', padding: 30}} className="align-items-center">
          <div style={{ marginBottom: 12}}>
            Available To Withdraw: { availableBalancesInETH } ETH
          </div>
          <Button onClick={() => setShowWithdrawModal(true)} variant="success">Withdraw</Button>
        </div>
        <Row className="align-items-center" style={{ maxWidth: 500, margin: 'auto', marginBottom: 40}}>
          <FormControl placeholder="Type here..." style={{ maxWidth: 'calc(100% - 120px)'}} className="ml-auto" value={value} onChange={(e) => setValue(e.target.value)} />
          <Button onClick={createPost} disabled={!value} style={{ maxWidth: 120}}>Create Post</Button>
        </Row>
        {
          posts.map((post) => {
            return (
              <Card style={{ width: '100%', maxWidth: 500, margin: 'auto', marginBottom: 30 }} key={post.id}>
                <Card.Body>
                  <Card.Text>
                    {hexToUtf8(post.content)}
                  </Card.Text>
                  <div style={{ display: 'flex'}} className="align-items-center">
                    <span style={{ marginRight: 'auto'}}>
                      {convertToETH(post.donated)} ETH donated.
                    </span>
                    {
                      post.owner.toLowerCase() !== accounts[0].toLowerCase() && (
                      <Button onClick={() => openDonateModal(post.id)}>
                        Donate
                      </Button>
                      )
                    }
                  </div>
                </Card.Body>
              </Card>
            )
          })
        }
      </Container>
      <DonateModal postId={donateState.postId} show={donateState.showModal} handleClose={closeDonateModal} callback={refresh}/>
      <WithdrawModal show={showWithdrawModal} handleClose={() => setShowWithdrawModal(false)} callback={refresh} />
    </div>
  );
}

const AppWithWeb3 = () => (
  <Web3Provider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Web3Provider>
)

export default AppWithWeb3;
