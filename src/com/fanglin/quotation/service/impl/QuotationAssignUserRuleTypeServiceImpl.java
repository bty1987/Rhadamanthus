package com.fanglin.quotation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.QuotationAssignUserRuleTypeDao;
import com.fanglin.quotation.po.QuotationAssignUserRuleTypePO;
import com.fanglin.quotation.service.QuotationAssignUserRuleTypeService;

/**
 * 报价单预算员类型支持表 Service 实现 职责: 管理预算员支持的装修类型（半包/整装）
 */
@Service("quotationAssignUserRuleTypeService")
@Transactional(readOnly = true)
public class QuotationAssignUserRuleTypeServiceImpl implements QuotationAssignUserRuleTypeService {

	@Autowired
	private QuotationAssignUserRuleTypeDao quotationAssignUserRuleTypeDao;

	@Override
	public List<QuotationAssignUserRuleTypePO> queryQuotationAssignUserRuleTypeByQaurid(long qaurid) {
		return quotationAssignUserRuleTypeDao.queryQuotationAssignUserRuleType(qaurid);
	}

	@Override
	public QuotationAssignUserRuleTypePO queryQuotationAssignUserRuleTypeByQauridAndType(long qaurid, short type) {
		return quotationAssignUserRuleTypeDao.queryQuotationAssignUserRuleType(qaurid, type);
	}

	@Override
	public int existQuotationAssignUserRuleType(long qaurid, short type) {
		return quotationAssignUserRuleTypeDao.existQuotationAssignUserRuleType(qaurid, type);
	}

	@Override
	public int countQuotationAssignUserRuleTypeByQaurid(long qaurid) {
		return quotationAssignUserRuleTypeDao.countQuotationAssignUserRuleType(qaurid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationAssignUserRuleTypeByQaurid(long qaurid) {
		return quotationAssignUserRuleTypeDao.deleteQuotationAssignUserRuleType(qaurid);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchSaveQuotationAssignUserRuleType(List<QuotationAssignUserRuleTypePO> types) {
		return quotationAssignUserRuleTypeDao.batchQuotationAssignUserRuleType(types);
	}
}
