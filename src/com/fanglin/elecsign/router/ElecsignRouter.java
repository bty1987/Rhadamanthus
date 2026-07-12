package com.fanglin.elecsign.router;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * 电子签厂商路由器。
 *
 * <p>业务方通过本路由器获取对应公司的 {@link ElecsignService} 实现，而非直接 {@code @Autowired}
 * 某个具体厂商。这样业务方与厂商解耦，新增/切换厂商对业务方透明。
 *
 * <h3>配置存储：复用 communion.systemconfig</h3>
 * <p>不新建独立配置表，直接用 {@code systemconfig}（key/value/company 结构，天然支持按公司配置）。
 * 配置约定（{@code group=elecsign}）：
 * <pre>
 * | group    | key                       | value        | company | 说明                     |
 * |----------|---------------------------|--------------|---------|--------------------------|
 * | elecsign | elecsign.default.provider | fadada       | 0       | 全局默认厂商（company=0） |
 * | elecsign | elecsign.provider         | esign        | {cid}   | 某公司用 e签宝           |
 * | elecsign | elecsign.appId            | xxx          | {cid}   | 该公司 e签宝 appId       |
 * | elecsign | elecsign.appSecret        | xxx(加密)    | {cid}   | 该公司 e签宝密钥         |
 * | elecsign | elecsign.host             | https://...  | {cid}   | 可选，openapi 地址       |
 * </pre>
 *
 * <h3>路由规则</h3>
 * <ol>
 *   <li>{@link #route(int)}：按公司当前配置选厂商（用于<b>新建</b>合同/印章/账号）</li>
 *   <li>{@link #route(ElecsignProvider)}：按数据自身记录的厂商选（用于<b>已有</b>数据，保证历史可回溯）</li>
 * </ol>
 *
 * <h3>路由优先级（resolveProvider）</h3>
 * <ol>
 *   <li>查该公司 {@code elecsign.provider} → 有则用该公司配置厂商</li>
 *   <li>查全局 {@code elecsign.default.provider}（company=0）→ 有则用全局默认</li>
 *   <li>都没有 → 硬兜底 {@link ElecsignProvider#FADADA}（等价现状）</li>
 * </ol>
 *
 * <h3>Bean 装配</h3>
 * <p>Spring 自动把所有 {@link ElecsignService} 实现按 bean 名注入 {@code impls} Map：
 * <ul>
 *   <li>{@code fadadaElecsignService}：法大大（{@code FadadaElecsignServiceImpl}）</li>
 *   <li>{@code esignElecsignService}：e签宝（{@code ESignElecsignServiceImpl}，阶段5新增）</li>
 * </ul>
 */
@Component
public class ElecsignRouter {

	/** 全局默认厂商配置 key（company=0 表全局，项目惯例） */
	public static final String KEY_DEFAULT_PROVIDER = "elecsign.default.provider";

	/** 公司级厂商配置 key */
	public static final String KEY_PROVIDER = "elecsign.provider";

	/** 全局 company 值（systemconfig 约定 0 表全局） */
	public static final int COMPANY_GLOBAL = 0;

	/** 法大大实现 bean 名 */
	public static final String BEAN_FADADA = "fadadaElecsignService";

	/** e签宝实现 bean 名 */
	public static final String BEAN_ESIGN = "esignElecsignService";

	@Autowired
	private Map<String, ElecsignService> impls;

	@Autowired
	private SystemConfigDao systemConfigDao;

	/**
	 * 解析某公司使用的电子签厂商（含全局默认回退）。
	 *
	 * @param companyId 公司 cid
	 * @return 厂商枚举；未配置返回全局默认，全局也没有则法大大（等价现状）
	 */
	public ElecsignProvider resolveProvider(int companyId) {

		// 1. 先查公司级配置
		ElecsignProvider provider = readProvider(KEY_PROVIDER, companyId);
		if (provider != null) {
			return provider;
		}

		// 2. 回退到全局默认（company=0）
		provider = readProvider(KEY_DEFAULT_PROVIDER, COMPANY_GLOBAL);
		if (provider != null) {
			return provider;
		}

		// 3. 硬兜底：法大大（等价现状）
		return ElecsignProvider.FADADA;
	}

	/**
	 * 按公司当前配置路由（用于新建场景）。
	 *
	 * @param companyId 公司 cid
	 * @return 该公司配置对应的厂商实现；未配置返回法大大（等价现状）
	 */
	public ElecsignService route(int companyId) {
		return route(resolveProvider(companyId));
	}

	/**
	 * 按数据自身记录的厂商路由（用于已有数据的查看/下载/归档，保证历史可回溯）。
	 *
	 * @param provider 数据记录的 provider（来自 PO 的 provider 字段，或枚举直接传入）
	 * @return 对应厂商实现；未知/null 返回法大大兜底
	 */
	public ElecsignService route(ElecsignProvider provider) {
		if (provider == null) {
			return fadada();
		}
		switch (provider) {
			case ESIGN:
				ElecsignService esign = impls.get(BEAN_ESIGN);
				return esign != null ? esign : fadada(); // e签宝未接入时兜底法大大
			case FADADA:
			default:
				return fadada();
		}
	}

	/** 从 systemconfig 读一个厂商配置值，支持名称（fadada/esign）和数字码（1/2）。 */
	private ElecsignProvider readProvider(String key, int company) {
		SystemConfigPO config = systemConfigDao.querySystemConfig(key, company);
		if (config != null && config.getValue() != null) {
			return parseProvider(config.getValue());
		}
		return null;
	}

	private ElecsignProvider parseProvider(String value) {
		String v = value.trim().toLowerCase();
		if ("fadada".equals(v) || "1".equals(v)) {
			return ElecsignProvider.FADADA;
		}
		if ("esign".equals(v) || "2".equals(v)) {
			return ElecsignProvider.ESIGN;
		}
		return null;
	}

	/** 直接取法大大实现（兜底用）。 */
	private ElecsignService fadada() {
		return impls.get(BEAN_FADADA);
	}

}
