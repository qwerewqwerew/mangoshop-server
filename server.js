const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;
const multer = require("multer");
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "uploads");
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		},
	}),
});

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.get("/products", (req, res) => {
	models.Product.findAll({
		order: [["createdAt", "DESC"]],
		attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt"],
	})
		.then((result) => {
			console.log("PRODUCTS : ", result);
			res.send({
				products: result,
			});
		})
		.catch((error) => {
			console.error(error);
			/* res.send("에러 발생"); */
			res.status(400).send("에러 발생");
		});
});

app.post("/products", (req, res) => {
	const body = req.body;
	const { name, description, price, seller ,imageUrl} = body;
	if (!name || !description || !price || !seller|| !imageUrl) {
		res.send("모든 필드를 입력해주세요");
	}
	models.Product.create({
		name,
		description,
		price,
		seller,
		imageUrl
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

app.post("/image", upload.single("image"), (req, res) => {
	const file = req.file;
	console.log(file);
	res.send({
		imageUrl: file.path,
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
			process.exit();
		});
});
