package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.RemeasureFormatDao;
import com.fanglin.data.material.service.RemeasureFormatService;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.RemeasureFormatVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.RemeasureFormatPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.utils.BeanUtil;

@Service("remeasureFormatService")
@Transactional(readOnly = true)
public class RemeasureFormatServiceImpl implements RemeasureFormatService {

	@Autowired
	private RemeasureFormatDao remeasureFormatDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Override
	public List<RemeasureFormatVO> queryRemeasureFormatByBid(RemeasureFormatVO remeasureFormat) {

		List<RemeasureFormatPO> remeasureFormatPOs = remeasureFormatDao.queryRemeasureFormatByBid(remeasureFormat.getBrand().getBid());
		List<RemeasureFormatVO> remeasureFormatVOs = new ArrayList<RemeasureFormatVO>();

		for (RemeasureFormatPO remeasureFormatPO : remeasureFormatPOs) {

			RemeasureFormatVO remeasureFormatVO = new RemeasureFormatVO(new BrandVO(), new QuotationItemVO(), new GoodsVO());

			remeasureFormatVOs.add(remeasureFormatPO.ptv(remeasureFormatVO));

		}

		return remeasureFormatVOs;

	}

	@Override
	public RemeasureFormatVO queryRemeasureFormatByRfid(RemeasureFormatVO remeasureFormat) {

		RemeasureFormatPO remeasureFormatPO = remeasureFormatDao.get(remeasureFormat.getRfid());

		RemeasureFormatVO remeasureFormatVO = new RemeasureFormatVO(new BrandVO(), new QuotationItemVO(), new GoodsVO());

		return remeasureFormatPO.ptv(remeasureFormatVO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRemeasureFormat(RemeasureFormatVO remeasureFormatVO, int company) throws FLException {

		long bid = remeasureFormatVO.getBrand().getBid();

		BrandPO brandPO = brandDao.get(bid);

		RemeasureFormatPO remeasureFormatPO = new RemeasureFormatPO(brandPO);

		if (remeasureFormatVO.getQuotationItem() != null && remeasureFormatVO.getQuotationItem().getQiid() != null) remeasureFormatPO.setQuotationItem(quotationItemDao.get(remeasureFormatVO.getQuotationItem().getQiid()));
		if (remeasureFormatVO.getGoods() != null && remeasureFormatVO.getGoods().getGid() != null) remeasureFormatPO.setGoods(goodsDao.get(remeasureFormatVO.getGoods().getGid()));

		BeanUtil.copyProperties(remeasureFormatVO, remeasureFormatPO, Arrays.asList("brand", "quotationItem", "goods"));

		remeasureFormatPO.setCompany(company);

		remeasureFormatDao.save(remeasureFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRemeasureFormat(RemeasureFormatVO remeasureFormatVO) throws FLException {

		RemeasureFormatPO remeasureFormatPO = remeasureFormatDao.get(remeasureFormatVO.getRfid());

		if (remeasureFormatPO == null) {
			throw new FLException(130140, "回尺指标不存在");
		}

		BeanUtil.copyProperties(remeasureFormatVO, remeasureFormatPO, Arrays.asList("brand", "quotationItem", "goods"));

		if (remeasureFormatVO.getBrand() != null && remeasureFormatVO.getBrand().getBid() != null) remeasureFormatPO.setBrand(new BrandPO(remeasureFormatVO.getBrand().getBid()));
		if (remeasureFormatVO.getGoods() != null && remeasureFormatVO.getGoods().getGid() != null) remeasureFormatPO.setGoods(new GoodsPO(remeasureFormatVO.getGoods().getGid()));
		if (remeasureFormatVO.getQuotationItem() != null && remeasureFormatVO.getQuotationItem().getQiid() != null) remeasureFormatPO.setQuotationItem(new QuotationItemPO(remeasureFormatVO.getQuotationItem().getQiid()));

		remeasureFormatDao.update(remeasureFormatPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRemeasureFormatForStatus(RemeasureFormatVO remeasureFormatVO) throws FLException {

		RemeasureFormatPO remeasureFormatPO = remeasureFormatDao.get(remeasureFormatVO.getRfid());

		if (remeasureFormatPO == null) {
			throw new FLException(130140, "回尺指标不存在");
		}

		remeasureFormatPO.setStatus(remeasureFormatVO.getStatus());

		remeasureFormatDao.update(remeasureFormatPO);

		return 0;
	}

}
