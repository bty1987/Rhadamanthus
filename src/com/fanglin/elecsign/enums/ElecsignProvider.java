package com.fanglin.elecsign.enums;

/**
 * 电子签厂商标记。
 *
 * <p>用于 {@code elecsignCompanyConfig} 表的 {@code provider} 字段，
 * 以及 {@code SignetPO}/{@code CustomerPO}/{@code UserPO} 新增的 {@code provider} 字段，
 * 区分一个签署账号/合同归属于哪家厂商，避免多厂商并存时串号。
 *
 * <ul>
 *   <li>{@link #FADADA}（值=1）：法大大</li>
 *   <li>{@link #ESIGN}（值=2）：e签宝</li>
 * </ul>
 *
 * @see ElecsignProvider#code
 */
public enum ElecsignProvider {

	FADADA((short) 1, "法大大"),

	ESIGN((short) 2, "e签宝");

	/** 数据库存储值（provider 字段）。存量数据全部为 1（法大大）。 */
	private short code;

	private String name;

	private ElecsignProvider(short code, String name) {
		this.code = code;
		this.name = name;
	}

	public short code() {
		return code;
	}

	public String name_() {
		return name;
	}

	/** 按 provider 字段值反查枚举，未知的返回 null（不抛异常，容错）。 */
	public static ElecsignProvider of(short code) {
		for (ElecsignProvider p : values()) {
			if (p.code == code) {
				return p;
			}
		}
		return null;
	}
}
