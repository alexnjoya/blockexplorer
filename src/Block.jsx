import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Collapsible from "react-collapsible";
import { camelCaseToTitle } from "./utils";
import Container from "react-bootstrap/Container";
import TextTruncate from "react-text-truncate";

// How to make a colum responsive bootstrap?
function Block({ block, header = {} }) {
  function renderHeader() {
    return (
      <Container fluid>
        <Row>
          {Object.entries(header).map(([key, value]) => {
            return (
              <Col sm="12" md="6" lg="6" xl="6">
                <Row>
                  <Col sm="3" md="3" lg="3" xl="3">{camelCaseToTitle(key)}:</Col>
                  <Col sm="9" md="9" lg="9" xl="9">
                    <TextTruncate text={"" + value} />
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
  function renderBlock() {
    const entries = Object.entries(block);
    return entries.map(([key, value]) => {
      return (
        <Row>
          <Col sm="6" md="4" lg="4" xl="4" key={key}>
            <p>{camelCaseToTitle(key)}:</p>
          </Col>
          <Col sm="6" md="8" lg="4" xl="8" key={key}>
            <TextTruncate text={"" + value} />
          </Col>
        </Row>
      );
    });
  }
  function renderTransactions() {
    return (
      <Collapsible trigger={<h5>Transactions</h5>}>
        {block.transactions.map((tx) => (
          <Block key={tx.hash} block={tx} />
        ))}
      </Collapsible>
    );
  }
  return (
    <Container className="border block" style={{ padding: 20 }}>
      <Collapsible trigger={renderHeader(block)}>
        <hr />
        <Container fluid>{renderBlock()}</Container>
        {block.transactions ? <hr /> : null}
        {block.transactions ? renderTransactions() : null}
      </Collapsible>
    </Container>
  );
}

export default Block;
