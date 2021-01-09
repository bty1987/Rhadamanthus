/**
 * @File Name		: Resource.java
 * @Package   	: com.fanglin.yspay.union
 * @Version		: 1.0
 * @Date			: 2021-1-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.yspay.union;

import java.io.Serializable;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SimplePropertyPreFilter;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.yspay.utils.HttpUtil;

public class Resource implements Serializable {

	private static final long serialVersionUID = 7450545045094582577L;

	private String userCode;

	private String token;

	private String picId;

	private String picType;

	private String path;

	private Base base;

	public Resource() {
		super();
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getPicId() {
		return picId;
	}

	public void setPicId(String picId) {
		this.picId = picId;
	}

	public String getPicType() {
		return picType;
	}

	public void setPicType(String picType) {
		this.picType = picType;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	@JSONField(serialize = false)
	public Base getBase() {
		return base;
	}

	public void setBase(Base base) {
		this.base = base;
	}

	public Resource query(String userCode) {

		return this;
	}

	public Resource token(String walletNo) throws FLException {

		setUserCode(walletNo);

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Resource.class, "userCode");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "getYsToken", "/api/getYsToken");

		return JSONObject.toJavaObject(response, Resource.class);
	}

	public Resource upload(String walletNo, String type, String token, String path) throws FLException {

		setUserCode(walletNo);
		setPicType(type);
		setToken(token);

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Resource.class, "userCode", "picType", "token");

		base.setFile(HttpUtil.getFile(path));

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "uploadPicture", "/api/uploadPicture");

		return JSONObject.toJavaObject(response, Resource.class);
	}

	public static void main(String[] args) {

	}

}
