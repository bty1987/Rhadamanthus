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
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.quotation.dao.QuotationCtemDao;
import com.fanglin.data.quotation.service.QuotationCtemService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("quotationCtemService")
@Transactional(readOnly = true)
public class QuotationCtemServiceImpl implements QuotationCtemService {

	@Autowired
	private QuotationCtemDao quotationCtemDao;

	@Override
	public void pageQuotationCtem(Paging paging, List<Filter> filters) {

		List<QuotationCtemPO> quotationCtemPOs = quotationCtemDao.pageQuotationCtem(paging, filters);

		List<QuotationCtemVO> quotationCtemVOs = new ArrayList<QuotationCtemVO>();

		for (QuotationCtemPO quotationCtemPO : quotationCtemPOs) {

			quotationCtemVOs.add(quotationCtemPO.ptv(new QuotationCtemVO(new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new MeasurementUnitVO(), new WorkTypeVO())));

		}

		paging.setData(quotationCtemVOs);

	}

	@Override
	public List<QuotationCtemVO> queryQuotationCtem(QuotationCtemVO quotationCtemVO) {

		Paging paging = new Paging(0, 10);

		List<QuotationCtemPO> quotationCtemPOs = quotationCtemDao.queryQuotationCtem(paging, quotationCtemVO.getName());
		List<QuotationCtemVO> quotationCtemVOs = new ArrayList<QuotationCtemVO>();

		for (QuotationCtemPO quotationCtemPO : quotationCtemPOs) {

			quotationCtemVOs.add(quotationCtemPO.ptv(new QuotationCtemVO(new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new MeasurementUnitVO(), new WorkTypeVO())));

		}

		return quotationCtemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationCtem(QuotationCtemVO quotationCtemVO) throws FLException {

		QuotationCtemPO quotationCtemPO = new QuotationCtemPO();

		BeanUtil.copyProperties(quotationCtemVO, quotationCtemPO, Arrays.asList("category", "classification", "bigCategory", "smallCategory", "unit", "workType"));

		quotationCtemPO.setStatus(QuotationCtemPO.STATUS_ENABLE_INT);
		quotationCtemPO.setPinyin(PinYin4Util.getPinYinHeadChar(quotationCtemVO.getName()).get(0));

		quotationCtemDao.save(quotationCtemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationCtem(QuotationCtemVO quotationCtemVO) throws FLException {

		QuotationCtemPO quotationCtemPO = quotationCtemDao.get(quotationCtemVO.getQcid());

		BeanUtil.copyProperties(quotationCtemVO, quotationCtemPO, Arrays.asList("category", "classification", "bigCategory", "smallCategory", "unit", "workType"));

		quotationCtemPO.setPinyin(PinYin4Util.getPinYinHeadChar(quotationCtemVO.getName()).get(0));

		quotationCtemDao.update(quotationCtemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationCtemForStatus(QuotationCtemVO quotationCtemVO) throws FLException {

		QuotationCtemPO quotationCtemPO = quotationCtemDao.get(quotationCtemVO.getQcid());

		quotationCtemPO.setStatus(quotationCtemVO.getStatus());

		quotationCtemDao.update(quotationCtemPO);

		return 0;
	}
}
