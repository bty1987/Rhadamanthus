package com.fanglin.swiftpass.enums;

/**
 * 应用请求报文签名算法枚举
 * 
 */
public enum KeySignTypeEnum {

	SHA256WITHRSA("2", "SHA256WithRSA"),

	SM3WITHSM2("3", "SM3WithSM2");

	/**
	 * 根据编码找枚举
	 * 
	 * @param code 编码
	 * @return KeyStatusEnum
	 */
	public static KeySignTypeEnum getByCode(String code) {
		if (code == null) {
			return null;
		}
		if (values() == null) {
			return null;
		}
		for (KeySignTypeEnum t : values()) {
			if (t.getCode().equals(code)) {
				return t;
			}
		}
		return null;
	}

	private final String code;
	private final String label;

	KeySignTypeEnum(String code, String label) {
		this.code = code;
		this.label = label;
	}

	public String getCode() {
		return code;
	}

	public String getLabel() {
		return label;
	}

	public KeySignTypeEnum returnEnum(String persistedValue) {
		return getByCode(persistedValue);
	}
}
