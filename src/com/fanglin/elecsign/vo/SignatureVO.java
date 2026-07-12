/**
 * @File Name		: SignatureVO.java
 * @Package   	: com.fanglin.elecsign.vo
 * @Version		: 1.0
 * @Date			: 2021-9-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 电子签印章/签名管理 VO（厂商中立）。从 com.fanglin.fadada.vo 迁入 elecsign 包。
 */

package com.fanglin.elecsign.vo;

import java.io.Serializable;

import com.alibaba.fastjson.JSONObject;

public class SignatureVO implements Serializable {

	private static final long serialVersionUID = -5794445985595714186L;

	private String customerId;

	private String signatureId;

	private String path;

	private String image;

	private Short defaults;

	private Short type;

	public SignatureVO() {
		super();
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getSignatureId() {
		return signatureId;
	}

	public void setSignatureId(String signatureId) {
		this.signatureId = signatureId;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Short getDefaults() {
		return defaults;
	}

	public void setDefaults(Short defaults) {
		this.defaults = defaults;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public SignatureVO jtv(JSONObject signature) {

		if (signature.getString("signature_id") != null)
			setSignatureId(signature.getString("signature_id"));

		if (signature.getString("signature_type") != null)
			setType(Short.parseShort(signature.getString("signature_type")));

		if (signature.getString("signature_scope") != null)
			setDefaults(Short.parseShort(signature.getString("signature_scope")));

		if (signature.getString("signature_img_base64") != null)
			setImage(signature.getString("signature_img_base64"));

		return this;

	}
}
