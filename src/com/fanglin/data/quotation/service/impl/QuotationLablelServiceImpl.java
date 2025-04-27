package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationLabelPO;
import com.fanglin.data.quotation.dao.QuotationLabelDao;
import com.fanglin.data.quotation.service.QuotationLabelService;
import com.fanglin.data.quotation.vo.QuotationLabelVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationLabelService")
@Transactional(readOnly = true)
public class QuotationLablelServiceImpl implements QuotationLabelService {

	@Autowired
	public QuotationLabelDao quotationLabelDao;

	@Override
	public void pageQuotationLabel(Paging paging, List<Filter> filters) {

		List<QuotationLabelPO> quotationLabelPOs = quotationLabelDao.pageQuotationLabel(paging, filters);
		List<QuotationLabelVO> quotationLabelVOs = new ArrayList<QuotationLabelVO>();

		for (QuotationLabelPO quotationLabelPO : quotationLabelPOs) {

			QuotationLabelVO quotationLabelVO = new QuotationLabelVO();

			BeanUtil.copyProperties(quotationLabelPO, quotationLabelVO);

			quotationLabelVOs.add(quotationLabelVO);

		}

		paging.setData(quotationLabelVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationLabel(QuotationLabelVO quotationLabelVO) throws FLException {

		QuotationLabelPO quotationLabelPO = new QuotationLabelPO();

		BeanUtil.copyProperties(quotationLabelVO, quotationLabelPO);

		quotationLabelDao.save(quotationLabelPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationLabel(QuotationLabelVO quotationLabelVO) throws FLException {

		QuotationLabelPO quotationLabelPO = quotationLabelDao.get(quotationLabelVO.getQlid());

		BeanUtil.copyProperties(quotationLabelVO, quotationLabelPO);

		quotationLabelDao.update(quotationLabelPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationLabel(QuotationLabelVO quotationLabelVO) throws FLException {

		QuotationLabelPO quotationLabelPO = quotationLabelDao.get(quotationLabelVO.getQlid());

		quotationLabelDao.delete(quotationLabelPO);

		return 0;
	}

}
