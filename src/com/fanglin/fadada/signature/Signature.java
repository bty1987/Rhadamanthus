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
import java.util.Properties;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

import Decoder.BASE64Decoder;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fadada.sdk.client.FddClientBase;
import com.fadada.sdk.client.FddClientExtra;
import com.fadada.sdk.client.authForfadada.ApplyCert;
import com.fadada.sdk.client.authForfadada.AuthBeforeSign;
import com.fadada.sdk.client.authForfadada.FindCertInfo;
import com.fadada.sdk.client.authForfadada.GetCompanyVerifyUrl;
import com.fadada.sdk.client.authForfadada.GetFileForUUID;
import com.fadada.sdk.client.authForfadada.GetPersonVerifyUrl;
import com.fadada.sdk.client.authForfadada.model.AgentInfoINO;
import com.fadada.sdk.client.authForfadada.model.BankInfoINO;
import com.fadada.sdk.client.authForfadada.model.CompanyInfoINO;
import com.fadada.sdk.client.authForfadada.model.LegalInfoINO;
import com.fadada.sdk.client.request.ExtsignReq;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.SignetPO;
import com.fanglin.fadada.bean.Contract;
import com.fanglin.fadada.tools.FddEncryptTool;
import com.fanglin.utils.SystemConfig;

@Service("signature")
public class Signature {

	private static String APPID = "402616";
	private static String APPSECRET = "krdhPR4a4Hb8ET1oJm9WxFAQ";
	private static String VERSION = "2.0";
	private static String HOST = "https://testapi.fadada.com:8443/api/";

	private static String NOTIFY_URL_STR = "http://www.fanglin.vip/";
	private static String RETURN_URL_STR = "http://www.fanglin.vip/"; // http://fanglin.vip:30080/communion/signatureCallback.do

	private static String configFilePathName = "/fadada.properties";

	private static Properties prop;

	static {
		try {
			prop = new Properties();
			prop.load(SystemConfig.class.getResourceAsStream(configFilePathName));

			APPID = prop.getProperty("appid");
			APPSECRET = prop.getProperty("secret");
			VERSION = "2.0";
			HOST = prop.getProperty("host");

		} catch (Throwable e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}

	public static void register(SignetPO signetPO) throws FLException {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		String result = base.invokeregisterAccount(signetPO.getNo(), "2"); // 注册类型 , 1: 个人 , 2: 公司

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}

		signetPO.setSignno(response.getString("data"));
	}

	public static String authenticate(SignetPO signetPO) throws FLException {

		GetCompanyVerifyUrl comverify = new GetCompanyVerifyUrl(APPID, APPSECRET, VERSION, HOST);

		String verifyed_way = "0"; // 认证套餐类型 , 0: 对公打款+纸质审核
		String m_verified_way = "0";// 实名认证套餐类型 , 0: 三要素 , 1: 四要素
		String page_modify = "1"; // 认证内容是否可修改 , 1: 允许
		String company_principal_type = "1";// 1.法人，2代理人
		String result_type = "1"; // 认证跳转方式 , 1: 直接跳转 , 2: 确认后跳转
		String cert_flag = "1"; // 自动申请证书 , 0: 不申请 , 1: 自动申请

		String signno = signetPO.getSignno();

		CompanyInfoINO companyInfo = new CompanyInfoINO();
		companyInfo.setCompany_name(signetPO.getName());
		companyInfo.setCredit_no("");
		companyInfo.setCredit_image_path("");

		BankInfoINO bankInfo = new BankInfoINO();

		LegalInfoINO legalInfo = new LegalInfoINO();

		AgentInfoINO agentInfo = new AgentInfoINO();

		String result = comverify.invokeCompanyVerifyUrl(companyInfo, bankInfo, legalInfo, agentInfo, signno, verifyed_way, m_verified_way, page_modify, company_principal_type, RETURN_URL_STR, NOTIFY_URL_STR, result_type, cert_flag, null, null, null, null, null);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130059, "公司认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130059, String.format("公司认证失败,%s", response.getString("msg")));
		}

		JSONObject data = response.getJSONObject("data");

		String authurl = decode(data.getString("url"));

		signetPO.setToken(data.getString("transactionNo"));
		signetPO.setAuthurl(authurl);

		return authurl;
	}

	public static void company(SignetPO signetPO) throws FLException {

		FindCertInfo personCertInfo = new FindCertInfo(APPID, APPSECRET, VERSION, HOST);

		String result = personCertInfo.invokeFindPersonCert(signetPO.getToken(), "2");

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130059, "公司认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130059, String.format("公司认证失败,%s", response.getString("msg")));
		}

		JSONObject data = response.getJSONObject("data");
		JSONObject company = data.getJSONObject("company");

		if (!"4".equals(company.getString("status"))) {
			System.out.println(result);
			throw new FLException(130059, String.format("公司认证失败,%s", company.getString("status")));
		}
	}

	public static String beforeauto(SignetPO signetPO) throws FLException {

		AuthBeforeSign authBeforeSign = new AuthBeforeSign(APPID, APPSECRET, VERSION, HOST);

		String transactionId = String.format(signetPO.getToken());
		String contractId = String.format("%s%s", signetPO.getNo(), signetPO.getSid());
		String customerId = signetPO.getSignno();

		String authType = "1";

		return authBeforeSign.invokeAuthBeforeSign(transactionId, authType, contractId, customerId, RETURN_URL_STR, NOTIFY_URL_STR);
	}

	public static void register(CustomerPO customerPO) throws FLException {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		String result = base.invokeregisterAccount(customerPO.getNo(), "1"); // 注册类型 , 1: 个人 , 2: 公司

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}

		customerPO.setSignno(response.getString("data"));
	}

	public static String authenticate(CustomerPO customerPO) throws FLException {

		GetPersonVerifyUrl personverify = new GetPersonVerifyUrl(APPID, APPSECRET, VERSION, HOST);

		String verifyed_way = "0"; // 认证套餐类型 , 0: 三要素标准方案
		String page_modify = "1"; // 认证内容是否可修改 , 1: 允许
		String customer_ident_type = "0"; // 证件类型 , 0: 身份证 , 1: 其他
		String ident_front_path = "";
		String result_type = "1"; // 认证跳转方式 , 1: 直接跳转 , 2: 确认后跳转
		String cert_flag = "1"; // 自动申请证书 , 0: 不申请 , 1: 自动申请

		String signno = customerPO.getSignno();
		String customerPhone = customerPO.getPhone();
		String customerName = customerPO.getName();
		String customerIdent = customerPO.getIdentity();

		String result = personverify.invokePersonVerifyUrl(signno, verifyed_way, page_modify, NOTIFY_URL_STR, RETURN_URL_STR, customerName, customer_ident_type, customerIdent, customerPhone, ident_front_path, result_type, cert_flag, null, null, null, null, null);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}

		JSONObject data = response.getJSONObject("data");

		String authurl = decode(data.getString("url"));

		customerPO.setToken(data.getString("transactionNo"));

		return authurl;
	}

	public static void person(CustomerPO customerPO) throws FLException {

		FindCertInfo personCertInfo = new FindCertInfo(APPID, APPSECRET, VERSION, HOST);

		String result = personCertInfo.invokeFindPersonCert(customerPO.getToken(), "1");

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}

		JSONObject data = response.getJSONObject("data");
		JSONObject person = data.getJSONObject("person");

		if (!"2".equals(person.getString("status"))) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", person.getString("status")));
		}

		customerPO.setName(person.getString("personName"));
		customerPO.setIdentity(person.getString("idCard"));
		customerPO.setPhone(person.getString("mobile"));
		customerPO.setAddress(person.getString("address"));

		customerPO.setPhotoPath(person.getString("photoUuid"));
		customerPO.setIdentityPathF(person.getString("headPhotoPath"));
		customerPO.setIdentityPathB(person.getString("backgroundIdCardPath"));

		customerPO.setStatus(CustomerPO.STATUS_AUTH_INT);
	}

	public static void certificate(CustomerPO customerPO) throws FLException {

		ApplyCert applyCert = new ApplyCert(APPID, APPSECRET, VERSION, HOST);

		String result = applyCert.invokeApplyCert(customerPO.getNo(), customerPO.getToken());

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}
	}

	public static void signature(String signno, String path) throws FLException {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		try {
			String result = base.invokeaddSignature(signno, FddEncryptTool.ImageToBase64(path));

			JSONObject response = JSONObject.parseObject(result);

			if (response == null) {
				throw new FLException(130027, "客户认证失败,请求错误");
			}

			if (response.getInteger("code") != 1) {
				System.out.println(result);
				throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
			}
		} catch (Exception e) {

			System.out.println(path);
			System.out.println(e.getMessage());

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

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		if (file != null && !file.exists()) {
			throw new FLException(-3, "文件上传失败");
		}

		String result = base.invokeUploadTemplate(templateId, file, url);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130030, "合同模版上传失败");
		}

		if (response.getInteger("code") != 1) {
			System.out.println(result);
			throw new FLException(130030, String.format("合同模版上传失败,%s", response.getString("msg")));
		}
	}

	public static void generate(Contract contract, JSONObject params, JSONArray tables) throws FLException {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		String font_size = "";
		String font_type = "4";
		String paramter = params.toJSONString();
		String dynamic_tables = tables == null ? "" : tables.toJSONString();

		String result = base.invokeGenerateContract(contract.templateCode(), contract.contentCode(), "", font_size, font_type, paramter, dynamic_tables);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (!"1000".equals(response.getString("code"))) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}

		contract.download(response.getString("download_url"));
		contract.viewpdf(response.getString("viewpdf_url"));
	}

	public static void autosign(String signno, String keyword, Contract contract) throws FLException {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		ExtsignReq req = new ExtsignReq();

		req.setCustomer_id(signno);
		req.setContract_id(contract.contentCode());
		req.setTransaction_id(String.format("%s%s", signno, contract.contentCode()));

		req.setDoc_title(contract.title()); // 文档标题
		req.setSign_keyword(keyword);

		req.setClient_role("1"); // 客户角色 , 接入平台
		req.setKeyword_strategy("0"); // 签章策略 , 0: 所有 , 1: 第一个 , 2: 最后一个

		String result = base.invokeExtSignAuto(req);

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if (!"1000".equals(response.getString("code"))) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}
	}

	public static String extsign(String signno, Contract contract) {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		ExtsignReq req = new ExtsignReq();

		req.setCustomer_id(signno);
		req.setContract_id(contract.contentCode());
		req.setTransaction_id(String.format("%s%s", signno, contract.contentCode()));

		req.setDoc_title(contract.title()); // 文档标题
		req.setReturn_url(RETURN_URL_STR);

		return base.invokeExtSign(req);
	}

	public static String view(Contract contract) {

		FddClientExtra extra = new FddClientExtra(APPID, APPSECRET, VERSION, HOST);

		return extra.invokeViewPdfURL(contract.contentCode());
	}

	public static void filing(Contract contract) throws FLException {

		FddClientBase base = new FddClientBase(APPID, APPSECRET, VERSION, HOST);

		String result = base.invokeContractFilling(contract.contentCode());

		JSONObject response = JSONObject.parseObject(result);

		if (response == null) {
			throw new FLException(130027, "客户认证失败,请求错误");
		}

		if ("1000".equals(response.getInteger("code"))) {
			System.out.println(result);
			throw new FLException(130027, String.format("客户认证失败,%s", response.getString("msg")));
		}

		contract.status(Contract.STATUS_FILING_INT);
	}

	public static String getFile(String uuid) {
		GetFileForUUID getFileForUUID = new GetFileForUUID(APPID, APPSECRET, VERSION, HOST);
		return getFileForUUID.invokeFileForUUID(uuid, "pdf");
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

	private static String decode(String bizContent) {
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
