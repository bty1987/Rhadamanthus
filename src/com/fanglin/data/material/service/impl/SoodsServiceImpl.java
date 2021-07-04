package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.SoodsDao;
import com.fanglin.data.material.service.SoodsService;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.SoodsPO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("soodsService")
@Transactional(readOnly = true)
public class SoodsServiceImpl implements SoodsService {

	@Autowired
	private SoodsDao soodsDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public void pageSoods(Paging paging, List<Filter> filters, int company) {

		List<SoodsPO> soodsPOs = soodsDao.pageSoods(paging, filters, company);
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsPO soodsPO : soodsPOs) {

			SoodsVO soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyProperties(soodsPO, soodsVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsPO.getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsPO.getQuotationItem().ptv(soodsVO.getQuotationItem());

			soodsVOs.add(soodsVO);
		}

		paging.setData(soodsVOs);

	}

	@Override
	public void pageSoodsByQiid(Paging paging, List<Filter> filters, SoodsVO soodsVO) {

		List<SoodsPO> soodsPOs = soodsDao.pageSoodsByQiid(paging, filters, soodsVO.getQuotationItem().getQiid());
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsPO soodsPO : soodsPOs) {
			soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyProperties(soodsPO, soodsVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsPO.getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsPO.getQuotationItem().ptv(soodsVO.getQuotationItem());

			soodsVOs.add(soodsVO);
		}

		paging.setData(soodsVOs);
	}

	@Override
	public List<SoodsVO> querySoodsByQiid(SoodsVO soodsVO) throws FLException {

		List<SoodsPO> soodsPOs = soodsDao.querySoodsByQiid(soodsVO.getQuotationItem().getQiid());
		List<SoodsVO> soodsVOs = new ArrayList<SoodsVO>();

		for (SoodsPO soodsPO : soodsPOs) {

			soodsVO = new SoodsVO(new GoodsVO(), new QuotationItemVO());

			BeanUtil.copyProperties(soodsPO, soodsVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsPO.getGoods(), soodsVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsPO.getQuotationItem().ptv(soodsVO.getQuotationItem());

			soodsVOs.add(soodsVO);
		}

		return soodsVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSoods(SoodsVO soodsVO, int company) throws FLException {

		SoodsPO soodsPO = new SoodsPO();

		if (soodsDao.countSoods(soodsVO.getGoods().getGid(), soodsVO.getQuotationItem().getQiid()) > 0) {
			throw new FLException(130032, "选材已存在");
		}

		GoodsPO goodsPO = goodsDao.get(soodsVO.getGoods().getGid());

		BrandPO brandPO = brandDao.queryBrandByBid(goodsPO.getBid());

		if (brandPO == null || brandPO.getSupplier() == null) {
			throw new FLException(130036, "商品无关联厂商");
		}

		soodsPO.setGoods(goodsPO);
		soodsPO.setQuotationItem(new QuotationItemPO(soodsVO.getQuotationItem().getQiid()));
		soodsPO.setNum(soodsVO.getNum());
		soodsPO.setStatus(SoodsPO.STATUS_VALID_INT);
		soodsPO.setCompany(company);
		soodsPO.setSelling(soodsVO.getSelling());

		soodsDao.save(soodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSoods(SoodsVO soodsVO) throws FLException {

		SoodsPO soodsPO = soodsDao.get(soodsVO.getSid());

		soodsPO.setSelling(soodsVO.getSelling());

		soodsDao.update(soodsPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSoods(SoodsVO soodsVO) throws FLException {

		SoodsPO soodsPO = soodsDao.get(soodsVO.getSid());

		soodsDao.delete(soodsPO);

		return 0;
	}

}
