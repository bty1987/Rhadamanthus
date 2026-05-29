package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationNamingRulePO;
import com.fanglin.data.quotation.dao.QuotationNamingRuleDao;
import com.fanglin.data.quotation.service.QuotationNamingRuleService;
import com.fanglin.data.quotation.vo.QuotationNamingRuleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationNamingRuleService")
@Transactional(readOnly = true)
public class QuotationNamingRuleServiceImpl implements QuotationNamingRuleService {

	@Autowired
	private QuotationNamingRuleDao quotationNamingRuleDao;

	@Override
	public void pageQuotationNamingRule(Paging paging, List<Filter> filters) {

		List<QuotationNamingRulePO> rulePOs = quotationNamingRuleDao.pageQuotationNamingRule(paging, filters);
		List<QuotationNamingRuleVO> ruleVOs = new ArrayList<QuotationNamingRuleVO>();

		for (QuotationNamingRulePO rulePO : rulePOs) {

			QuotationNamingRuleVO ruleVO = new QuotationNamingRuleVO();

			BeanUtil.copyProperties(rulePO, ruleVO);

			ruleVOs.add(ruleVO);
		}

		paging.setData(ruleVOs);
	}

	@Override
	public List<QuotationNamingRuleVO> queryQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO) {

		short type = quotationNamingRuleVO != null && quotationNamingRuleVO.getType() != null ? quotationNamingRuleVO.getType() : -1;

		List<QuotationNamingRulePO> rulePOs = quotationNamingRuleDao.queryQuotationNamingRule(type);
		List<QuotationNamingRuleVO> ruleVOs = new ArrayList<QuotationNamingRuleVO>();

		for (QuotationNamingRulePO rulePO : rulePOs) {

			QuotationNamingRuleVO ruleVO = new QuotationNamingRuleVO();

			BeanUtil.copyProperties(rulePO, ruleVO);

			ruleVOs.add(ruleVO);
		}

		return ruleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO) {

		QuotationNamingRulePO rulePO = new QuotationNamingRulePO();

		BeanUtil.copyProperties(quotationNamingRuleVO, rulePO);

		quotationNamingRuleDao.save(rulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO) {

		QuotationNamingRulePO rulePO = quotationNamingRuleDao.get(quotationNamingRuleVO.getQnrid());

		if (rulePO != null) {

			BeanUtil.copyProperties(quotationNamingRuleVO, rulePO);

			quotationNamingRuleDao.update(rulePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationNamingRuleForStatus(QuotationNamingRuleVO quotationNamingRuleVO) {

		QuotationNamingRulePO rulePO = quotationNamingRuleDao.get(quotationNamingRuleVO.getQnrid());

		if (rulePO != null) {

			rulePO.setStatus(quotationNamingRuleVO.getStatus());

			quotationNamingRuleDao.update(rulePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO) {

		QuotationNamingRulePO rulePO = quotationNamingRuleDao.get(quotationNamingRuleVO.getQnrid());

		if (rulePO != null) {
			quotationNamingRuleDao.delete(rulePO);
		}

		return 0;
	}

	@Override
	public boolean validateNormaddName(String name) {

		QuotationNamingRulePO rulePO = quotationNamingRuleDao.queryQuotationNamingRuleByName(name, QuotationNamingRulePO.TYPE_NORMADD_SHORT);

		return rulePO != null && rulePO.getStatus() == QuotationNamingRulePO.STATUS_ENABLE_SHORT;
	}

	@Override
	public List<QuotationNamingRuleVO> queryQuotationNamingRuleByPinyin(String pinyin, Short type, Short status) {

		List<QuotationNamingRulePO> rulePOs = quotationNamingRuleDao.queryQuotationNamingRuleByPinyin(pinyin, type, status);
		List<QuotationNamingRuleVO> ruleVOs = new ArrayList<QuotationNamingRuleVO>();

		for (QuotationNamingRulePO rulePO : rulePOs) {

			QuotationNamingRuleVO ruleVO = new QuotationNamingRuleVO();

			BeanUtil.copyProperties(rulePO, ruleVO);

			ruleVOs.add(ruleVO);
		}

		return ruleVOs;
	}

}
