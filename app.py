import mysql.connector
import math
import jwt
import time
import requests
import json
import datetime
from datetime import datetime
from flask import Flask
from flask import request
from flask import render_template
from flask import redirect
from flask import url_for
from flask import session
from flask import jsonify
from flask import make_response
from functools import wraps

app=Flask(
    __name__,
    static_folder = "public",
    static_url_path = "/"
)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SECRET_KEY"] = "mob 100 is GOD."
app.secret_key = "Gundam 00 is the best!!"

# link to the database
dbconfig = {
	"host":"0.0.0.0",
    "user":"root",
    "password":"zxcvbnmM12*",
    "database":"taipei_day_trip",
}

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# 取得景點資料: 算出總頁數 / 每頁12筆
@app.route("/api/attractions")
def get_attractions():
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)
	
	try:
		page = request.args.get("page", type=int)
		keyword = request.args.get("keyword", type=str)
		per_page = 12

		if (keyword == None) or (keyword == ""):
			# total pages without filter
			search_no_filter = "SELECT COUNT(*) FROM attractions"
			mycursor.execute(search_no_filter)
			total_rows_no_filter = mycursor.fetchone()
			total_page_no_filter = math.ceil(total_rows_no_filter[0] / per_page)
		else:
			# total pages with filter
			search_yes_filter = "SELECT COUNT(*) FROM attractions WHERE category = %s OR name LIKE %s"
			search_val = (keyword, "%"+keyword+"%")
			mycursor.execute(search_yes_filter, search_val)
			total_rows_yes_filter = mycursor.fetchone()
			total_page_yes_filter = math.ceil(total_rows_yes_filter[0] / per_page)

		if (keyword == None) or (keyword == ""):
			# fetch data without filter
			search_query = "SELECT * FROM attractions LIMIT %s, %s"
			row_start = page * per_page
			search_page = (row_start, per_page)
			mycursor.execute(search_query, search_page)
			datalist = mycursor.fetchall()
		else:
			# fetch data with filter
			search_query = "SELECT * FROM attractions WHERE category = %s OR name LIKE %s LIMIT %s, %s"
			row_start = page * per_page
			search_page = (keyword, "%"+keyword+"%", row_start, per_page)
			mycursor.execute(search_query, search_page)
			datalist = mycursor.fetchall()

		data = []
		for result in datalist:
			data.append({
				"id": result[0],
				"name": result[1],
				"category": result[2],
				"description": result[3],
				"address": result[4],
				"transport": result[5],
				"mrt": result[6],
				"lat": str(result[7]),
				"lng": str(result[8]),
				"images": result[9].split(",")
			})

		if (keyword == None or keyword == "") and page+1 < total_page_no_filter:
			response = {
				"nextPage": int(page+1),
				"data": data
			}
			return jsonify(response)
		elif (keyword == None or keyword == "") and page+1 == total_page_no_filter:
			response = {
				"nextPage": None,
				"data": data
			}
			return jsonify(response)
		elif (keyword != None or keyword != "") and page+1 < total_page_yes_filter:
			response = {
				"nextPage": int(page+1),
				"data": data
			}
			return jsonify(response)
		elif (keyword != None or keyword != "") and page+1 == total_page_yes_filter:
			response = {
				"nextPage": None,
				"data": data
			}
			return jsonify(response)
	
	except:
		response = {
			"error": True,
			"message": "內部伺服器錯誤"
		}
		return jsonify(response), 500
	
	finally:
		mycursor.close()
		attractions.close()

# 根據景點編號取得景點資料
@app.route("/api/attraction/<int:attractionId>")
def get_attraction_id(attractionId):
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)
	
	try:
		# search by id
		search_query = "SELECT * FROM attractions WHERE id = %s"
		mycursor.execute(search_query, (attractionId, ))
		found_data = mycursor.fetchone()

		data = {}
		data.update({
			"id": found_data[0],
			"name": found_data[1],
			"category": found_data[2],
			"description": found_data[3],
			"address": found_data[4],
			"transport": found_data[5],
			"mrt": found_data[6],
			"lat": str(found_data[7]),
			"lng": str(found_data[8]),
			"images": found_data[9].split(",")
		})

		response = {
			"data": data
		}

		return jsonify(response)

	except:
		if found_data is None:
			response = {
				"error": True,
				"message": "請輸入正確的編號"
			}
			return jsonify(response), 400
		else:
			response = {
				"error": True,
				"message": "內部伺服器錯誤"
			}
			return jsonify(response), 500

	finally:
		mycursor.close()
		attractions.close()

# 旅遊景點分類
@app.route("/api/categories")
def list_categories():
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)
	
	try:
		search_query = "SELECT category FROM attractions GROUP BY category ORDER BY category DESC"
		mycursor.execute(search_query)
		found_data = mycursor.fetchall()

		if found_data is None:
			response = {
				"error": True,
				"message": "伺服器內部錯誤"
			}
			return jsonify(response), 500
		else:
			data = [ result[0] for result in found_data ]
			response = {
				"data": data
			}
			return jsonify(response)
			
	finally:
		mycursor.close()
		attractions.close()

# 註冊
@app.route("/api/user", methods=["POST"])
def signup():
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	user_data = request.get_json() 
	member_new_name = user_data["name"]
	member_new_email = user_data["email"]
	member_new_password = user_data["password"]

	data = {
		"name": member_new_name,
		"email": member_new_email,
		"password": member_new_password
	}

	try:
		member_search = "SELECT email FROM member WHERE email = %s"
		mycursor.execute(member_search, (member_new_email, ))
		search_result = mycursor.rowcount

		if search_result == 0:

			member_add = "INSERT INTO member(name, email, password) VALUES(%s, %s, %s)"
			value = (member_new_name, member_new_email, member_new_password)
			mycursor.execute(member_add, value)
			attractions.commit()

			response = { 
				"ok": True
				}
			return jsonify(response)

		if search_result > 0:
			response = { 
				"error": True,
				"message": "該信箱已經被註冊"
				}
			return jsonify(response), 400
		else:
			response = {
				"error": True,
				"message": "內部伺服器錯誤"
			}
			return jsonify(response), 500

	finally:
		mycursor.close()
		attractions.close()

# 取得會員資訊
@app.route("/api/user/auth", methods=["GET"])
def check_member():
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	try:
		if "Cookie" in request.headers:
			user_cookie = request.cookies.get("token")
			user_token = jwt.decode(user_cookie, app.config["SECRET_KEY"], algorithms = "HS256")
		else:
			response = {
					"data": None
				}
			return jsonify(response)

		member_search = "SELECT * FROM member WHERE email = %s"
		member_email = user_token["email"]
		mycursor.execute(member_search, (member_email, ))
		search_result = mycursor.rowcount
		search_result_data = mycursor.fetchone()

		if search_result == 1:
			data = {
				"id": search_result_data[0],
				"name": search_result_data[1],
				"email": search_result_data[2],
			}

			response = {
				"data": data
			}
			return jsonify(response)
		
		response = {
				"data": None
			}
		return jsonify(response)
	
	finally:
		mycursor.close()
		attractions.close()

# 登入
@app.route("/api/user/auth", methods=["PUT"])
def signin(): 
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	user_data = request.get_json()
	member_email = user_data["email"]
	member_password = user_data["password"]

	try:
		member_search = "SELECT email FROM member WHERE email = %s AND password = %s"
		mycursor.execute(member_search, (member_email, member_password, ))
		search_result = mycursor.rowcount

		if search_result == 1:
			user_token = jwt.encode(user_data, app.config["SECRET_KEY"], algorithm = "HS256")
			response = jsonify({ "ok": True })
			resp_cookie = make_response(response)
			resp_cookie.set_cookie(key="token", value=user_token, max_age=604800)
			return resp_cookie

		if search_result != 1:
			response = { 
				"error": True,
				"message": "帳號或密碼錯誤"
				}
			return jsonify(response), 400
		else:
			response = {
				"error": True,
				"message": "內部伺服器錯誤"
			}
			return jsonify(response), 500

	finally:
		mycursor.close()
		attractions.close()

# 登出
@app.route("/api/user/auth", methods=["DELETE"])
def signout():
	response = jsonify({ "ok": True })
	del_cookie = make_response(response)
	del_cookie.set_cookie(key="token", value="", expires=0)
	del_cookie.delete_cookie("token")
	return del_cookie

# 登入驗證
def check_token(func):
	@wraps(func)
	def decorated(*args, **kwargs):
		attractions = mysql.connector.connect(**dbconfig)
		mycursor = attractions.cursor(buffered=True)

		cookie = None
		
		if "Cookie" in request.headers:
			cookie = request.cookies.get("token")
		if not cookie:
			return jsonify({"error": True, "message": "請登入系統"}), 403

		try:
			token = jwt.decode(cookie, app.config["SECRET_KEY"], algorithms = "HS256")
			user_search = "SELECT * FROM member WHERE email = %s AND password = %s"
			mycursor.execute(user_search, (token["email"], token["password"],))
			search_result = mycursor.rowcount
			current_user = mycursor.fetchone()
			current_user = list(current_user)

			if search_result == 0:
				return jsonify({"error": True, "message": "請重新登入，並輸入正確的帳號或密碼"}), 403
		
		except:
			return jsonify({"error": True, "message": "請重新登入系統"}), 403

		finally:
			mycursor.close()
			attractions.close()

		return func(current_user, *args, **kwargs)

	return decorated

# 選擇行程: 購物車
@app.route("/api/booking", methods=["GET"])
@check_token
def booking_car(current_user):
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	user_id = current_user[0]
	
	try:
		booking_search = "SELECT attraction_id, date, time, price FROM booking WHERE user_id = %s"
		mycursor.execute(booking_search, (user_id, ))
		booking_search = mycursor.rowcount
		booking_search_result = mycursor.fetchone()

		if booking_search_result != None:
			booking_search_result = list(booking_search_result)
			attraction_id = booking_search_result[0]
		else:
			response = {
				"data": None
			}
			return jsonify(response)

		attraction_search = "SELECT id, name, address, images FROM attractions WHERE id = %s"
		mycursor.execute(attraction_search, (attraction_id, ))
		attraction_search_result = mycursor.fetchone()

		if attraction_search_result != None:
			attraction_search_result = list(attraction_search_result)
			attraction_search_result[3] = attraction_search_result[3].split(",")

			attraction = {
				"id": attraction_search_result[0],
				"name": attraction_search_result[1],
				"address": attraction_search_result[2],
				"images": attraction_search_result[3][0],
			}

			data = {
				"attraction": attraction,
				"date": booking_search_result[1],
				"time": booking_search_result[2],
				"price": booking_search_result[3]
			}

			response = {
				"data": data
			}
			return jsonify(response)

		response = {
			"data": None
		}
		return jsonify(response)

	finally:
		mycursor.close()
		attractions.close()

# 建立行程: "開始預約行程" button
@app.route("/api/booking", methods=["POST"])
@check_token
def new_booking(current_user):
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	booking_data = request.get_json() 
	booking_attraction_id = booking_data["attractionId"]
	booking_date = booking_data["date"]
	booking_time = booking_data["time"]
	booking_price = booking_data["price"]
	booking_user_id = current_user[0]

	try:
		check_booking_data = "SELECT * FROM booking WHERE user_id = %s"
		mycursor.execute(check_booking_data, (booking_user_id, ))
		search_result = mycursor.rowcount

		if search_result != 0:
			update_booking = "UPDATE booking SET attraction_id = %s, date = %s, time = %s, price = %s WHERE user_id = %s"
			update_value = (booking_attraction_id, booking_date, booking_time, booking_price, booking_user_id)
			mycursor.execute(update_booking, update_value)
			attractions.commit()
		else:
			add_new_booking = "INSERT INTO booking(attraction_id, user_id, date, time, price) VALUES(%s, %s, %s, %s, %s)"
			add_value = (booking_attraction_id, booking_user_id, booking_date, booking_time, booking_price)
			mycursor.execute(add_new_booking, add_value)
			attractions.commit()

		confirm_booking_data = "SELECT * FROM booking WHERE attraction_id = %s AND user_id = %s"
		confirm_value = (booking_attraction_id, booking_user_id)
		mycursor.execute(confirm_booking_data, confirm_value)
		confirm_result = mycursor.rowcount

		if confirm_result == 1:
			response = {
				"ok": True
			}
			return jsonify(response)

		response = {
			"error": True,
			"message": "預約失敗，請重新嘗試"
		}
		return jsonify(response), 400

	except:
		response = {
			"error": True,
			"message": "內部伺服器錯誤"
		}
		return jsonify(response), 500

	finally:
		mycursor.close()
		attractions.close()

# 刪除行程
@app.route("/api/booking", methods=["DELETE"])
@check_token
def del_booking(current_user):
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	try:
		delete_booking = "DELETE FROM booking WHERE user_id = %s"
		mycursor.execute(delete_booking, (current_user[0], ))
		attractions.commit()

		response = {
			"ok": True
		}
		return jsonify(response)

	finally:
		mycursor.close()
		attractions.close()

# 付款: 建立訂單，完成付款程序
@app.route("/api/orders", methods=["POST"])
@check_token
def payment(current_user):
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	order_data = request.get_json()

	if "" or None not in order_data.values():
		customer_id = current_user[0]
		order_no = str("%03d" % current_user[0]) + str(time.strftime("%Y%m%d%H%M%S", time.localtime(time.time())) + str(time.time()).replace(".","")[-7:])
		prime = order_data["prime"]
		order_price = order_data["order"]["price"]
		attraction_id = order_data["order"]["trip"]["attraction"]["id"]
		attraction_name = order_data["order"]["trip"]["attraction"]["name"]
		attraction_address = order_data["order"]["trip"]["attraction"]["address"]
		attraction_image = order_data["order"]["trip"]["attraction"]["image"]
		trip_date = order_data["order"]["trip"]["date"]
		trip_time = order_data["order"]["trip"]["time"]
		contact_name = order_data["order"]["contact"]["name"]
		contact_email = order_data["order"]["contact"]["email"]
		contact_phone = order_data["order"]["contact"]["phone"]
		pay_done = "尚未付款"

		add_order = "INSERT INTO order_history(customer_id, order_no, order_price, attraction_id, attraction_name, attraction_address, attraction_image, trip_date, trip_time, contact_name, contact_email, contact_phone, pay_done) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
		add_order_value = (customer_id, order_no, order_price, attraction_id, attraction_name, attraction_address, attraction_image, trip_date, trip_time, contact_name, contact_email, contact_phone, pay_done)
		mycursor.execute(add_order, add_order_value)
		attractions.commit()
	else:
		response = {
			"error": True,
			"message": "訂單建立失敗，請確認資料是否正確、填妥"
		}
		return jsonify(response), 400

	try:
		url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
		headers = {
			"methods": "POST",
			"content-type": "application/json",
			"x-api-key": "partner_Jl9j17qoPXMmavyDhq6MFIWWhgYIvvJUdEzV8rKIoHwjA5VdFyVmS1UN"
		}
		params = {
			"prime": prime,
			"partner_key": "partner_Jl9j17qoPXMmavyDhq6MFIWWhgYIvvJUdEzV8rKIoHwjA5VdFyVmS1UN",
			"amount": order_price,
			"merchant_id": "MinnieCheng_CTBC",
			"details": order_no,
			"cardholder": {
				"phone_number": "+886" + contact_phone[1:len(contact_phone)],
				"name": contact_name,
				"email": contact_email,
				"zip_code": "",
				"address": "",
				"national_id": ""
			},
			"remember": False
		}

		response = requests.post(url, headers=headers, params=params)
		result = response.json()
		print(result)

		if result["status"] == 0:
			# payment update 
			pay_done = "付款完成"
			update_order = "UPDATE order_history SET order_status = %s, pay_done = %s WHERE order_no = %s"
			update_order_value = (result["status"], pay_done, order_no)
			mycursor.execute(update_order, update_order_value)
			attractions.commit()

			# delete booking data
			delete_booking = "DELETE FROM booking WHERE user_id = %s"
			mycursor.execute(delete_booking, (customer_id, ))
			attractions.commit()

			response = {
				"data": {
					"number": order_no,
					"payment": {
						"status": result["status"],
						"message": "付款成功"
					}
				}
			}
			return jsonify(response)

		if result["status"] > 0:
			# payment update 
			update_order = "UPDATE order_history SET order_status = %s WHERE order_no = %s"
			update_order_value = (result["status"], order_no)
			mycursor.execute(update_order, update_order_value)
			attractions.commit()

			# delete booking data
			delete_booking = "DELETE FROM booking WHERE user_id = %s"
			mycursor.execute(delete_booking, (customer_id, ))
			attractions.commit()

			response = {
				"data": {
					"number": order_no,
					"payment": {
						"status": result["status"],
						"message": "付款失敗，請重新嘗試"
					}
				}
			}
			return jsonify(response)

	except:
		response = {
			"error": True,
			"message": "內部伺服器錯誤"
		}
		return jsonify(response), 500

	finally:
		mycursor.close()
		attractions.close()

# 查詢訂單: 依據訂單編號取得訂單資訊
@app.route("/api/orders/<int:orderNumber>")
@check_token
def get_order(current_user, orderNumber):
	attractions = mysql.connector.connect(**dbconfig)
	mycursor = attractions.cursor(buffered=True)

	try:
		get_order = "SELECT * FROM order_history WHERE customer_id = %s and order_no = %s"
		get_order_value = (current_user[0], orderNumber)
		mycursor.execute(get_order, get_order_value)
		get_result = mycursor.fetchone()

		if get_result is not None:
			data = {
				"number": get_result[1],
				"price": get_result[2],
				"trip": {
					"attraction": {
						"id": get_result[3],
						"name": get_result[4],
						"address": get_result[5],
						"image": get_result[6]
					},
					"date": get_result[7].strftime("%Y-%m-%d"),
					"time": get_result[8]
				},
				"contact": {
					"name": get_result[9],
					"email": get_result[10],
					"phone": get_result[11]
				},
				"status": get_result[12]
			}

			response = {
				"data": data
			}
			return jsonify(response)
		else:
			response = {
				"data": None
			}
			return jsonify(response)

	except:
		response = {
			"error": True,
			"message": "內部伺服器錯誤"
		}
		return jsonify(response), 500

	finally:
		mycursor.close()
		attractions.close()

app.run(host="0.0.0.0", port=3000)