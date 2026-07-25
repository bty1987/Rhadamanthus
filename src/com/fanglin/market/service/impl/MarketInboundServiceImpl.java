package com.fanglin.market.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketAttributionDao;
import com.fanglin.market.dao.MarketCampaignDao;
import com.fanglin.market.dao.MarketChannelDao;
import com.fanglin.market.dao.MarketInboundDao;
import com.fanglin.market.dao.MarketInboundItemDao;
import com.fanglin.market.dao.MarketSourceDao;
import com.fanglin.market.po.MarketAttributionPO;
import com.fanglin.market.po.MarketCampaignPO;
import com.fanglin.market.po.MarketChannelPO;
import com.fanglin.market.po.MarketInboundItemPO;
import com.fanglin.market.po.MarketInboundPO;
import com.fanglin.market.po.MarketSourcePO;
import com.fanglin.market.service.MarketCustomerBridgeService;
import com.fanglin.market.service.MarketInboundService;
import com.fanglin.market.vo.MarketAttributionVO;
import com.fanglin.market.vo.MarketInboundItemVO;
import com.fanglin.market.vo.MarketInboundVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("marketInboundService")
@Transactional(readOnly = true)
public class MarketInboundServiceImpl implements MarketInboundService {

	@Autowired
	private MarketInboundDao marketInboundDao;

	@Autowired
	private MarketInboundItemDao marketInboundItemDao;

	@Autowired
	private MarketAttributionDao marketAttributionDao;

	@Autowired
	private MarketCampaignDao marketCampaignDao;

	@Autowired
	private MarketChannelDao marketChannelDao;

	@Autowired
	private MarketSourceDao marketSourceDao;

	@Autowired
	private MarketCustomerBridgeService marketCustomerBridgeService;

	@Override
	public void pageMarketInbound(Paging paging, List<Filter> filters, int company) {

		List<MarketInboundPO> marketInboundPOs = marketInboundDao.pageMarketInbound(paging, filters, company);
		List<MarketInboundVO> marketInboundVOs = new ArrayList<MarketInboundVO>();

		for (MarketInboundPO marketInboundPO : marketInboundPOs) {
			marketInboundVOs.add(ptv(marketInboundPO, false));
		}

		paging.setData(marketInboundVOs);
	}

	@Override
	public MarketInboundVO queryMarketInboundByMiid(MarketInboundVO marketInboundVO, int company) throws FLException {

		if (marketInboundVO == null || marketInboundVO.getMiid() == null) {
			throw new FLException(390005, "入站记录不存在");
		}

		MarketInboundPO marketInboundPO = marketInboundDao.get(marketInboundVO.getMiid());

		checkMarketInbound(marketInboundPO, company);

		return ptv(marketInboundPO, true);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMarketInbound(MarketInboundVO marketInboundVO, String userId, int company) throws FLException {

		if (marketInboundVO == null) {
			throw new FLException(390005, "入站记录不存在");
		}

		checkMarketInboundSource(marketInboundVO, company);

		String phoneHash = buildPhoneHash(marketInboundVO.getPhone());
		String idempotentKey = buildIdempotentKey(marketInboundVO, phoneHash, company);

		MarketInboundPO existed = marketInboundDao.queryMarketInboundByIdempotentKey(idempotentKey, company);

		if (existed != null) {
			marketInboundVO.setMiid(existed.getMiid());
			marketInboundVO.setInboundNo(existed.getInboundNo());
			marketInboundVO.setStatus(existed.getStatus());
			marketInboundVO.setCsid(existed.getCsid());
			marketInboundVO.setCcid(existed.getCcid());
			marketInboundVO.setOrderId(existed.getOrderId());
			return;
		}

		MarketInboundPO marketInboundPO = new MarketInboundPO();
		Timestamp now = new Timestamp(System.currentTimeMillis());

		BeanUtil.copyProperties(marketInboundVO, marketInboundPO, Arrays.asList("miid", "phone", "phoneHash", "inboundNo", "csid", "ccid", "orderId", "status", "errorMsg", "createTime", "updateTime", "company", "items", "customerSource", "customerChance"));

		marketInboundPO.setInboundNo(buildInboundNo());
		marketInboundPO.setPhone(StringUtils.isBlank(marketInboundVO.getPhone()) ? null : SensitiveDataHelper.encrypt(marketInboundVO.getPhone()));
		marketInboundPO.setPhoneHash(phoneHash);
		marketInboundPO.setIdempotentKey(idempotentKey);
		marketInboundPO.setStatus(MarketInboundPO.STATUS_PENDING_INT);
		marketInboundPO.setCreateTime(now);
		marketInboundPO.setUpdateTime(now);
		marketInboundPO.setCompany(company);

		marketInboundDao.save(marketInboundPO);
		marketInboundDao.flush();

		saveItems(marketInboundPO.getMiid(), marketInboundVO.getItems());
		acceptInbound(marketInboundPO, marketInboundVO, userId, company);

		marketInboundVO.setMiid(marketInboundPO.getMiid());
		marketInboundVO.setInboundNo(marketInboundPO.getInboundNo());
		marketInboundVO.setStatus(marketInboundPO.getStatus());
		marketInboundVO.setCsid(marketInboundPO.getCsid());
		marketInboundVO.setCcid(marketInboundPO.getCcid());
		marketInboundVO.setOrderId(marketInboundPO.getOrderId());
		marketInboundVO.setErrorMsg(marketInboundPO.getErrorMsg());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void retryMarketInbound(MarketInboundVO marketInboundVO, String userId, int company) throws FLException {

		if (marketInboundVO == null || marketInboundVO.getMiid() == null) {
			throw new FLException(390005, "入站记录不存在");
		}

		MarketInboundPO marketInboundPO = marketInboundDao.get(marketInboundVO.getMiid());

		checkMarketInbound(marketInboundPO, company);

		if (!Arrays.asList(MarketInboundPO.STATUS_PENDING_INT, MarketInboundPO.STATUS_FAILED_INT, MarketInboundPO.STATUS_RETRY_INT).contains(marketInboundPO.getStatus())) {
			throw new FLException(390006, "入站状态不可操作");
		}

		marketInboundPO.setStatus(MarketInboundPO.STATUS_RETRY_INT);
		marketInboundPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		BeanUtil.copyPropertie(marketInboundPO, marketInboundVO, Arrays.asList("phone", "items", "customerSource", "customerChance"));
		acceptInbound(marketInboundPO, marketInboundVO, userId, company);
	}

	@Override
	public List<MarketAttributionVO> queryMarketAttributionByCsid(MarketAttributionVO marketAttributionVO, int company) throws FLException {

		if (marketAttributionVO == null || marketAttributionVO.getCsid() == null) {
			throw new FLException(390005, "入站记录不存在");
		}

		List<MarketAttributionPO> marketAttributionPOs = marketAttributionDao.queryMarketAttributionByCsid(marketAttributionVO.getCsid(), company);
		List<MarketAttributionVO> marketAttributionVOs = new ArrayList<MarketAttributionVO>();

		for (MarketAttributionPO marketAttributionPO : marketAttributionPOs) {

			MarketAttributionVO attributionVO = new MarketAttributionVO();

			BeanUtil.copyPropertie(marketAttributionPO, attributionVO);

			marketAttributionVOs.add(attributionVO);
		}

		return marketAttributionVOs;
	}

	@Override
	public int countMarketInboundForCampaign(MarketInboundVO marketInboundVO, int company) throws FLException {

		if (marketInboundVO == null || marketInboundVO.getCampaignId() == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = marketCampaignDao.get(marketInboundVO.getCampaignId());

		if (marketCampaignPO == null || marketCampaignPO.getCompany() != company) {
			throw new FLException(390001, "活动不存在");
		}

		short status = marketInboundVO.getStatus() == null ? MarketInboundPO.STATUS_SUCCESS_INT : marketInboundVO.getStatus();

		return marketInboundDao.countMarketInboundForCampaign(marketInboundVO.getCampaignId(), status, company);
	}

	@Override
	public int countMarketInboundForChannel(MarketInboundVO marketInboundVO, int company) throws FLException {

		if (marketInboundVO == null || marketInboundVO.getChannelId() == null) {
			throw new FLException(390003, "渠道不存在");
		}

		MarketChannelPO marketChannelPO = marketChannelDao.get(marketInboundVO.getChannelId());

		if (marketChannelPO == null || marketChannelPO.getCompany() != company) {
			throw new FLException(390003, "渠道不存在");
		}

		short status = marketInboundVO.getStatus() == null ? MarketInboundPO.STATUS_SUCCESS_INT : marketInboundVO.getStatus();

		return marketInboundDao.countMarketInboundForChannel(marketInboundVO.getChannelId(), status, company);
	}

	private void acceptInbound(MarketInboundPO marketInboundPO, MarketInboundVO marketInboundVO, String userId, int company) throws FLException {

		try {

			MarketCustomerBridgeService.BridgeResult result = marketCustomerBridgeService.acceptMarketInbound(marketInboundVO, userId, company);

			if (result.isAccepted()) {

				marketInboundPO.setCsid(result.getCsid() == null ? 0 : result.getCsid());
				marketInboundPO.setCcid(result.getCcid() == null ? 0 : result.getCcid());
				marketInboundPO.setOrderId(result.getOrderId());
				marketInboundPO.setStatus(MarketInboundPO.STATUS_SUCCESS_INT);
				marketInboundPO.setErrorMsg(null);

				saveAttribution(marketInboundPO, resolveEventType(marketInboundPO));
			} else {
				marketInboundPO.setStatus(MarketInboundPO.STATUS_PENDING_INT);
				marketInboundPO.setErrorMsg(result.getMessage());
			}
		} catch (FLException e) {
			marketInboundPO.setStatus(MarketInboundPO.STATUS_FAILED_INT);
			marketInboundPO.setErrorMsg(e.getErrorMessage());
		}

		marketInboundPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		marketInboundDao.update(marketInboundPO);
	}

	private void saveAttribution(MarketInboundPO marketInboundPO, short eventType) {

		MarketAttributionPO marketAttributionPO = new MarketAttributionPO();

		marketAttributionPO.setCampaignId(marketInboundPO.getCampaignId());
		marketAttributionPO.setSourceId(marketInboundPO.getSourceId());
		marketAttributionPO.setMiid(marketInboundPO.getMiid());
		marketAttributionPO.setCsid(marketInboundPO.getCsid());
		marketAttributionPO.setCcid(marketInboundPO.getCcid());
		marketAttributionPO.setOrderId(marketInboundPO.getOrderId());
		marketAttributionPO.setEventType(eventType);
		marketAttributionPO.setStatus((short) 0);
		marketAttributionPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		marketAttributionPO.setCompany(marketInboundPO.getCompany());

		marketAttributionDao.save(marketAttributionPO);
	}

	private void saveItems(long miid, List<MarketInboundItemVO> items) {

		if (items == null) return;

		for (MarketInboundItemVO itemVO : items) {

			if (itemVO == null || StringUtils.isBlank(itemVO.getFieldKey())) continue;

			MarketInboundItemPO itemPO = new MarketInboundItemPO();

			BeanUtil.copyProperties(itemVO, itemPO, Arrays.asList("miiid", "miid"));
			itemPO.setMiid(miid);

			marketInboundItemDao.save(itemPO);
		}
	}

	private MarketInboundVO ptv(MarketInboundPO marketInboundPO, boolean withItems) {

		MarketInboundVO marketInboundVO = new MarketInboundVO();

		BeanUtil.copyPropertie(marketInboundPO, marketInboundVO);
		marketInboundVO.setPhone(StringUtils.isBlank(marketInboundPO.getPhone()) ? null : SensitiveDataHelper.maskPhone(SensitiveDataHelper.decrypt(marketInboundPO.getPhone())));

		if (withItems) {

			List<MarketInboundItemPO> itemPOs = marketInboundItemDao.queryMarketInboundItemByMiid(marketInboundPO.getMiid());
			List<MarketInboundItemVO> itemVOs = new ArrayList<MarketInboundItemVO>();

			for (MarketInboundItemPO itemPO : itemPOs) {

				MarketInboundItemVO itemVO = new MarketInboundItemVO();

				BeanUtil.copyPropertie(itemPO, itemVO);

				itemVOs.add(itemVO);
			}

			marketInboundVO.setItems(itemVOs);
		}

		return marketInboundVO;
	}

	private void checkMarketInboundSource(MarketInboundVO marketInboundVO, int company) throws FLException {

		if (marketInboundVO == null || marketInboundVO.getCampaignId() == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = marketCampaignDao.get(marketInboundVO.getCampaignId());

		if (marketCampaignPO == null || marketCampaignPO.getCompany() != company) {
			throw new FLException(390001, "活动不存在");
		}

		if (marketInboundVO.getChannelId() == null) {
			throw new FLException(390003, "渠道不存在");
		}

		MarketChannelPO marketChannelPO = marketChannelDao.get(marketInboundVO.getChannelId());

		if (marketChannelPO == null || marketChannelPO.getCompany() != company) {
			throw new FLException(390003, "渠道不存在");
		}

		if (marketInboundVO.getSourceId() == null) {
			throw new FLException(390004, "来源不存在");
		}

		MarketSourcePO marketSourcePO = marketSourceDao.get(marketInboundVO.getSourceId());

		if (marketSourcePO == null || marketSourcePO.getCompany() != company) {
			throw new FLException(390004, "来源不存在");
		}

		if (marketSourcePO.getCampaignId() != marketInboundVO.getCampaignId() || marketSourcePO.getChannelId() != marketInboundVO.getChannelId()) {
			throw new FLException(390004, "来源不存在");
		}
	}

	private void checkMarketInbound(MarketInboundPO marketInboundPO, int company) throws FLException {

		if (marketInboundPO == null || marketInboundPO.getCompany() != company) {
			throw new FLException(390005, "入站记录不存在");
		}
	}

	private String buildPhoneHash(String phone) {

		if (StringUtils.isBlank(phone)) return null;

		return MD5Helper.MD5(phone.trim());
	}

	private String buildIdempotentKey(MarketInboundVO marketInboundVO, String phoneHash, int company) {

		if (StringUtils.isNotBlank(marketInboundVO.getIdempotentKey())) return marketInboundVO.getIdempotentKey();

		return MD5Helper.MD5(String.format("%s-%s-%s-%s", company, marketInboundVO.getCampaignId(), marketInboundVO.getSourceId(), phoneHash == null ? UUID.randomUUID().toString() : phoneHash));
	}

	private String buildInboundNo() {
		return String.format("MI%s", UUID.randomUUID().toString().replace("-", "").substring(0, 18));
	}

	private short resolveEventType(MarketInboundPO marketInboundPO) {

		if (marketInboundPO.getCcid() > 0) return MarketAttributionPO.EVENT_CUSTOMER_CHANCE_INT;

		if (marketInboundPO.getCsid() > 0) return MarketAttributionPO.EVENT_CUSTOMER_SOURCE_INT;

		return MarketAttributionPO.EVENT_SUBMIT_INT;
	}

}
