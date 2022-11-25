import sys
import json
import requests
import mysql.connector
import math
from flask import Flask
from flask import request
from flask import render_template
from flask import redirect
from flask import url_for
from flask import session
from flask import json
from flask import jsonify

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = "Gundam 00 is the best!!"

# link to the database & create a cursor object
attractions = mysql.connector.connect(
    host = "localhost",
    user = "viviweikuo",
    password = "zxcvbnmM12*",
    database = "taipei_day_trip"
)
mycursor = attractions.cursor(buffered=True)

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

# 取得景點資料
@app.route("/api/attractions")
def get_attractions():
	try:
		page = request.args.get("page", type=int)
		keyword = request.args.get("keyword", type=str)
		per_page = 12

		if keyword == None:
			# total pages without filter
			search_no_filter = "SELECT COUNT(*) FROM attractions"
			mycursor.execute(search_no_filter)
			total_rows_no_filter = mycursor.fetchone()
			total_page_no_filter = math.ceil(total_rows_no_filter[0] / per_page)
			print(total_page_no_filter)
		else:
			# total pages with filter
			search_yes_filter = "SELECT COUNT(*) FROM attractions WHERE category = %s OR name LIKE %s"
			search_val = (keyword, "%"+keyword+"%")
			mycursor.execute(search_yes_filter, search_val)
			total_rows_yes_filter = mycursor.fetchone()
			total_page_yes_filter = math.ceil(total_rows_yes_filter[0] / per_page)
			print(total_page_yes_filter)

		if keyword == None:
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
				"images": result[9]
			})

		if (keyword == None and page+1 < total_page_no_filter) or (keyword != None and page+1 < total_page_yes_filter):
			response = {
				"nextPage": int(page+1),
				"data": data
			}
			return jsonify(response)
		elif (keyword == None and page+1 == total_page_no_filter) or (keyword != None and page+1 == total_page_yes_filter):
			response = {
				"nextPage": "Null",
				"data": data
			}
			return jsonify(response)
	
	except Exception:
		response = {
			"error": True,
			"message": "請輸入正確的字串"
		}
		return jsonify(response), 500
	
	finally:
		mycursor.close()

# 根據景點編號取得景點資料
@app.route("/api/attraction/<int:attractionId>")
def get_attraction_id(attractionId):
	try:
		# search by id
		search_query = "SELECT * FROM attractions WHERE id = %s"
		mycursor.execute = (search_query, (attractionId, ))
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
			"images": found_data[9]
		})

		response = {
			"data": data
		}

		return jsonify(response)

	except:
		if not mycursor.rowcount:
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

# 旅遊景點分類
@app.route("/api/categories")
def list_filter():
	try:
		search_query = "SELECT category FROM attractions GROUP BY category ORDER BY category DESC"
		mycursor.execute = (search_query)
		found_data = mycursor.fetchone()

		if not mycursor.rowcount:
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


app.run(port=3000)

