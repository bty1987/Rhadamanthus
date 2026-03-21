/**
 * @File Name     : QuotationAssignRequestServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.service.QuotationAssignRequestService;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.Paging;

@Service("quotationAssignRequestService")
public class QuotationAssignRequestServiceImpl implements QuotationAssignRequestService {

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company) throws FLException {
		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.pageQuotationAssignRequest(paging, filters, company);
		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(quotationAssignRequestPO.ptv(new QuotationAssignRequestVO()));
		}

		// 设置分页结果
		paging.setData(quotationAssignRequestVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRequestVO queryQuotationAssignRequestById(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {
		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.get(quotationAssignRequestVO.getQarid());
		return quotationAssignRequestPO.ptv(new QuotationAssignRequestVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRequestVO queryQuotationAssignRequestForPending(String orderId) throws FLException {
		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.queryQuotationAssignRequestForPending(orderId);
		return quotationAssignRequestPO != null ? quotationAssignRequestPO.ptv(new QuotationAssignRequestVO()) : null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignRequestVO> queryQuotationAssignRequestForQueue(int company, Integer department, short decorationType) throws FLException {
		List<QuotationAssignRequestPO> quotationAssignRequestPOs = quotationAssignRequestDao.queryQuotationAssignRequestForQueue(company, department, decorationType);
		List<QuotationAssignRequestVO> quotationAssignRequestVOs = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO quotationAssignRequestPO : quotationAssignRequestPOs) {
			quotationAssignRequestVOs.add(quotationAssignRequestPO.ptv(new QuotationAssignRequestVO()));
		}

		return quotationAssignRequestVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {
		QuotationAssignRequestPO quotationAssignRequestPO = new QuotationAssignRequestPO();
		quotationAssignRequestPO.vtp(quotationAssignRequestVO);
		quotationAssignRequestDao.save(quotationAssignRequestPO);
		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {
		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.get(quotationAssignRequestVO.getQarid());
		if (quotationAssignRequestPO != null) {
			quotationAssignRequestPO.vtp(quotationAssignRequestVO);
			quotationAssignRequestDao.update(quotationAssignRequestPO);
			return 1;
		}
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException {
		QuotationAssignRequestPO quotationAssignRequestPO = quotationAssignRequestDao.get(quotationAssignRequestVO.getQarid());
		if (quotationAssignRequestPO != null) {
			quotationAssignRequestDao.delete(quotationAssignRequestPO);
			return 1;
		}
		return 0;
	}
}
