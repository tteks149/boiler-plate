import React, { useState, useEffect } from "react";
import { Typography, Button, Form, message, Input } from "antd";
import Axios from "axios";

const { TextArea } = Input;
const { Title } = Typography;
function MedalUpdatePage(props) {
  const medalId = props.match.params.medalId;
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState("");
  const [MedalDetail, setMedalDetail] = useState([]);

  const onNameChange = (e) => {
    setName(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };
  const onPriceChange = (e) => {
    setPrice(e.currentTarget.value);
  };
  useEffect(() => {
    const variable = {
      medalId: medalId,
    };
    Axios.post("/api/medals/getMedalDetail", variable).then((response) => {
      if (response.data.success) {
        setMedalDetail(response.data.medalDetail);
      } else {
        alert("칭호 정보 가져오기 실패");
      }
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const variables = {
      medalId: MedalDetail._id,
      medalName: Name,
      medalPrice: Price,
      medalDescription: Description,
    };
    if(variables.medalName==="")
      variables.medalName=MedalDetail.name
    if(variables.medalPrice==="")
      variables.medalPrice=MedalDetail.price
    if(variables.medalDescription==="")
      variables.medalDescription=MedalDetail.description
    Axios.post("/api/medals/updateMedal", variables).then((response) => {
      if (response.data.success) {
        message.success("칭호 수정 성공!");

        setTimeout(() => {
          props.history.push("/medal");
        }, 1000);
      } else {
        alert(" 칭호 수정 실패");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>칭호 수정</Title>
      </div>

      <Form>
        <label>칭호</label>
        <Input value={MedalDetail.medalTitle} readOnly={true} />
        <br />
        <br />
        <label>칭호이름</label>
        <Input
          onChange={onNameChange}
          value={Name}
          
          placeholder={MedalDetail.name}
        />
        <br />
        <br />
        <label>가격</label>
        <Input
          onChange={onPriceChange}
          value={Price}
          placeholder={MedalDetail.price}
        />
        <br />
        <br />
        <label>칭호설명</label>
        <TextArea
          onChange={onDescriptionChange}
          value={Description}
          placeholder={MedalDetail.description}
        />
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          저장하기
        </Button>
      </Form>
    </div>
  );
}
export default MedalUpdatePage;