package com.fanglin.elecsign.enums;

/**
 * 电子签业务场景标记。
 *
 * <p>多厂商支持要求「不同合同场景、不同公司可配置不同厂商」。本枚举即"合同场景"维度，
 * 与公司维度（systemconfig 的 company 列）组合，形成两级路由：
 *
 * <pre>
 * 优先级1（公司×场景）：elecsign.provider.&lt;scene&gt;   company=公司cid  如 elecsign.provider.decoration=esign
 * 优先级2（公司级）    ：elecsign.provider             company=公司cid
 * 优先级3（全局默认）  ：elecsign.default.provider     company=0
 * 兜底    ：法大大
 * </pre>
 *
 * <p>场景与业务模块的对应关系：
 * <ul>
 *   <li>{@link #DECORATION}：装修合同（decoration 模块 DecorationContractServiceImpl）</li>
 *   <li>{@link #PAYMENT}：付款合同（payment 模块 PaymentContractServiceImpl）</li>
 *   <li>{@link #SUPPLIER}：供应商合同（personel 模块 SupplierContractServiceImpl）</li>
 *   <li>{@link #USER}：员工合同（personel 模块 UserContractServiceImpl）</li>
 *   <li>{@link #AUTH}：实名认证与印章（客户/员工实名、公司/供应商印章，communion/personel/data 模块）</li>
 * </ul>
 *
 * <p>合同模板上传（data.common.ContractServiceImpl）不区分场景，按公司默认厂商路由
 * （{@code ElecsignRouter#route(int)}，即公司级→全局→法大大）。若某合同场景配置了独立厂商，
 * 该场景使用的模板需同时上传到对应厂商后台（模板不在厂商间互通）。
 *
 * @see ElecsignProvider
 */
public enum ElecsignScene {

	DECORATION("decoration", "装修合同"),

	PAYMENT("payment", "付款合同"),

	SUPPLIER("supplier", "供应商合同"),

	USER("user", "员工合同"),

	AUTH("auth", "实名认证与印章");

	/** systemconfig 配置 key 后缀（elecsign.provider.{key}） */
	private String key;

	private String name;

	private ElecsignScene(String key, String name) {
		this.key = key;
		this.name = name;
	}

	public String key() {
		return key;
	}

	public String name_() {
		return name;
	}
}
