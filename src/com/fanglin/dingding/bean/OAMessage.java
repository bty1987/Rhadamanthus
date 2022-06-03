package com.fanglin.dingding.bean;

import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

/**
 * { "message_url": "http://dingtalk.com", "head": { "bgcolor": "FFCC0000" }, "body": { "title": "标题", "form": [ { "key": "姓名", "value": "张三" }, { "key": "年龄", "value": "30" } ], "rich": { "num": "15.6", "unit": "元" }, "content": "大段文本", "image": "@lADOAAGXIszazQKA", "file_count": "3", "author": "李四" }
 */
public class OAMessage {

	private String TYPE_OA_STR = "oa";

	private String message_url;

	private Head head;

	private Body body;

	public String getMessage_url() {
		return message_url;
	}

	public void setMessage_url(String message_url) {
		this.message_url = message_url;
	}

	public Head getHead() {
		return head;
	}

	public void setHead(Head head) {
		this.head = head;
	}

	public Body getBody() {
		return body;
	}

	public void setBody(Body body) {
		this.body = body;
	}

	public JSONObject delivery() {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_OA_STR);
		json.put(this.TYPE_OA_STR, JSON.toJSON(this));

		return json;
	}

	public JSONObject delivery(String agentId, String receiverId, String deptId) {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_OA_STR);
		json.put(this.TYPE_OA_STR, JSON.toJSON(this));

		json.put("touser", receiverId);
		json.put("toparty", deptId);
		json.put("agentid", agentId);

		return json;
	}

	public static class Head {
		public String bgcolor;
	}

	public static class Body {
		public String title;
		public List<Form> form;
		public Rich rich;
		public String content;
		public String image;
		public String file_found;
		public String author;

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public List<Form> getForm() {
			return form;
		}

		public void setForm(List<Form> form) {
			this.form = form;
		}

		public Rich getRich() {
			return rich;
		}

		public void setRich(Rich rich) {
			this.rich = rich;
		}

		public String getContent() {
			return content;
		}

		public void setContent(String content) {
			this.content = content;
		}

		public String getImage() {
			return image;
		}

		public void setImage(String image) {
			this.image = image;
		}

		public String getFile_found() {
			return file_found;
		}

		public void setFile_found(String file_found) {
			this.file_found = file_found;
		}

		public String getAuthor() {
			return author;
		}

		public void setAuthor(String author) {
			this.author = author;
		}

		public static class Form {

			private String key;

			private String value;

			public String getKey() {
				return key;
			}

			public void setKey(String key) {
				this.key = key;
			}

			public String getValue() {
				return value;
			}

			public void setValue(String value) {
				this.value = value;
			}
		}

		public static class Rich {

			private String num;

			private String unit;

			public String getNum() {
				return num;
			}

			public void setNum(String num) {
				this.num = num;
			}

			public String getUnit() {
				return unit;
			}

			public void setUnit(String unit) {
				this.unit = unit;
			}

		}
	}
}
