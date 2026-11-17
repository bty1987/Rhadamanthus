/**
 * @File Name		: A20261117ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-11-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 上方系统定额补数服务实现(工费/辅料两接口 → data.normrice/data.normood)
 *
 *                   落点说明: 先落 seiya 模块独立触发(Phase 1), 后续 makeNormtion 接线复用本服务(Phase 2)。
 *                   评估与实施设计见 docs/01-方案设计/定额数据接口补充评估方案.md 第 7 节。
 */

package com.fanglin.seiya.service.impl;

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
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.quotation.dao.NormoodDao;
import com.fanglin.data.quotation.dao.NormriceDao;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.po.QuotationItemPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.seiya.service.A20261117Service;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.DateUtil;

@Service("a20261117Service")
@Transactional(readOnly = true)
public class A20261117ServiceImpl implements A20261117Service {

	private static final Logger log = LoggerFactory.getLogger(A20261117ServiceImpl.class);

	/** 对方接口固定应用标识(fl-sync 验签, 与优惠额度校验同 appId) */
	private static final String APP_ID = "erp_project_sync";

	/** systemconfig 配置键: 上方定额接口基地址(网关前缀, 代码追加两接口路径); 公司行可覆盖集团行 */
	private static final String KEY_SYNC_URL = "norm.sync.url";

	/** systemconfig 配置键: 公司三方定额补数开关(公司行, value=1 启用; 未配置走现有逻辑) */
	private static final String KEY_SYNC_ENABLE = "norm.sync.enable";

	/** systemconfig 配置键: erp_project_sync 应用密钥(集团行, 复用优惠额度校验既有键禁止重复配) */
	private static final String KEY_APP_SECRET = "cost.app.secret";

	/** 工费清单查询路径 */
	private static final String PATH_LABOR_FEE = "/erp/quotation/labor-fee/get";

	/** 辅料单查询路径 */
	private static final String PATH_AUXILIARY = "/erp/quotation/auxiliary-material-list/get";

	private static final int CONNECT_TIMEOUT = 5000;

	private static final int READ_TIMEOUT = 10000;

	/** 元→厘 / 需求数量→毫 的统一 ×1000 口径 */
	private static final int SCALE = 1000;

	private static final SecureRandom RANDOM = new SecureRandom();

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private NoodsDao noodsDao;

	@Autowired
	private NormriceDao normriceDao;

	@Autowired
	private NormoodDao normoodDao;

	@Autowired
	private NormtionDao normtionDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int supplementNormForSync(String orderId, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		// 公司开关(公司行): 未配置/≠1 = 未启用, 走现有逻辑(两分支)
		SystemConfigPO enableConfig = systemConfigDao.querySystemConfig(KEY_SYNC_ENABLE, decorationPO.getCompany());

		if (enableConfig == null || !"1".equals(enableConfig.getValue())) {
			log.info(String.format("三方定额补数公司未启用, 走现有逻辑, orderId:%s, company:%s", orderId, decorationPO.getCompany()));
			return 0;
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		// normtion 单据头: 判断不存在进行创建
		NormtionPO normtionPO = normtionDao.queryNormtion(quotationPO.getQid());

		if (normtionPO == null) {
			normtionPO = new NormtionPO();
			normtionPO.setQid(quotationPO.getQid());
			normtionPO.setOrderId(orderId);
			normtionPO.setCreater(userDao.queryUserByUserId(userId));
			normtionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			normtionDao.save(normtionPO);
		}

		// 锚点报价项: 功能区内第一个工程量>0 的报价项; 同时收集全部报价项 qiid(占用检查用)
		Set<Long> qiids = new HashSet<Long>();

		long anchorQiid = 0;
		int anchorInitNum = 0;

		for (QuotationFunctionAreaPO functionArea : quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid())) {

			for (QuotationFunctionAreaItemPO item : quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(functionArea.getQfaId(), functionArea.getIndex()), functionArea.getQfaId())) {

				long qiid = item.getQuotationItem().getQiid();

				qiids.add(qiid);

				if (anchorQiid == 0 && item.getInitNum() > 0) {
					anchorQiid = qiid;
					anchorInitNum = item.getInitNum();
				}
			}
		}

		if (qiids.isEmpty() || anchorQiid == 0) {
			throw new FLException(200136, "报价无可挂载报价项");
		}

		// 接口配置: 基地址公司行优先、无则集团行(company=0); 密钥固定集团行(复用 cost.app.secret)
		SystemConfigPO urlConfig = systemConfigDao.querySystemConfig(KEY_SYNC_URL, decorationPO.getCompany());

		if (urlConfig == null) {
			urlConfig = systemConfigDao.querySystemConfig(KEY_SYNC_URL, 0);
		}

		SystemConfigPO secretConfig = systemConfigDao.querySystemConfig(KEY_APP_SECRET, 0);

		if (urlConfig == null || urlConfig.getValue() == null || "".equals(urlConfig.getValue().trim()) || secretConfig == null || secretConfig.getValue() == null || "".equals(secretConfig.getValue().trim())) {
			throw new FLException(200132, "三方定额接口未配置");
		}

		String url = urlConfig.getValue().trim();
		String secret = secretConfig.getValue().trim();

		// 工费清单查询 + 辅料单查询(fail-closed: 调用失败/返回无数据中止)
		JSONObject laborFee = postForSync(url + PATH_LABOR_FEE, buildBody(orderId), secret);
		checkResponse(laborFee, orderId, PATH_LABOR_FEE);

		JSONArray laborFees = laborFee.getJSONArray("data");

		if (laborFees == null || laborFees.isEmpty()) {
			throw new FLException(200134, "三方定额数据为空");
		}

		JSONObject auxiliary = postForSync(url + PATH_AUXILIARY, buildBody(orderId), secret);
		checkResponse(auxiliary, orderId, PATH_AUXILIARY);

		JSONArray auxiliaries = auxiliary.getJSONArray("data");

		if (auxiliaries == null || auxiliaries.isEmpty()) {
			throw new FLException(200134, "三方定额数据为空");
		}

		// 解析+字典校验(fail-closed: cnid/nid 查不到字典即中止)
		Map<Long, ConstructionNodePO> nodeByCnid = new LinkedHashMap<Long, ConstructionNodePO>();
		Map<Long, Integer> salaryByCnid = new LinkedHashMap<Long, Integer>();
		parseLaborFees(laborFees, nodeByCnid, salaryByCnid);

		Map<Long, NoodsPO> noodsByNid = new LinkedHashMap<Long, NoodsPO>();
		Map<Long, Integer> numByNid = new LinkedHashMap<Long, Integer>();
		parseAuxiliaries(auxiliaries, noodsByNid, numByNid);

		// 占用检查(仅补缺): 该单报价任一报价项下已有同 cnid/nid 的定额行则跳过该三方行
		Set<Long> occupiedCnids = new HashSet<Long>();

		for (NormricePO normricePO : normriceDao.queryNormriceByQiids(qiids)) {
			if (normricePO.getConstructionNode() != null) {
				occupiedCnids.add(normricePO.getConstructionNode().getCnid());
			}
		}

		Set<Long> occupiedNids = new HashSet<Long>();

		for (NormoodPO normoodPO : normoodDao.queryNormoodByQiids(qiids)) {
			if (normoodPO.getNoods() != null) {
				occupiedNids.add(normoodPO.getNoods().getNid());
			}
		}

		// 落行: 挂锚点报价项
		QuotationItemPO anchorItem = quotationItemDao.get(anchorQiid);
		int count = 0;

		for (Map.Entry<Long, Integer> entry : salaryByCnid.entrySet()) {

			if (occupiedCnids.contains(entry.getKey())) {
				log.info(String.format("三方定额工费行跳过(该单报价已有同节点定额), orderId:%s, cnid:%s", orderId, entry.getKey()));
				continue;
			}

			NormricePO normricePO = new NormricePO(anchorItem, nodeByCnid.get(entry.getKey()));
			normricePO.setTrannum(0); // 总额行约定(trannum=0): salary 即金额(厘), 实例生成与工资核算不乘工程量
			normricePO.setSalary(entry.getValue());
			normricePO.setStuff(0);
			normricePO.setStatus(NormricePO.STATUS_VALID_STR);
			normriceDao.save(normricePO);

			count++;
		}

		for (Map.Entry<Long, Integer> entry : numByNid.entrySet()) {

			if (occupiedNids.contains(entry.getKey())) {
				log.info(String.format("三方定额辅料行跳过(该单报价已有同定材定额), orderId:%s, nid:%s", orderId, entry.getKey()));
				continue;
			}

			// normood 无 trannum, 实例生成固定 Arith.mul(工程量, 单量): 按锚点项工程量还原单量 → 实例量 = 三方总量
			int normnum = (int) Math.round((double) entry.getValue() * SCALE / anchorInitNum);

			if (normnum <= 0) {
				throw new FLException(200135, "三方定额数据异常");
			}

			NormoodPO normoodPO = new NormoodPO(anchorItem);
			normoodPO.setNoods(noodsByNid.get(entry.getKey()));
			normoodPO.setName(noodsByNid.get(entry.getKey()).getName());
			normoodPO.setNormnum(normnum);
			normoodPO.setStorenum(normnum);
			normoodPO.setPrice(0);
			normoodPO.setStatus(NormoodPO.STATUS_VALID_STR);
			normoodDao.save(normoodPO);

			count++;
		}

		log.info(String.format("三方定额补数完成, orderId:%s, company:%s, 工费:%s行/辅料:%s行, 补插:%s行", orderId, decorationPO.getCompany(), salaryByCnid.size(), numByNid.size(), count));

		return count;
	}

	/** 工费行解析: id(erpId串)=cnid → constructionNode 字典校验; amount(元4位小数) → salary(厘, ×1000 截断) */
	private void parseLaborFees(JSONArray laborFees, Map<Long, ConstructionNodePO> nodeByCnid, Map<Long, Integer> salaryByCnid) throws FLException {

		for (int i = 0; i < laborFees.size(); i++) {

			JSONObject row = laborFees.getJSONObject(i);

			String idStr = row == null ? null : row.getString("id");

			if (idStr == null || "".equals(idStr.trim()) || !idStr.trim().matches("\\d+")) {
				log.error(String.format("三方定额工费行id非法, row:%s", row));
				throw new FLException(200135, "三方定额数据异常");
			}

			long cnid = Long.parseLong(idStr.trim());

			ConstructionNodePO nodePO = constructionNodeDao.get(cnid);

			if (nodePO == null) {
				log.error(String.format("三方定额工费行cnid不存在施工节点字典, cnid:%s", cnid));
				throw new FLException(200135, "三方定额数据异常");
			}

			BigDecimal amount = row.getBigDecimal("amount");

			if (amount == null) {
				log.error(String.format("三方定额工费行amount缺失, cnid:%s", cnid));
				throw new FLException(200135, "三方定额数据异常");
			}

			if (nodeByCnid.containsKey(cnid)) {
				log.warn(String.format("三方定额工费行cnid重复, 取末行, cnid:%s", cnid));
			}

			nodeByCnid.put(cnid, nodePO);
			salaryByCnid.put(cnid, amount.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue());
		}
	}

	/** 辅料行解析: nid → noods 字典校验; quantity(4位小数) → 需求量(毫, ×1000 截断) */
	private void parseAuxiliaries(JSONArray auxiliaries, Map<Long, NoodsPO> noodsByNid, Map<Long, Integer> numByNid) throws FLException {

		for (int i = 0; i < auxiliaries.size(); i++) {

			JSONObject row = auxiliaries.getJSONObject(i);

			Long nid = row == null ? null : row.getLong("nid");

			if (nid == null) {
				log.error(String.format("三方定额辅料行nid缺失, row:%s", row));
				throw new FLException(200135, "三方定额数据异常");
			}

			NoodsPO noodsPO = noodsDao.get(nid);

			if (noodsPO == null) {
				log.error(String.format("三方定额辅料行nid不存在定材字典, nid:%s", nid));
				throw new FLException(200135, "三方定额数据异常");
			}

			BigDecimal quantity = row.getBigDecimal("quantity");

			if (quantity == null || quantity.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue() <= 0) {
				log.error(String.format("三方定额辅料行quantity缺失或非正, nid:%s, quantity:%s", nid, quantity));
				throw new FLException(200135, "三方定额数据异常");
			}

			if (noodsByNid.containsKey(nid)) {
				log.warn(String.format("三方定额辅料行nid重复, 取末行, nid:%s", nid));
			}

			noodsByNid.put(nid, noodsPO);
			numByNid.put(nid, quantity.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue());
		}
	}

	/** 接口响应校验(fail-closed): 缺失/HTTP 失败/业务 code≠0 一律 200133 中止 */
	private void checkResponse(JSONObject response, String orderId, String api) throws FLException {

		if (response == null || response.get("code") == null || response.getIntValue("code") != 0) {
			log.error(String.format("三方定额接口调用失败, orderId:%s, api:%s, response:%s", orderId, api, response == null ? "null" : response.toJSONString()));
			throw new FLException(200133, "三方定额接口调用失败");
		}
	}

	private String buildBody(String orderId) {

		JSONObject body = new JSONObject();
		body.put("erpOrderCode", orderId);

		return body.toJSONString();
	}

	/**
	 * 签名 POST(fl-sync 统一验签, 与 DecorationActivityCostServiceImpl 同款):
	 * headers appId/timestamp(毫秒, 时差≤30s)/nonce(60s 防重)/sign;
	 * sign = SHA256_HEX(queryString + "#" + rawBody + "##" + headerString + "###" + appSecret),
	 * 本接口业务参数全在 Body(queryString 空串), headerString 仅 appId/nonce/timestamp 按名称升序;
	 * rawBody 签名与发送必须同一份序列化串。
	 * 任何失败(网络/超时/HTTP 非 200/解析)仅 log.error 并返回 null, 由调用方 fail-closed 中止。
	 */
	private JSONObject postForSync(String url, String rawBody, String secret) {

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
				log.error(String.format("三方定额接口响应为空, url:%s, httpCode:%s, response:%s", url, code, response.toString()));
				return null;
			}

			return result;

		} catch (Exception e) {
			log.error(String.format("三方定额接口调用异常, url:%s", url), e);
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
			log.error("三方定额接口签名计算异常", e);
			return null;
		}
	}

}
