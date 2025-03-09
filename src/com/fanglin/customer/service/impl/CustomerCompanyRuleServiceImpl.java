package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCompanyRuleDao;
import com.fanglin.customer.po.CustomerCompanyRulePO;
import com.fanglin.customer.service.CustomerCompanyRuleService;
import com.fanglin.customer.vo.CustomerCompanyRuleVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerCompanyRuleService")
@Transactional(readOnly = true)
public class CustomerCompanyRuleServiceImpl implements CustomerCompanyRuleService {

	@Autowired
	private CustomerCompanyRuleDao customerCompanyRuleDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageCustomerCompanyRule(Paging paging, List<Filter> filters, int cid) throws FLException {

		List<CustomerCompanyRulePO> customerCompanyRulePOs = customerCompanyRuleDao.pageCustomerCompanyRule(paging, filters, cid);
		List<CustomerCompanyRuleVO> customerCompanyRuleVOs = new ArrayList<CustomerCompanyRuleVO>();

		for (CustomerCompanyRulePO customerCompanyRulePO : customerCompanyRulePOs) {
			customerCompanyRuleVOs.add(customerCompanyRulePO.ptv(new CustomerCompanyRuleVO(new CompanyVO())));
		}

		paging.setData(customerCompanyRuleVOs);
	}

	@Override
	public List<CustomerCompanyRuleVO> queryCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRule, int cid) throws FLException {

		List<CustomerCompanyRulePO> customerCompanyRulePOs = customerCompanyRuleDao.queryCustomerCompanyRule(cid, customerCompanyRule.getUppval(), customerCompanyRule.getLowval(), customerCompanyRule.getType());
		List<CustomerCompanyRuleVO> customerCompanyRuleVOs = new ArrayList<CustomerCompanyRuleVO>();

		for (CustomerCompanyRulePO customerCompanyRulePO : customerCompanyRulePOs) {
			customerCompanyRuleVOs.add(customerCompanyRulePO.ptv(new CustomerCompanyRuleVO(new CompanyVO())));
		}

		return customerCompanyRuleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRuleVO, String userId, int company) throws FLException {

		if (customerCompanyRuleVO.getCompany() == null) {
			throw new FLException(230015, "公司不存在");
		}

		CompanyPO companyPO = companyDao.get(CompanyServiceImpl.decode(customerCompanyRuleVO.getCompany().getCid()));

		if (companyPO == null) {
			throw new FLException(310001, "公司不存在");
		}

		CustomerCompanyRulePO customerCompanyRulePO = new CustomerCompanyRulePO();

		BeanUtil.copyProperties(customerCompanyRuleVO, customerCompanyRulePO, Arrays.asList("company"));

		customerCompanyRulePO.setCompany(companyPO);

		customerCompanyRuleDao.save(customerCompanyRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRule) throws FLException {

		CustomerCompanyRulePO customerCompanyRulePO = customerCompanyRuleDao.get(customerCompanyRule.getCcrid());

		if (customerCompanyRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerCompanyRuleDao.delete(customerCompanyRulePO);
	}

}
