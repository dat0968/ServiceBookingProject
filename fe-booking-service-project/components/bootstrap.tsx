"use client";

import { Button, Card, Col, Container, Row } from "react-bootstrap";

export { Button, Card, Col, Container, Row };

// Server Component không "chấm" vào Card.Body được, nên export riêng
export const CardBody = Card.Body;
export const CardTitle = Card.Title;
export const CardText = Card.Text;