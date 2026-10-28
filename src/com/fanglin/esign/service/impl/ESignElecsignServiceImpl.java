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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.SignetPO;
import com.fanglin.elecsign.bean.Contract;
import com.fanglin.elecsign.service.CompanyAware;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.elecsign.vo.SignatureVO;
import com.fanglin.esign.utils.EsignClient;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * e签宝实现（ElecsignService 的 e签宝适配）。
 * 
 * <p>
 * 本类是 Spring 单例（bean 名 esignElecsignService，供 ElecsignRouter 发现）， 真正的接口调用请通过 {@code ElecsignRouter.route(company, scene)} 返回的 {@link #forCompany(int)} 公司绑定实例进行——绑定实例携带公司上下文， e签宝凭证（elecsign.appId/appSecret）按该公司的 systemconfig 读取。 直接注入本 bean 调用时按全局配置（company=0）执行。
 * 
 * <h3>与法大大的概念映射</h3>
 * <table border="1">
 * <tr>
 * <th>法大大</th>
 * <th>e签宝 v3</th>
 * </tr>
 * <tr>
 * <td>合同编号 contentCode</td>
 * <td>业务编号由业务方管理；e签宝侧流程号存 {@link Contract#flowId()}： upload/generate 后存 fileId，签署建流后覆盖为 signFlowId</td>
 * </tr>
 * <tr>
 * <td>企业账号 signno</td>
 * <td>orgId（机构实名后产生）</td>
 * </tr>
 * <tr>
 * <td>个人账号 signno</td>
 * <td>psnId（个人实名后产生；未实名时以业务编号占位）</td>
 * </tr>
 * <tr>
 * <td>autosign 静默签</td>
 * <td>sign-flow/create-by-file，signers.autoSign=true（平台主体自动落章）； 双方场景走 autosignBoth/extsignBoth 单流合流——一份合同一张流，企业章与客户签字同文件</td>
 * </tr>
 * <tr>
 * <td>extsign 手动签</td>
 * <td>create-by-file（指定签署人 psnId）+ 获取签署链接</td>
 * </tr>
 * <tr>
 * <td>filing 归档</td>
 * <td>建流时 signFlowConfig.autoArchived=true，无独立归档接口（no-op）</td>
 * </tr>
 * <tr>
 * <td>certificate 申请证书</td>
 * <td>e签宝无需单独申请证书（no-op）</td>
 * </tr>
 * </table>
 * 
 * <h3>不支持的能力（130098 显式报错）</h3>
 * <ul>
 * <li>印章管理（query/add/defaults/delete/signature）：e签宝静默签自动使用主体默认印章，印章在 e签宝控制台维护</li>
 * <li>template 合同模板上传：模板在 e签宝控制台维护（templateId 即控制台模板ID）</li>
 * <li>getFile 认证文件下载</li>
 * </ul>
 * 
 * <h3>联调状态（2026-10-18 沙箱全链路实测通过）</h3>
 * <p>
 * 已实测打通（appId 7439144015, smlopenapi.esign.cn）：签名鉴权 → 文件两步上传 → 关键字坐标 → 建签署流（个人+坐标）→ 获取签署链接 → 流程详情，端到端 8 环节全部验证。
 * <p>
 * 实测确认的关键结构（与本实现一致）：
 * <ul>
 * <li>签名串 Date 段恒空（见 EsignClient）</li>
 * <li>psn-auth-url 入参包 psnAuthConfig；identity-info 直查 psnId（realnameStatus=1 已实名）</li>
 * <li>自动落章=normalSignFieldConfig.autoSign（个人不支持）；signFieldStyle 必传</li>
 * <li>签署区纯坐标定位，keyword 先查 keyword-positions（POST keywords[]）</li>
 * <li>sign-url：POST operator.psnId + urlType=2</li>
 * </ul>
 * <p>
 * 待沙箱继续验证：generate 模板填充（等控制台 docTemplateId）、动态表格能力、单流合流双方签署 （autosignBoth 建流→企业即时落章→extsignBoth 取链接→终稿双章同文件）、签署流完结回调 （SIGN_FLOW_COMPLETE，需控制台配置应用回调地址）。
 */
@Service("esignElecsignService")
public class ESignElecsignServiceImpl implements ElecsignService, CompanyAware {

	// ==================== 端点常量（2026-10 对照 v3 官方文档核对，残留「联调确认」处待沙箱验证） ====================

	/** 查询机构认证信息：GET /v3/organizations/identity-info?orgName=，响应 realnameStatus(1=已实名)/orgId */
	private static final String EP_ORG_IDENTITY_INFO = "/v3/organizations/identity-info";

	/** 获取机构认证&授权页面链接：POST /v3/org-auth-url，入参 orgAuthConfig.orgName，响应 authFlowId/authUrl/authShortUrl */
	private static final String EP_ORG_AUTH_URL = "/v3/org-auth-url";

	/** 查询个人认证信息 */
	private static final String EP_PSN_AUTH_INFO = "/v3/persons/identity-info";

	/** 获取个人认证&授权页面链接：POST /v3/psn-auth-url，响应 authFlowId/authUrl(同机构侧字段风格) */
	private static final String EP_PSN_AUTH_URL = "/v3/psn-auth-url";

	/** 获取文件上传地址（本地两步上传 step1，step2=PUT 上传地址且带 Content-Type/Content-MD5 头） */
	private static final String EP_FILES_FILE_UPLOAD_URL = "/v3/files/file-upload-url";

	/** 关键字坐标查询：POST /v3/files/{fileId}/keyword-positions，body keywords[]（e签宝无 keyword 定位签署区，需先查坐标） */
	private static final String EP_FLOW_KEYWORD_POSITIONS = "/v3/files/%s/keyword-positions";

	/** 基于文档模板创建文件（模板填充）：POST /v3/files/create-by-doc-template，入参 docTemplateId/components/fileName */
	private static final String EP_DOC_CREATE_BY_TEMPLATE = "/v3/files/create-by-doc-template";

	/** 基于文件创建签署流 */
	private static final String EP_FLOW_CREATE_BY_FILE = "/v3/sign-flow/create-by-file";

	/** 签署流详情 */
	private static final String EP_FLOW_DETAIL = "/v3/sign-flow/%s/detail";

	/** 发起方完结签署流（autoFinish 兜底：全部签署完成仍卡"签署中"时收口归档） */
	private static final String EP_FLOW_FINISH = "/v3/sign-flow/%s/finish";

	/** 获取签署链接：POST /v3/sign-flow/{signFlowId}/sign-url，入参 operator(psnId/psnAccount)，响应 url */
	private static final String EP_FLOW_SIGN_URL = "/v3/sign-flow/%s/sign-url";

	/** 获取文件下载地址 */
	private static final String EP_FILE_URL = "/v3/files/%s/url";
	private static final String EP_FLOW_FILE_DOWNLOAD_URL = "/v3/sign-flow/%s/file-download-url";

	/** 文档模板详情（控件清单回读，generate 前核对控件漂移/漏值用） */
	private static final String EP_DOC_TEMPLATE_DETAIL = "/v3/doc-templates/%s";

	/** 流程模板(signTemplate)体系端点——web.esign.cn SaaS 模板管理创建的模板属该体系, 与文档模板(docTemplateId)并存 */
	private static final String EP_ST_DETAIL = "/v3/sign-templates/detail";
	private static final String EP_FLOW_CREATE_BY_SIGN_TEMPLATE = "/v3/sign-flow/create-by-sign-template";
	private static final String EP_SEAL_ORG_LIST = "/v3/seals/org-own-seal-list";
	private static final String EP_FLOW_SIGN_FIELDS = "/v3/sign-flow/%s/sign-fields";

	/** 流程模板探测结果缓存(templateId→是否流程模板): 法大大/docTemplate模板缓存false后零探测开销 */
	private static final java.util.concurrent.ConcurrentHashMap<String, Boolean> FLOW_TEMPLATE_PROBE_CACHE = new java.util.concurrent.ConcurrentHashMap<String, Boolean>();

	private static final Logger logger = LoggerFactory.getLogger(ESignElecsignServiceImpl.class);

	@Autowired
	private EsignClient esignClient;

	@Autowired
	private SystemConfigDao systemConfigDao;

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
	public void autosignBoth(String orgId, String keyword, Contract contract, String signatureId, String psnSignno) throws FLException {
		autosignBoth(0, orgId, keyword, contract, psnSignno);
	}

	@Override
	public String extsignBoth(String psnSignno, Contract contract, String orgId, String orgKeyword) throws FLException {
		return extsignBoth(0, psnSignno, contract, orgId, orgKeyword);
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
	public boolean finish(Contract contract) throws FLException {
		return finish(0, contract);
	}

	@Override
	public String transactorSignUrl(Contract contract) throws FLException {
		return transactorSignUrl(0, contract);
	}

	@Override
	public boolean finishSignedFlow(Contract contract) throws FLException {
		return finishSignedFlow(0, contract);
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

		// 实测（2026-10 沙箱）：orgName 需包在 orgAuthConfig 内（对齐个人认证 psnAuthConfig 结构）
		// orgInfo(信用代码)按需传入: systemconfig 键 esign.orginfo.{company} 或全局 esign.orginfo 配置了才带——
		// 沙箱 mock 需名称+证件号成对识别测试数据; 正式环境不传=经办人 H5 自填证件号, e签宝按真实工商库 E 比对
		JSONObject orgAuthConfig = new JSONObject().fluentPut("orgName", signetPO.getName());

		String idCardNum = orgIDCardNum(company);

		if (idCardNum != null) {
			orgAuthConfig.fluentPut("orgInfo", new JSONObject().fluentPut("orgIDCardNum", idCardNum).fluentPut("orgIDCardType", "ORGANIZE_USCC"));
		}

		JSONObject body = new JSONObject();
		body.put("orgAuthConfig", orgAuthConfig);
		// 认证+授权合一(D2): 带授权范围后, 经办人打开同一链接先实名再授权, 一次操作解锁企业静默签
		// 未实名机构走两步引导, 已实名机构仅授权确认; autoSign解锁待授权E2E验证后如有增补范围在此调整
		body.put("authorizedScopes", new JSONArray().fluentAdd("manage_org_resource"));
		// 认证完成回调: 沙箱/生产同路径, ESignAuthCallback 按 authFlowId 自动推进印章状态
		// isv 值带尾部斜杠(如 http://service-erp.fanglin.vip/), 拼接前归一化, 否则 e签宝 报 notifyUrl 格式错误
		body.put("notifyUrl", normalizeIsv() + "/esignAuthCallback.do");

		JSONObject data = esignClient.post(company, EP_ORG_AUTH_URL, body);

		// 实测（2026-10 沙箱）：响应 authFlowId + authUrl + authShortUrl；无 orgId
		// （orgId 在认证完成后按 orgName 查 identity-info 获取，见 company()）
		String url = data.getString("authUrl");

		signetPO.setToken(data.getString("authFlowId")); // token 复用为认证流程号（对齐法大大 token=交易号语义）
		signetPO.setAuthurl(url);

		return url;
	}

	void company(int company, SignetPO signetPO) throws FLException {

		// 实测（2026-10 沙箱）：按 orgName 查 identity-info（认证前无 orgId；
		// 认证完成后 realnameStatus=1 并返回 orgId 写回 signno）
		Map<String, String> query = new HashMap<String, String>();
		query.put("orgName", signetPO.getName());

		JSONObject data = esignClient.get(company, EP_ORG_IDENTITY_INFO, query);

		Short status = data.getShort("realnameStatus");

		if (status == null || status.shortValue() != 1) {
			throw new FLException(130097, "e签宝接口调用失败, 企业实名认证未通过, 请先完成认证");
		}

		signetPO.setSignno(data.getString("orgId"));
	}

	String beforeauto(int company, SignetPO signetPO) throws FLException {

		// 静默签授权与认证&授权同端点(org-auth-url), 已实名机构打开同一链接仅授权确认, 一次人工操作解锁企业静默签
		// 🔴授权范围必须与 authenticate 一致(manage_org_resource): 缺了办出来的授权不解锁 autoSign, 签署时报 1435011 不允许自动签署
		// orgInfo 同 authenticate 按需传入(配置驱动), 正式环境缺省不传
		JSONObject orgAuthConfig = new JSONObject().fluentPut("orgName", signetPO.getName());

		String idCardNum = orgIDCardNum(company);

		if (idCardNum != null) {
			orgAuthConfig.fluentPut("orgInfo", new JSONObject().fluentPut("orgIDCardNum", idCardNum).fluentPut("orgIDCardType", "ORGANIZE_USCC"));
		}

		JSONObject body = new JSONObject();
		body.put("orgAuthConfig", orgAuthConfig);
		body.put("authorizedScopes", new JSONArray().fluentAdd("manage_org_resource"));
		// 授权完成回调按 authFlowId 反查印章(与 authenticate 同一回调入口)
		body.put("notifyUrl", normalizeIsv() + "/esignAuthCallback.do");

		JSONObject data = esignClient.post(company, EP_ORG_AUTH_URL, body);

		// 响应 authFlowId + authUrl/authShortUrl; token 复用为认证/授权流程号, 供回调反查
		signetPO.setToken(data.getString("authFlowId"));
		signetPO.setAuthurl(data.getString("authUrl"));

		// 返回授权页URL(对齐法大大 beforeauto 返回授权链接语义; 原实现返回整个JSON串前端无法直接跳转)
		return signetPO.getAuthurl();
	}

	String register(int company, String no) throws FLException {

		// e签宝无个人账号注册概念：signno 先以业务编号占位，实名通过后由 psnId 覆盖
		return no;
	}

	JSONObject authenticate(int company, String signno, String name, String phone, String identity, short type) throws FLException {

		// 实测确认（2026-10 沙箱）：psnAccount/psnInfo 需包在 psnAuthConfig 内，端点 POST /v3/psn-auth-url
		// 已实名账号返回 1450005"个人用户已实名"——业务方先调 identity-info 查 psnId 再决定是否走认证
		JSONObject psnInfo = new JSONObject().fluentPut("psnName", name).fluentPut("psnIdCardNum", identity).fluentPut("psnIdCardType", type == 0 ? "CRED_PSN_CH_IDCARD" : "CRED_PSN_CH_PASSPORT");

		JSONObject body = new JSONObject();
		body.put("psnAuthConfig", new JSONObject().fluentPut("psnAccount", phone).fluentPut("psnInfo", psnInfo));

		body.put("notifyUrl", normalizeIsv() + "/esignAuthCallback.do"); // 个人认证完成回调

		JSONObject data = esignClient.post(company, EP_PSN_AUTH_URL, body);

		// 实测（2026-10 沙箱）：响应 authFlowId + authUrl + authShortUrl
		data.put("url", data.getString("authUrl")); // 对齐法大大 authenticate 返回 data.url 的消费习惯
		data.put("transactionNo", data.getString("authFlowId")); // 对齐法大大 token=交易号的消费习惯(authCustomer setToken)

		return data;
	}

	JSONObject person(int company, String token) throws FLException {

		// 实测确认：GET /v3/persons/identity-info?psnAccount=手机号 → data.psnId/realnameStatus(1=已实名)
		// token 传手机号（个人账号标识），比 authFlowId 更稳定（认证前也可查）
		Map<String, String> query = new HashMap<String, String>();
		query.put("psnAccount", token);

		return esignClient.get(company, EP_PSN_AUTH_INFO, query);
	}

	void certificate(int company, String no, String token) throws FLException {

		// e签宝无需单独申请证书
	}

	void generate(int company, Contract contract, JSONObject json, JSONArray tables) throws FLException {

		// 流程模板分支: templateCode 为 signTemplateId(web.esign.cn 模板管理创建)时走 create-by-sign-template
		// 一步发起(替代文档模板的 生成文件+建流 两步), 判据=systemconfig esign.orgid.{company} 配置了模板归属企业 orgId
		String flowOrgId = orgIdFor(company);

		if (flowOrgId != null && isFlowTemplate(company, contract.templateCode(), flowOrgId)) {
			generateByFlowTemplate(company, contract, json, flowOrgId);
			return;
		}

		// 基于文档模板创建文件：templateCode()=e签宝控制台模板ID(docTemplateId)，json=控件填充值(components)
		// 生成前核对模板控件清单(告警不阻断): 控件名漂移/漏值在签出空白合同前暴露
		checkTemplateComponents(company, contract.templateCode(), json);

		JSONObject body = new JSONObject();
		body.put("docTemplateId", contract.templateCode());
		body.put("components", buildComponents(json, tables));
		body.put("fileName", String.format("%s.pdf", contract.title()));

		JSONObject data = esignClient.post(company, EP_DOC_CREATE_BY_TEMPLATE, body);

		String fileId = data.getString("fileId");

		contract.flowId(fileId);
		// 实测（2026-10 沙箱）响应直接带 fileDownloadUrl（OSS 临时地址），无需再调 /files/{id}/url
		String downloadUrl = data.getString("fileDownloadUrl");
		if (downloadUrl == null || downloadUrl.isEmpty()) {
			downloadUrl = fileUrl(company, fileId);
		}
		contract.download(downloadUrl);
		contract.viewpdf(downloadUrl);
	}

	/** 模板归属企业 orgId: systemconfig 键 esign.orgid.{company} → 全局 esign.orgid → null(非流程模板路线) */
	private String orgIdFor(int company) {

		SystemConfigPO configPO = systemConfigDao.querySystemConfig("esign.orgid." + company, company);

		if (configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim())) {
			configPO = systemConfigDao.querySystemConfig("esign.orgid");
		}

		return configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim()) ? null : configPO.getValue().trim();
	}

	/**
	 * 流程模板探测: sign-templates/detail 查得到即流程模板(signTemplateId 体系)。 查不到(1430011 等)视为文档模板——与既有文档模板路线自动分流, 模板 ID 无需前缀区分。
	 */
	private boolean isFlowTemplate(int company, String templateId, String orgId) {

		Boolean cached = FLOW_TEMPLATE_PROBE_CACHE.get(templateId);

		if (cached != null) {
			return cached.booleanValue();
		}

		try {
			Map<String, String> query = new HashMap<String, String>();
			query.put("signTemplateId", templateId);
			query.put("orgId", orgId);
			query.put("queryComponents", "true");
			JSONObject detail = esignClient.get(company, EP_ST_DETAIL, query);
			boolean hit = detail != null && detail.getString("signTemplateId") != null;
			FLOW_TEMPLATE_PROBE_CACHE.put(templateId, Boolean.valueOf(hit));
			return hit;
		} catch (FLException e) {
			FLOW_TEMPLATE_PROBE_CACHE.put(templateId, Boolean.FALSE);
			return false;
		}
	}

	/**
	 * 流程模板路线生成=直接发起签署流程（create-by-sign-template 一步替代 生成文件+建流 两步）。
	 * 
	 * <p>
	 * json 中以下划线前缀的键为流程上下文（docTemplate 路线忽略）：_flow_orgName=签章主体企业全称、 _flow_transactorName/_flow_transactorPhone=企业经办人、_flow_psnName/_flow_psnPhone=个人签署方（客户）。 participants 按模板详情的 participantId 绑定：企业方传 orgName+经办人（经办人不影响签署区自动落章）、 个人方传 psnAccount+psnName。components 按 componentKey 匹配填充值（建模板时控件须配置 key）。 发起后 flowId=signFlowId 写回, 文件下载/预览地址从流程详情取。
	 */
	private void generateByFlowTemplate(int company, Contract contract, JSONObject json, String orgId) throws FLException {

		String templateId = contract.templateCode();

		Map<String, String> detailQuery = new HashMap<String, String>();
		detailQuery.put("signTemplateId", templateId);
		detailQuery.put("orgId", orgId);
		detailQuery.put("queryComponents", "true");
		JSONObject templateDetail = esignClient.get(company, EP_ST_DETAIL, detailQuery);

		JSONArray stParticipants = templateDetail.getJSONArray("participants");

		if (stParticipants == null || stParticipants.isEmpty()) {
			throw new FLException(130097, "e签宝接口调用失败, 流程模板无参与方配置");
		}

		// 参与方绑定: 模板详情顺序即配置顺序, 企业方(含orgParticipant)绑企业信息, 个人方绑客户信息
		JSONArray participants = new JSONArray();
		JSONArray components = new JSONArray();

		for (int i = 0; i < stParticipants.size(); i++) {

			JSONObject stp = stParticipants.getJSONObject(i);
			String participantId = stp.getString("participantId");
			// 模板详情的orgParticipant/psnParticipant恒null("使用模板时指定"占位, 绑定发生在发起时)——
			// 企业/个人由participantType区分(实测befdeb9a: 1=企业章方/2=个人章签名方), orgParticipant块仅当模板固定成员时才有值
			boolean isOrg = stp.getJSONObject("orgParticipant") != null
					|| (stp.getInteger("participantType") != null && stp.getInteger("participantType").intValue() == 1);

			JSONObject p = new JSONObject().fluentPut("participantId", participantId);

			if (isOrg) {
				// 实测(2026-10-25正式): orgId/orgName二选一必传(缺一报1451000), transactor支持transactorPsnAccount(手机号)
				JSONObject orgParticipant = new JSONObject();
				// 固定企业参与方(模板详情自带orgParticipant, 如setMode=4): 主体以模板为准——传入不一致报"企业信息和模板中固定信息需一致", 仅经办人从上下文取;
				// 使用模板时指定(详情orgParticipant为null占位): 上下文取主体——orgName(签章keyword实名全称)优先与PsnAccount配对, orgId仅无全称时回退(orgId须配PsnId)
				JSONObject tplOrg = stp.getJSONObject("orgParticipant");
				String tplOrgId = tplOrg == null ? null : tplOrg.getString("orgId");
				String tplOrgName = tplOrg == null ? null : tplOrg.getString("orgName");

				if (tplOrgName != null && !tplOrgName.trim().isEmpty()) {
					orgParticipant.fluentPut("orgName", tplOrgName.trim());
				} else if (tplOrgId != null && !tplOrgId.trim().isEmpty()) {
					orgParticipant.fluentPut("orgId", tplOrgId.trim());
				} else {
					String orgName = json.getString("_flow_orgName");
					String signOrgId = json.getString("_flow_orgId");

					if (orgName != null && !orgName.trim().isEmpty()) {
						orgParticipant.fluentPut("orgName", orgName.trim());
					} else if (signOrgId != null && !signOrgId.trim().isEmpty()) {
						orgParticipant.fluentPut("orgId", signOrgId.trim());
					} else {
						throw new FLException(130097, "e签宝流程模板发起缺少签章主体企业标识(_flow_orgId/_flow_orgName)");
					}
				}
				String transactorName = json.getString("_flow_transactorName");
				String transactorPhone = json.getString("_flow_transactorPhone");
				if (transactorPhone != null && !transactorPhone.trim().isEmpty()) {
					orgParticipant.fluentPut("transactor", new JSONObject().fluentPut("transactorPsnAccount", transactorPhone.trim()).fluentPut("transactorName", transactorName == null ? null : transactorName.trim()));
				}
				p.fluentPut("orgParticipant", orgParticipant);
			} else {
				JSONObject psnParticipant = new JSONObject();
				String psnPhone = json.getString("_flow_psnPhone");
				String psnName = json.getString("_flow_psnName");
				if (psnPhone == null || psnPhone.trim().isEmpty()) {
					throw new FLException(130097, "e签宝流程模板发起缺少客户手机号(_flow_psnPhone)");
				}
				psnParticipant.fluentPut("psnAccount", psnPhone.trim());
				psnParticipant.fluentPut("psnName", psnName == null ? null : psnName.trim());
				p.fluentPut("psnParticipant", psnParticipant);
			}

			participants.add(p);
		}

		// 控件填充: 模板详情 components 的 componentKey 与 json 同名键匹配(componentKey 为空的签章区跳过)
		JSONArray stComponents = templateDetail.getJSONArray("components");

		if (stComponents != null) {
			for (int i = 0; i < stComponents.size(); i++) {
				JSONObject c = stComponents.getJSONObject(i);
				String key = c.getString("componentKey");
				if (key == null || key.trim().isEmpty() || !json.containsKey(key)) {
					continue;
				}
				String value = json.getString(key);
				if (value == null || value.trim().isEmpty()) {
					continue;
				}
				components.add(new JSONObject().fluentPut("fileId", c.getString("fileId")).fluentPut("componentId", c.getString("componentId")).fluentPut("componentValue", value));
			}
		}

		JSONObject body = new JSONObject().fluentPut("signTemplateId", templateId).fluentPut("signFlowConfig", new JSONObject().fluentPut("signFlowTitle", contract.title()).fluentPut("autoFinish", true).fluentPut("autoStart", true)).fluentPut("participants", participants);

		if (!components.isEmpty()) {
			body.put("components", components);
		}

		JSONObject data = esignClient.post(company, EP_FLOW_CREATE_BY_SIGN_TEMPLATE, body);

		String signFlowId = data.getString("signFlowId");

		contract.flowId(signFlowId);

		// 文件下载/预览地址: 流程详情 docs[].fileDownloadUrl(签署中即有临时地址)
		String fileUrl = flowTemplateFileUrl(company, signFlowId);
		contract.download(fileUrl);
		contract.viewpdf(fileUrl);
	}

	/** 流程详情 docs[0] 的 fileDownloadUrl(签署过程中的临时地址, 完结后为归档文件地址)。 */
	private String flowTemplateFileUrl(int company, String signFlowId) {

		try {
			JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, signFlowId), null);
			JSONArray docs = detail == null ? null : detail.getJSONArray("docs");
			if (docs != null && !docs.isEmpty()) {
				return docs.getJSONObject(0).getString("fileDownloadUrl");
			}
		} catch (FLException e) {
			// 查询失败返回 null, 调用方回退 contract 既有值
		}
		return null;
	}

	void upload(int company, Contract contract, String path) throws FLException {

		// 实测（2026-10 沙箱）：create-by-url 端点不存在(404)——走本地两步上传：
		// 下载源 PDF → file-upload-url(step1) → PUT(step2, Content-Type/Content-MD5 与 step1 一致)
		// 🔴JDK1.7环境兼容: 不用try-with-resources(依赖1.7+语法与Throwable.addSuppressed),
		// 改经典try/finally, close异常吞掉不掩盖主异常
		java.io.InputStream is = null;
		java.io.ByteArrayOutputStream bos = null;
		java.io.OutputStream os = null;
		java.net.HttpURLConnection connection = null;

		try {
			java.net.URL source = new java.net.URL(path);
			byte[] pdf;
			try {
				is = source.openStream();
				bos = new java.io.ByteArrayOutputStream();

				byte[] buf = new byte[8192];
				int len;
				while ((len = is.read(buf)) > 0) {
					bos.write(buf, 0, len);
				}
				pdf = bos.toByteArray();
			} finally {
				if (is != null) try {
					is.close();
				} catch (Exception e) {
				}
				if (bos != null) try {
					bos.close();
				} catch (Exception e) {
				}
			}

			String contentMd5 = org.apache.commons.codec.binary.Base64.encodeBase64String(java.security.MessageDigest.getInstance("MD5").digest(pdf));

			JSONObject step1 = esignClient.post(company, EP_FILES_FILE_UPLOAD_URL, new JSONObject().fluentPut("contentMd5", contentMd5).fluentPut("contentType", "application/pdf;").fluentPut("fileName", String.format("%s.pdf", contract.title())).fluentPut("fileSize", pdf.length));

			String fileId = step1.getString("fileId");
			String uploadUrl = step1.getString("fileUploadUrl");

			connection = (java.net.HttpURLConnection) new java.net.URL(uploadUrl).openConnection();
			connection.setRequestMethod("PUT");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/pdf;");
			connection.setRequestProperty("Content-MD5", contentMd5);
			try {
				os = connection.getOutputStream();
				os.write(pdf);
			} finally {
				if (os != null) try {
					os.close();
				} catch (Exception e) {
				}
			}
			int code = connection.getResponseCode();
			if (code != 200) {
				throw new FLException(130097, String.format("e签宝接口调用失败, 文件上传PUT %d", code));
			}

			contract.flowId(fileId);
			contract.download(fileUrl(company, fileId));
			contract.viewpdf(fileUrl(company, fileId));

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			throw new FLException(130097, String.format("e签宝接口调用失败, 文件上传异常, %s", e.getMessage()));
		}
	}

	void autosign(int company, String signno, String keyword, Contract contract) throws FLException {

		// 流程模板分支: flowId 即 signFlowId → sign-fields 指定印章落章;
		// 印章=该企业名下 sealBizType 合同专用章(缺省回退默认章), operator=流程内企业经办人 psnId;
		// 印章未授权自动签时平台登记不执行(autoExecuteSign=false)——降级为经办人签署链接模式(业务与法大大时期一致)
		if (isSignFlow(company, contract.flowId())) {
			autosignByFlowTemplate(company, contract);
			return;
		}

		// signno=机构账号 orgId（机构认证后写回 signet.signno）；自动落章仅限应用主体企业或已授权机构
		// 仅企业方单方流——装修合同等双方场景请走 autosignBoth（单流合流），否则章与客户签字分属两份文件
		createSignFlow(company, contract, signno, keyword, null);
	}

	/**
	 * 流程模板路线的企业落章: sign-fields 指定企业印章(合同专用章→默认章回退), operator=流程内企业经办人。 平台受理即成功(异步落章); 若企业未授权自动签, 平台登记不执行(autoExecuteSign=false)—— 此时抛错引导经办人经签署链接手动落章(与法大大时期公司签业务习惯一致)。
	 */
	private String autosignByFlowTemplate(int company, Contract contract) throws FLException {

		String signFlowId = contract.flowId();

		JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, signFlowId), null);

		JSONArray signers = detail.getJSONArray("signers");

		for (int i = 0; signers != null && i < signers.size(); i++) {

			JSONObject signer = signers.getJSONObject(i);
			JSONObject orgSigner = signer.getJSONObject("orgSigner");

			if (orgSigner == null) {
				continue;
			}

			JSONArray signFields = signer.getJSONArray("signFields");

			if (signFields == null || signFields.isEmpty()) {
				continue;
			}

			JSONObject signField = new JSONObject().fluentPut("signFieldId", signFields.getJSONObject(0).getString("signFieldId"));

			String sealId = orgContractSealId(company, orgSigner.getString("orgId"));

			if (sealId != null) {
				signField.fluentPut("sealId", sealId);
			}

			JSONObject transactor = orgSigner.getJSONObject("transactor");
			String psnId = transactor == null ? null : transactor.getString("psnId");

			JSONObject body = new JSONObject();
			if (psnId != null && !psnId.trim().isEmpty()) {
				body.put("operator", new JSONObject().fluentPut("psnId", psnId));
			}
			body.put("signFields", new JSONArray().fluentAdd(signField));

			JSONObject result = esignClient.post(company, String.format(EP_FLOW_SIGN_FIELDS, signFlowId), body);

			JSONArray executed = result.getJSONArray("signFields");

			if (executed != null && !executed.isEmpty() && executed.getJSONObject(0).getBooleanValue("autoExecuteSign")) {
				return null; // 受理并自动落章
			}
		}

		// 未受理(企业未授权自动签)→ 无缝降级: 返回经办人签署链接(H5手动落章, 与法大大时期公司签用法一致)
		return transactorSignUrl(company, contract);
	}

	/**
	 * 经办人签署链接: 流程详情企业签署方的经办人 psnId → sign-url。 公司自动落章未受理时的降级通道(经办人H5手动落章), 对齐法大大时期"公司签=经办人点链接"用法。
	 */
	String transactorSignUrl(int company, Contract contract) throws FLException {

		String signFlowId = contract.flowId();

		JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, signFlowId), null);

		JSONArray signers = detail.getJSONArray("signers");

		for (int i = 0; signers != null && i < signers.size(); i++) {

			JSONObject signer = signers.getJSONObject(i);
			JSONObject orgSigner = signer.getJSONObject("orgSigner");

			if (orgSigner == null) {
				continue;
			}

			JSONObject transactor = orgSigner.getJSONObject("transactor");
			String psnId = transactor == null ? null : transactor.getString("psnId");

			if (psnId != null && !psnId.trim().isEmpty()) {
				return signUrl(company, signFlowId, psnId);
			}
		}

		throw new FLException(130097, "e签宝接口调用失败, 签署流程中未找到企业经办人");
	}

	/** 企业印章 sealId: sealBizType 合同专用章优先, 回退默认章; 无印章返回 null。 */
	private String orgContractSealId(int company, String orgId) {

		if (orgId == null || orgId.trim().isEmpty()) {
			return null;
		}

		try {
			Map<String, String> sealQuery = new HashMap<String, String>();
			sealQuery.put("orgId", orgId);
			sealQuery.put("pageNum", "1");
			sealQuery.put("pageSize", "20");
			JSONObject list = esignClient.get(company, EP_SEAL_ORG_LIST, sealQuery);

			JSONArray seals = list.getJSONArray("seals");

			String fallback = null;

			for (int i = 0; seals != null && i < seals.size(); i++) {

				JSONObject seal = seals.getJSONObject(i);

				if (seal.getIntValue("sealStatus") != 1) {
					continue;
				}

				if ("CONTRACT".equals(seal.getString("sealBizType"))) {
					return seal.getString("sealId");
				}

				if (fallback == null && seal.getBooleanValue("defaultSealFlag")) {
					fallback = seal.getString("sealId");
				}
			}

			return fallback;
		} catch (FLException e) {
			return null;
		}
	}

	/**
	 * 单流合流的企业自动签：预置双方签署方一次建流，企业方 autoSign 即时落章； 客户后续经 {@link #extsign} 从同一流取链接续签（签在同一份已盖章文件上）。 流已存在时幂等不重建（客户先行场景的企业签补点）。
	 */
	void autosignBoth(int company, String orgId, String keyword, Contract contract, String psnSignno) throws FLException {

		if (isSignFlow(company, contract.flowId())) {
			return; // 流已建(客户先行/重复点击): 一份合同一张流, 不重建
		}

		if (psnSignno == null || psnSignno.trim().isEmpty()) {
			// 个人方未实名(无 psnId)时若只建企业方流, 客户后续将无法并入同一流——双章分家问题复活, 显式拦下
			throw new FLException(130189, "客户实名认证未完成, 请先发起实名认证");
		}

		createSignFlow(company, contract, orgId, keyword, psnSignno);
	}

	String extsign(int company, String signno, Contract contract) throws FLException {

		// 流程模板分支: flowId 即 signFlowId, 客户 psnId 从流程详情的个人签署方取(发起时按手机号已注册),
		// 无需依赖 signno(docTemplate 体系 psnId)——signno 参数在此分支忽略
		if (isSignFlow(company, contract.flowId())) {
			return extsignByFlowTemplate(company, contract);
		}

		// 流已建(企业签先行)→ 直接取该个人账号的签署链接, 不新建流(否则客户签的是未盖章原件, 章与签字分家);
		// 尚未建流 → 走 extsignBoth 语义(需要企业侧信息才能单流合流), 此处无企业信息按原样仅个人方建流
		return extsignBoth(company, signno, contract, null, null);
	}

	/**
	 * 流程模板路线的客户签署链接: 流程详情个人签署方(signerType=0/psnSigner 非空)的 psnId 作为 operator。 流程发起时已按客户手机号注册签署档案, 详情中的 psnId 即客户在该流程的签署身份。
	 */
	private String extsignByFlowTemplate(int company, Contract contract) throws FLException {

		String signFlowId = contract.flowId();

		JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, signFlowId), null);

		JSONArray signers = detail.getJSONArray("signers");

		for (int i = 0; signers != null && i < signers.size(); i++) {

			JSONObject signer = signers.getJSONObject(i);

			if (signer.getJSONObject("psnSigner") == null) {
				continue;
			}

			String psnId = signer.getJSONObject("psnSigner").getString("psnId");

			if (psnId != null && !psnId.trim().isEmpty()) {
				return signUrl(company, signFlowId, psnId);
			}
		}

		throw new FLException(130097, "e签宝接口调用失败, 签署流程中未找到个人签署方");
	}

	/**
	 * 单流合流的个人手动签：流已存在直接取链接；未建流则以双方流发起（企业方即时落章）后取链接。
	 */
	String extsignBoth(int company, String psnSignno, Contract contract, String orgId, String orgKeyword) throws FLException {

		String flowId = contract.flowId();

		if (isSignFlow(company, flowId)) {
			return signUrl(company, flowId, psnSignno);
		}

		if (orgId == null || orgId.trim().isEmpty()) {
			// 未建流且无企业侧信息: 只能建个人方单方流, 企业章将无法落在同一份文件上——引导先企业签
			throw new FLException(130097, "e签宝接口调用失败, 合同尚未发起企业签署, 请先完成企业签章再发送客户签署");
		}

		createSignFlow(company, contract, orgId, orgKeyword, psnSignno);

		return signUrl(company, contract.flowId(), psnSignno);
	}

	/** 获取个人签署链接（operator=psnId，urlType=2 签署链接）。 */
	private String signUrl(int company, String signFlowId, String psnId) throws FLException {

		JSONObject body = new JSONObject();
		body.put("operator", new JSONObject().fluentPut("psnId", psnId));
		body.put("urlType", 2); // 2=签署链接（1=预览）
		body.put("clientType", "ALL");

		JSONObject data = esignClient.post(company, String.format(EP_FLOW_SIGN_URL, signFlowId), body);

		return data.getString("url");
	}

	/**
	 * flowId 是否已是签署流号（建过流）：能查到流详情即 true，查不到视为文件ID（未建流）。
	 */
	private boolean isSignFlow(int company, String flowId) {

		if (flowId == null || flowId.trim().isEmpty()) {
			return false;
		}

		try {
			JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, flowId), null);
			return detail != null && detail.getString("signFlowId") != null;
		} catch (FLException e) {
			return false;
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

		// e签宝建流时已配置 autoFinish 自动归档，无独立归档接口
		contract.status(Contract.STATUS_FILING_INT);
	}

	/**
	 * 卡流判定+完结一体：流"签署中"且签署方全部完成 → 调完结收口，其余一律不动。
	 * 
	 * <p>
	 * 供巡检任务逐单调用：非流ID（仅生成未建流）、查不到、有人未签、已完结—— 全部静默返回 false（不兜底不报错），只有真卡单才 finish。
	 */
	boolean finishSignedFlow(int company, Contract contract) throws FLException {

		String flowId = contract.flowId();

		if (flowId == null || flowId.trim().isEmpty()) {
			return false;
		}

		JSONObject detail;

		try {
			detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, flowId), null);
		} catch (FLException e) {
			return false; // 非签署流ID(文件ID)或已不可查——非卡单
		}

		if (detail.getIntValue("signFlowStatus") != 1) {
			return false; // 仅"签署中"存在卡单
		}

		JSONArray signers = detail.getJSONArray("signers");

		if (signers == null || signers.isEmpty()) {
			return false;
		}

		for (int i = 0; i < signers.size(); i++) {
			if (signers.getJSONObject(i).getIntValue("signStatus") != 2) {
				return false; // 有人未签完, 正常等待中
			}
		}

		return finish(company, contract);
	}

	/**
	 * 发起方完结签署流（无 operator——应用即发起方，实测免传）。
	 * 
	 * <p>
	 * 兜底场景：签署方全部完成但流仍卡"签署中"（autoFinish 失效的历史流/网络抖动）。 全部未签署时 e签宝报 1437170"没有签署，无需归档"——调用方（巡检任务）应先查 detail 判定全部已签再调本方法。
	 * 
	 * @return true=完结成功；false=无流程号（未建流，无需兜底）
	 */
	boolean finish(int company, Contract contract) throws FLException {

		String flowId = contract.flowId();

		if (flowId == null || flowId.trim().isEmpty()) {
			return false;
		}

		esignClient.post(company, String.format(EP_FLOW_FINISH, flowId), new JSONObject());

		return true;
	}

	// ====================================================================================
	// 私有方法
	// ====================================================================================

	/**
	 * 创建签署流（2026-10 沙箱实测结构；单流合流：一次放入企业方+个人方全部签署方）。
	 * 
	 * <p>
	 * 实测要点：
	 * <ul>
	 * <li>签署方 = signerType(0个人/1机构) + psnSignerInfo{psnId} / orgSignerInfo{orgId}，signers 数组可含多方</li>
	 * <li>自动落章在 normalSignFieldConfig.autoSign（非 signer 层）；个人不支持 autoSign， 机构限应用主体企业自身（或已做印章授权）</li>
	 * <li>signFieldStyle 必传（1=单页章），否则 1435002 参数错误</li>
	 * <li>签署区只支持坐标定位：keyword 需先调 keyword-positions 查坐标（两步，对应法大大一步 keyword）</li>
	 * <li>无序签署（默认）：企业方 autoSign 建流即落章，个人方随时可签且签在同一份已盖章文件上； 流完结 autoFinish 归档，一份终稿双章齐全</li>
	 * </ul>
	 * 
	 * @param contract 合同（flowId() 此时为 fileId，建流后覆盖为 signFlowId）
	 * @param orgId 企业签署账号 orgId（null=不含企业方）
	 * @param keyword 盖章关键字（企业方必传，先查坐标定位签署区）
	 * @param psnId 个人签署账号 psnId（null=不含个人方）
	 * @return signFlowId
	 */
	private String createSignFlow(int company, Contract contract, String orgId, String keyword, String psnId) throws FLException {

		String fileId = resolveFileId(company, contract.flowId());

		if (fileId == null || fileId.trim().isEmpty()) {
			throw new FLException(130097, "e签宝接口调用失败, 合同文件未上传(缺少厂商文件号)");
		}

		JSONArray signers = new JSONArray();

		if (orgId != null && !orgId.trim().isEmpty()) {

			if (keyword == null || keyword.trim().isEmpty()) {
				throw new FLException(130097, "e签宝接口调用失败, 自动落章必须提供盖章关键字");
			}

			JSONObject pos = firstKeywordPosition(company, fileId, keyword);

			JSONObject orgNormalJson = new JSONObject();
			orgNormalJson.put("autoSign", true);
			// 指定位置签章：signFieldStyle=1(单页) + keyword 预查坐标
			orgNormalJson.put("signFieldStyle", 1);
			orgNormalJson.put("signFieldPosition", new JSONObject().fluentPut("positionPage", String.valueOf(pos.getIntValue("pageNum"))).fluentPut("positionX", pos.getJSONArray("coordinates").getJSONObject(0).getDoubleValue("positionX")).fluentPut("positionY", pos.getJSONArray("coordinates").getJSONObject(0).getDoubleValue("positionY")));

			JSONObject orgSigner = new JSONObject();
			orgSigner.put("signerType", 1);
			orgSigner.put("orgSignerInfo", new JSONObject().fluentPut("orgId", orgId));
			orgSigner.put("signFields", new JSONArray().fluentAdd(signField(fileId, orgNormalJson)));

			signers.add(orgSigner);
		}

		if (psnId != null && !psnId.trim().isEmpty()) {

			// 手动签=自由签章模式：不限制位置/样式/个数, 客户在 H5 页面自选(对齐法大大 extsign 自选语义);
			// 非自由模式必须传 signFieldPosition 否则 1435002"非自由模式signFieldPosition不能为空"
			JSONObject psnNormalJson = new JSONObject();
			psnNormalJson.put("autoSign", false);
			psnNormalJson.put("freeMode", true);

			JSONObject psnSigner = new JSONObject();
			psnSigner.put("signerType", 0);
			psnSigner.put("psnSignerInfo", new JSONObject().fluentPut("psnId", psnId));
			psnSigner.put("signFields", new JSONArray().fluentAdd(signField(fileId, psnNormalJson)));

			signers.add(psnSigner);
		}

		if (signers.isEmpty()) {
			throw new FLException(130097, "e签宝接口调用失败, 签署方为空(企业方与个人方账号均未提供)");
		}

		JSONObject body = new JSONObject();
		body.put("docs", new JSONArray().fluentAdd(new JSONObject().fluentPut("fileId", fileId)));
		body.put("signers", signers);
		// 实测(2026-10沙箱): v3字段名为autoFinish(传autoArchived无效被忽略, 流签完卡"签署中"不归档); signFlowTitle必填
		// notifyUrl: 签署流完结回调——v3以应用控制台回调配置推送为主, 此处一并尝试下发(未知字段实测被静默忽略, 不致错)
		body.put("signFlowConfig", new JSONObject().fluentPut("autoFinish", true).fluentPut("signFlowTitle", contract.title()).fluentPut("notifyUrl", normalizeIsv() + "/esignAuthCallback.do"));

		JSONObject data = esignClient.post(company, EP_FLOW_CREATE_BY_FILE, body);

		String signFlowId = data.getString("signFlowId");

		contract.flowId(signFlowId);

		return signFlowId;
	}

	/** 签署域（普通签章）公共结构：fileId + signFieldType=0 + normalSignFieldConfig。 */
	private JSONObject signField(String fileId, JSONObject normalJson) {

		JSONObject signField = new JSONObject();
		signField.put("fileId", fileId);
		signField.put("signFieldType", 0);
		signField.put("normalSignFieldConfig", normalJson);

		return signField;
	}

	/**
	 * 解析真实文件ID（flowId 双语义：add/generate 后存 fileId，任一签署建流后覆盖为 signFlowId）。 先企业签再客户签时 flowId 已是 signFlowId，直接当 fileId 建流会报"文档不存在"—— 先按签署流详情反查 docs[0].fileId，查不到（非流ID）则视为 fileId 原样使用。
	 */
	private String resolveFileId(int company, String id) throws FLException {

		if (id == null || id.trim().isEmpty()) {
			return null;
		}

		try {
			JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, id), null);

			JSONArray docs = detail.getJSONArray("docs");

			if (docs != null && !docs.isEmpty()) {
				String fileId = docs.getJSONObject(0).getString("fileId");

				if (fileId != null && !fileId.trim().isEmpty()) {
					return fileId;
				}
			}
		} catch (FLException e) {
			// 非流ID(即fileId本身), 按文件ID原样使用
		}

		return id;
	}

	/** 关键字坐标查询（POST keywords[]）。多个命中取第一个（对应法大大 keywordStrategy=首个策略；全部命中策略待业务确认）。 */
	private JSONObject firstKeywordPosition(int company, String fileId, String keyword) throws FLException {

		JSONObject data = esignClient.post(company, String.format(EP_FLOW_KEYWORD_POSITIONS, fileId), new JSONObject().fluentPut("keywords", new JSONArray().fluentAdd(keyword)));

		JSONArray list = data.getJSONArray("keywordPositions");

		if (list == null || list.isEmpty()) {
			throw new FLException(130097, String.format("e签宝接口调用失败, 关键字[%s]未在合同文件中定位到", keyword));
		}

		JSONObject first = list.getJSONObject(0);

		if (!Boolean.TRUE.equals(first.getBoolean("searchResult")) || first.getJSONArray("positions") == null || first.getJSONArray("positions").isEmpty()) {
			throw new FLException(130097, String.format("e签宝接口调用失败, 关键字[%s]未在合同文件中定位到", keyword));
		}

		return first.getJSONArray("positions").getJSONObject(0);
	}

	/**
	 * 模板控件核对（告警不阻断，生成前把关）。
	 * 
	 * <p>
	 * 对照控制台模板控件清单，报告两类漂移——都是"签出空白/错位合同"的前兆：
	 * <ul>
	 * <li>模板有控件但本次未赋值 → 该位置将渲染空白</li>
	 * <li>前端传了模板上没有的控件 key → e签宝静默忽略（实测），值不会出现</li>
	 * </ul>
	 * 每次生成多一次模板详情 GET；核对失败只记日志不影响生成。
	 */
	private void checkTemplateComponents(int company, String docTemplateId, JSONObject json) {

		try {
			JSONObject detail = esignClient.get(company, String.format(EP_DOC_TEMPLATE_DETAIL, docTemplateId), null);

			JSONArray components = detail.getJSONArray("components");

			if (components == null || components.isEmpty()) {
				return;
			}

			Set<String> templateKeys = new HashSet<String>();

			for (int i = 0; i < components.size(); i++) {
				String key = components.getJSONObject(i).getString("componentKey");
				if (key != null && !key.trim().isEmpty()) {
					templateKeys.add(key);
				}
			}

			if (templateKeys.isEmpty()) {
				return;
			}

			// 模板控件缺值 → 渲染空白
			List<String> blank = new ArrayList<String>();

			for (String key : templateKeys) {
				String value = json == null ? null : json.getString(key);
				if (value == null || value.trim().isEmpty()) {
					blank.add(key);
				}
			}

			// 前端多传 → e签宝静默忽略
			List<String> unknown = new ArrayList<String>();

			if (json != null) {
				for (Map.Entry<String, Object> entry : json.entrySet()) {
					if (entry.getKey().startsWith("_flow_")) {
						continue; // 流程上下文键非控件, 不参与核对
					}
					if (!templateKeys.contains(entry.getKey())) {
						unknown.add(entry.getKey());
					}
				}
			}

			if (!blank.isEmpty() || !unknown.isEmpty()) {
				logger.warn("e签宝模板控件核对[{}]: 模板有控件未赋值(将渲染空白)={}, 传了模板上没有的控件key(被忽略)={}", docTemplateId, blank, unknown);
			}
		} catch (Exception e) {
			logger.warn("e签宝模板控件核对失败[{}](不影响生成): {}", docTemplateId, e.getMessage());
		}
	}

	/** 签署流详情 → 文件下载地址。 */
	private String flowFileUrl(int company, Contract contract) throws FLException {

		String signFlowId = contract.flowId();

		if (signFlowId == null || signFlowId.trim().isEmpty()) {
			return null;
		}

		// 优先: 流程产物文件下载(流完成后的带章归档文件; 沙箱实测2026-10)——
		// 流程产物 fileId 走应用空间 /v3/files/{id}/url 是 404, 必须用流程下载端点
		try {
			JSONObject data = esignClient.get(company, String.format(EP_FLOW_FILE_DOWNLOAD_URL, signFlowId), null);

			JSONArray files = data.getJSONArray("files");

			if (files != null && !files.isEmpty()) {
				return files.getJSONObject(0).getString("downloadUrl");
			}
		} catch (FLException e) {
			// 流未完成/产物未生成: 回退应用空间文件地址
		}

		JSONObject detail = esignClient.get(company, String.format(EP_FLOW_DETAIL, signFlowId), null);

		JSONArray docs = detail.getJSONArray("docs");

		if (docs == null || docs.isEmpty()) {
			return null;
		}

		String fileId = docs.getJSONObject(0).getString("fileId");

		return fileUrl(company, fileId);
	}

	/** 机构证件号: systemconfig 键 esign.orginfo.{company} → 全局 esign.orginfo → null(不传orgInfo, 经办人H5自填) */
	private String orgIDCardNum(int company) {

		SystemConfigPO configPO = systemConfigDao.querySystemConfig("esign.orginfo." + company, company);

		if (configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim())) {
			configPO = systemConfigDao.querySystemConfig("esign.orginfo");
		}

		return configPO == null || configPO.getValue() == null || "".equals(configPO.getValue().trim()) ? null : configPO.getValue().trim();
	}

	/** isv 归一化：从 DB systemconfig(company=0) 读取(properties 文件无 isv key)，去尾部斜杠。 */
	private String normalizeIsv() {

		SystemConfigPO isvPO = systemConfigDao.querySystemConfig("isv");

		String isv = isvPO == null ? null : isvPO.getValue();

		if (isv != null && isv.endsWith("/")) {
			isv = isv.substring(0, isv.length() - 1);
		}

		return isv == null ? "" : isv;
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
				// _flow_* 为流程模板路线的发起上下文(签署人/主体企业), 非文档模板控件——透传会被e签宝以"控件不存在"拒绝
				if (entry.getKey().startsWith("_flow_")) {
					continue;
				}
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
		public void autosignBoth(String orgId, String keyword, Contract contract, String signatureId, String psnSignno) throws FLException {
			ESignElecsignServiceImpl.this.autosignBoth(company, orgId, keyword, contract, psnSignno);
		}

		@Override
		public String extsignBoth(String psnSignno, Contract contract, String orgId, String orgKeyword) throws FLException {
			return ESignElecsignServiceImpl.this.extsignBoth(company, psnSignno, contract, orgId, orgKeyword);
		}

		@Override
		public String transactorSignUrl(Contract contract) throws FLException {
			return ESignElecsignServiceImpl.this.transactorSignUrl(company, contract);
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
		public boolean finish(Contract contract) throws FLException {
			return ESignElecsignServiceImpl.this.finish(company, contract);
		}

		@Override
		public boolean finishSignedFlow(Contract contract) throws FLException {
			return ESignElecsignServiceImpl.this.finishSignedFlow(company, contract);
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
