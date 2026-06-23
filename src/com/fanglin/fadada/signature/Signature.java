package com.fanglin.fadada.signature;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;

import Decoder.BASE64Decoder;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fadada.sdk.base.client.FddBaseClient;
import com.fadada.sdk.base.model.req.AddSignatureParams;
import com.fadada.sdk.base.model.req.BeforeAuthSignParams;
import com.fadada.sdk.base.model.req.ContractFillingParams;
import com.fadada.sdk.base.model.req.DownloadPdfParams;
import com.fadada.sdk.base.model.req.ExtSignAutoParams;
import com.fadada.sdk.base.model.req.ExtSignParams;
import com.fadada.sdk.base.model.req.GenerateContractParams;
import com.fadada.sdk.base.model.req.RegisterAccountParams;
import com.fadada.sdk.base.model.req.UploadDocsParams;
import com.fadada.sdk.base.model.req.UploadTemplateParams;
import com.fadada.sdk.base.model.req.ViewPdfURLParams;
import com.fadada.sdk.extra.client.FddExtraClient;
import com.fadada.sdk.extra.model.req.DefaultSignatureParams;
import com.fadada.sdk.extra.model.req.QuerySignatureParams;
import com.fadada.sdk.extra.model.req.RemoveSignatureParams;
import com.fadada.sdk.verify.client.FddVerifyClient;
import com.fadada.sdk.verify.model.req.ApplyCertParams;
import com.fadada.sdk.verify.model.req.CompanyVerifyUrlParams;
import com.fadada.sdk.verify.model.req.CompanyVerifyUrlParams.BankInfo;
import com.fadada.sdk.verify.model.req.CompanyVerifyUrlParams.CompanyInfo;
import com.fadada.sdk.verify.model.req.CompanyVerifyUrlParams.LegalInfo;
import com.fadada.sdk.verify.model.req.FileForUUIDParams;
import com.fadada.sdk.verify.model.req.FindCompanyCertParams;
import com.fadada.sdk.verify.model.req.FindPersonCertParams;
import com.fadada.sdk.verify.model.req.PersonVerifyUrlParams;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.SignetPO;
import com.fanglin.fadada.bean.Contract;
import com.fanglin.fadada.tools.FddEncryptTool;
import com.fanglin.fadada.vo.SignatureVO;
import com.fanglin.utils.EncryptConfigLoader;
import com.fanglin.utils.SystemConfig;

public class Signature {

	private static final Logger logger = Logger.getLogger(Signature.class);

	private static String APPID = null;
	private static String APPSECRET = null;
	private static String VERSION = "2.0";
	private static String HOST = null;

	private static String NOTIFY_URL_STR = "http://www.fanglin.cc";
	private static String RETURN_URL_STR = "http://www.fanglin.cc"; // http://fanglin.vip:30080/communion/signatureCallback.do

	// https://open.fadada.com/index.html#/portal/documentCenter/66RZRDRHPD/LA5RUYXPDXPVZVCE

	private static String configFilePathName = "/fadada.properties";

	private static Properties prop;

	static {
		try {
			try {
				prop = EncryptConfigLoader.load(configFilePathName);
			} catch (Throwable e) {
				logger.info("EncryptConfigLoader加载失败，回退到原始方式: " + e.getMessage());
				prop = new Properties();
				prop.load(SystemConfig.class.getResourceAsStream(configFilePathName));
			}

			APPID = prop.getProperty("appid");
			APPSECRET = prop.getProperty("secret");
			VERSION = "2.0";
			HOST = prop.getProperty("host");

		} catch (Throwable e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}

	public static String KEYWORD_STRATEGY_ALL_STR = "0";

	public static String KEYWORD_STRATEGY_FIRST_STR = "1";

	public static String KEYWORD_STRATEGY_LAST_STR = "2";

	public static List<SignatureVO> query(SignatureVO signatureVO) throws FLException {

		FddExtraClient client = new FddExtraClient(APPID, APPSECRET, VERSION, HOST);

		QuerySignatureParams params = new QuerySignatureParams();

		params.setCustomerId(signatureVO.getCustomerId());

		String result = client.invokeQuerySignature(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130066, "印章信息获取失败");
		}

		if (response.getInteger("code") != 1) {
			logger.error("印章信息获取失败: " + result);
			throw new FLException(130066, String.format("印章信息获取失败, %s", response.getString("msg")));
		}

		List<SignatureVO> signatures = new ArrayList<SignatureVO>();

		JSONArray data = response.getJSONArray("data");

		for (int i = 0; i < data.size(); i++) {
			JSONObject signature = data.getJSONObject(i);

			signatureVO = new SignatureVO().jtv(signature);

			signatureVO.setCustomerId(signatureVO.getCustomerId());

			signatures.add(signatureVO);
		}

		return signatures;
	}

	public static SignatureVO add(SignatureVO signatureVO) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		AddSignatureParams params = new AddSignatureParams();

		params.setCustomerId(signatureVO.getCustomerId()); // 客户编号

		String image = null;

		try {

			image = FddEncryptTool.ImageToBase64(signatureVO.getPath());

			// 下面章图片base64、签章图片、图片公网地址三选一

			params.setSignatureImgBase64(FddEncryptTool.ImageToBase64(signatureVO.getPath())); // 签章图片base64
			// params.setFile(new File(signatureVO.getPath())); // 签章图片
			// params.setImgUrl(signatureVO.getPath()); // 签章图片公网地址
		} catch (Exception e) {
			logger.error("图片获取失败, path=" + signatureVO.getPath() + ", error=" + e.getMessage(), e);
			throw new FLException(130074, "图片获取失败");
		}

		String result = client.invokeAddSignature(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130067, "印章添加失败");
		}

		if (response.getInteger("code") != 1) {
			logger.error("印章添加失败: " + result);
			throw new FLException(130067, String.format("印章添加失败, %s", response.getString("msg")));
		}

		JSONObject signature = response.getJSONObject("data");

		signatureVO.setImage(image);

		return signatureVO.jtv(signature);
	}

	public static void defaults(SignatureVO signatureVO) throws FLException {

		FddExtraClient client = new FddExtraClient(APPID, APPSECRET, VERSION, HOST);

		DefaultSignatureParams params = new DefaultSignatureParams();

		params.setCustomerId(signatureVO.getCustomerId());
		params.setSignatureId(signatureVO.getSignatureId());

		String result = client.invokeDefaultSignature(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130068, "印章默认失败");
		}

		if (response.getInteger("code") != 1) {
			logger.error("印章默认失败: " + result);
			throw new FLException(130068, String.format("印章默认失败, %s", response.getString("msg")));
		}
	}

	public static void delete(SignatureVO signatureVO) throws FLException {

		FddExtraClient client = new FddExtraClient(APPID, APPSECRET, VERSION, HOST);

		RemoveSignatureParams params = new RemoveSignatureParams();

		params.setCustomerId(signatureVO.getCustomerId());
		params.setSignatureId(signatureVO.getSignatureId());

		String result = client.invokeRemoveSignature(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130069, "印章删除失败");
		}

		if (response.getInteger("code") != 1) {
			logger.error("印章删除失败: " + result);
			throw new FLException(130069, String.format("印章删除失败, %s", response.getString("msg")));
		}
	}

	public static void register(SignetPO signetPO) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		RegisterAccountParams params = new RegisterAccountParams();

		params.setAccountType("2"); // 账号类型 , 1: 个人 , 2: 企业
		params.setOpenId(signetPO.getNo()); // 平台方自定义唯一标识

		String result = client.invokeRegisterAccount(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("企业客户注册失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		signetPO.setSignno(response.getString("data"));
	}

	public static String authenticate(SignetPO signetPO) throws FLException {

		FddVerifyClient client = new FddVerifyClient(APPID, APPSECRET, VERSION, HOST);

		CompanyVerifyUrlParams params = new CompanyVerifyUrlParams();

		params.setCustomerId(signetPO.getSignno());
		params.setPageModify("1"); // 1允许 2不允许 默认为1

		params.setVerifiedWay("0"); // 实名认证套餐类型： 0：标准方案（对公打款+纸质审核+法人身份+法人授权）；1：对公打款；2：纸质审核；3：法人身份（授权）认证
		params.setMVerifiedWay("0"); // 管理员认证套餐类型： 0：三要素标准方案； 1：三要素补充方案； 2：四要素标准方案； 3：四要素补充方案； 4：纯三要素方案； 5：纯四要素方案；

		params.setCertFlag("1"); // 自动申请证书 , 0: 不申请 , 1: 自动申请
		params.setReturnUrl(RETURN_URL_STR);
		params.setNotifyUrl(NOTIFY_URL_STR);

		CompanyInfo companyInfo = new CompanyInfo();

		companyInfo.setCompanyName(signetPO.getName());
		companyInfo.setCreditNo("");
		companyInfo.setCreditImagePath("");

		params.setCompanyInfo(companyInfo);
		params.setCompanyPrincipalType("1");

		LegalInfo legalInfo = new LegalInfo();

		params.setLegalInfo(legalInfo);

		BankInfo bankInfo = new BankInfo();

		params.setBankInfo(bankInfo);

		String result = client.invokeCompanyVerifyUrl(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130059, "公司认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("企业认证URL获取失败: " + result);
			throw new FLException(130059, response.getString("msg"));
		}

		JSONObject data = response.getJSONObject("data");

		String authurl = decode(data.getString("url"));

		signetPO.setToken(data.getString("transactionNo"));
		signetPO.setAuthurl(authurl);

		return authurl;
	}

	public static void company(SignetPO signetPO) throws FLException {

		FddVerifyClient client = new FddVerifyClient(APPID, APPSECRET, VERSION, HOST);

		FindCompanyCertParams params = new FindCompanyCertParams();

		params.setVerifiedSerialNo(signetPO.getToken());// 此处填获取企业实名认证地址返回的交易号

		String result = client.invokeFindCompanyCert(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130059, "公司认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("企业认证查询失败: " + result);
			throw new FLException(130059, response.getString("msg"));
		}

		JSONObject data = response.getJSONObject("data");
		JSONObject company = data.getJSONObject("company");

		if (!"4".equals(company.getString("status"))) {
			logger.error("企业认证状态异常: " + result);
			throw new FLException(130059, String.format("公司认证失败,%s", company.getString("status")));
		}
	}

	public static String beforeauto(SignetPO signetPO) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		BeforeAuthSignParams params = new BeforeAuthSignParams();

		params.setAuthType("1");// 1:授权自动签（目前只能填1）

		params.setTransactionId(signetPO.getToken()); // 平台自定义唯一交易号
		params.setContractId(String.format("%s%s", signetPO.getNo(), signetPO.getSid())); // 指该份线上授权委托书的合同编号，自定义即可
		params.setCustomerId(signetPO.getSignno()); // 传入注册返回的个人或企业客户编号

		params.setReturnUrl(RETURN_URL_STR);// 同步通知签署结果地址
		params.setNotifyUrl(NOTIFY_URL_STR);// 异步通知签署结果地址

		return client.invokeBeforeAuthSign(params);
	}

	public static String register(String no) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		RegisterAccountParams params = new RegisterAccountParams();

		params.setAccountType("1"); // 注册类型 , 1: 个人 , 2: 公司
		params.setOpenId(no); // 平台方自定义唯一标识

		String result = client.invokeRegisterAccount(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("个人客户注册失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		return response.getString("data");
	}

	public static JSONObject authenticate(String signno, String name, String phone, String identity, short type) throws FLException {

		FddVerifyClient client = new FddVerifyClient(APPID, APPSECRET, VERSION, HOST);

		PersonVerifyUrlParams params = new PersonVerifyUrlParams();

		params.setCustomerId(signno); // 客户编号
		params.setVerifiedWay("0"); // 实名认证套餐类型 , 0: 三要素标准方案
		params.setPageModify("1"); // 是否允许用户页面修改, 1: 允许 , 2: 不允许

		// params.setNotifyUrl(NOTIFY_URL_STR); // 异步回调地址
		// params.setReturnUrl(RETURN_URL_STR); // 同步通知url
		params.setResultType("1"); // 认证跳转方式 , 1: 直接跳转 , 2: 确认后跳转
		params.setCertFlag("1"); // 自动申请证书 , 0: 不申请 , 1: 自动申请
		params.setCertType("0"); // 证件类型 , 0: 身份证 , 1: 护照 , B: 港澳 , C: 台湾

		params.setCustomerName(name); // 姓名
		params.setMobile(phone); // 手机号码
		params.setCustomerIdentType("0"); // 证件类型
		params.setCustomerIdentNo(identity); // 证件号码

		if (type == 0) {
			params.setCustomerIdentType("0");
			params.setCertType("0");
		}

		if (type == 1) {
			params.setCustomerIdentType("1");
			params.setCertType("1");
		}

		String result = client.invokePersonVerifyUrl(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("个人认证URL获取失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		JSONObject data = response.getJSONObject("data");

		return data;
	}

	public static JSONObject person(String token) throws FLException {

		FddVerifyClient client = new FddVerifyClient(APPID, APPSECRET, VERSION, HOST);

		FindPersonCertParams params = new FindPersonCertParams();

		params.setVerifiedSerialNo(token); // 此处填获取个人实名认证地址返回的交易号

		String result = client.invokeFindPersonCert(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("个人认证查询失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		JSONObject data = response.getJSONObject("data");
		JSONObject person = data.getJSONObject("person");

		if (!"2".equals(person.getString("status"))) {
			logger.error("个人认证状态异常: " + result);
			throw new FLException(130027, String.format("客户认证失败,%s", person.getString("auditFailReason")));
		}

		return data;
	}

	public static void certificate(String no, String token) throws FLException {

		FddVerifyClient client = new FddVerifyClient(APPID, APPSECRET, VERSION, HOST);

		ApplyCertParams params = new ApplyCertParams();

		params.setCustomerId(no); // 客户编号
		params.setVerifiedSerialNo(token); // 填写获取实名认证地址返回的交易号ransactionNo

		String result = client.invokeApplyCert(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			logger.error("证书申请失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}
	}

	public static void signature(String signno, String path) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		try {

			AddSignatureParams params = new AddSignatureParams();

			params.setCustomerId(signno); // 客户编号

			// 下面章图片base64、签章图片、图片公网地址三选一
			params.setImgUrl(path); // 签章图片公网地址
			// params.setFile(new File(path));
			// params.setSignatureImgBase64(FddEncryptTool.ImageToBase64(path));

			String result = client.invokeAddSignature(params);

			JSONObject response = JSONObject.parseObject(result);

			if (response == null) {
				throw new FLException(130027, "客户认证失败,请求错误");
			}

			if (response.getInteger("code") != 1) {
				logger.error("签章添加失败: " + result);
				throw new FLException(130027, response.getString("msg"));
			}
		} catch (Exception e) {
			logger.error("签章处理失败, path=" + path + ", error=" + e.getMessage(), e);
			throw new FLException(130027, "客户认证失败,获取签章失败");
		}

		// JSONObject data = response.getJSONObject("data");
		//
		// String signatureId = decode(data.getString("signature_id"));
		//
		// result = ExtendService.invokedefaultSignature(base, signno, signatureId);
		//
		// System.out.println(result);
	}

	public static void template(String templateId, File file, String url) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		if (file != null && !file.exists()) {
			throw new FLException(-3, "文件上传失败");
		}

		UploadTemplateParams params = new UploadTemplateParams();

		params.setTemplateId(templateId); // 平台自定义唯一模板编号

		if (file != null) {
			params.setFile(file);
		}

		if (url != null) {
			params.setDocUrl(url); // 文档地址
		}

		String result = client.invokeUploadTemplate(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130030, "合同模版上传失败");
		}

		if (response.getInteger("code") != 1) {
			logger.error("合同模版上传失败: " + result);
			throw new FLException(130030, String.format("合同模版上传失败,%s", response.getString("msg")));
		}
	}

	public static void generate(Contract contract, JSONObject json, JSONArray tables) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		GenerateContractParams params = new GenerateContractParams();

		params.setTemplateId(contract.templateCode()); // 模板编号
		params.setContractId(contract.contentCode()); // 合同编号

		// 以下是非必填参数
		params.setDocTitle(""); // 文档标题
		params.setFontSize("12"); // 字体大小
		params.setFontType(""); // 字体类型
		params.setParameterMap(json.toJSONString()); // 填充内容,json字符串
		params.setDynamicTables(tables == null ? "" : tables.toJSONString()); // 动态表格

		// 在版本号设置为 2.1 时，实现了对填充内容和动态表单进行3DES加密
		// baseClient.setVersion("2.1");

		String result = client.invokeGenerateContract(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (!"1000".equals(response.getString("code"))) {
			logger.error("合同生成失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		contract.download(response.getString("download_url"));
		contract.viewpdf(response.getString("viewpdf_url"));
	}

	public static void upload(Contract contract, String path) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		UploadDocsParams params = new UploadDocsParams();

		params.setContractId(contract.contentCode());
		params.setDocTitle("");
		params.setFile(null);
		params.setDocUrl(path);
		params.setDocType(".pdf");

		String result = client.invokeUploadDocs(params);

		logger.info("合同文档上传结果: " + result);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (!"1000".equals(response.getString("code"))) {
			logger.error("合同文档上传失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		contract.download(download(contract));
		contract.viewpdf(view(contract));
	}

	public static void autosign(String signno, String keyword, Contract contract) throws FLException {
		Signature.autosign(signno, keyword, contract, null, Signature.KEYWORD_STRATEGY_ALL_STR);
	}

	public static void autosign(String signno, String keyword, Contract contract, String signatureId) throws FLException {
		Signature.autosign(signno, keyword, contract, signatureId, Signature.KEYWORD_STRATEGY_ALL_STR);
	}

	public static void autosign(String signno, String keyword, Contract contract, String signatureId, String keywordStrategy) throws FLException {

		FddBaseClient base = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		ExtSignAutoParams params = new ExtSignAutoParams();

		params.setCustomerId(signno);
		params.setContractId(contract.contentCode());
		params.setTransactionId(String.format("%s%s", signno, contract.contentCode()));

		params.setDocTitle(contract.title()); // 文档标题
		params.setSignKeyword(keyword);

		params.setClientRole("1"); // 客户角色 , 接入平台
		params.setPositionType("0");
		params.setKeywordStrategy(keywordStrategy); // 签章策略 , 0: 所有 , 1: 第一个 , 2: 最后一个

		if (signatureId != null && !"".equals(signatureId)) {
			params.setSignatureId(signatureId);
		}

		String result = base.invokeExtSignAuto(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (!"1000".equals(response.getString("code"))) {
			logger.error("自动签署失败(关键字): " + result);
			throw new FLException(130027, response.getString("msg"));
		}
	}

	public static void autosign(String signno, Contract contract, String signatureId, double x, double y) throws FLException {

		FddBaseClient base = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		ExtSignAutoParams params = new ExtSignAutoParams();

		params.setCustomerId(signno);
		params.setContractId(contract.contentCode());
		params.setTransactionId(String.format("%s%s", signno, contract.contentCode()));

		params.setDocTitle(contract.title()); // 文档标题

		params.setClientRole("1"); // 客户角色 , 接入平台
		params.setPositionType("1");
		params.setSignaturePositions(String.format("[{\"pagenum\":\"0\",\"x\":\"%.0f\",\"y\":\"%.0f\"}]", x, y));

		if (signatureId != null && !"".equals(signatureId)) {
			params.setSignatureId(signatureId);
		}

		String result = base.invokeExtSignAuto(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (!"1000".equals(response.getString("code"))) {
			logger.error("自动签署失败(坐标): " + result);
			throw new FLException(130027, response.getString("msg"));
		}
	}

	public static String extsign(String signno, Contract contract) {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		ExtSignParams params = new ExtSignParams();

		params.setCustomerId(signno);
		params.setContractId(contract.contentCode());
		params.setTransactionId(String.format("%s%s", signno, contract.contentCode()));
		params.setMobileSignType("1"); // 签章类型 , 0: 全部 , 1: 标准 , 2: 手写

		params.setDocTitle(contract.title()); // 文档标题
		params.setReturnUrl(RETURN_URL_STR);

		return client.invokeExtSign(params);
	}

	public static String view(Contract contract) {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		ViewPdfURLParams params = new ViewPdfURLParams();

		params.setContractId(contract.contentCode());

		return client.invokeViewPdfURL(params);
	}

	public static String download(Contract contract) {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		DownloadPdfParams params = new DownloadPdfParams();

		params.setContractId(contract.contentCode());

		return client.invokeDownloadPdf(params);
	}

	public static void filing(Contract contract) throws FLException {

		FddBaseClient client = new FddBaseClient(APPID, APPSECRET, VERSION, HOST);

		ContractFillingParams params = new ContractFillingParams();

		params.setContractId(contract.contentCode());

		String result = client.invokeContractFilling(params);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if ("1000".equals(response.getInteger("code"))) {
			logger.error("合同归档失败: " + result);
			throw new FLException(130027, response.getString("msg"));
		}

		contract.status(Contract.STATUS_FILING_INT);
	}

	public static String getFile(String uuid) {

		FddVerifyClient client = new FddVerifyClient(APPID, APPSECRET, VERSION, HOST);

		FileForUUIDParams params = new FileForUUIDParams();

		params.setUuid(uuid);// 此处传个人实名认证接口查询中返回的认证图片id，或查询企业认证信息中返回的企业认证申请表id
		params.setDocType("1");// 0：图片（默认图片）1：pdf (仅支持企业申请表模板)

		return client.invokeFileForUUID(params);
	}

	@SuppressWarnings("unused")
	private static String squarepng(String message) throws FLException {

		int width = 100;
		int height = 100;

		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

		Graphics2D g2 = image.createGraphics();

		image = g2.getDeviceConfiguration().createCompatibleImage(width, height, Transparency.TRANSLUCENT);

		g2 = image.createGraphics();// 得到图形上下文

		g2.setColor(Color.RED); // 设置画笔颜色

		g2.setStroke(new BasicStroke(3)); // 边框粗细设置
		g2.drawRect(1, 1, 96, 96); // 绘制边框

		// 设置字体
		g2.setFont(new Font("宋体", Font.LAYOUT_LEFT_TO_RIGHT, 50));// 写入签名
		g2.setStroke(new BasicStroke(1));

		int length = message.length();
		String fillstr = "之印章";

		message = String.format("%s%s", message, fillstr.substring(length - 1, 3)); // 如果三个 则 XXX章 如果两个则 XX之章 大于3个 则 取前三

		char[] charArray = message.toCharArray();

		g2.drawString(new String(new char[] { charArray[0] }), 0, 45); // 写文字
		g2.drawString(new String(new char[] { charArray[1] }), 0, 90); // 写文字
		g2.drawString(new String(new char[] { charArray[2] }), 48, 45); // 写文字
		g2.drawString(new String(new char[] { charArray[3] }), 48, 90); // 写文字

		g2.dispose();

		ByteArrayOutputStream out = new ByteArrayOutputStream();

		try {
			ImageIO.write(image, "png", out);
			out.flush();
			return new String(Base64.encodeBase64(out.toByteArray()));
		} catch (IOException e) {
			throw new FLException(130027, "客户认证失败,请求错误");
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				throw new FLException(130027, "客户认证失败,请求错误");
			}
		}
	}

	public static String decode(String bizContent) {
		try {
			bizContent = URLDecoder.decode(bizContent, "utf-8");
			bizContent = new String(Base64.decodeBase64(bizContent.getBytes()));
		} catch (UnsupportedEncodingException e) {
			return "";
		}
		return bizContent;
	}

	public static String zoom(String data) throws FLException {

		try {
			BASE64Decoder decoder = new BASE64Decoder();

			byte[] b = decoder.decodeBuffer(data);
			for (int i = 0; i < b.length; ++i) {
				if (b[i] < 0) {// 调整异常数据
					b[i] += 256;
				}
			}

			BufferedImage img = ImageIO.read(new ByteArrayInputStream(b));

			int _width = 100;
			int _height = 70;

			java.awt.Image _img = img.getScaledInstance(_width, _height, 1); // 获取缩放后的Image对象
			BufferedImage image = new BufferedImage(_width, _height, BufferedImage.TYPE_INT_RGB); // 新建一个和Image对象相同大小的画布
			Graphics2D graphics = image.createGraphics(); // 获取画笔
			graphics.drawImage(_img, 0, 0, null); // 将Image对象画在画布上,最后一个参数,ImageObserver:接收有关 Image 信息通知的异步更新接口,没用到直接传空

			graphics.dispose(); // 释放资源

			ByteArrayOutputStream os = new ByteArrayOutputStream();

			ImageIO.write(image, "png", os);

			return new String(Base64.encodeBase64(os.toByteArray()));
		} catch (Exception e) {
			throw new FLException(140069, "客户签名失败");
		}
	}

	public static void main(String[] args) throws FLException {

		// Signature.template("TEMP202004060001", "D:\\0405测试合同模板.pdf");
		// Signature.template1("TEMP202009270001", "http://www.fanglinserver.com/group3/M00/05/72/wKgFcF9v8fiAFFYcAAJc5ZwqSl4668.pdf");

	}
}
