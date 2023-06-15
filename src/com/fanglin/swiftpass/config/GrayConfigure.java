package com.fanglin.swiftpass.config;

// 灰度发布配置对象
public class GrayConfigure {

	private String key; // 请求头中的灰度参数键

	private String value; // 请求头中的灰度参数值

	public GrayConfigure() {
	}

	public GrayConfigure(String key, String value) {
		this.key = key;
		this.value = value;
	}

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

	public boolean notNull() {
		if (null != this.key && null != this.value) {
			return true;
		}
		return false;
	}
}
