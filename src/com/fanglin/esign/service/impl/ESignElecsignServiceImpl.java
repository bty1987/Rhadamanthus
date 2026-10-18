/**
 * @File Name		: ESignElecsignServiceImpl.java
 * @Package   	: com.fanglin.esign.service.impl
 * @Version		: 1.0
 * @Date			: 2026-09-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: e签宝电子签实现（openapi v3，纯 HTTP，无 SDK 依赖）
 */

package com.fanglin.esign.service.impl;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.SignetPO;
import com.fanglin.elecsign.service.CompanyAware;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.esign.utils.EsignClient;
import com.fanglin.fadada.bean.Contract;
import com.fanglin.fadada.vo.SignatureVO;

/**
 * e签宝实现（ElecsignService 的 e签宝适配）。
 *
 * <p>本类是 Spring 单例（bean 名 esignElecsignService，供 ElecsignRouter 发现），
 * 真正的接口调用请通过 {@code ElecsignRouter.route(company, scene)} 返回的
 * {@link #forCompany(int)} 公司绑定实例进行——绑定实例携带公司上下文，
 * e签宝凭证（elecsign.appId/appSecret）按该公司的 systemconfig 读取。
 * 直接注入本 bean 调用时按全局配置（company=0）执行。
 *
 * <h3>与法大大的概念映射</h3>
 * <table border="1">
 * <tr><th>法大大</th><th>e签宝 v3</th></tr>
 * <tr><td>合同编号 contentCode</td><td>业务编号由业务方管理；e签宝侧流程号存 {@link Contract#flowId()}：
 *     upload/generate 后存 fileId，签署建流后覆盖为 signFlowId</td></tr>
 * <tr><td>企业账号 signno</td><td>orgId（机构实名后产生）</td></tr>
 * <tr><td>个人账号 signno</td><td>psnId（个人实名后产生；未实名时以业务编号占位）</td></tr>
 * <tr><td>autosign 静默签</td><td>sign-flow/create-by-file，signers.autoSign=true（平台主体自动落章）</td></tr>
 * <tr><td>extsign 手动签</td><td>create-by-file（指定签署人 psnId）+ 获取签署链接</td></tr>
 * <tr><td>filing 归档</td><td>建流时 signFlowConfig.autoArchived=true，无独立归档接口（no-op）</td></tr>
 * <tr><td>certificate 申请证书</td><td>e签宝无需单独申请证书（no-op）</td></tr>
 * </table>
 *
 * <h3>不支持的能力（130098 显式报错）</h3>
 * <ul>
 *   <li>印章管理（query/add/defaults/delete/signature）：e签宝静默签自动使用主体默认印章，印章在 e签宝控制台维护</li>
 *   <li>template 合同模板上传：模板在 e签宝控制台维护（templateId 即控制台模板ID）</li>
 *   <li>getFile 认证文件下载</li>
 * </ul>
 *
 * <h3>端点核对状态（2026-10 对照 v3 官方文档）</h3>
 * <p>已核对修正：机构/个人认证链接（/v3/org-auth-url、/v3/psn-auth-url）、模板填充
 * （/v3/files/create-by-doc-template + docTemplateId）、签署链接（POST /v3/sign-flow/{id}/sign-url）、
 * 签署区关键字定位（signFields.normalSignFieldConfig.signFieldPosition）、认证状态字段（authenticated）。
 * <p>剩余联调确认项（沙箱验证）：① org-auth-url 自动签署授权参数；② psn-auth-url 的 psnInfo 字段名；
 * ③ 认证流详情（authFlowId）路径与状态字段；④ signFields 字段层级枚举值；⑤ sign-url 的 operator 入参形态；
 * ⑥ tables 动态表格能力。
 */
@Service("esignElecsignService")
public class ESignElecsignServiceImpl implements ElecsignService, CompanyAware {

	// ==================== 端点常量（2026-10 对照 v3 官方文档核对，残留「联调确认」处待沙箱验证） ====================

	/** 查询机构认证信息：GET /v3/organizations/{orgId}/auth-info，响应 authenticated 字段 */
	private static final String EP_ORG_AUTH_INFO = "/v3/organizations/%s/auth-info";

	/** 获取机构认证&授权页面链接：POST /v3/org-auth-url，入参 orgName(与orgId二选一)，响应 authFlowId/authPageUrl/orgId */
	private static final String EP_ORG_AUTH_URL = "/v3/org-auth-url";

	/** 查询个人认证信息 */
	private static final String EP_PSN_AUTH_INFO = "/v3/persons/identity-info";

	/** 获取个人认证&授权页面链接：POST /v3/psn-auth-url，响应 authFlowId/authPageUrl */
	private static final String EP_PSN_AUTH_URL = "/v3/psn-auth-url";

	/** 查询认证授权流程详情（按 authFlowId 跟踪认证进度） TODO 联调确认路径 */
	private static final String EP_AUTH_FLOW_DETAIL = "/v3/auth-flows/%s";

	/** 通过下载地址创建文件 */
	private static final String EP_FILES_CREATE_BY_URL = "/v3/files/create-by-url";

	/** 基于文档模板创建文件（模板填充）：POST /v3/files/create-by-doc-template，入参 docTemplateId/components/fileName */
	private static final String EP_DOC_CREATE_BY_TEMPLATE = "/v3/files/create-by-doc-template";

	/** 基于文件创建签署流 */
	private static final String EP_FLOW_CREATE_BY_FILE = "/v3/sign-flow/create-by-file";

	/** 签署流详情 */
	private static final String EP_FLOW_DETAIL = "/v3/sign-flow/%s/detail";

	/** 获取签署链接：POST /v3/sign-flow/{signFlowId}/sign-url，入参 operator(psnId/psnAccount)，响应 url */
	private static final String EP_FLOW_SIGN_URL = "/v3/sign-flow/%s/sign-url";

	/** 获取文件下载地址 */
	private static final String EP_FILE_URL = "/v3/files/%s/url";

	@Autowired
	private EsignClient esignClient;

	@Override
	public ElecsignService forCompany(final int company) {
		return new BoundService(company);
	}

	// ====================================================================================
	// 单例直接调用：按全局配置（company=0）执行。经 Router 路由的调用走 BoundService。
	// ====================================================================================

	@Override
	public void register(SignetPO signetPO) throws FLException {
		register(0, signetPO);
	}

	@Override
	public String authenticate(SignetPO signetPO) throws FLException {
		return authenticate(0, signetPO);
	}

	@Override
	public void company(SignetPO signetPO) throws FLException {
		company(0, signetPO);
	}

	@Override
	public String beforeauto(SignetPO signetPO) throws FLException {
		return beforeauto(0, signetPO);
	}

	@Override
	public String register(String no) throws FLException {
		return register(0, no);
	}

	@Override
	public JSONObject authenticate(String signno, String name, String phone, String identity, short type) throws FLException {
		return authenticate(0, signno, name, phone, identity, type);
	}

	@Override
	public JSONObject person(String token) throws FLException {
		return person(0, token);
	}

	@Override
	public void certificate(String no, String token) throws FLException {
		certificate(0, no, token);
	}

	@Override
	public List<SignatureVO> query(SignatureVO signatureVO) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
	}

	@Override
	public SignatureVO add(SignatureVO signatureVO) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
	}

	@Override
	public void defaults(SignatureVO signatureVO) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
	}

	@Override
	public void delete(SignatureVO signatureVO) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
	}

	@Override
	public void signature(String signno, String path) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
	}

	@Override
	public void template(String templateId, File file, String url) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 合同模板请在e签宝控制台维护");
	}

	@Override
	public void generate(Contract contract, JSONObject json, JSONArray tables) throws FLException {
		generate(0, contract, json, tables);
	}

	@Override
	public void upload(Contract contract, String path) throws FLException {
		upload(0, contract, path);
	}

	@Override
	public void autosign(String signno, String keyword, Contract contract) throws FLException {
		autosign(0, signno, keyword, contract);
	}

	@Override
	public void autosign(String signno, String keyword, Contract contract, String signatureId) throws FLException {
		autosign(0, signno, keyword, contract);
	}

	@Override
	public void autosign(String signno, String keyword, Contract contract, String signatureId, String keywordStrategy) throws FLException {
		autosign(0, signno, keyword, contract);
	}

	@Override
	public void autosign(String signno, Contract contract, String signatureId, double x, double y) throws FLException {
		throw new FLException(130098, "e签宝不支持该操作, 请使用关键字签章(autosign keyword)");
	}

	@Override
	public String extsign(String signno, Contract contract) throws FLException {
		return extsign(0, signno, contract);
	}

	@Override
	public String view(Contract contract) {
		return view(0, contract);
	}

	@Override
	public String download(Contract contract) {
		return download(0, contract);
	}

	@Override
	public void filing(Contract contract) throws FLException {
		filing(0, contract);
	}

	@Override
	public String getFile(String uuid) {
		throw new FLException(130098, "e签宝不支持该操作");
	}

	@Override
	public String decode(String bizContent) {
		return bizContent;
	}

	// ====================================================================================
	// 核心逻辑（company 显式传参）
	// ====================================================================================

	void register(int company, SignetPO signetPO) throws FLException {

		// e签宝无企业账号注册概念：signno 先以业务编号占位，机构认证通过后由 orgId 覆盖（见 authenticate/company）
	}

	String authenticate(int company, SignetPO signetPO) throws FLException {

		JSONObject body = new JSONObject();
		body.put("orgName", signetPO.getName());

		JSONObject data = esignClient.post(company, EP_ORG_AUTH_URL, body);

		// 响应：authFlowId(认证流程号) + authPageUrl(认证页面) + orgId(机构账号，认证过程中即分配)
		String url = data.getString("authPageUrl");

		signetPO.setToken(data.getString("authFlowId")); // token 复用为认证流程号（对齐法大大 token=交易号语义）
		signetPO.setAuthurl(url);

		if (data.getString("orgId") != null) {
			signetPO.setSignno(data.getString("orgId"));
		}

		return url;
	}

	void company(int company, SignetPO signetPO) throws FLException {

		if (signetPO.getSignno() == null || signetPO.getSignno().trim().isEmpty()) {
			throw new FLException(130097, "e签宝接口调用失败, 机构账号缺失, 请先完成认证");
		}

		JSONObject data = esignClient.get(company, String.format(EP_ORG_AUTH_INFO, signetPO.getSignno()), null);

		if (!Boolean.TRUE.equals(data.getBoolean("authenticated"))) {
			throw new FLException(130097, "e签宝接口调用失败, 企业实名认证未通过");
		}

		signetPO.setSignno(data.getString("orgId"));
	}

	String beforeauto(int company, SignetPO signetPO) throws FLException {

		// 静默签授权：复用机构认证&授权页面链接 TODO 联调确认自动签署授权(mode/授权书模板)与 org-auth-url 的参数差异
		JSONObject body = new JSONObject();
		body.put("orgName", signetPO.getName());

		JSONObject data = esignClient.post(company, EP_ORG_AUTH_URL, body);

		return data.toJSONString();
	}

	String register(int company, String no) throws FLException {

		// e签宝无个人账号注册概念：signno 先以业务编号占位，实名通过后由 psnId 覆盖
		return no;
	}

	JSONObject authenticate(int company, String signno, String name, String phone, String identity, short type) throws FLException {

		JSONObject body = new JSONObject();
		body.put("psnAccount", phone);
		body.put("psnInfo", new JSONObject().fluentPut("psnName", name).fluentPut("psnIdCardNum", identity).fluentPut("psnIdCardType", type == 0 ? "CRED_PSN_CH_IDCARD" : "CRED_PSN_CH_PASSPORT"));

		JSONObject data = esignClient.post(company, EP_PSN_AUTH_URL, body);

		// 响应：authFlowId + authPageUrl（TODO 联调确认 psnInfo 字段名与响应结构）
		data.put("url", data.getString("authPageUrl")); // 对齐法大大 authenticate 返回 data.url 的消费习惯

		return data;
	}

	JSONObject person(int company, String token) throws FLException {

		// token 复用为认证流程号 authFlowId（authenticate 时写入），按流程查认证进度
		// TODO 联调确认响应状态字段（认证完成判定），必要时对齐 CustomerServiceImpl.confirmCustomer 的判定逻辑
		return esignClient.get(company, String.format(EP_AUTH_FLOW_DETAIL, token), null);
	}

	void certificate(int company, String no, String token) throws FLException {

		// e签宝无需单独申请证书
	}

	void generate(int company, Contract contract, JSONObject json, JSONArray tables) throws FLException {

		// 基于文档模板创建文件：templateCode()=e签宝控制台模板ID(docTemplateId)，json=控件填充值(components)
		JSONObject body = new JSONObject();
		body.put("docTemplateId", contract.templateCode());
		body.put("components", buildComponents(json, tables));
		body.put("fileName", String.format("%s.pdf", contract.title()));

		JSONObject data = esignClient.post(company, EP_DOC_CREATE_BY_TEMPLATE, body);

		String fileId = data.getString("fileId");

		contract.flowId(fileId);
		contract.download(fileUrl(company, fileId));
		contract.viewpdf(fileUrl(company, fileId));
	}

	void upload(int company, Contract contract, String path) throws FLException {

		JSONObject body = new JSONObject();
		body.put("url", path);
		body.put("fileName", String.format("%s.pdf", contract.title()));

		JSONObject data = esignClient.post(company, EP_FILES_CREATE_BY_URL, body);

		String fileId = data.getString("fileId");

		contract.flowId(fileId);
		contract.download(fileUrl(company, fileId));
		contract.viewpdf(fileUrl(company, fileId));
	}

	void autosign(int company, String signno, String keyword, Contract contract) throws FLException {

		// signno=机构账号 orgId（印章认证后写入 signet.signno），作为静默签主体标识
		createSignFlow(company, contract, signno, keyword, true);
	}

	String extsign(int company, String signno, Contract contract) throws FLException {

		// 建流（指定个人签署人）→ 获取签署链接；失败直接抛错，不让前端拿到空 URL 误判成功
		String signFlowId = createSignFlow(company, contract, signno, null, false);

		JSONObject body = new JSONObject();
		body.put("operator", new JSONObject().fluentPut("psnId", signno)); // TODO 联调确认 operator 入参形态(psnId/psnAccount)

		JSONObject data = esignClient.post(company, String.format(EP_FLOW_SIGN_URL, signFlowId), body);

		return data.getString("url");
	}

	String view(int company, Contract contract) {

		try {
			return flowFileUrl(company, contract);
		} catch (FLException e) {
			return contract.viewpdf();
		}
	}

	String download(int company, Contract contract) {

		try {
			return flowFileUrl(company, contract);
		} catch (FLException e) {
			return contract.download();
		}
	}

	void filing(int company, Contract contract) throws FLException {

		// e签宝建流时已配置 autoArchived 自动归档，无独立归档接口
		contract.status(Contract.STATUS_FILING_INT);
	}

	// ====================================================================================
	// 私有方法
	// ====================================================================================

	/**
	 * 创建签署流。
	 *
	 * @param contract 合同（flowId() 此时为 fileId，建流后覆盖为 signFlowId）
	 * @param subject 签署主体标识：静默签=机构账号 orgId，个人签=个人 psnId
	 * @param keyword 盖章关键字（静默签定位签署域）
	 * @param autoSign true 平台主体自动落章 / false 个人手动签
	 * @return signFlowId
	 */
	private String createSignFlow(int company, Contract contract, String subject, String keyword, boolean autoSign) throws FLException {

		String fileId = contract.flowId();

		if (fileId == null || fileId.trim().isEmpty()) {
			throw new FLException(130097, "e签宝接口调用失败, 合同文件未上传(缺少厂商文件号)");
		}

		// 签署区：关键字定位（TODO 联调确认 signFields/normalSignFieldConfig/signFieldPosition 字段层级与枚举值）
		JSONObject position = new JSONObject().fluentPut("positionType", "KEYWORD");
		if (keyword != null && !keyword.trim().isEmpty()) {
			position.put("keyword", keyword);
		}

		JSONObject signField = new JSONObject();
		signField.put("fileId", fileId);
		signField.put("normalSignFieldConfig", new JSONObject().fluentPut("signFieldPosition", position));

		JSONObject signer = new JSONObject();
		signer.put("signFields", new JSONArray().fluentAdd(signField));

		if (autoSign) {
			// 平台主体静默签：orgId 指定企业主体 + autoSign=true（需该主体在 e签宝开通自动签署能力）
			signer.put("orgId", subject);
			signer.put("autoSign", true);
		} else {
			// 个人签署人：psnId（实名后分配；未实名占位号需先走认证）
			signer.put("psnId", subject);
		}

		JSONObject body = new JSONObject();
		body.put("docs", new JSONArray().fluentAdd(new JSONObject().fluentPut("fileId", fileId)));
		body.put("signers", new JSONArray().fluentAdd(signer));
		body.put("signFlowConfig", new JSONObject().fluentPut("autoArchived", true).fluentPut("signFlowTitle", contract.title()));

		JSONObject data = esignClient.post(company, EP_FLOW_CREATE_BY_FILE, body);

		String signFlowId = data.getString("signFlowId");

		contract.flowId(signFlowId);

		return signFlowId;
	}

	/** 签署流详情 → 文件下载地址。 */
	private String flowFileUrl(int company, Contract contract) throws FLException {

		String signFlowId = contract.flowId();

		if (signFlowId == null || signFlowId.trim().isEmpty()) {
			return null;
		}

		JSONObject data = esignClient.get(company, String.format(EP_FLOW_DETAIL, signFlowId), null);

		JSONArray docs = data.getJSONArray("docs");

		if (docs == null || docs.isEmpty()) {
			return null;
		}

		String fileId = docs.getJSONObject(0).getString("fileId");

		return fileUrl(company, fileId);
	}

	/** 文件下载地址。 */
	private String fileUrl(int company, String fileId) throws FLException {

		if (fileId == null || fileId.trim().isEmpty()) {
			return null;
		}

		JSONObject data = esignClient.get(company, String.format(EP_FILE_URL, fileId), null);

		JSONArray files = data.getJSONArray("files");

		return files == null || files.isEmpty() ? null : files.getJSONObject(0).getString("url");
	}

	/** 模板填充控件：平铺 json 值（动态表格 tables 暂不映射 TODO 联调确认 e签宝动态表格能力）。 */
	private JSONArray buildComponents(JSONObject json, JSONArray tables) {

		JSONArray components = new JSONArray();

		if (json != null) {
			for (Map.Entry<String, Object> entry : json.entrySet()) {
				components.add(new JSONObject().fluentPut("componentKey", entry.getKey()).fluentPut("componentValue", String.valueOf(entry.getValue())));
			}
		}

		return components;
	}

	// ====================================================================================
	// 公司绑定实例（Router.route 返回，携带公司上下文）
	// ====================================================================================

	private class BoundService implements ElecsignService {

		private final int company;

		private BoundService(int company) {
			this.company = company;
		}

		@Override
		public void register(SignetPO signetPO) throws FLException {
			ESignElecsignServiceImpl.this.register(company, signetPO);
		}

		@Override
		public String authenticate(SignetPO signetPO) throws FLException {
			return ESignElecsignServiceImpl.this.authenticate(company, signetPO);
		}

		@Override
		public void company(SignetPO signetPO) throws FLException {
			ESignElecsignServiceImpl.this.company(company, signetPO);
		}

		@Override
		public String beforeauto(SignetPO signetPO) throws FLException {
			return ESignElecsignServiceImpl.this.beforeauto(company, signetPO);
		}

		@Override
		public String register(String no) throws FLException {
			return ESignElecsignServiceImpl.this.register(company, no);
		}

		@Override
		public JSONObject authenticate(String signno, String name, String phone, String identity, short type) throws FLException {
			return ESignElecsignServiceImpl.this.authenticate(company, signno, name, phone, identity, type);
		}

		@Override
		public JSONObject person(String token) throws FLException {
			return ESignElecsignServiceImpl.this.person(company, token);
		}

		@Override
		public void certificate(String no, String token) throws FLException {
			ESignElecsignServiceImpl.this.certificate(company, no, token);
		}

		@Override
		public List<SignatureVO> query(SignatureVO signatureVO) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
		}

		@Override
		public SignatureVO add(SignatureVO signatureVO) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
		}

		@Override
		public void defaults(SignatureVO signatureVO) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
		}

		@Override
		public void delete(SignatureVO signatureVO) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
		}

		@Override
		public void signature(String signno, String path) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 印章请在e签宝控制台维护");
		}

		@Override
		public void template(String templateId, File file, String url) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 合同模板请在e签宝控制台维护");
		}

		@Override
		public void generate(Contract contract, JSONObject json, JSONArray tables) throws FLException {
			ESignElecsignServiceImpl.this.generate(company, contract, json, tables);
		}

		@Override
		public void upload(Contract contract, String path) throws FLException {
			ESignElecsignServiceImpl.this.upload(company, contract, path);
		}

		@Override
		public void autosign(String signno, String keyword, Contract contract) throws FLException {
			ESignElecsignServiceImpl.this.autosign(company, signno, keyword, contract);
		}

		@Override
		public void autosign(String signno, String keyword, Contract contract, String signatureId) throws FLException {
			ESignElecsignServiceImpl.this.autosign(company, signno, keyword, contract);
		}

		@Override
		public void autosign(String signno, String keyword, Contract contract, String signatureId, String keywordStrategy) throws FLException {
			ESignElecsignServiceImpl.this.autosign(company, signno, keyword, contract);
		}

		@Override
		public void autosign(String signno, Contract contract, String signatureId, double x, double y) throws FLException {
			throw new FLException(130098, "e签宝不支持该操作, 请使用关键字签章(autosign keyword)");
		}

		@Override
		public String extsign(String signno, Contract contract) throws FLException {
			return ESignElecsignServiceImpl.this.extsign(company, signno, contract);
		}

		@Override
		public String view(Contract contract) {
			return ESignElecsignServiceImpl.this.view(company, contract);
		}

		@Override
		public String download(Contract contract) {
			return ESignElecsignServiceImpl.this.download(company, contract);
		}

		@Override
		public void filing(Contract contract) throws FLException {
			ESignElecsignServiceImpl.this.filing(company, contract);
		}

		@Override
		public String getFile(String uuid) {
			throw new FLException(130098, "e签宝不支持该操作");
		}

		@Override
		public String decode(String bizContent) {
			return bizContent;
		}
	}

}
