package com.fanglin.decoration.service.impl;

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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityCostDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityCostPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationActivityCostService;
import com.fanglin.decoration.vo.ActivityCostVO;
import com.fanglin.information.po.ActivityItemPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

/**
 * 优惠额度校验哨兵: 额度类活动物品(activityitem.type>=10)创建前调 fl-yy validate 接口校验资格。
 *
 * <p>
 * 纯 HTTP 实现(HttpURLConnection + SHA-256 应用签名), 不引入外部 SDK。额度为现算(实测 3.4s/次),
 * 校验通过后响应快照落 {@link DecorationActivityCostPO} 缓存档——只写档: 不展示、不参与校验判定、系统逻辑不读。
 *
 * <p>
 * 🔴尽力而为语义(唯一拦截条件 = 接口明确 usable=false → 140108):
 * 未配置 cost.*、配置反查不到、金额无效、网络/超时/签名/接口非 0 等一切无法完成校验的情形,
 * 一律记日志后跳过校验放行创建(返回 null)——外挂不在场时业务照走, 不存在"异常时拦截"路径。
 *
 * <h3>配置(communion.systemconfig 表, 全局 key=company 0)</h3>
 * <ul>
 * <li>{@code cost.validate.url}: validate 接口地址(daily/正式各自网关地址)</li>
 * <li>{@code cost.app.secret}: erp_project_sync 应用密钥(按环境分配, 复用既有密钥禁止覆盖)</li>
 * </ul>
 * appId 固定 erp_project_sync(接口文档明示), 硬编码常量不设配置键。
 * 任一未配置 = 跳过校验放行(尽力而为语义, log.warn 留痕)。
 *
 * <h3>签名(fl-sync 统一验签)</h3>
 * Header 必传 appId/timestamp(毫秒, 与服务器时差≤30s)/nonce(60s 防重)/sign;
 * sign = SHA256_HEX(queryString + "#" + rawBody + "##" + headerString + "###" + appSecret),
 * 本接口业务参数全在 Body(queryString 空串), headerString 仅 appId/nonce/timestamp 按名称升序;
 * rawBody 签名与发送必须同一份序列化串。
 */
@Service("decorationActivityCostService")
public class DecorationActivityCostServiceImpl implements DecorationActivityCostService {

	private static final Logger log = LoggerFactory.getLogger(DecorationActivityCostServiceImpl.class);

	/** 对外接口固定应用标识(fl-sync 验签, 接口文档明示固定值) */
	private static final String APP_ID = "erp_project_sync";

	private static final int CONNECT_TIMEOUT = 5000;

	private static final int READ_TIMEOUT = 10000;

	/** 库内金额单位: money=厘(元×1000), num=毫个(个×1000); money×num÷10⁶=元 */
	private static final long MONEY_SCALE = 1000000L;

	/** 使用额度总额(元)→厘 */
	private static final long COST_MONEY_SCALE = 1000L;

	private static final SecureRandom RANDOM = new SecureRandom();

	/** systemconfig 配置键: validate 接口地址 */
	private static final String KEY_VALIDATE_URL = "cost.validate.url";

	/** systemconfig 配置键: erp_project_sync 应用密钥 */
	private static final String KEY_APP_SECRET = "cost.app.secret";

	@Autowired
	private DecorationActivityCostDao decorationActivityCostDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public boolean isCostItem(ActivityItemPO activityItemPO) {
		return activityItemPO != null && activityItemPO.getType() >= ActivityItemPO.TYPE_COST_COUPON_INT;
	}

	@Override
	public ActivityCostVO queryActivityCost(String orderId, String userId, ActivityItemPO activityItemPO, int money, int num) throws FLException {

		// 配置反查不到(含存量前端未传 aiid 且 asid 无配置行)视为非额度类, 走原逻辑
		if (activityItemPO == null || !isCostItem(activityItemPO)) {
			return null;
		}

		long amount = amount(money, num);

		// 金额异常无法校验, 尽力而为跳过(不拦截创建)
		if (amount <= 0) {
			log.warn(String.format("优惠额度物品金额无效, 跳过校验放行, orderId:%s, money:%s, num:%s", orderId, money, num));
			return null;
		}

		return tryValidate(orderId, userId, amount);
	}

	@Override
	public ActivityCostVO queryActivityCost(String orderId, String userId, long amount) throws FLException {

		if (amount <= 0) {
			log.warn(String.format("优惠额度合并金额无效, 跳过校验放行, orderId:%s, amount:%s", orderId, amount));
			return null;
		}

		return tryValidate(orderId, userId, amount);
	}

	@Override
	public void addActivityCost(String orderId, long daiId, int money, int num, ActivityCostVO snapshot, Integer company) {

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<ActivityCostVO> updateDecorationActivityCost(String orderId) throws FLException {

		List<DecorationActivityCostPO> costPOs = decorationActivityCostDao.queryDecorationActivityCostByOrderId(orderId);

		if (costPOs == null || costPOs.size() == 0) {
			throw new FLException(140109, "优惠额度校验缓存记录不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null || decorationPO.getDesigner() == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<ActivityCostVO> vos = new ArrayList<ActivityCostVO>();

		for (DecorationActivityCostPO costPO : costPOs) {
			vos.add(refreshActivityCost(orderId, decorationPO.getDesigner().getUserId(), costPO));
		}

		return vos;
	}

	/**
	 * 独立更新单行: 以缓存行 money÷1000(厘→元)为校验金额重调接口(身份=装修单设计师), 最新额度回写缓存行。
	 * 与创建校验的尽力而为不同: 本入口是显式维护操作, 接口不可用/响应不完整直接抛 140110;
	 * usable=false 照常回写最新额度并在 summary 标注(额度治理对账用)。
	 */
	private ActivityCostVO refreshActivityCost(String orderId, String userId, DecorationActivityCostPO costPO) throws FLException {

		SystemConfigPO urlConfig = systemConfigDao.querySystemConfig(KEY_VALIDATE_URL);
		SystemConfigPO secretConfig = systemConfigDao.querySystemConfig(KEY_APP_SECRET);

		if (urlConfig == null || urlConfig.getValue() == null || "".equals(urlConfig.getValue().trim()) || secretConfig == null || secretConfig.getValue() == null || "".equals(secretConfig.getValue().trim())) {
			throw new FLException(140110, "优惠额度校验接口不可用");
		}

		JSONObject body = new JSONObject();
		body.put("staffCode", userId);
		body.put("orderId", orderId);
		body.put("amount", costPO.getMoney() / 1000);

		JSONObject response = post(urlConfig.getValue().trim(), body.toJSONString(), secretConfig.getValue().trim());

		if (response == null || response.getIntValue("code") != 0 || response.getJSONObject("data") == null) {
			throw new FLException(140110, "优惠额度校验接口不可用");
		}

		JSONObject data = response.getJSONObject("data");

		Integer balance = toCostMoney(data.getBigDecimal("availableAmount"));
		Integer toplimit = toCostMoney(data.getBigDecimal("perOrderLimit"));

		costPO.setBalance(balance);
		costPO.setToplimit(toplimit);
		costPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationActivityCostDao.update(costPO);

		String reason = data.getString("reason");

		return new ActivityCostVO(balance, toplimit, String.format("优惠额度抵扣 更新(可用%s/上限%s%s)", data.getString("availableAmount"), data.getString("perOrderLimit"), data.getBooleanValue("usable") ? "" : ", 未通过:" + (reason == null ? "" : reason)));
	}

	/**
	 * 尽力而为校验: 唯一拦截 = usable=false(140108); 未配置/请求异常/响应不完整一律 log 后返回 null 放行。
	 */
	private ActivityCostVO tryValidate(String orderId, String userId, long amount) throws FLException {

		// 配置读 communion.systemconfig(全局 key): 任一未配置 = 跳过校验放行(尽力而为)
		SystemConfigPO urlConfig = systemConfigDao.querySystemConfig(KEY_VALIDATE_URL);
		SystemConfigPO secretConfig = systemConfigDao.querySystemConfig(KEY_APP_SECRET);

		if (urlConfig == null || urlConfig.getValue() == null || "".equals(urlConfig.getValue().trim()) || secretConfig == null || secretConfig.getValue() == null || "".equals(secretConfig.getValue().trim())) {
			log.warn(String.format("优惠额度校验未配置(%s/%s), 跳过校验放行, orderId:%s", KEY_VALIDATE_URL, KEY_APP_SECRET, orderId));
			return null;
		}

		String url = urlConfig.getValue().trim();
		String secret = secretConfig.getValue().trim();

		JSONObject body = new JSONObject();
		body.put("staffCode", userId);
		body.put("orderId", orderId);
		body.put("amount", amount);

		JSONObject response = post(url, body.toJSONString(), secret);

		if (response == null) {
			return null;
		}

		int code = response.getIntValue("code");

		if (code != 0) {
			log.error(String.format("优惠额度校验接口处理失败, 跳过校验放行, orderId:%s, userId:%s, response:%s", orderId, userId, response.toJSONString()));
			return null;
		}

		JSONObject data = response.getJSONObject("data");

		if (data == null) {
			log.error(String.format("优惠额度校验接口响应缺 data, 跳过校验放行, orderId:%s, response:%s", orderId, response.toJSONString()));
			return null;
		}

		if (!data.getBooleanValue("usable")) {
			String reason = data.getString("reason");
			throw new FLException(140108, reason == null ? "优惠额度校验未通过" : reason);
		}

		return snapshot(data);
	}

	private long amount(int money, int num) {
		return Arith.div(Arith.mul((long) money, num), MONEY_SCALE);
	}

	private ActivityCostVO snapshot(JSONObject data) {

		Integer balance = toCostMoney(data.getBigDecimal("availableAmount"));
		Integer toplimit = toCostMoney(data.getBigDecimal("perOrderLimit"));
		String summary = String.format("优惠额度抵扣 校验通过(可用%s/上限%s)", data.getString("availableAmount"), data.getString("perOrderLimit"));

		return new ActivityCostVO(balance, toplimit, summary);
	}

	private Integer toCostMoney(BigDecimal value) {

		if (value == null) {
			return null;
		}

		return value.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue();
	}

	/**
	 * 签名 POST: 任何失败(网络/超时/HTTP 非 200/解析)仅 log.error 并返回 null, 由调用方跳过放行。
	 */
	private JSONObject post(String url, String rawBody, String secret) {

		String timestamp = String.valueOf(System.currentTimeMillis());
		String nonce = nonce();
		String headerString = "appId=" + APP_ID + "&nonce=" + nonce + "&timestamp=" + timestamp;
		String sign = sha256Hex("#" + rawBody + "##" + headerString + "###" + secret);

		if (sign == null) {
			return null;
		}

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
				return null;
			}

			return result;

		} catch (Exception e) {
			log.error(String.format("优惠额度校验接口调用异常, 跳过校验放行, url:%s", url), e);
			return null;
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

	private String sha256Hex(String text) {

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
			return null;
		}
	}

}
