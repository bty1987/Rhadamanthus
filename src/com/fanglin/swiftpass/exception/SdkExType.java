package com.fanglin.swiftpass.exception;

/**
 * SDK异常枚举
 * 
 */
public enum SdkExType {

	/**
	 * 异常码枚举
	 */
	CONN_ERR("OPEN25801", "通讯错误或超时，交易未决"),

	PARAM_ERR("OPEN25802", "参数校验错误"),

	UNKNOWN("OPEN25803", "未知错误，请检查是否为最新版本SDK或是否配置错误"),

	RESPONSE_SIGN_ERR("OPEN25804", "响应报文验签失败，请检查验签公钥或验签算法配置"),

	FILE_ERROR_RESULT("OPEN25805", "文件读取或写入失败"),

	REQ_PARAM_ENCRYPT_ERR("OPEN25806", "字段加/解密失败，请检查字段加密密钥或字段值"),

	KEY_CONFIGURE_ERR("OPEN25807", "当前keyId未找到配置对象信息，请检查keyConfigures集合中是否保存"),

	CALLBACK_REQUEST_VERIFY_ERR("OPEN25808", "回调请求报文验签失败，请检查验签公钥或验签算法配置"),

	CALLBACK_RESPONSE_SIGN_ERR("OPEN25809", "回调响应报文签名失败，请检查签名私钥或签名算法配置"),

	CALLBACK_BODY_ENCRYPT_ERR("OPEN25810", "回调报文加/解密失败，请检查报文加/解密钥或报文值"),

	NET_SIGN_ERR("OPEN25812", "数字信封制作失败，请检查签名/验签密钥或加密算法配置");

	/**
	 * 根据编码找枚举
	 * 
	 * @param code 编码
	 * @return SdkExType
	 */
	public static SdkExType getByCode(String code) {
		if (code == null) {
			return null;
		}

		for (SdkExType t : values()) {
			if (t.getCode().equals(code)) {
				return t;
			}
		}
		return null;
	}

	private final String code;

	private final String msg;

	private SdkExType(String code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	public String getCode() {
		return code;
	}

	public String getMsg() {
		return msg;
	}

	public SdkExType returnEnum(String persistedValue) {
		return getByCode(persistedValue);
	}

}
