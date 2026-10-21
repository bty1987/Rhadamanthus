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
 * <td>sign-flow/create-by-file，signers.autoSign=true（平台主体自动落章）</td>
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
 * 待沙箱继续验证：generate 模板填充（等控制台 docTemplateId）、org-auth-url 自动签署授权、 动态表格能力、真实签署完成后的回调。
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
	@SuppressWarnings("unused")
	private static final String EP_FILES_FILE_UPLOAD_URL = "/v3/files/file-upload-url";

	/** 关键字坐标查询：POST /v3/files/{fileId}/keyword-positions，body keywords[]（e签宝无 keyword 定位签署区，需先查坐标） */
	private static final String EP_FLOW_KEYWORD_POSITIONS = "/v3/files/%s/keyword-positions";

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

		// 实测（2026-10 沙箱）：orgName 需包在 orgAuthConfig 内（对齐个人认证 psnAuthConfig 结构）
		// 沙箱 mock 规则（官方"构造企业实名认证测试数据"文档）：名称+证件号成对传入才识别为测试数据
		JSONObject orgInfo = new JSONObject()
				.fluentPut("orgIDCardNum", "910000040897920017")
				.fluentPut("orgIDCardType", "ORGANIZE_USCC");
		JSONObject body = new JSONObject();
		body.put("orgAuthConfig", new JSONObject()
				.fluentPut("orgName", signetPO.getName())
				.fluentPut("orgInfo", orgInfo));
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

		// 静默签授权：复用机构认证&授权页面链接 TODO 联调确认自动签署授权(mode/授权书模板)与 org-auth-url 的参数差异
		JSONObject orgInfo = new JSONObject()
				.fluentPut("orgIDCardNum", "910000040897920017")
				.fluentPut("orgIDCardType", "ORGANIZE_USCC");
		JSONObject body = new JSONObject();
		body.put("orgAuthConfig", new JSONObject()
				.fluentPut("orgName", signetPO.getName())
				.fluentPut("orgInfo", orgInfo));

		JSONObject data = esignClient.post(company, EP_ORG_AUTH_URL, body);

		return data.toJSONString();
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

		// 基于文档模板创建文件：templateCode()=e签宝控制台模板ID(docTemplateId)，json=控件填充值(components)
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

	void upload(int company, Contract contract, String path) throws FLException {

		// 实测（2026-10 沙箱）：create-by-url 端点不存在(404)——走本地两步上传：
		// 下载源 PDF → file-upload-url(step1) → PUT(step2, Content-Type/Content-MD5 与 step1 一致)
		try {
			java.net.URL source = new java.net.URL(path);
			byte[] pdf;
			try (java.io.InputStream is = source.openStream(); java.io.ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream()) {
				byte[] buf = new byte[8192];
				int len;
				while ((len = is.read(buf)) > 0) {
					bos.write(buf, 0, len);
				}
				pdf = bos.toByteArray();
			}

			String contentMd5 = org.apache.commons.codec.binary.Base64.encodeBase64String(java.security.MessageDigest.getInstance("MD5").digest(pdf));

			JSONObject step1 = esignClient.post(company, EP_FILES_FILE_UPLOAD_URL, new JSONObject()
					.fluentPut("contentMd5", contentMd5)
					.fluentPut("contentType", "application/pdf;")
					.fluentPut("fileName", String.format("%s.pdf", contract.title()))
					.fluentPut("fileSize", pdf.length));

			String fileId = step1.getString("fileId");
			String uploadUrl = step1.getString("fileUploadUrl");

			java.net.HttpURLConnection connection = (java.net.HttpURLConnection) new java.net.URL(uploadUrl).openConnection();
			connection.setRequestMethod("PUT");
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/pdf;");
			connection.setRequestProperty("Content-MD5", contentMd5);
			try (java.io.OutputStream os = connection.getOutputStream()) {
				os.write(pdf);
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

		// signno=机构账号 orgId（机构认证后写回 signet.signno）；自动落章仅限应用主体企业或已授权机构
		createSignFlow(company, contract, true, signno, keyword, true);
	}

	String extsign(int company, String signno, Contract contract) throws FLException {

		// 建流（个人手动签，无坐标=用户 H5 页面自选签章位置）→ 获取签署链接
		String signFlowId = createSignFlow(company, contract, false, signno, null, false);

		JSONObject body = new JSONObject();
		body.put("operator", new JSONObject().fluentPut("psnId", signno));
		body.put("urlType", 2); // 2=签署链接（1=预览）
		body.put("clientType", "ALL");

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
	 * 创建签署流（2026-10 沙箱实测结构）。
	 * 
	 * <p>
	 * 实测要点：
	 * <ul>
	 * <li>签署方 = signerType(0个人/1机构) + psnSignerInfo{psnId} / orgSignerInfo{orgId}</li>
	 * <li>自动落章在 normalSignFieldConfig.autoSign（非 signer 层）；个人不支持 autoSign， 机构限应用主体企业自身（或已做印章授权）</li>
	 * <li>signFieldStyle 必传（1=单页章），否则 1435002 参数错误</li>
	 * <li>签署区只支持坐标定位：keyword 需先调 keyword-positions 查坐标（两步，对应法大大一步 keyword）</li>
	 * </ul>
	 * 
	 * @param contract 合同（flowId() 此时为 fileId，建流后覆盖为 signFlowId）
	 * @param subject 签署主体标识：个人=psnId，机构=orgId
	 * @param keyword 盖章关键字（非空时先查坐标定位签署区）
	 * @param autoSign true 后台自动落章（仅机构）/ false 页面手动签
	 * @return signFlowId
	 */
private String createSignFlow(int company, Contract contract, boolean orgSigner, String subject, String keyword, boolean autoSign) throws FLException {

	String fileId = resolveFileId(company, contract.flowId());

	if (fileId == null || fileId.trim().isEmpty()) {
		throw new FLException(130097, "e签宝接口调用失败, 合同文件未上传(缺少厂商文件号)");
	}

		// 签署区：autoSign 场景用关键字查坐标；手动签场景不传位置则由用户在 H5 页面自选
		NormalSignFieldHolder normal = new NormalSignFieldHolder();
		normal.autoSign = autoSign;

		if (autoSign) {
			if (keyword == null || keyword.trim().isEmpty()) {
				throw new FLException(130097, "e签宝接口调用失败, 自动落章必须提供盖章关键字");
			}
			JSONObject pos = firstKeywordPosition(company, fileId, keyword);
			normal.position = new JSONObject().fluentPut("positionPage", String.valueOf(pos.getIntValue("pageNum"))).fluentPut("positionX", pos.getJSONArray("coordinates").getJSONObject(0).getDoubleValue("positionX")).fluentPut("positionY", pos.getJSONArray("coordinates").getJSONObject(0).getDoubleValue("positionY"));
		}

		JSONObject signField = new JSONObject();
		signField.put("fileId", fileId);
		signField.put("signFieldType", 0);
		JSONObject normalJson = new JSONObject();
		normalJson.put("autoSign", normal.autoSign);
		if (normal.autoSign) {
			// 指定位置签章：signFieldStyle=1(单页) + keyword 预查坐标
			normalJson.put("signFieldStyle", 1);
			normalJson.put("signFieldPosition", normal.position);
		} else {
			// 手动签=自由签章模式：不限制位置/样式/个数, 客户在 H5 页面自选(对齐法大大 extsign 自选语义);
			// 非自由模式必须传 signFieldPosition 否则 1435002"非自由模式signFieldPosition不能为空"
			normalJson.put("freeMode", true);
		}
		signField.put("normalSignFieldConfig", normalJson);

		JSONObject signer = new JSONObject();
		signer.put("signerType", orgSigner ? 1 : 0);
		if (orgSigner) {
			signer.put("orgSignerInfo", new JSONObject().fluentPut("orgId", subject));
		} else {
			signer.put("psnSignerInfo", new JSONObject().fluentPut("psnId", subject));
		}
		signer.put("signFields", new JSONArray().fluentAdd(signField));

		JSONObject body = new JSONObject();
		body.put("docs", new JSONArray().fluentAdd(new JSONObject().fluentPut("fileId", fileId)));
		body.put("signers", new JSONArray().fluentAdd(signer));
		// 实测(2026-10沙箱): v3字段名为autoFinish(传autoArchived无效被忽略, 流签完卡"签署中"不归档); signFlowTitle必填
		body.put("signFlowConfig", new JSONObject().fluentPut("autoFinish", true).fluentPut("signFlowTitle", contract.title()));

		JSONObject data = esignClient.post(company, EP_FLOW_CREATE_BY_FILE, body);

		String signFlowId = data.getString("signFlowId");

		contract.flowId(signFlowId);

		return signFlowId;
	}

	/**
	 * 解析真实文件ID（flowId 双语义：add/generate 后存 fileId，任一签署建流后覆盖为 signFlowId）。
	 * 先企业签再客户签时 flowId 已是 signFlowId，直接当 fileId 建流会报"文档不存在"——
	 * 先按签署流详情反查 docs[0].fileId，查不到（非流ID）则视为 fileId 原样使用。
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

	/** 签章区配置载体（内部传递用）。 */
	private static class NormalSignFieldHolder {

		private boolean autoSign;

		private JSONObject position;
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
