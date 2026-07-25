package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.MarketChannelDao;
import com.fanglin.market.po.MarketChannelPO;
import com.fanglin.market.service.MarketChannelService;
import com.fanglin.market.vo.MarketChannelVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("marketChannelService")
@Transactional(readOnly = true)
public class MarketChannelServiceImpl implements MarketChannelService {

	@Autowired
	private MarketChannelDao marketChannelDao;

	@Override
	public void pageMarketChannel(Paging paging, List<Filter> filters, int company) {

		List<MarketChannelPO> marketChannelPOs = marketChannelDao.pageMarketChannel(paging, filters, company);
		List<MarketChannelVO> marketChannelVOs = new ArrayList<MarketChannelVO>();

		for (MarketChannelPO marketChannelPO : marketChannelPOs) {

			MarketChannelVO marketChannelVO = new MarketChannelVO();

			BeanUtil.copyPropertie(marketChannelPO, marketChannelVO);

			marketChannelVOs.add(marketChannelVO);
		}

		paging.setData(marketChannelVOs);
	}

	@Override
	public List<MarketChannelVO> queryMarketChannelForEnable(int company) {

		List<MarketChannelPO> marketChannelPOs = marketChannelDao.queryMarketChannelForEnable(company);
		List<MarketChannelVO> marketChannelVOs = new ArrayList<MarketChannelVO>();

		for (MarketChannelPO marketChannelPO : marketChannelPOs) {

			MarketChannelVO marketChannelVO = new MarketChannelVO();

			BeanUtil.copyPropertie(marketChannelPO, marketChannelVO);

			marketChannelVOs.add(marketChannelVO);
		}

		return marketChannelVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMarketChannel(MarketChannelVO marketChannelVO, int company) throws FLException {

		if (marketChannelVO == null) {
			throw new FLException(390003, "渠道不存在");
		}

		MarketChannelPO marketChannelPO = new MarketChannelPO();

		BeanUtil.copyProperties(marketChannelVO, marketChannelPO, Arrays.asList("mchid", "status", "company"));

		marketChannelPO.setStatus(MarketChannelPO.STATUS_ENABLE_INT);
		marketChannelPO.setCompany(company);

		marketChannelDao.save(marketChannelPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMarketChannel(MarketChannelVO marketChannelVO, int company) throws FLException {

		if (marketChannelVO == null || marketChannelVO.getMchid() == null) {
			throw new FLException(390003, "渠道不存在");
		}

		MarketChannelPO marketChannelPO = marketChannelDao.get(marketChannelVO.getMchid());

		checkMarketChannel(marketChannelPO, company);

		BeanUtil.copyProperties(marketChannelVO, marketChannelPO, Arrays.asList("mchid", "status", "company"));

		marketChannelDao.update(marketChannelPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void disableMarketChannel(MarketChannelVO marketChannelVO, int company) throws FLException {

		if (marketChannelVO == null || marketChannelVO.getMchid() == null) {
			throw new FLException(390003, "渠道不存在");
		}

		MarketChannelPO marketChannelPO = marketChannelDao.get(marketChannelVO.getMchid());

		checkMarketChannel(marketChannelPO, company);

		marketChannelPO.setStatus(MarketChannelPO.STATUS_DISABLE_INT);

		marketChannelDao.update(marketChannelPO);
	}

	private void checkMarketChannel(MarketChannelPO marketChannelPO, int company) throws FLException {

		if (marketChannelPO == null || marketChannelPO.getCompany() != company) {
			throw new FLException(390003, "渠道不存在");
		}
	}

}
