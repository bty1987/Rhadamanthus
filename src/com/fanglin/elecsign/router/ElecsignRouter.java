package com.fanglin.elecsign.router;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.enums.ElecsignScene;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * 电子签厂商路由器。
 *
 * <p>业务方通过本路由器获取对应公司/场景的 {@link ElecsignService} 实现，而非直接 {@code @Autowired}
 * 某个具体厂商。这样业务方与厂商解耦，新增/切换厂商对业务方透明。
 *
 * <h3>配置存储：复用 communion.systemconfig</h3>
 * <p>不新建独立配置表，直接用 {@code systemconfig}（key/value/company 结构，天然支持按公司配置）。
 * 配置约定（{@code group=elecsign}）：
 * <pre>
 * | group    | key                            | value        | company | 说明                          |
 * |----------|--------------------------------|--------------|---------|-------------------------------|
 * | elecsign | elecsign.default.provider      | fadada       | 0       | 全局默认厂商（company=0）      |
 * | elecsign | elecsign.provider              | esign        | {cid}   | 某公司默认厂商                |
 * | elecsign | elecsign.provider.decoration   | esign        | {cid}   | 某公司装修合同场景独立厂商     |
 * | elecsign | elecsign.appId                 | xxx          | {cid}   | 该公司 e签宝 appId            |
 * | elecsign | elecsign.appSecret             | xxx(加密)    | {cid}   | 该公司 e签宝密钥              |
 * | elecsign | elecsign.host                  | https://...  | {cid}   | 可选，openapi 地址            |
 * </pre>
 * 场景 key 后缀见 {@link ElecsignScene}（decoration/payment/supplier/user/auth）。
 *
 * <h3>路由规则（两条路径）</h3>
 * <ol>
 *   <li><b>新建走配置</b>：{@link #route(int, ElecsignScene)} / {@link #route(int)} —— 按公司×场景当前配置选厂商，
 *       用于生成合同、发起签署、实名认证等"新建"操作；业务方应把解析结果写入数据的 provider 字段</li>
 *   <li><b>存量走记录</b>：{@link #route(Short)} —— 按数据自身记录的厂商（PO 的 provider 字段）选，
 *       用于查看/下载/归档等"读取"操作，保证历史可回溯；provider 为 null 视同法大大（存量兼容）</li>
 * </ol>
 *
 * <h3>路由优先级（resolveProvider）</h3>
 * <ol>
 *   <li>公司×场景级：{@code elecsign.provider.{scene}}（该公司该场景）</li>
 *   <li>公司级：{@code elecsign.provider}（该公司）</li>
 *   <li>全局默认：{@code elecsign.default.provider}（company=0）</li>
 *   <li>都没有 → 硬兜底 {@link ElecsignProvider#FADADA}（等价现状）</li>
 * </ol>
 *
 * <h3>Bean 装配</h3>
 * <p>Spring 自动把所有 {@link ElecsignService} 实现按 bean 名注入 {@code impls} Map：
 * <ul>
 *   <li>{@code fadadaElecsignService}：法大大（{@code FadadaElecsignServiceImpl}，转调 Signature 静态方法）</li>
 *   <li>{@code esignElecsignService}：e签宝（{@code ESignElecsignServiceImpl}，HTTP 直连 openapi v3）</li>
 * </ul>
 */
@Component
public class ElecsignRouter {

	/** 全局默认厂商配置 key（company=0 表全局，项目惯例） */
	public static final String KEY_DEFAULT_PROVIDER = "elecsign.default.provider";

	/** 公司级厂商配置 key */
	public static final String KEY_PROVIDER = "elecsign.provider";

	/** 公司×场景级厂商配置 key 前缀（+场景后缀，如 elecsign.provider.decoration） */
	public static final String KEY_PROVIDER_SCENE_PREFIX = "elecsign.provider.";

	/** 全局 company 值（systemconfig 约定 0 表全局） */
	public static final int COMPANY_GLOBAL = 0;

	/** 法大大实现 bean 名 */
	public static final String BEAN_FADADA = "fadadaElecsignService";

	/** e签宝实现 bean 名 */
	public static final String BEAN_ESIGN = "esignElecsignService";

	/** 法大大厂商标记（存量数据 provider 视同值） */
	public static final short PROVIDER_FADADA_INT = 1;

	@Autowired
	private Map<String, ElecsignService> impls;

	@Autowired
	private SystemConfigDao systemConfigDao;

	/**
	 * 解析某公司（不含场景维度）使用的电子签厂商（含全局默认回退）。
	 *
	 * @param companyId 公司 cid
	 * @return 厂商枚举；未配置返回全局默认，全局也没有则法大大（等价现状）
	 */
	public ElecsignProvider resolveProvider(int companyId) {
		return resolveProvider(companyId, null);
	}

	/**
	 * 解析某公司某场景使用的电子签厂商。
	 *
	 * 优先级：公司×场景级 → 公司级 → 全局默认 → 法大大兜底。
	 *
	 * @param companyId 公司 cid
	 * @param scene 业务场景（null 表示不区分场景，仅按公司路由）
	 * @return 厂商枚举
	 */
	public ElecsignProvider resolveProvider(int companyId, ElecsignScene scene) {

		// 1. 公司×场景级：elecsign.provider.{scene}（该公司该场景独立配置）
		if (scene != null) {
			ElecsignProvider provider = readProvider(KEY_PROVIDER_SCENE_PREFIX + scene.key(), companyId);
			if (provider != null) {
				return provider;
			}
		}

		// 2. 公司级：elecsign.provider
		ElecsignProvider provider = readProvider(KEY_PROVIDER, companyId);
		if (provider != null) {
			return provider;
		}

		// 3. 全局默认（company=0）
		provider = readProvider(KEY_DEFAULT_PROVIDER, COMPANY_GLOBAL);
		if (provider != null) {
			return provider;
		}

		// 4. 硬兜底：法大大（等价现状）
		return ElecsignProvider.FADADA;
	}

	/**
	 * 按公司当前配置路由（不含场景维度，用于合同模板上传等无场景区分的业务）。
	 *
	 * @param companyId 公司 cid
	 * @return 该公司配置对应的厂商实现；未配置返回法大大（等价现状）
	 */
	public ElecsignService route(int companyId) throws FLException {
		return bindCompany(resolveProvider(companyId), companyId);
	}

	/**
	 * 按公司×场景当前配置路由（用于新建合同、发起签署、实名认证等"新建"操作）。
	 *
	 * <p>e签宝实现返回公司绑定实例（携带公司上下文读取该公司凭证）。
	 *
	 * @param companyId 公司 cid
	 * @param scene 业务场景（null 等同 {@link #route(int)}）
	 * @return 对应厂商实现
	 * @throws FLException 配置指向的厂商实现缺失（fail-fast，防误路由）
	 */
	public ElecsignService route(int companyId, ElecsignScene scene) throws FLException {
		return bindCompany(resolveProvider(companyId, scene), companyId);
	}

	/**
	 * 按数据自身记录的厂商路由（用于已有数据的查看/下载/归档，保证历史可回溯）。
	 *
	 * <p>存量 e签宝数据的读取使用全局凭证（company=0）——合同 PO 无公司列，
	 * 多公司各自 e签宝凭证的场景下读取操作依赖全局凭证可访问该合同文件。
	 *
	 * @param providerCode 数据记录的 provider 值（PO 的 provider 字段，null 视同法大大）
	 * @return 对应厂商实现
	 * @throws FLException 厂商实现缺失（fail-fast，防误路由）
	 */
	public ElecsignService route(Short providerCode) throws FLException {
		return bindCompany(ElecsignProvider.of(providerCode == null ? PROVIDER_FADADA_INT : providerCode), COMPANY_GLOBAL);
	}

	/**
	 * 按厂商枚举路由。
	 *
	 * <p>e签宝实现缺失时抛异常而非静默回落法大大——配置指向 e签宝而实现不在（部署不完整），
	 * 继续用法大大会把 e签宝的单子发到法大大账号造成串号，报错比串号安全。
	 *
	 * @param provider 厂商枚举（null 兜底法大大）
	 * @return 对应厂商实现
	 * @throws FLException 厂商实现缺失
	 */
	public ElecsignService route(ElecsignProvider provider) throws FLException {

		if (provider == ElecsignProvider.ESIGN) {
			return requireImpl(BEAN_ESIGN, provider);
		}

		return requireImpl(BEAN_FADADA, provider);
	}

	/** 对实现了 {@link com.fanglin.elecsign.service.CompanyAware} 的厂商实现返回公司绑定实例。 */
	private ElecsignService bindCompany(ElecsignProvider provider, int company) throws FLException {

		ElecsignService impl = route(provider);

		if (impl instanceof com.fanglin.elecsign.service.CompanyAware) {
			return ((com.fanglin.elecsign.service.CompanyAware) impl).forCompany(company);
		}

		return impl;
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

	private ElecsignService requireImpl(String beanName, ElecsignProvider provider) throws FLException {

		ElecsignService impl = impls.get(beanName);

		if (impl == null) {
			throw new FLException(130097, String.format("e签宝接口调用失败, 厂商实现缺失: %s", provider == null ? ElecsignProvider.FADADA.name_() : provider.name_()));
		}

		return impl;
	}

}
