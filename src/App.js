import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import Block from './Block';
import './App.css';
import { formatObject, fromStorage, range } from './utils';
import Container from 'react-bootstrap/esm/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TxModal from './TxModal';
// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);
function App() {
  const [currentBlockNumber, setCurrentBlockNumber] = useState();
  const [latestsBlocks, setLatestsBlocks] = useState("[]");
  const [latestsTransactions, setLatestsTransactions] = useState("[]");

  useEffect(() => {
    async function getBlock1(blockNumber) {
      return formatObject(await alchemy.core.getBlockWithTransactions(blockNumber), { transactions: false });
    }
    async function getLatestsBlocks() {
      setCurrentBlockNumber(await alchemy.core.getBlockNumber());
      const currentBlock = await formatObject(await alchemy.core.getBlockWithTransactions(currentBlockNumber));
      setLatestsTransactions(JSON.stringify(currentBlock.transactions.slice(-5)))
      const blocks = await Promise.all(range(currentBlockNumber - 1, currentBlockNumber - 4).map(getBlock1));
      delete currentBlock.transactions;
      blocks.unshift(currentBlock);
      setLatestsBlocks(JSON.stringify(blocks));
    }
    getLatestsBlocks()

  });


  return <div>
    <Container fluid style={{ padding: 50 }} className="app">
      <h1 className='display-3 text-center'>Ethereum Block Explorer</h1>
      <br />

      <TxModal alchemy={alchemy} ></TxModal>

      <Row xs="1" lg="2">
        <Col>
          <Container className='block-container'>
            <h3 className='px-2 pb-1'> Latest Blocks</h3>
            {fromStorage(latestsBlocks).map(block => 
              <Block 
                key={block.hash}
                block={block}
                header={{block: block.number, miner:block.miner}}
                 />)}
          </Container>
        </Col>
        <Col>
          <Container className='block-container'>
            <h3 className='px-2 pb-1'>Latest Transactions</h3>
            {fromStorage(latestsTransactions).map(block =>
              <Block
                key={block.hash}
                block={block} 
                header={{from: block.from, to: block.to}}
                />
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  </div>
}

export default App;
