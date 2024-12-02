package com.fanglin.quotation.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
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
public class QuotationPreferServiceImpl implements QuotationPreferService {

	@Autowired
	private QuotationPreferDao quotationPreferDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public QuotationPreferVO queryQuotationPrefer(QuotationPreferVO quotationPreferVO) throws FLException {

		QuotationPreferPO quotationPreferPO = quotationPreferDao.queryQuotationPreferByQid(quotationPreferVO.getQid());

		BeanUtil.copyProperties(quotationPreferPO, quotationPreferVO);

		return quotationPreferVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationPrefer(QuotationPreferVO quotationPreferVO, QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() == QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200033, "报价已锁定");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(200005, "报价不能修改");
		}

		QuotationPreferPO quotationPreferPO = quotationPreferDao.queryQuotationPreferByQid(quotationPreferVO.getQid());

		if (quotationPreferPO == null) {
			quotationPreferPO = new QuotationPreferPO(quotationPO.getOrderId(), quotationPO.getQid());
		}

		quotationPreferPO.setPreferPrice(quotationPreferVO.getPreferPrice());
		quotationPreferPO.setManagePrefer(quotationPreferVO.getManagePrefer());
		quotationPreferPO.setAdvancePrefer(quotationPreferVO.getAdvancePrefer());

		quotationPreferDao.save(quotationPreferPO);

		quotationPO.setTotalPrice(quotationVO.getTotalPrice());
		quotationPO.setTaxPrice(quotationVO.getTaxPrice());

		quotationDao.update(quotationPO);

		return 0;
	}

}
