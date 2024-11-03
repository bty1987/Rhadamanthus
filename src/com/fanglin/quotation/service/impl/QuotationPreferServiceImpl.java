package com.fanglin.quotation.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationPreferDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotationPreferPO;
import com.fanglin.quotation.service.QuotationPreferService;
import com.fanglin.quotation.vo.QuotationPreferVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationPreferService")
@Transactional(readOnly = true)
public class QuotationPreferServiceImpl implements QuotationPreferService{

	@Autowired
	private QuotationPreferDao quotationPreferDao;

	@Autowired
	private QuotationDao quotationDao;

	@Override
	public QuotationPreferVO queryQuotationPrefer(QuotationPreferVO quotationPreferVO) throws FLException {

		QuotationPreferPO quotationPreferPO = quotationPreferDao.queryQuotationPreferByQid(quotationPreferVO.getQid());

		BeanUtil.copyProperties(quotationPreferPO, quotationPreferVO);

		return quotationPreferVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationPrefer(QuotationPreferVO quotationPreferVO, QuotationVO quotationVO) throws FLException {	

		QuotationPreferPO quotationPreferPO = quotationPreferDao.queryQuotationPreferByQid(quotationPreferVO.getQid());

		if (quotationPreferPO != null) {
			quotationPreferPO.setPreferPrice(quotationPreferVO.getPreferPrice());
			quotationPreferPO.setManagePrefer(quotationPreferVO.getManagePrefer());
			quotationPreferPO.setAdvancePrefer(quotationPreferVO.getAdvancePrefer());

			quotationPreferDao.update(quotationPreferPO);
		} else {
			QuotationPreferPO quotationPrefer = new QuotationPreferPO();

			BeanUtil.copyProperties(quotationPreferVO, quotationPrefer);

			quotationPreferDao.save(quotationPrefer);
		}

		if (quotationVO != null && quotationVO.getTotalPrice() != null) {

			QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

			quotationPO.setTotalPrice(quotationVO.getTotalPrice());
			quotationPO.setTaxPrice(quotationVO.getTaxPrice());

			quotationDao.update(quotationPO);
		}

		return 0;
	}

}
