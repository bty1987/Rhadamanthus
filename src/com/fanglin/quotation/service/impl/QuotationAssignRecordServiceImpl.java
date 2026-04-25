/**
 * @File Name     : QuotationAssignRecordServiceImpl.java
 * @Package      : com.fanglin.quotation.service.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配记录表 Service 实现类
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.quotation.service.QuotationAssignRecordService;
import com.fanglin.quotation.vo.QuotationAssignRecordVO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配记录表 Service 实现类
 * 
 * <p>
 * 职责：实现分配记录的业务逻辑处理
 * </p>
 * 
 * @author Claude AI
 * @version 1.0
 */
@Service("quotationAssignRecordService")
@Transactional(readOnly = true)
public class QuotationAssignRecordServiceImpl implements QuotationAssignRecordService {

	@Autowired
	private QuotationAssignRecordDao quotationAssignRecordDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageQuotationAssignRecord(Paging paging, List<Filter> filters, Integer company) throws FLException {
		List<QuotationAssignRecordPO> quotationAssignRecordPOs = quotationAssignRecordDao.pageQuotationAssignRecord(paging, filters, company);
		List<QuotationAssignRecordVO> quotationAssignRecordVOs = new ArrayList<QuotationAssignRecordVO>();

		for (QuotationAssignRecordPO quotationAssignRecordPO : quotationAssignRecordPOs) {
			quotationAssignRecordVOs.add(quotationAssignRecordPO.ptv(new QuotationAssignRecordVO()));
		}

		// 设置分页结果
		paging.setData(quotationAssignRecordVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationAssignRecordVO queryQuotationAssignRecordById(QuotationAssignRecordVO quotationAssignRecordVO) throws FLException {

		QuotationAssignRecordPO quotationAssignRecordPO = quotationAssignRecordDao.get(quotationAssignRecordVO.getQasrid());

		return quotationAssignRecordPO == null ? null : quotationAssignRecordPO.ptv(new QuotationAssignRecordVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createQuotationAssignRecord(QuotationAssignRecordVO quotationAssignRecordVO) throws FLException {

		// 参数校验
		if (quotationAssignRecordVO == null) {
			throw new FLException(0, "分配记录信息不能为空");
		}
		if (quotationAssignRecordVO.getOrderId() == null || quotationAssignRecordVO.getOrderId().trim().isEmpty()) {
			throw new FLException(0, "装修单号不能为空");
		}

		QuotationAssignRecordPO quotationAssignRecordPO = new QuotationAssignRecordPO();
		quotationAssignRecordPO.vtp(quotationAssignRecordVO);
		quotationAssignRecordDao.save(quotationAssignRecordPO);
		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<QuotationAssignRecordVO> queryQuotationAssignRecordByOrderId(QuotationAssignRecordVO quotationAssignRecordVO) throws FLException {
		List<QuotationAssignRecordPO> quotationAssignRecordPOs = quotationAssignRecordDao.queryQuotationAssignRecordByOrderId(quotationAssignRecordVO.getOrderId());
		List<QuotationAssignRecordVO> quotationAssignRecordVOs = new ArrayList<QuotationAssignRecordVO>();

		for (QuotationAssignRecordPO quotationAssignRecordPO : quotationAssignRecordPOs) {
			quotationAssignRecordVOs.add(quotationAssignRecordPO.ptv(new QuotationAssignRecordVO()));
		}

		return quotationAssignRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int countSuccessAssignByUid(int uid) throws FLException {
		return quotationAssignRecordDao.countQuotationAssignRecordByUid(uid);
	}
}
