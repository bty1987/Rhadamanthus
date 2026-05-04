package com.fanglin.kingdee.handle;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.EncryptConfigLoader;

public class Kandle {

	// K3 Cloud WebSite URL Example "http://192.168.19.113/K3Cloud/"
	public static String K3CLOUD_URL_STR = null;

	// Cookie值
	private static String CookieVal = null;

	private static String dbid = null;
	private static String uid = null;
	private static String pwd = null;
	private static int lang = 2052;

	private static Properties prop;

	private static String configFilePathName = "/kingdee.properties";

	static {
		try {
			try {
				prop = EncryptConfigLoader.load(configFilePathName);
			} catch (Throwable e) {
				// 兜底: EncryptConfigLoader 加载/解密失败时, 使用原有方式直接读取配置文件
				java.io.InputStream is = Kandle.class.getResourceAsStream(configFilePathName);
				if (is == null) {
					throw new RuntimeException("config-file cannot be load: " + configFilePathName);
				}
				prop = new Properties();
				prop.load(is);
				is.close();
			}

			K3CLOUD_URL_STR = prop.getProperty("K3CLOUD_URL_STR");
			dbid = prop.getProperty("KINGDEE.DBID");
			uid = prop.getProperty("KINGDEE.UID");
			pwd = prop.getProperty("KINGDEE.PWD");
			lang = Integer.valueOf(prop.getProperty("KINGDEE.LANG"));

		} catch (Throwable e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName, e);
		}
	}

	private static Map<String, String> map = new HashMap<String, String>();

	static {
		map.put("Save", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Save.common.kdsvc");
		map.put("View", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.View.common.kdsvc");
		map.put("Submit", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Submit.common.kdsvc");
		map.put("Audit", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Audit.common.kdsvc");
		map.put("UnAudit", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.UnAudit.common.kdsvc");
		map.put("StatusConvert", "Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.StatusConvert.common.kdsvc");
	}

	// HttpURLConnection
	private static HttpURLConnection initUrlConn(String url, JSONArray paras) throws Exception {

		URL postUrl = new URL(K3CLOUD_URL_STR.concat(url));

		HttpURLConnection connection = (HttpURLConnection) postUrl.openConnection();

		if (CookieVal != null) {
			connection.setRequestProperty("Cookie", CookieVal);
		}

		if (!connection.getDoOutput()) {
			connection.setDoOutput(true);
		}

		connection.setRequestMethod("POST");
		connection.setUseCaches(false);
		connection.setInstanceFollowRedirects(true);
		connection.setRequestProperty("Content-Type", "application/json");
		DataOutputStream out = new DataOutputStream(connection.getOutputStream());

		UUID uuid = UUID.randomUUID();
		int hashCode = uuid.toString().hashCode();

		JSONObject jObj = new JSONObject();

		jObj.put("format", 1);
		jObj.put("useragent", "ApiClient");
		jObj.put("rid", hashCode);
		jObj.put("parameters", chinaToUnicode(paras.toString()));
		jObj.put("timestamp", new Date().toString());
		jObj.put("v", "1.0");

		System.out.println(jObj.toString());

		out.writeBytes(jObj.toString());
		out.flush();
		out.close();

		return connection;
	}

	// Login
	public static boolean Login() throws FLException {

		if (prop == null || prop.getProperty("ENABLE").equals("false")) {
			return false;
		}

		boolean bResult = false;

		String sUrl = "Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser.common.kdsvc";

		JSONArray jParas = new JSONArray();

		jParas.add(dbid); // 帐套Id
		jParas.add(uid); // 用户名
		jParas.add(pwd); // 密码
		jParas.add(lang); // 语言

		System.out.println(jParas);

		HttpURLConnection connection;

		try {
			connection = initUrlConn(sUrl, jParas);
		} catch (Exception e) {
			throw new FLException(360001, "金蝶请求异常");
		}

		// 获取Cookie
		String key = null;
		for (int i = 1; (key = connection.getHeaderFieldKey(i)) != null; i++) {
			if (key.equalsIgnoreCase("Set-Cookie")) {
				String tempCookieVal = connection.getHeaderField(i);
				if (tempCookieVal.startsWith("kdservice-sessionid")) {
					CookieVal = tempCookieVal;
					break;
				}
			}
		}

		BufferedReader reader;
		try {
			reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		} catch (IOException e) {
			throw new FLException(360001, "金蝶请求异常");
		}

		String line;

		System.out.println(" ============================= ");
		System.out.println(" Contents of post request ");
		System.out.println(" ============================= ");

		try {
			while ((line = reader.readLine()) != null) {
				String sResult = new String(line.getBytes(), "utf-8");
				System.out.println(sResult);
				bResult = line.contains("\"LoginResultType\":1");
			}
		} catch (Exception e) {
			throw new FLException(360002, "金蝶响应异常");
		}

		System.out.println(" ============================= ");
		System.out.println(" Contents of post request ends ");
		System.out.println(" ============================= ");

		try {
			reader.close();
		} catch (IOException e) {
			throw new FLException(360003, "金蝶资源异常");
		}

		connection.disconnect();

		return bResult;
	}

	private static String Invoke(String deal, String formId, String content) throws FLException {

		String number = "";

		String sUrl = map.get(deal).toString();

		JSONArray jParas = new JSONArray();

		jParas.add(formId);
		jParas.add(content);

		HttpURLConnection connectionInvoke;

		try {
			connectionInvoke = initUrlConn(sUrl, jParas);
		} catch (Exception e) {
			throw new FLException(360001, "金蝶请求异常");
		}

		BufferedReader reader;

		try {
			reader = new BufferedReader(new InputStreamReader(connectionInvoke.getInputStream()));
		} catch (IOException e) {
			throw new FLException(360001, "金蝶请求异常");
		}

		String line;

		System.out.println(" ============================= ");
		System.out.println(" Contents of post request ");
		System.out.println(" ============================= ");

		try {
			while ((line = reader.readLine()) != null) {
				String sResult = new String(line.getBytes(), "utf-8");

				JSONObject result = JSONObject.parseObject(sResult).getJSONObject("Result");
				JSONObject responseStatus = result.getJSONObject("ResponseStatus");
				String status = responseStatus.getString("IsSuccess");

				if (status.equals("true")) {
					number = responseStatus.getJSONArray("SuccessEntitys").getJSONObject(0).getString("Number");
				}

				System.out.println(sResult);
			}
		} catch (Exception e1) {
			throw new FLException(360002, "金蝶响应异常");
		}

		System.out.println(" ============================= ");
		System.out.println(" Contents of post request ends ");
		System.out.println(" ============================= ");

		try {
			reader.close();
		} catch (IOException e) {
			throw new FLException(360003, "金蝶资源异常");
		}

		connectionInvoke.disconnect();

		return number;
	}

	// Save 创建
	public static String Save(String formId, String content) throws FLException {
		return Invoke("Save", formId, content);
	}

	// View 查看
	public static void View(String formId, String content) throws FLException {
		Invoke("View", formId, content);
	}

	// Submit 提交
	public static void Submit(String formId, String content) throws FLException {
		Invoke("Submit", formId, content);
	}

	// Audit 审核
	public static void Audit(String formId, String content) throws FLException {
		Invoke("Audit", formId, content);
	}

	// UnAudit 反审核
	public static void UnAudit(String formId, String content) throws FLException {
		Invoke("UnAudit", formId, content);
	}

	// StatusConvert
	public static void StatusConvert(String formId, String content) throws FLException {
		Invoke("StatusConvert", formId, content);
	}

	/**
	 * 把中文转成Unicode码
	 * 
	 * @param str
	 * @return
	 */
	public static String chinaToUnicode(String str) {

		String result = "";

		for (int i = 0; i < str.length(); i++) {
			int chr1 = (char) str.charAt(i);
			if (chr1 >= 19968 && chr1 <= 171941) { // 汉字范围 \u4e00-\u9fa5 (中文)
				result += "\\u" + Integer.toHexString(chr1);
			} else {
				result += str.charAt(i);
			}
		}

		return result;
	}

	// 客户
	public static List<String> customer() {

		String sFormId = "BD_Customer";

		String sContent = "{\"Model\":" + "{\"FNumber\":\"2105190099\"," + "\"FName\":\"沈阳 浑南 万达公馆 12#2-3-3\"}}";

		// 提交或审核
		// String sContent = "{\"Numbers\":[\"2105190009\"]}";

		// "{\"FCreateOrgId\":{\"FNumber\":\"100.01\"}," +

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 收款单
	public static List<String> collection() {

		String sFormId = "AR_RECEIVEBILL";
		String sContent = "{\"Model\":" + "{\"FDATE\":\"2021-06-28 10:50:34.987\"," + "\"FBillTypeID\":{\"FNumber\":\"SKDLX01_SYS\"}," + "\"FCONTACTUNIT\":{\"FNumber\":\"2107260003\"}," + "\"FPAYORGID\":{\"FNumber\":\"100.01\"}," + "\"FSETTLEORGID\":{\"FNumber\":\"100.01\"}," + "\"F_SFKD_Hslb\": {\"FNumber\":\"A\"}," + "\"F_SFKD_Base\":{\"FNumber\":\"设计费\"}," + "\"F_SFKD_Skfs\":{\"FNumber\":\"收款\"}," + "\"FREMARK\":\"备注信息\"," + "\"FRECEIVEBILLENTRY\":[" + "{\"FPURPOSEID\":{\"FNumber\":\"SFKYT01_SYS\"}," + "\"FSETTLETYPEID\":{\"FNumber\":\"JSFS04_SYS\"}," + "\"FRECTOTALAMOUNTFOR\": 1111 ," + "\"FACCOUNTID\":{\"FNumber\":\"422050100100208856\"}}" + "]}}";

		// "{\"FPURPOSEID\":{\"FNumber\":\"SFKYT02_SYS\"}," + 这个是主材类用的
		// "\"F_SFKD_Skfs\":{\"FNumber\":\"收款\"}," + 这个是合同预付款时使用

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 应收单
	public static List<String> receivable() {

		String sFormId = "AR_receivable";

		String sContent = "{\"Model\":{\"FDATE\":\"2021-06-23 00:00:00\"," + "\"FBillTypeID\":{\"FNumber\":\"YSD01_SYS\"}," + "\"FCUSTOMERID\":{\"FNumber\":\"2105190009\"}," + "\"FSETTLEORGID\":{\"FNumber\":\"100.01\"}," + "\"FPAYORGID\":{\"FNumber\":\"100.01\"}," + "\"F_ora_Base1\":{\"FNumber\":\"A\"}," + "\"F_ora_Assistant\":{\"FNumber\":\"KXLX001\"}," + "\"FEntityDetail\":[" + "{\"FMATERIALID\":{\"FNumber\":\"CH4440\"}," + "\"FPriceQty\":-1," + "\"FTaxPrice\":1000," + "\"FEntryTaxRate\":3," + "\"FCostId\":{\"FNumber\":\"CI010\"}}]}}";

		// "\"F_SFKD_RECTYPE\":{\"FNumber\":\"收款\"}," + 收款类型
		// "{\"FPRICEUNITID\":{\"FNumber\":\"笔\"}," + 计价单位

		// "\"FNoTaxAmountFor_D\":1000," + 不含税金额
		// "\"FTAXAMOUNTFOR_D \":111," + 税额
		// "\"FALLAMOUNTFOR_D\":1111}]}}"; 价税合计

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 其它应收单
	public static List<String> otherReceivable() {

		String sFormId = "AR_OtherRecAble";

		String sContent = "{\"Model\":{\"FDATE\":\"2021-06-24 00:00:00\"," + "\"FCONTACTUNITTYPE\":\"BD_Customer\"," + "\"FCONTACTUNIT\":{\"FNumber\":\"2105190009\"}," + "\"F_ora_Base\":{\"FNumber\":\"2105190009\"}," + "\"FSETTLEORGID\":{\"FNumber\":\"100.01\"}," + "\"F_ora_Base3\":{\"FNumber\":\"A\"}," + "\"F_SFKD_BASE5\":{\"FNumber\":\"设计费\"}," + "\"FEntity\":[" + "{\"FCOSTDEPARTMENTID\":{\"FNumber\":\"BM000023\"}," + "\"FNOTAXAMOUNTFOR\":1000}]}}";
		// "\"FTAXAMOUNTFOR\":90}]}}";

		// 其他应收单有两种情况： 1、合同预付款转工程款 2、工程款转合同预付款 *区别是金额1正2负*
		// "\"FSETTLEORGID\":{\"FNumber\":\"100.01\"}," + 结算组织
		// "\"FINVOICETYPE\":\"普通发票\"," + 发票类型

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 其它应付单
	public static List<String> otherPayable() {

		String sFormId = "AP_OtherPayable";

		String sContent = "{\"Model\":{\"FDATE\":\"2021-06-24 00:00:00\"," + "\"FBillTypeID\":{\"FNumber\":\"QTYFD01_SYS\"}," + "\"FCONTACTUNITTYPE\":\"BD_Customer\"," + "\"FCONTACTUNIT\":{\"FNumber\":\"2105190009\"}," + "\"F_ora_Base\":{\"FNumber\":\"2105190009\"}," + "\"F_ora_Base1\":{\"FNumber\":\"A\"}," + "\"F_SFKD_Base5\":{\"FNumber\":\"设计费\"}," + "\"FEntity\":[" + "{\"FCOSTID\":{\"FNumber\":\"CI010\"}," + "\"FCOSTDEPARTMENTID\":{\"FNumber\":\"BM000023\"}," + "\"FNOTAXAMOUNTFOR\":990}]}}";
		// "\"FTAXAMOUNTFOR\":90}]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 收款退款单
	public static List<String> refundBill() {

		String sFormId = "AR_REFUNDBILL";

		String sContent = "{\"Model\":{\"FDATE\":\"2021-07-24 00:00:00\"," + "\"FBILLTYPEID\":{\"FNumber\":\"SKTKDLX01_SYS\"}," + "\"FSETTLEORGID\":{\"FNumber\":\"100.01\"}," + "\"FRECTUNITTYPE\":\"BD_Customer\"," + "\"FCONTACTUNIT\":{\"FNumber\":\"2105190009\"}," + "\"FCONTACTUNITTYPE\":\"BD_Customer\"," + "\"FRECTUNIT\":{\"FNumber\":\"2105190009\"}," + "\"FPAYORGID\":{\"FNumber\":\"100.01\"}," + "\"F_ORA_BASE\":{\"FNumber\":\"A\"}," + "\"F_SFKD_GCKXLX\":{\"FNumber\":\"设计费\"}," + "\"FREFUNDBILLENTRY\":[" + "{\"FSETTLETYPEID\":{\"FNumber\":\"JSFS04_SYS\"}," + "\"FPURPOSEID\":{\"FNumber\":\"SFKYT02_SYS\"}," + "\"FREFUNDAMOUNTFOR\":4," + "\"FNOTE\":\"这里是备注信息~\"}]}}";

		// "\"FPOSTDATE\":\"2021-07-20\"," +
		// "\"FRUZHANGTYPE\":\"2021-07-21\"," +

		// "\"FREFUNDTOTALAMOUNTFOR\":1," +
		// "\"FREALREFUNDAMOUNTFOR\":2," +
		// "\"FREFUNDAMOUNTFOR_H \":5," +

		// "\"FREALREFUNDAMOUNTFOR_D\":4," +
		// "\"FREFUNDAMOUNTFOR_E\":6," +

		// "\"FRECTYPE\":\"不知道\"," +
		// "\"FPAYTYPE\":\"不知道\"," +
		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 以上是主材相关单据

	// 银行过渡单
	public static List<String> bankTransBill() {

		String sFormId = "SFKD_BankTransBill";
		String sContent = "{\"Model\":" + "{\"FBillNo\":\"NO008\"," + "\"F_SFKD_Date\":\"2021-08-07 10:50:34.987\"," + "\"F_SFKD_WangLaiOrgType\":\"BD_Customer\"," + "\"F_SFKD_RecOrgType\":\"BD_Customer\"," + "\"F_SFKD_RecOrg\":{\"FNumber\":\"100.01\"}," + "\"F_SFKD_SaleOrg\":{\"FNumber\":\"100.01\"}," + "\"F_ora_Base3\":{\"FNumber\":\"A\"}," + "\"F_ora_Base2\":{\"FNumber\":\"2105190009\"}," + "\"F_SFKD_RealAmount\":12345," + "\"FEntity\":[" + "{\"F_SFKD_BankNo\":{\"FNumber\":\"422050100100208856\"}," + "\"F_SFKD_ShiShouAmount\":1000," + "\"F_ora_Base4\":{\"FNumber\":\"002\"}," + "\"F_ora_Base5\":{\"FNumber\":\"VEN00014\"}," + "\"F_ora_Base6\":{\"FNumber\":\"补款\"}}" + "]}}";

		// "\"F_ora_Base\":{\"FNumber\":\"007\"}," +
		// "\"F_SFKD_Brand\":{\"FNumber\":\"001\"}," +
		// "\"F_SFKD_RealAmount\":\"900\"," +
		// "\"F_ora_BaseProperty\":{\"FNumber\":\"2105190009\"}," + 这个不用给 根据客户自己带出来

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 主材转款单
	public static List<String> materialTransferBill() {

		String sFormId = "SFKD_ZhuCaiZhuanKuanBill";
		String sContent = "{\"Model\":" + "{\"FBillNo\":\"NO004\"," + "\"F_SFKD_Date\":\"2021-06-26 10:50:34.987\"," + "\"F_SFKD_WangLaiUnitType\":\"BD_Customer\"," + "\"F_SFKD_PayUnitType\":\"BD_Customer\"," + "\"F_SFKD_ABC\":{\"FNumber\":\"A\"}," + "\"F_SFKD_RecOrgId\":{\"FNumber\":\"100.01\"}," + "\"F_SFKD_SaleOrgId\":{\"FNumber\":\"100.01\"}," + "\"F_ora_Base\":{\"FNumber\":\"2105190009\"}," + "\"F_SFKD_ShiShouAmount\":300," + "\"FEntity\":[" + "{\"F_SFKD_BankNo\":{\"FNumber\":\"422050100100208856\"}," + "\"F_SFKD_RealAmount\":300," + "\"F_ora_Base3\":{\"FNumber\":\"002\"}," + "\"F_ora_Base4\":{\"FNumber\":\"VEN00061\"}," + "\"F_ora_Text\":\"123123\"," + "\"F_SFKD_Base\":{\"FNumber\":\"补款\"}," + "}]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 付款单
	public static List<String> payBill() {

		String sFormId = "AP_PAYBILL";
		String sContent = "{\"Model\":" + "{\"FBillTypeID\":{\"FNumber\":\"FKDLX02_SYS\"}," + "\"FDATE\":\"2021-06-26 10:50:34.987\"," + "\"FCONTACTUNITTYPE\":\"BD_Customer\"," + "\"FCONTACTUNIT\":{\"FNumber\":\"2105190009\"}," + "\"FRECTUNITTYPE\":\"BD_Customer\"," + "\"FRECTUNIT\":{\"FNumber\":\"2105190009\"}," + "\"FPAYORGID\":{\"FNumber\":\"100.01\"}," + "\"FSETTLEORGID\":{\"FNumber\":\"100.01\"}," + "\"F_ora_Base\":{\"FNumber\":\"A\"}," + "\"FPAYBILLENTRY\":[" + "{\"FPURPOSEID\":{\"FNumber\":\"主材退款\"}," + "\"FSETTLETYPEID\":{\"FNumber\":\"JSFS04_SYS\"}," + "\"FPAYTOTALAMOUNTFOR\":2222," + "\"FACCOUNTID\":{\"FNumber\":\"422050100100208856\"}}" + "]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 结算单
	public static List<String> balanceBill() {

		String sFormId = "SFKD_JieSuanBill";
		String sContent = "{\"Model\":" + "{\"FBillNo\":\"NO002\"," + "\"F_SFKD_Date\":\"2021-06-26 10:50:34.987\"," + "\"F_SFKD_ABC\":{\"FNumber\":\"A\"}," + "\"F_SFKD_OrgId\":{\"FNumber\":\"100.01\"}," + "\"F_SFKD_OrgId1\":{\"FNumber\":\"100.01\"}," + "\"F_SFKD_Brand\":{\"FNumber\":\"001\"}," + "\"F_SFKD_Supplier\":{\"FNumber\":\"VEN00013\"}," + "\"F_SFKD_SaleBillNo\":\"2105190009\"," + "\"FEntity\":[" + "{\"F_SFKD_JieSuanAmount\":300," + "\"F_SFKD_ShiShouAmount\":300," + "\"F_ora_Base\":{\"FNumber\":\"2105190009\"}}" + "]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 以下是辅料相关数据

	// 销售出库单
	public static List<String> salesOutStock() {

		// 注意: FCustomerID这个参数要在FSaleOrgId后面, 不然FCustomerID获取不到值报错
		String sFormId = "SAL_OUTSTOCK";
		String sContent = "{\"Model\":" + "{\"FDate\":\"2021-06-26 10:50:34.987\"," + "\"FSaleOrgId\":{\"FNumber\":\"100.01\"}," + "\"FCustomerID\":{\"FNumber\":\"2105190009\"}," + "\"FEntity\":[" + "{\"FMaterialID\":{\"FNumber\":\"01.01.0001\"}," + "\"FRealQty\":12," + "\"FStockID\":{\"FNumber\":\"CK003\"}}," + "]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 采购入库单
	public static List<String> purchaseInStock() {

		String sFormId = "STK_InStock";
		String sContent = "{\"Model\":" + "{\"FStockOrgId\":{\"FNumber\":\"100.01\"}," + "\"FDate\":\"2021-06-26 10:50:34.987\"," + "\"FPurchaseOrgId\":{\"FNumber\":\"100.01\"}," + "\"FSupplierId\":{\"FNumber\":\"VEN00013\"}," + "\"FInStockEntry\":[" + "{\"FMaterialId\":{\"FNumber\":\"01.01.0001\"}," + "\"FSTOCKID\":{\"FNumber\":\"CK003\"}," + "\"FUnitID\":{\"FNumber\":\"UOM026\"}," + "\"FPriceUnitID\":{\"FNumber\":\"UOM026\"}," + "\"FRemainInStockUnitId\":{\"FNumber\":\"UOM026\"}," + "\"FRemainInStockQty\":120}" + "]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 采购退料单
	public static List<String> purchaseReturnMaterial() {

		// FSupplierID这个参数要放在最后! FPRICEUNITID FUnitID FCarryUnitId调整之后要放在前面
		String sFormId = "PUR_MRB";
		String sContent = "{\"Model\":" + "{\"FStockOrgId\":{\"FNumber\":\"100.01\"}," + "\"FDate\":\"2021-06-26 10:50:34.987\"," + "\"FBillTypeID\":{\"FNumber\":\"TLD02_SYS\"}," + "\"FPurchaseOrgId\":{\"FNumber\":\"100.01\"}," + "\"FRequireOrgId\":{\"FNumber\":\"100.01\"}," + "\"FSupplierID\":{\"FNumber\":\"VEN00013\"}," + "\"FPURMRBENTRY\":[" + "{\"FPRICEUNITID\":{\"FNumber\":\"UOM009\"}," + "\"FUnitID\":{\"FNumber\":\"UOM009\"}," + "\"FCarryUnitId\":{\"FNumber\":\"UOM009\"}," + "\"FMaterialID\":{\"FNumber\":\"01.01.0001\"}," + "\"FSTOCKID\":{\"FNumber\":\"CK003\"}," + "\"FRMREALQTY\":12}" + "]}}";

		// "\"FMRTYPE\":{\"FNumber\":\"2105190009\"}," + 退料类型
		// "\"FMRMODE\":{\"FNumber\":\"2105190009\"}," + 退料方式

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 销售退货单
	public static List<String> salesReturnMaterial() {

		String sFormId = "SAL_RETURNSTOCK";
		String sContent = "{\"Model\":" + "{\"FDate\":\"2021-08-21 10:50:34.987\"," + "\"FBillTypeID\":{\"FNumber\":\"XSTHD01_SYS\"}," + "\"FSaleOrgId\":{\"FNumber\":\"100.01\"}," + "\"FStockOrgId\":{\"FNumber\":\"100.01\"}," + "\"FRetcustId\":{\"FNumber\":\"2105190009\"}," + "\"FEntity\":[" + "{\"FMaterialId\":{\"FNumber\":\".0009\"}," + "\"FRealQty\":23," + "\"FStockId\":{\"FNumber\":\"CK003\"}}" + "]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 其他出库单
	public static List<String> otherOutStock() {

		String sFormId = "STK_MisDelivery";
		String sContent = "{\"Model\":" + "{\"FDate\":\"2021-08-21 10:50:34.987\"," + "\"FStockOrgId\":{\"FNumber\":\"100.01\"}," + "\"FBillTypeID\":{\"FNumber\":\"QTCKD01_SYS\"}," + "\"FCustId\":{\"FNumber\":\"2105190009\"}," + "\"FEntity\":[" + "{\"FMaterialId\":{\"FNumber\":\".0009\"}," + "\"FQty\":46," + "\"FStockId\":{\"FNumber\":\"CK003\"}}" + "]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	// 费用核销单
	public static List<String> costMotch() {

		String sFormId = "ER_MatchBill";
		String sContent = "{\"Model\":{" + "\"fDate\":\"2021-08-18 09:35:45.352\"," + "\"fDOCUMENTSTATUS\":\"1\"," + "\"fSETTLEORGID\":{\"FNumber\":\"100.01\"}," + "\"fBillTypeID\":{\"fNumber\":\"FYHXD\"}," + "\"fEntity\":[{" + "\"fMatchAMOUNTFOR\":1.0" + "}]}}";

		List<String> paramsList = Arrays.asList(sFormId, sContent);

		return paramsList;

	}

	public static void main(String[] args) throws Exception {

		if (!Kandle.Login()) return;

		System.out.println(Kandle.CookieVal);

		// 客户
		// List<String> customerParams = Kandle.customer();
		// Kandle.Save(customerParams.get(0), customerParams.get(1));
		// Kandle.Submit(customerParams.get(0), customerParams.get(1));

		// 收款单
		// List<String> collectionParams = Kandle.collection();
		// Kandle.Save(collectionParams.get(0), collectionParams.get(1));

		// 应收单
		// List<String> receivableParams = Kandle.receivable();
		// Kandle.Save(receivableParams.get(0), receivableParams.get(1));

		// 其它应收单
		// List<String> othereceivableParams = Kandle.otherReceivable();
		// Kandle.Save(othereceivableParams.get(0), othereceivableParams.get(1));

		// 收款退款单
		// List<String> refundBillParams = Kandle.refundBill();
		// Kandle.Save(refundBillParams.get(0), refundBillParams.get(1));

		// 其它应付单
		// List<String> otherPayableParams = Kandle.otherPayable();
		// Kandle.Save(otherPayableParams.get(0), otherPayableParams.get(1));

		// 银行过渡单
		// List<String> bankTransBillParams = Kandle.bankTransBill();
		// Kandle.Save(bankTransBillParams.get(0), bankTransBillParams.get(1));

		// 主材转款单
		// List<String> materialTransferBillParams = Kandle.materialTransferBill();
		// Kandle.Save(materialTransferBillParams.get(0), materialTransferBillParams.get(1));

		// 付款单
		// List<String> payBillParams = Kandle.payBill();
		// Kandle.Save(payBillParams.get(0), payBillParams.get(1));

		// 结算单
		// List<String> balanceBillParams = Kandle.balanceBill();
		// Kandle.Save(balanceBillParams.get(0), balanceBillParams.get(1));

		// 销售出库单
		// List<String> salesOutStockParams = Kandle.salesOutStock();
		// Kandle.Save(salesOutStockParams.get(0), salesOutStockParams.get(1));

		// 采购入库单
		// List<String> purchaseInStockParams = Kandle.purchaseInStock();
		// Kandle.Save(purchaseInStockParams.get(0), purchaseInStockParams.get(1));

		// 采购退料单
		// List<String> purchaseReturnMaterialParams = Kandle.purchaseReturnMaterial();
		// Kandle.Save(purchaseReturnMaterialParams.get(0), purchaseReturnMaterialParams.get(1));

		// 销售退货单
		// List<String> salesReturnMaterialParams = Kandle.salesReturnMaterial();
		// Kandle.Save(salesReturnMaterialParams.get(0), salesReturnMaterialParams.get(1));

		// 其他出库单
		// List<String> otherOutStockParams = Kandle.otherOutStock();
		// Kandle.Save(otherOutStockParams.get(0), otherOutStockParams.get(1));

		// 费用核销单
		// List<String> salesReturnMaterialParams = Kandle.costMotch();
		// Kandle.Save(salesReturnMaterialParams.get(0), salesReturnMaterialParams.get(1));

		System.out.println("hola success");

	}
}
