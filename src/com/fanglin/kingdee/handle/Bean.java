/**
 * @File Name		: BeanKO.java
 * @Package   	: com.fanglin.kingdee.handle
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.handle;

import com.alibaba.fastjson.JSONObject;

public class Bean {

	private String FormId;

	public String getFormId() {
		return FormId;
	}

	public void setFormId(String formId) {
		FormId = formId;
	}

	public String param() {
		return String.format("%s%s%s", "{\"Model\":", JSONObject.toJSONString(this), "}");
	}
}
