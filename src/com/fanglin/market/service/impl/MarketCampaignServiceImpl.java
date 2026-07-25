package com.fanglin.market.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketCampaignDao;
import com.fanglin.market.po.MarketCampaignPO;
import com.fanglin.market.service.MarketCampaignService;
import com.fanglin.market.vo.MarketCampaignVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("marketCampaignService")
@Transactional(readOnly = true)
public class MarketCampaignServiceImpl implements MarketCampaignService {

	@Autowired
	private MarketCampaignDao marketCampaignDao;

	@Override
	public void pageMarketCampaign(Paging paging, List<Filter> filters, int company) {

		List<MarketCampaignPO> marketCampaignPOs = marketCampaignDao.pageMarketCampaign(paging, filters, company);
		List<MarketCampaignVO> marketCampaignVOs = new ArrayList<MarketCampaignVO>();

		for (MarketCampaignPO marketCampaignPO : marketCampaignPOs) {

			MarketCampaignVO marketCampaignVO = new MarketCampaignVO();

			BeanUtil.copyPropertie(marketCampaignPO, marketCampaignVO);

			marketCampaignVOs.add(marketCampaignVO);
		}

		paging.setData(marketCampaignVOs);
	}

	@Override
	public List<MarketCampaignVO> queryMarketCampaignForEnable(int company) {

		List<MarketCampaignPO> marketCampaignPOs = marketCampaignDao.queryMarketCampaignForEnable(company);
		List<MarketCampaignVO> marketCampaignVOs = new ArrayList<MarketCampaignVO>();

		for (MarketCampaignPO marketCampaignPO : marketCampaignPOs) {

			MarketCampaignVO marketCampaignVO = new MarketCampaignVO();

			BeanUtil.copyPropertie(marketCampaignPO, marketCampaignVO);

			marketCampaignVOs.add(marketCampaignVO);
		}

		return marketCampaignVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException {

		if (marketCampaignVO == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = new MarketCampaignPO();

		BeanUtil.copyProperties(marketCampaignVO, marketCampaignPO, Arrays.asList("mcid", "status", "createTime", "updateTime", "company"));

		Timestamp now = new Timestamp(System.currentTimeMillis());

		marketCampaignPO.setStatus(MarketCampaignPO.STATUS_DRAFT_INT);
		marketCampaignPO.setCreateTime(now);
		marketCampaignPO.setUpdateTime(now);
		marketCampaignPO.setCompany(company);

		marketCampaignDao.save(marketCampaignPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException {

		if (marketCampaignVO == null || marketCampaignVO.getMcid() == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = marketCampaignDao.get(marketCampaignVO.getMcid());

		checkMarketCampaign(marketCampaignPO, company);

		BeanUtil.copyProperties(marketCampaignVO, marketCampaignPO, Arrays.asList("mcid", "status", "createTime", "updateTime", "company"));

		marketCampaignPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		marketCampaignDao.update(marketCampaignPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void publishMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException {

		if (marketCampaignVO == null || marketCampaignVO.getMcid() == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = marketCampaignDao.get(marketCampaignVO.getMcid());

		checkMarketCampaign(marketCampaignPO, company);

		if (marketCampaignPO.getStatus() == MarketCampaignPO.STATUS_ARCHIVE_INT) {
			throw new FLException(390002, "活动状态不可操作");
		}

		marketCampaignPO.setStatus(MarketCampaignPO.STATUS_ENABLE_INT);
		marketCampaignPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		marketCampaignDao.update(marketCampaignPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException {

		if (marketCampaignVO == null || marketCampaignVO.getMcid() == null) {
			throw new FLException(390001, "活动不存在");
		}

		MarketCampaignPO marketCampaignPO = marketCampaignDao.get(marketCampaignVO.getMcid());

		checkMarketCampaign(marketCampaignPO, company);

		if (marketCampaignPO.getStatus() == MarketCampaignPO.STATUS_ARCHIVE_INT) {
			throw new FLException(390002, "活动状态不可操作");
		}

		marketCampaignPO.setStatus(MarketCampaignPO.STATUS_DISABLE_INT);
		marketCampaignPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		marketCampaignDao.update(marketCampaignPO);
	}

	private void checkMarketCampaign(MarketCampaignPO marketCampaignPO, int company) throws FLException {

		if (marketCampaignPO == null || marketCampaignPO.getCompany() != company) {
			throw new FLException(390001, "活动不存在");
		}
	}

}
