package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.data.quotation.service.QuotationPriceService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationPriceVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationPriceService")
@Transactional(readOnly = true)
public class QuotationPriceServiceImpl implements QuotationPriceService {

	@Autowired
	public QuotationPriceDao quotationPriceDao;

	@Autowired
	public QuotationItemDao quotationItemDao;

	@Override
	public void pageQuotationPrice(Paging paging, List<Filter> filters, QuotationPriceVO quotationPriceVO) {

		List<QuotationPricePO> quotationPricePOs = quotationPriceDao.pageQuotationPrice(paging, filters, quotationPriceVO.getQuotationItem().getQiid(), quotationPriceVO.getStatus());
		List<QuotationPriceVO> quotationPriceVOs = new ArrayList<QuotationPriceVO>();

		for (QuotationPricePO quotationPricePO : quotationPricePOs) {

			quotationPriceVO = new QuotationPriceVO(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO()));

			BeanUtil.copyPropertie(quotationPricePO, quotationPriceVO, Arrays.asList("quotationItem"));

			quotationPricePO.getQuotationItem().ptv(quotationPriceVO.getQuotationItem());

			quotationPriceVOs.add(quotationPriceVO);
		}

		paging.setData(quotationPriceVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationPrice(QuotationPriceVO quotationPriceVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationPriceVO.getQuotationItem().getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		QuotationPricePO quotationPricePO = new QuotationPricePO();

		BeanUtil.copyProperties(quotationPriceVO, quotationPricePO, Arrays.asList("quotationItem"));

		quotationPricePO.setQuotationItem(quotationItemPO);
		quotationPricePO.setCreateTime(DateUtil.getDateToTimestamp(DateUtil.parseDate("2015-01-01 00:00:00", "yyyy-MM-dd hh:mm:ss")));
		quotationPricePO.setStatus(QuotationPricePO.STATUS_ENABLE_INT);

		quotationPriceDao.save(quotationPricePO);

		quotationItemPO.setAddPrice(quotationPriceVO.getAddPrice());
		quotationItemPO.setUnitPrice(quotationPriceVO.getUnitPrice());
		quotationItemPO.setSubPrice(quotationPriceVO.getSubPrice());

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationPrice(QuotationPriceVO quotationPriceVO) throws FLException {

		QuotationPricePO quotationPricePO = quotationPriceDao.get(quotationPriceVO.getQpid());

		if (quotationPricePO == null) {
			throw new FLException(200076, "报价价格不存在");
		}

		BeanUtil.copyProperties(quotationPriceVO, quotationPricePO, Arrays.asList("quotationItem"));

		quotationPriceDao.update(quotationPricePO);

		QuotationItemPO quotationItem = quotationItemDao.get(quotationPriceVO.getQuotationItem().getQiid());

		quotationItem.setAddPrice(quotationPriceVO.getAddPrice());
		quotationItem.setUnitPrice(quotationPriceVO.getUnitPrice());
		quotationItem.setSubPrice(quotationPriceVO.getSubPrice());

		quotationItemDao.update(quotationItem);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationPrice(QuotationPriceVO quotationPriceVO) throws FLException {

		QuotationPricePO quotationPricePO = quotationPriceDao.get(quotationPriceVO.getQpid());

		if (quotationPricePO == null) {
			throw new FLException(200076, "报价价格不存在");
		}

		quotationPriceDao.delete(quotationPricePO);

		return 0;
	}

}
