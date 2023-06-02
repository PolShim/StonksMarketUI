import { Col, Container, Row } from "react-bootstrap";
import { Person } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import "./MainHeader.scss";

export function MainHeader() {
  const navigate = useNavigate();
  return (
    <Row className="mainHeader__headerRow align-items-center">
      <Col className="mt-3 mb-3 ms-5">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <h3 className="text-white">Strona Główna</h3>
        </Link>
      </Col>
      <Col className="mt-3 mb-3 me-5 justify-content-end d-flex">
        <Link
          to={"/userDetail"}
          style={{
            textDecoration: "none",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Person sx={{ fontSize: 55, color: "white" }} />
          <h3 className="text-white">Twój profil</h3>
        </Link>
      </Col>
    </Row>
  );
}
