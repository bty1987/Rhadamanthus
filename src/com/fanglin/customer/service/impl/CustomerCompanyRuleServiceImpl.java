package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCityProperRuleDao;
import com.fanglin.customer.dao.CustomerCompanyRuleDao;
import com.fanglin.customer.po.CustomerCityProperRulePO;
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
	private CustomerCityProperRuleDao customerCityProperRuleDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Override
	public void pageCustomerCompanyRule(Paging paging, List<Filter> filters, int cid) throws FLException {

		List<CustomerCompanyRulePO> customerCompanyRulePOs = customerCompanyRuleDao.pageCustomerCompanyRule(paging, filters, cid);
		List<CustomerCompanyRuleVO> customerCompanyRuleVOs = new ArrayList<CustomerCompanyRuleVO>();

		for (CustomerCompanyRulePO customerCompanyRulePO : customerCompanyRulePOs) {
			customerCompanyRuleVOs.add(customerCompanyRulePO.ptv(new CustomerCompanyRuleVO(new CompanyVO(), new DepartmentVO())));
		}

		paging.setData(customerCompanyRuleVOs);
	}

	@Override
	public List<CustomerCompanyRuleVO> queryCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRuleVO, int company) throws FLException {

		if (customerCompanyRuleVO.getDept() == null) {
			customerCompanyRuleVO.setDept(new DepartmentVO());
		}

		// Step 1: 查询公司规则（基础过滤条件）
		List<CustomerCompanyRulePO> companyRules = customerCompanyRuleDao.queryCustomerCompanyRule(company, customerCompanyRuleVO.getDept().getDid(), customerCompanyRuleVO.getUppval());

		// Step 2: 如果提供了城区ID，查询城区规则并过滤
		if (customerCompanyRuleVO.getCpid() != null) {

			// 2.1 查询该城区的规则（城区→公司），支持按业务类型过滤
			List<CustomerCityProperRulePO> cityRules = customerCityProperRuleDao.queryCustomerCityProperRuleByTypeAndDbid(
					customerCompanyRuleVO.getCpid(),
					customerCompanyRuleVO.getDbid(),
					company,
					CustomerCityProperRulePO.TYPE_COMPANY_INT // 0=城区→公司
					);

			// 2.2 提取允许的公司ID集合
			Set<Integer> allowedCompanyIds = new HashSet<Integer>();
			for (CustomerCityProperRulePO cityRule : cityRules) {
				if (cityRule.getTargetCompany() != null) {
					allowedCompanyIds.add(cityRule.getTargetCompany().getCid());
				}
			}

			// 2.3 如果没有配置城区规则，返回空列表
			if (allowedCompanyIds.isEmpty()) {
				return new ArrayList<CustomerCompanyRuleVO>();
			}

			// 2.4 过滤公司规则：只保留城区规则允许的公司
			List<CustomerCompanyRulePO> filteredRules = new ArrayList<CustomerCompanyRulePO>();
			for (CustomerCompanyRulePO rule : companyRules) {
				if (rule.getCompany() != null && allowedCompanyIds.contains(rule.getCompany().getCid())) {
					filteredRules.add(rule);
				}
			}

			companyRules = filteredRules;
		}

		// Step 3: 转换为VO并去重
		Set<String> uniqueKeys = new HashSet<String>();
		List<CustomerCompanyRuleVO> result = new ArrayList<CustomerCompanyRuleVO>();

		for (CustomerCompanyRulePO po : companyRules) {

			// 去重：使用 "部门ID_类型" 作为唯一键
			String key = String.valueOf(po.getCompany().getCid());
			if (uniqueKeys.contains(key)) {
				continue; // 跳过重复
			}
			uniqueKeys.add(key);

			result.add(po.ptv(new CustomerCompanyRuleVO(new CompanyVO(), new DepartmentVO())));
		}

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRuleVO, String userId, int company) throws FLException {

		CustomerCompanyRulePO customerCompanyRulePO = new CustomerCompanyRulePO();

		BeanUtil.copyProperties(customerCompanyRuleVO, customerCompanyRulePO, Arrays.asList("company", "dept"));

		if (customerCompanyRuleVO.getCompany() != null) {

			CompanyPO companyPO = companyDao.get(CompanyServiceImpl.decode(customerCompanyRuleVO.getCompany().getCid()));

			if (companyPO == null) {
				throw new FLException(310001, "公司不存在");
			}

			customerCompanyRulePO.setCompany(companyPO);
		}

		if (customerCompanyRuleVO.getDept() != null) {

			DepartmentPO departmentPO = departmentDao.get(customerCompanyRuleVO.getDept().getDid());

			if (departmentPO == null) {
				throw new FLException(310001, "部门不存在");
			}

			customerCompanyRulePO.setDept(departmentPO);
		}

		customerCompanyRulePO.setCompanys(company);

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
