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
import java.util.HashMap;
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
 * <h3>联调核对清单（TODO）</h3>
 * <p>以下端点按 e签宝 v3 文档整理，上线联调须逐一核对（常量集中在下方）：
 * 机构/个人认证页面链接、模板填充生成文档、签署链接三个端点的请求/响应字段名。
 */
@Service("esignElecsignService")
public class ESignElecsignServiceImpl implements ElecsignService, CompanyAware {

	// ==================== 端点常量（联调核对处） ====================

	/** 查询机构认证信息 */
	private static final String EP_ORG_AUTH_INFO = "/v3/organization/auth-info";

	/** 获取机构认证&授权页面链接 TODO 联调核对端点与参数 */
	private static final String EP_ORG_AUTH_URL = "/v3/organization/auth-page-url";

	/** 查询个人认证信息 */
	private static final String EP_PSN_AUTH_INFO = "/v3/person/auth-info";

	/** 获取个人认证&授权页面链接 TODO 联调核对端点与参数 */
	private static final String EP_PSN_AUTH_URL = "/v3/person/auth-page-url";

	/** 通过下载地址创建文件 */
	private static final String EP_FILES_CREATE_BY_URL = "/v3/files/create-by-url";

	/** 基于模板创建文档（模板填充） TODO 联调核对端点与参数 */
	private static final String EP_DOC_CREATE_BY_TEMPLATE = "/v3/doc/create-by-template";

	/** 基于文件创建签署流 */
	private static final String EP_FLOW_CREATE_BY_FILE = "/v3/sign-flow/create-by-file";

	/** 签署流详情 */
	private static final String EP_FLOW_DETAIL = "/v3/sign-flow/detail/%s";

	/** 获取签署链接 TODO 联调核对端点与参数 */
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
	public String extsign(String signno, Contract contract) {
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

		// e签宝无企业账号注册概念：机构已实名则取 orgId 写回 signno，未实名等待 authenticate 流程
		Map<String, String> query = new HashMap<String, String>();
		query.put("orgName", signetPO.getName());

		JSONObject data = esignClient.get(company, EP_ORG_AUTH_INFO, query);

		if (Boolean.TRUE.equals(data.getBoolean("verified"))) {
			signetPO.setSignno(data.getString("orgId"));
		}
	}

	String authenticate(int company, SignetPO signetPO) throws FLException {

		JSONObject body = new JSONObject();
		body.put("orgName", signetPO.getName());

		JSONObject data = esignClient.post(company, EP_ORG_AUTH_URL, body);

		String url = data.getString("url");

		signetPO.setAuthurl(url);

		return url;
	}

	void company(int company, SignetPO signetPO) throws FLException {

		Map<String, String> query = new HashMap<String, String>();
		query.put("orgName", signetPO.getName());

		JSONObject data = esignClient.get(company, EP_ORG_AUTH_INFO, query);

		if (!Boolean.TRUE.equals(data.getBoolean("verified"))) {
			throw new FLException(130097, "e签宝接口调用失败, 企业实名认证未通过");
		}

		signetPO.setSignno(data.getString("orgId"));
	}

	String beforeauto(int company, SignetPO signetPO) throws FLException {

		// 静默签授权：复用机构授权页面链接（认证&授权模式），返回厂商原始结果串
		JSONObject body = new JSONObject();
		body.put("orgName", signetPO.getName());
		body.put("authMode", "silent");

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
		body.put("psnInfo", new JSONObject().fluentPut("name", name).fluentPut("idNumber", identity).fluentPut("idType", type == 0 ? "CRED_PSN_CH_IDCARD" : "CRED_PSN_CH_PASSPORT"));

		return esignClient.post(company, EP_PSN_AUTH_URL, body);
	}

	JSONObject person(int company, String token) throws FLException {

		Map<String, String> query = new HashMap<String, String>();
		query.put("psnAccount", token);

		return esignClient.get(company, EP_PSN_AUTH_INFO, query);
	}

	void certificate(int company, String no, String token) throws FLException {

		// e签宝无需单独申请证书
	}

	void generate(int company, Contract contract, JSONObject json, JSONArray tables) throws FLException {

		// 模板填充生成文档：templateCode()=e签宝控制台模板ID，json=填充控件值
		JSONObject body = new JSONObject();
		body.put("templateId", contract.templateCode());
		body.put("components", buildComponents(json, tables));

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
		createSignFlow(company, contract, null, keyword, true);
	}

	String extsign(int company, String signno, Contract contract) {

		try {

			String signFlowId = createSignFlow(company, contract, signno, null, false);

			Map<String, String> query = new HashMap<String, String>();
			query.put("psnId", signno);

			JSONObject data = esignClient.get(company, String.format(EP_FLOW_SIGN_URL, signFlowId), query);

			return data.getString("url");

		} catch (FLException e) {
			return null;
		}
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
	 * @param psnId 个人签署人 psnId（null 表示平台主体静默签）
	 * @param keyword 盖章关键字（静默签定位签署域）
	 * @param autoSign true 平台主体自动落章 / false 个人手动签
	 * @return signFlowId
	 */
	private String createSignFlow(int company, Contract contract, String psnId, String keyword, boolean autoSign) throws FLException {

		String fileId = contract.flowId();

		if (fileId == null || fileId.trim().isEmpty()) {
			throw new FLException(130097, "e签宝接口调用失败, 合同文件未上传(缺少厂商文件号)");
		}

		JSONObject signField = new JSONObject();
		signField.put("fileId", fileId);

		if (keyword != null && !keyword.trim().isEmpty()) {
			signField.put("posBean", new JSONObject().fluentPut("keyword", keyword));
		}

		JSONObject signer = new JSONObject();
		signer.put("signFields", new JSONArray().fluentAdd(signField));

		if (autoSign) {
			// 平台主体静默签：e签宝后台自动取 appid 所属公司信息与默认印章
			signer.put("autoSign", true);
		} else {
			signer.put("psnId", psnId);
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
		public String extsign(String signno, Contract contract) {
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
