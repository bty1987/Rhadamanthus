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
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketCampaignDao;
import com.fanglin.market.dao.MarketChannelDao;
import com.fanglin.market.dao.MarketSourceDao;
import com.fanglin.market.po.MarketCampaignPO;
import com.fanglin.market.po.MarketChannelPO;
import com.fanglin.market.po.MarketSourcePO;
import com.fanglin.market.service.MarketSourceService;
import com.fanglin.market.vo.MarketSourceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("marketSourceService")
@Transactional(readOnly = true)
public class MarketSourceServiceImpl implements MarketSourceService {

	@Autowired
	private MarketSourceDao marketSourceDao;

	@Autowired
	private MarketCampaignDao marketCampaignDao;

	@Autowired
	private MarketChannelDao marketChannelDao;

	@Override
	public void pageMarketSource(Paging paging, List<Filter> filters, int company) {

		List<MarketSourcePO> marketSourcePOs = marketSourceDao.pageMarketSource(paging, filters, company);
		List<MarketSourceVO> marketSourceVOs = new ArrayList<MarketSourceVO>();

		for (MarketSourcePO marketSourcePO : marketSourcePOs) {

			MarketSourceVO marketSourceVO = new MarketSourceVO();

			BeanUtil.copyPropertie(marketSourcePO, marketSourceVO);

			marketSourceVOs.add(marketSourceVO);
		}

		paging.setData(marketSourceVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMarketSource(MarketSourceVO marketSourceVO, int company) throws FLException {

		checkCampaignAndChannel(marketSourceVO, company);

		MarketSourcePO marketSourcePO = new MarketSourcePO();

		BeanUtil.copyProperties(marketSourceVO, marketSourcePO, Arrays.asList("msid", "status", "createTime", "company"));

		if (StringUtils.isBlank(marketSourcePO.getCode())) {
			marketSourcePO.setCode(UUID.randomUUID().toString().replace("-", ""));
		}

		checkMarketSourceCode(marketSourcePO.getCode(), 0, company);

		marketSourcePO.setStatus(MarketSourcePO.STATUS_ENABLE_INT);
		marketSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		marketSourcePO.setCompany(company);

		marketSourceDao.save(marketSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMarketSource(MarketSourceVO marketSourceVO, int company) throws FLException {

		if (marketSourceVO == null || marketSourceVO.getMsid() == null) {
			throw new FLException(390004, "来源不存在");
		}

		MarketSourcePO marketSourcePO = marketSourceDao.get(marketSourceVO.getMsid());

		checkMarketSource(marketSourcePO, company);
		checkCampaignAndChannel(marketSourceVO, company);
		checkMarketSourceCode(marketSourceVO, marketSourcePO, company);

		BeanUtil.copyProperties(marketSourceVO, marketSourcePO, Arrays.asList("msid", "status", "createTime", "company"));

		marketSourceDao.update(marketSourcePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableMarketSource(MarketSourceVO marketSourceVO, int company) throws FLException {

		if (marketSourceVO == null || marketSourceVO.getMsid() == null) {
			throw new FLException(390004, "来源不存在");
		}

		MarketSourcePO marketSourcePO = marketSourceDao.get(marketSourceVO.getMsid());

		checkMarketSource(marketSourcePO, company);

		marketSourcePO.setStatus(MarketSourcePO.STATUS_DISABLE_INT);

		marketSourceDao.update(marketSourcePO);
	}

	private void checkCampaignAndChannel(MarketSourceVO marketSourceVO, int company) throws FLException {

		if (marketSourceVO == null || marketSourceVO.getCampaignId() == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = marketCampaignDao.get(marketSourceVO.getCampaignId());

		if (marketCampaignPO == null || marketCampaignPO.getCompany() != company) {
			throw new FLException(390001, "活动不存在");
		}

		if (marketSourceVO.getChannelId() == null) {
			throw new FLException(390003, "渠道不存在");
		}

		MarketChannelPO marketChannelPO = marketChannelDao.get(marketSourceVO.getChannelId());

		if (marketChannelPO == null || marketChannelPO.getCompany() != company) {
			throw new FLException(390003, "渠道不存在");
		}
	}

	private void checkMarketSource(MarketSourcePO marketSourcePO, int company) throws FLException {

		if (marketSourcePO == null || marketSourcePO.getCompany() != company) {
			throw new FLException(390004, "来源不存在");
		}
	}

	private void checkMarketSourceCode(MarketSourceVO marketSourceVO, MarketSourcePO marketSourcePO, int company) throws FLException {

		if (StringUtils.isBlank(marketSourceVO.getCode())) return;

		checkMarketSourceCode(marketSourceVO.getCode(), marketSourcePO.getMsid(), company);
	}

	private void checkMarketSourceCode(String code, long msid, int company) throws FLException {

		MarketSourcePO existed = marketSourceDao.queryMarketSourceByCode(code, company);

		if (existed != null && existed.getMsid() != msid) {
			throw new FLException(390016, "来源已存在");
		}
	}

}
