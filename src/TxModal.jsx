import Modal from "react-modal";
import { useState } from "react";
import Block from "./Block";
import Container from "react-bootstrap/Container";

export default function TxModal({ alchemy }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [transactions, setTransactions] = useState("[]");

  const handleChange = (event) => {
    const input = event.target.value;
    setWalletAddress(input);
    setIsValid(/^0x[a-fA-F0-9]{40}$/.test(input));
    setIsEmpty(input.length === 0);
  };

  async function showTransactionsFromWallet() {
    const latestTransactions = await alchemy.core.getAssetTransfers({
      fromAddress: walletAddress,
      excludeZeroValue: true,
      maxCount: "0xA",
      category: [
        "external",
        "internal",
        "erc20",
        "erc721",
        "erc1155",
        "specialnft",
      ],
    });
    // Select values
    const transactions = latestTransactions.transfers.map((tx) => {
      return {
        txnHash: tx.hash,
        block: tx.blockNum,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        asset: tx.asset,
      };
    });
    openModal();

    setTransactions(JSON.stringify(transactions));
  }

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a wallet address"
          value={walletAddress}
          onChange={handleChange}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            hidden={showModal}
            type="button"
            onClick={showTransactionsFromWallet}
            disabled={isEmpty || !isValid}
          >
            <i className="fas fa-search"></i>
            Search
          </button>
        </div>
      </div>
      {!isValid && <span className="text-danger">Invalid Wallet address</span>}

      <Modal className='tx-modal' isOpen={showModal} onRequestClose={closeModal}>
        <div className="modal-footer">
          <button type="button" className="btn" onClick={closeModal}>
            X
          </button>
        </div>

        <div className="modal-body">
          <h3 className="text-center">Wallet Address:</h3>
          <h5 className="text-center">{walletAddress}</h5>
         
          <br />
          <div>
            {transactions === "[]" ? (
              <p className="text-center h5">
                There are no transactions for this wallet :(
              </p>
            ) : (
              <Container className='block-container'>
                <h3 className='px-2 pb-1'>Latest Transactions</h3>

                {JSON.parse(transactions).map((tx) => (
                  <Block
                    key={tx.blockNum}
                    block={tx}
                    header={{ block: tx.block }}
                  />
                ))}
              </Container>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
