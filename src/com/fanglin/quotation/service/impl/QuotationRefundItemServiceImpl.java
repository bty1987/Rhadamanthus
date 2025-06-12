package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationRefundDao;
import com.fanglin.quotation.dao.QuotationRefundItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationRefundItemPO;
import com.fanglin.quotation.po.QuotationRefundPO;
import com.fanglin.quotation.service.QuotationRefundItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationRefundItemVO;
import com.fanglin.quotation.vo.QuotationRefundVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationRefunItemService")
@Transactional(readOnly = true)
public class QuotationRefundItemServiceImpl implements QuotationRefundItemService{

	@Autowired
	public QuotationRefundDao quotationRefundDao;

	@Autowired
	public QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	public QuotationRefundItemDao quotationRefundItemDao;

	@Autowired
	public QuotationItemDao quotationItemDao;

	@Override
	public List<QuotationRefundItemVO> queryQuotationRefundItem(QuotationRefundItemVO quotationRefundItemVO) throws FLException {

		List<QuotationRefundItemPO> quotationRefundItemPOs = quotationRefundItemDao.queryQuotationRefundItem(quotationRefundItemVO.getQuotationRefund().getQrid(), quotationRefundItemVO.getQuotationFunctionArea().getQfaId());
		List<QuotationRefundItemVO> quotationRefundItemVOs = new ArrayList<QuotationRefundItemVO>();
		
		for (QuotationRefundItemPO quotationRefundItemPO : quotationRefundItemPOs) {
			quotationRefundItemVOs.add(quotationRefundItemPO.ptv(new QuotationRefundItemVO(new QuotationRefundVO(), new QuotationFunctionAreaVO(), new QuotationItemVO())));
		}

		return quotationRefundItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationRefundItemVO updateQuotationRefundItem(QuotationRefundItemVO quotationRefundItemVO, QuotationRefundVO quotationRefundVO) throws FLException {

		QuotationRefundItemPO quotationRefundItemPO = null;

		if (quotationRefundItemVO.getQriid() == null) {

			quotationRefundItemPO = new QuotationRefundItemPO();

			QuotationRefundPO quotationRefundPO = quotationRefundDao.get(quotationRefundItemVO.getQuotationRefund().getQrid());

			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationRefundItemVO.getQuotationFunctionArea().getQfaId());

			QuotationItemPO quotationItemPO = quotationItemDao.get(quotationRefundItemVO.getQuotationItem().getQiid());

			BeanUtil.copyProperties(quotationRefundItemVO, quotationRefundItemPO, Arrays.asList("quotationRefund", "quotationFunctionArea", "quotationItem"));

			quotationRefundItemPO.setQuotationRefund(quotationRefundPO);
			quotationRefundItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
			quotationRefundItemPO.setQuotationItem(quotationItemPO);

			quotationItemDao.save(quotationRefundItemPO);

			quotationRefundItemVO.setQriid(quotationRefundItemPO.getQriid());
			
		} else {

			quotationRefundItemPO = quotationRefundItemDao.get(quotationRefundItemVO.getQriid());

			quotationRefundItemPO.setFormula(quotationRefundItemVO.getFormula());
			quotationRefundItemPO.setInitNum(quotationRefundItemVO.getInitNum());
			quotationRefundItemPO.setNum(quotationRefundItemVO.getNum());

			quotationItemDao.update(quotationRefundItemPO);
		}

		QuotationRefundPO quotationRefundPO = quotationRefundDao.get(quotationRefundVO.getQrid());

		quotationRefundPO.setTotalPrice(quotationRefundVO.getTotalPrice());

		quotationRefundDao.update(quotationRefundPO);

		return quotationRefundItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationRefundItemForIndex(List<QuotationRefundItemVO> quotationRefundItemVOs) throws FLException {

		for (QuotationRefundItemVO quotationRefundItemVO : quotationRefundItemVOs) {
			quotationRefundItemDao.updateQuotationRefundItemForIndex(quotationRefundItemVO.getQriid(), quotationRefundItemVO.getIndex());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationRefundItem(QuotationRefundItemVO quotationRefundItemVO, QuotationRefundVO quotationRefundVO) throws FLException {

		QuotationRefundItemPO quotationRefundItemPO = quotationRefundItemDao.get(quotationRefundItemVO.getQriid());

		QuotationRefundPO quotationRefundPO = quotationRefundDao.get(quotationRefundVO.getQrid());

		quotationRefundPO.setTotalPrice(quotationRefundVO.getTotalPrice());

		quotationRefundItemDao.delete(quotationRefundItemPO);

		quotationRefundDao.update(quotationRefundPO);

		return 0;
	}

}
