package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.PriceDao;
import com.fanglin.data.material.service.PriceService;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.PriceVO;
import com.fanglin.data.po.PriceGO;
import com.fanglin.data.po.PricePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("priceService")
@Transactional(readOnly = true)
public class PriceServiceImpl implements PriceService {

	@Autowired
	private PriceDao priceDao;

	@Override
	public void pagePrice(Paging paging, List<Filter> filters, int company) {

		List<PriceGO> priceGOs = priceDao.pagePrice(paging, filters, company);
		List<PriceVO> priceVOs = new ArrayList<PriceVO>();

		for (PriceGO priceGO : priceGOs) {

			PriceVO priceVO = new PriceVO(new GoodsVO());

			BeanUtil.copyProperties(priceGO, priceVO, Arrays.asList("goods"));
			BeanUtil.copyProperties(priceGO.getGoods(), priceVO.getGoods(), Arrays.asList("accessoriesType"));

			priceVOs.add(priceVO);
		}

		paging.setData(priceVOs);
	}

	@Override
	public List<PriceVO> queryPriceByGid(PriceVO priceVO) {

		List<PricePO> pricePOs = priceDao.queryPriceByGid(priceVO.getGid(), priceVO.getStatus());
		List<PriceVO> priceVOs = new ArrayList<PriceVO>();

		for (PricePO pricePO : pricePOs) {

			priceVO = new PriceVO();

			String content = pricePO.getSelling() + " " + pricePO.getName();

			BeanUtil.copyProperties(pricePO, priceVO);
			priceVO.setContent(content);

			priceVOs.add(priceVO);
		}

		return priceVOs;
	}

	@Override
	public PriceVO queryPriceByPid(PriceVO priceVO) {

		PricePO pricePO = priceDao.queryPriceByPid(priceVO.getPid());

		PriceVO priceVOs = new PriceVO();
		BeanUtil.copyProperties(pricePO, priceVOs);

		return priceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPrice(PriceVO priceVO) throws FLException {

		PricePO pricePO = new PricePO();

		BeanUtil.copyProperties(priceVO, pricePO);

		priceDao.save(pricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deletePrice(PriceVO priceVO) throws FLException {

		PricePO pricePO = priceDao.get(priceVO.getPid());

		if (pricePO == null) {
			throw new FLException(260016, "价格不存在");
		}

		priceDao.delete(pricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePriceForStatus(PriceVO priceVO) throws FLException {

		PricePO pricePO = priceDao.get(priceVO.getPid());

		if (pricePO == null) {
			throw new FLException(260016, "价格不存在");
		}

		pricePO.setStatus(priceVO.getStatus());

		priceDao.update(pricePO);

		return 0;
	}

}
