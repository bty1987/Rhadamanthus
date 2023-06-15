package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.QuotationFunctionDao;
import com.fanglin.quotation.po.QuotationFunctionPO;
import com.fanglin.quotation.service.QuotationFunctionService;
import com.fanglin.quotation.vo.QuotationFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionService")
@Transactional(readOnly = true)
public class QuotationFunctionServiceImpl implements QuotationFunctionService {

	@Autowired
	private QuotationFunctionDao quotationFunctionDao;

	@Override
	public List<QuotationFunctionVO> queryQuotationFunction(QuotationFunctionVO quotationFunctionVO) {

		List<QuotationFunctionPO> quotationFunctionPOs = quotationFunctionDao.queryQuotationFunction(quotationFunctionVO.getType());
		List<QuotationFunctionVO> quotationFunctionVOs = new ArrayList<QuotationFunctionVO>();

		for (QuotationFunctionPO quotationFunctionPO : quotationFunctionPOs) {

			quotationFunctionVO = new QuotationFunctionVO();
			BeanUtil.copyPropertie(quotationFunctionPO, quotationFunctionVO);

			quotationFunctionVOs.add(quotationFunctionVO);

		}

		return quotationFunctionVOs;
	}

}
