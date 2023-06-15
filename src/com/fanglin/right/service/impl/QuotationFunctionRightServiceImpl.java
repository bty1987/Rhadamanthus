package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.QuotationFunctionDao;
import com.fanglin.quotation.po.QuotationFunctionPO;
import com.fanglin.quotation.vo.QuotationFunctionVO;
import com.fanglin.right.dao.QuotationFunctionRightDao;
import com.fanglin.right.po.QuotationFunctionRightPO;
import com.fanglin.right.service.QuotationFunctionRightService;
import com.fanglin.right.vo.QuotationFunctionRightVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionRightService")
@Transactional(readOnly = true)
public class QuotationFunctionRightServiceImpl implements QuotationFunctionRightService {

	@Autowired
	private QuotationFunctionRightDao quotationFunctionRightDao;

	@Autowired
	private QuotationFunctionDao quotationFunctionDao;

	@Override
	public List<QuotationFunctionRightVO> queryQuotationFunctionRight(QuotationFunctionRightVO quotationFunctionRightVO) {

		List<QuotationFunctionRightPO> quotationFunctionRightPOs = quotationFunctionRightDao.queryQuotationFunctionRight(quotationFunctionRightVO.getName());
		List<QuotationFunctionRightVO> quotationFunctionRightVOs = new ArrayList<QuotationFunctionRightVO>();

		for (QuotationFunctionRightPO quotationFunctionRightPO : quotationFunctionRightPOs) {

			quotationFunctionRightVO = new QuotationFunctionRightVO(new QuotationFunctionVO());

			BeanUtil.copyPropertie(quotationFunctionRightPO, quotationFunctionRightVO, Arrays.asList("quotationFunction"));
			BeanUtil.copyPropertie(quotationFunctionRightPO.getQuotationFunction(), quotationFunctionRightVO.getQuotationFunction());

			quotationFunctionRightVOs.add(quotationFunctionRightVO);
		}

		return quotationFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateQuotationFunctionRight(QuotationFunctionRightVO quotationFunctionRightVO, List<Long> qfids, int company) {

		quotationFunctionRightDao.deleteQuotationFunctionRightByName(quotationFunctionRightVO.getName(), quotationFunctionRightVO.getType());

		for (Long qfid : qfids) {
			QuotationFunctionRightPO quotationFunctionRightPO = new QuotationFunctionRightPO();
			QuotationFunctionPO quotationFunctionPO = quotationFunctionDao.get(qfid);

			quotationFunctionRightPO.setName(quotationFunctionRightVO.getName());
			quotationFunctionRightPO.setQuotationFunction(quotationFunctionPO);
			quotationFunctionRightPO.setType(quotationFunctionRightVO.getType());
			quotationFunctionRightPO.setCompany(company);

			quotationFunctionRightDao.save(quotationFunctionRightPO);
		}

	}

}
