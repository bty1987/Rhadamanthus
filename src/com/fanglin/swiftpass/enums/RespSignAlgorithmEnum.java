package com.fanglin.swiftpass.enums;

/**
 * 响应报文验签算法枚举
 * 
 */
public enum RespSignAlgorithmEnum {

	SHA1WITHRSA("1", "SHA1WithRSA"),

	SHA256WITHRSA("2", "SHA256WithRSA"),

	SM3WITHSM2("3", "SM3WithSM2");

	/**
	 * 根据编码找枚举
	 * 
	 * @param code 编码
	 * @return KeyStatusEnum
	 */
	public static RespSignAlgorithmEnum getByCode(String code) {
		if (code == null) {
			return null;
		}
		if (values() == null) {
			return null;
		}
		for (RespSignAlgorithmEnum t : values()) {
			if (t.getCode().equals(code)) {
				return t;
			}
		}
		return null;
	}

	private final String code;
	private final String label;

	private RespSignAlgorithmEnum(String code, String label) {
		this.code = code;
		this.label = label;
	}

	public String getCode() {
		return code;
	}

	public String getLabel() {
		return label;
	}

	public RespSignAlgorithmEnum returnEnum(String persistedValue) {
		return getByCode(persistedValue);
	}
}
