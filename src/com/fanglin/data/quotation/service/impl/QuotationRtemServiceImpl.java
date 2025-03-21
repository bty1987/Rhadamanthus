package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationRtemPO;
import com.fanglin.data.quotation.dao.QuotationRtemDao;
import com.fanglin.data.quotation.service.QuotationRtemService;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationRtemVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationRtemService")
@Transactional(readOnly = true)
public class QuotationRtemServiceImpl implements QuotationRtemService {

	@Autowired
	private QuotationRtemDao quotationRtemDao;

	@Override
	public List<QuotationRtemVO> queryQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		List<QuotationRtemPO> quotationRtemPOs = quotationRtemDao.queryQuotationRtem(quotationRtemVO.getSource().getQiid());
		List<QuotationRtemVO> quotationRtemVOs = new ArrayList<QuotationRtemVO>();

		for (QuotationRtemPO quotationRtemPO : quotationRtemPOs) {

			quotationRtemVOs.add(quotationRtemPO.ptv(new QuotationRtemVO(new QuotationItemVO(), new QuotationItemVO())));
		}

		return quotationRtemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		QuotationRtemPO quotationRtemPO = new QuotationRtemPO();

		BeanUtil.copyProperties(quotationRtemVO, quotationRtemPO, Arrays.asList("source", "target"));

		quotationRtemPO.setSource(new QuotationItemPO(quotationRtemVO.getSource().getQiid()));
		quotationRtemPO.setTarget(new QuotationItemPO(quotationRtemVO.getTarget().getQiid()));

		quotationRtemDao.save(quotationRtemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationRtem(QuotationRtemVO quotationRtemVO) throws FLException {

		QuotationRtemPO quotationRtemPO = quotationRtemDao.get(quotationRtemVO.getQrid());

		quotationRtemDao.delete(quotationRtemPO);

		return 0;
	}

}
