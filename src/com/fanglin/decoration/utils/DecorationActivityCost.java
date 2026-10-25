package com.fanglin.decoration.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityCostDao;
import com.fanglin.decoration.po.DecorationActivityCostPO;
import com.fanglin.information.po.ActivityItemPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

/**
 * 优惠额度校验客户端: 额度类活动物品(activityitem.type>=10)创建前调 fl-yy validate 接口校验资格。
 * 
 * <p>
 * 纯 HTTP 实现(HttpURLConnection + SHA-256 应用签名), 不引入外部 SDK。额度为现算(实测 3.4s/次),
 * 校验通过后响应快照落 {@link DecorationActivityCostPO} 缓存档——只写档: 不展示、不参与校验判定、系统逻辑不读。
 * 
 * <h3>配置(sysconfig.properties)</h3>
 * <ul>
 * <li>{@code cost.validate.url}: validate 接口地址(daily/正式各自网关地址)</li>
 * <li>{@code cost.app.secret}: erp_project_sync 应用密钥(按环境分配, 复用既有密钥禁止覆盖)</li>
 * </ul>
 * appId 固定 erp_project_sync(接口文档明示), 硬编码常量不设配置键。
 * 
 * <h3>签名(fl-sync 统一验签)</h3>
 * Header 必传 appId/timestamp(毫秒, 与服务器时差≤30s)/nonce(60s 防重)/sign;
 * sign = SHA256_HEX(queryString + "#" + rawBody + "##" + headerString + "###" + appSecret),
 * 本接口业务参数全在 Body(queryString 空串), headerString 仅 appId/nonce/timestamp 按名称升序;
 * rawBody 签名与发送必须同一份序列化串。
 */
@Component("decorationActivityCost")
public class DecorationActivityCost {

	private static final Logger log = LoggerFactory.getLogger(DecorationActivityCost.class);

	/** 对外接口固定应用标识(fl-sync 验签, 接口文档明示固定值) */
	private static final String APP_ID = "erp_project_sync";

	private static final int CONNECT_TIMEOUT = 5000;

	private static final int READ_TIMEOUT = 10000;

	/** 库内金额单位: money=厘(元×1000), num=毫个(个×1000); money×num÷10⁶=元 */
	private static final long MONEY_SCALE = 1000000L;

	/** 使用额度总额(元)→厘 */
	private static final long COST_MONEY_SCALE = 1000L;

	private static final SecureRandom RANDOM = new SecureRandom();

	@Autowired
	private DecorationActivityCostDao decorationActivityCostDao;

	/**
	 * 校验结果缓存档快照: balance/toplimit 为厘(接口元值×1000, 接口未返回时为 null)。
	 */
	public static class CostSnapshot {

		private final Integer balance;

		private final Integer toplimit;

		private final String summary;

		public CostSnapshot(Integer balance, Integer toplimit, String summary) {
			super();
			this.balance = balance;
			this.toplimit = toplimit;
			this.summary = summary;
		}

		public Integer getBalance() {
			return balance;
		}

		public Integer getToplimit() {
			return toplimit;
		}

		public String getSummary() {
			return summary;
		}
	}

	/**
	 * 额度类判定: 配置端 activityitem.type >= 10(10/11/12 = 额度的券/物品/红包, 对齐 0=券/1=物品/2=红包 语义)。
	 */
	public boolean isCostItem(ActivityItemPO activityItemPO) {
		return activityItemPO != null && activityItemPO.getType() >= ActivityItemPO.TYPE_COST_COUPON_INT;
	}

	/**
	 * 创建前校验(单条): 非额度类返回 null(调用方照旧落行); 额度类同步调 validate, 通过返回快照, 拒绝抛 FLException。
	 * 
	 * @param orderId 装修单号
	 * @param userId 员工编码(当前登录人/审批发起人), 即接口 staffCode
	 * @param activityItemPO 活动物品配置(调用方按 aiid 直查或 asid 反查)
	 * @param money 物品单价(厘)
	 * @param num 数量(毫个)
	 */
	public CostSnapshot checkBeforeCreate(String orderId, String userId, ActivityItemPO activityItemPO, int money, int num) throws FLException {

		// 配置反查不到(含存量前端未传 aiid 且 asid 无配置行)视为非额度类, 走原逻辑
		if (activityItemPO == null || !isCostItem(activityItemPO)) {
			return null;
		}

		return checkBeforeCreate(orderId, userId, amount(money, num));
	}

	/**
	 * 创建前校验(合并金额): 审批路径同单同员工多明细合并金额一次校验(N 次现算 → 1 次)。
	 * 
	 * @param amount 合并申请额度(元)
	 */
	public CostSnapshot checkBeforeCreate(String orderId, String userId, long amount) throws FLException {

		if (amount <= 0) {
			throw new FLException(140111, "优惠额度物品金额无效");
		}

		String url = SystemConfig.getString("cost.validate.url");
		String secret = SystemConfig.getString("cost.app.secret");

		if (url == null || "".equals(url) || secret == null || "".equals(secret)) {
			throw new FLException(140110, "优惠额度功能未启用");
		}

		JSONObject body = new JSONObject();
		body.put("staffCode", userId);
		body.put("orderId", orderId);
		body.put("amount", amount);

		JSONObject response = post(url, body.toJSONString(), secret);

		int code = response.getIntValue("code");

		if (code != 0) {
			log.error(String.format("优惠额度校验接口处理失败, orderId:%s, userId:%s, response:%s", orderId, userId, response.toJSONString()));
			throw new FLException(140109, "优惠额度校验服务不可用,请稍后重试");
		}

		JSONObject data = response.getJSONObject("data");

		if (data == null) {
			log.error(String.format("优惠额度校验接口响应缺 data, orderId:%s, response:%s", orderId, response.toJSONString()));
			throw new FLException(140109, "优惠额度校验服务不可用,请稍后重试");
		}

		if (!data.getBooleanValue("usable")) {
			String reason = data.getString("reason");
			throw new FLException(140108, reason == null ? "优惠额度校验未通过" : reason);
		}

		return snapshot(data);
	}

	/**
	 * 落缓存档(物品行 save 之后调, 携带 daiId): 只写档, 非额度类(snapshot 为 null)跳过。
	 * 
	 * @param money 物品单价(厘)
	 * @param num 数量(毫个); cost.money = 本次使用总额(厘) = money×num÷10³
	 */
	public void saveCostRecord(String orderId, long daiId, int money, int num, CostSnapshot snapshot, Integer company) {

		if (snapshot == null) {
			return;
		}

		DecorationActivityCostPO po = new DecorationActivityCostPO();

		po.setOrderId(orderId);
		po.setDaiId(daiId);
		po.setMoney((int) Arith.div(Arith.mul((long) money, num), COST_MONEY_SCALE));
		po.setBalance(snapshot.getBalance());
		po.setToplimit(snapshot.getToplimit());
		po.setCompany(company);
		po.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityCostDao.save(po);
	}

	private long amount(int money, int num) {
		return Arith.div(Arith.mul((long) money, num), MONEY_SCALE);
	}

	private CostSnapshot snapshot(JSONObject data) {

		Integer balance = toCostMoney(data.getBigDecimal("availableAmount"));
		Integer toplimit = toCostMoney(data.getBigDecimal("perOrderLimit"));
		String summary = String.format("优惠额度抵扣 校验通过(可用%s/上限%s)", data.getString("availableAmount"), data.getString("perOrderLimit"));

		return new CostSnapshot(balance, toplimit, summary);
	}

	private Integer toCostMoney(BigDecimal value) {

		if (value == null) {
			return null;
		}

		return value.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue();
	}

	private JSONObject post(String url, String rawBody, String secret) throws FLException {

		String timestamp = String.valueOf(System.currentTimeMillis());
		String nonce = nonce();
		String headerString = "appId=" + APP_ID + "&nonce=" + nonce + "&timestamp=" + timestamp;
		String sign = sha256Hex("#" + rawBody + "##" + headerString + "###" + secret);

		HttpURLConnection connection = null;

		try {

			connection = (HttpURLConnection) new URL(url).openConnection();
			connection.setRequestMethod("POST");
			connection.setConnectTimeout(CONNECT_TIMEOUT);
			connection.setReadTimeout(READ_TIMEOUT);
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setRequestProperty("appId", APP_ID);
			connection.setRequestProperty("timestamp", timestamp);
			connection.setRequestProperty("nonce", nonce);
			connection.setRequestProperty("sign", sign);

			OutputStream os = connection.getOutputStream();
			os.write(rawBody.getBytes("UTF-8"));
			os.flush();
			os.close();

			int code = connection.getResponseCode();
			InputStream stream = code >= 400 ? connection.getErrorStream() : connection.getInputStream();

			BufferedReader reader = new BufferedReader(new InputStreamReader(stream, "UTF-8"));

			StringBuilder response = new StringBuilder();

			String line = null;

			while ((line = reader.readLine()) != null) {
				response.append(line);
			}

			reader.close();

			JSONObject result = JSON.parseObject(response.toString());

			if (result == null) {
				log.error(String.format("优惠额度校验接口响应为空, url:%s, httpCode:%s, response:%s", url, code, response.toString()));
				throw new FLException(140109, "优惠额度校验服务不可用,请稍后重试");
			}

			return result;

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			log.error(String.format("优惠额度校验接口调用异常, url:%s", url), e);
			throw new FLException(140109, "优惠额度校验服务不可用,请稍后重试");
		} finally {
			if (connection != null) {
				connection.disconnect();
			}
		}
	}

	private String nonce() {

		byte[] bytes = new byte[16];

		RANDOM.nextBytes(bytes);

		StringBuilder sb = new StringBuilder(32);

		for (byte b : bytes) {
			sb.append(String.format("%02x", b));
		}

		return sb.toString();
	}

	private String sha256Hex(String text) throws FLException {

		try {

			MessageDigest digest = MessageDigest.getInstance("SHA-256");

			byte[] bytes = digest.digest(text.getBytes("UTF-8"));

			StringBuilder sb = new StringBuilder(64);

			for (byte b : bytes) {
				sb.append(String.format("%02x", b));
			}

			return sb.toString();

		} catch (Exception e) {
			log.error("优惠额度签名计算异常", e);
			throw new FLException(140109, "优惠额度校验服务不可用,请稍后重试");
		}
	}

}
