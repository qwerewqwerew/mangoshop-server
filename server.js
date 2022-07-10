const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;

app.use(express.json()); //json 형식의 데이터를 처리할 수 있게 설정하는 코드
app.use(cors()); //브라우저의 CORS 이슈를 막기 위해 사용하는 코드

app.get("/products", (req, res) => {
	models.Product.findAll({
		order: [["createdAt", "DESC"]],
		attributes: ["id", "name", "price", "seller","imageUrl", "createdAt" ],
	})
		.then((result) => {
			console.log("PRODUCTS : ", result);
			res.send({
				products: result,
			});
		})
		.catch((error) => {
			console.error(error);
			res.send("에러 발생");
		});
});

app.post("/products", (req, res) => {
	const body = req.body;
	const { name, description, price, seller } = body;
	if (!name || !description || !price || !seller) {
		res.send("모든 필드를 입력해주세요");
	}
	models.Product.create({
		name,
		description,
		price,
		seller,
	})
		.then((result) => {
			console.log("상품생성결과:", result);
			res.send({ result });
		})
		.catch((error) => {
			console.error(error);
			res.send("상품 업로드에 문제가 발생했습니다.");
		});
});

app.get("/products/:id", (req, res) => {
	const params = req.params;
	const { id } = params;
	models.Product.findOne({
		where: {
			id: id,
		},
	})
		.then((result) => {
			return res.send({ product: result });
		})
		.catch((error) => {
			console.error(error);
			res.send("상품조회시 에러가 발생했습니다.");
		});
});

app.listen(port, () => {
	console.log("망고샵의 서버가 구동중 입니다.");
	models.sequelize
		.sync()
		.then(() => {
			console.log("✓ DB 연결 성공");
		})
		.catch(function (err) {
			console.error(err);
			console.log("✗ DB 연결 에러");
			//에러발생시 서버프로세스 종료
			process.exit();
		});
});
