package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.SoodsDao;
import com.fanglin.data.material.dao.SoodsItemDao;
import com.fanglin.data.material.service.SoodsItemService;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.SoodsItemVO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.SoodsItemPO;
import com.fanglin.data.po.SoodsPO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("soodsItemService")
@Transactional(readOnly = true)
public class SoodsItemServiceImpl implements SoodsItemService {

	@Autowired
	private SoodsDao soodsDao;

	@Autowired
	private SoodsItemDao soodsItemDao;

	@Override
	public void pageSoodsItemByQiid(Paging paging, List<Filter> filters, SoodsItemVO soodsItemVO) {

		List<SoodsItemPO> soodsItemPOs = soodsItemDao.pageSoodsItemByQiid(paging, filters, soodsItemVO.getQuotationItem().getQiid(), soodsItemVO.getStatus(), soodsItemVO.getGoods().getStatus());
		List<SoodsItemVO> soodsItemVOs = new ArrayList<SoodsItemVO>();

		for (SoodsItemPO soodsItemPO : soodsItemPOs) {

			soodsItemVO = new SoodsItemVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyPropertie(soodsItemPO, soodsItemVO, Arrays.asList("soods", "goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsItemVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsItemVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsItemPO.getQuotationItem().ptv(soodsItemVO.getQuotationItem());

			soodsItemVOs.add(soodsItemVO);
		}

		paging.setData(soodsItemVOs);
	}

	@Override
	public void pageSoodsItemBySid(Paging paging, List<Filter> filters, SoodsItemVO soodsItemVO) {

		List<SoodsItemPO> soodsItemPOs = soodsItemDao.pageSoodsItemBySid(paging, filters, soodsItemVO.getSid(), soodsItemVO.getStatus());
		List<SoodsItemVO> soodsItemVOs = new ArrayList<SoodsItemVO>();

		for (SoodsItemPO soodsItemPO : soodsItemPOs) {

			soodsItemVO = new SoodsItemVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyPropertie(soodsItemPO, soodsItemVO, Arrays.asList("soods", "goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsItemVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsItemVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsItemPO.getQuotationItem().ptv(soodsItemVO.getQuotationItem());

			soodsItemVOs.add(soodsItemVO);
		}

		paging.setData(soodsItemVOs);

	}

	@Override
	public List<SoodsItemVO> querySoodsItemByQiid(SoodsItemVO soodsItemVO) throws FLException {

		List<SoodsItemPO> SoodsItemPOs = soodsItemDao.querySoodsItemByQiid(soodsItemVO.getQuotationItem().getQiid());
		List<SoodsItemVO> soodsItemVOs = new ArrayList<SoodsItemVO>();

		for (SoodsItemPO soodsItemPO : SoodsItemPOs) {

			soodsItemVO = new SoodsItemVO(new GoodsVO(), new QuotationItemVO());

			BeanUtil.copyPropertie(soodsItemPO, soodsItemVO, Arrays.asList("soods", "goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsItemVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsItemVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsItemPO.getQuotationItem().ptv(soodsItemVO.getQuotationItem());

			soodsItemVOs.add(soodsItemVO);
		}

		return soodsItemVOs;
	}

	@Override
	public List<SoodsItemVO> querySoodsItemBySid(SoodsItemVO soodsItemVO) throws FLException {

		List<SoodsItemPO> soodsItemPOs = soodsItemDao.querySoodsItemBySid(soodsItemVO.getSid());
		List<SoodsItemVO> soodsItemVOs = new ArrayList<SoodsItemVO>();

		for (SoodsItemPO soodsItemPO : soodsItemPOs) {

			soodsItemVO = new SoodsItemVO(new GoodsVO(), new QuotationItemVO(new QuotationVersionVO()));

			BeanUtil.copyPropertie(soodsItemPO, soodsItemVO, Arrays.asList("soods", "goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods(), soodsItemVO, Arrays.asList("goods", "quotationItem"));
			BeanUtil.copyProperties(soodsItemPO.getSoods().getGoods(), soodsItemVO.getGoods(), Arrays.asList("accessoriesType"));

			soodsItemPO.getQuotationItem().ptv(soodsItemVO.getQuotationItem());

			soodsItemVOs.add(soodsItemVO);
		}

		return soodsItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSoodsItem(SoodsItemVO soodsItemVO, long company) throws FLException {
		SoodsPO soodsPO = soodsDao.get(soodsItemVO.getSid());

		if (soodsPO == null) {
			throw new FLException(200038, "选材项不存在");
		}

		if (soodsPO.getSelling() > soodsItemVO.getQuotationItem().getUnitPrice()) {
			throw new FLException(130037, "选材结算金额不符");
		}

		if (soodsItemDao.countSoodsItem(soodsItemVO.getGoods().getGid(), soodsItemVO.getQuotationItem().getQiid()) > 0) {
			throw new FLException(130032, "选材已存在");
		}

		SoodsItemPO soodsItemPO = new SoodsItemPO();

		soodsItemPO.setQuotationItem(new QuotationItemPO(soodsItemVO.getQuotationItem().getQiid()));
		soodsItemPO.setSoods(soodsPO);
		soodsItemPO.setGid(soodsPO.getGoods().getGid());

		soodsItemPO.setStatus(SoodsItemPO.STATUS_INIT_INT);

		soodsItemDao.save(soodsItemPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSoodsItem(SoodsItemVO soodsItemVO) throws FLException {

		soodsItemDao.deleteById(soodsItemVO.getSiid());

		return 0;
	}
}
