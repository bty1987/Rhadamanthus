package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCityProperRuleDao;
import com.fanglin.customer.po.CustomerCityProperRulePO;
import com.fanglin.customer.service.CustomerCityProperRuleService;
import com.fanglin.customer.vo.CustomerCityProperRuleVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerCityProperRuleService")
@Transactional(readOnly = true)
public class CustomerCityProperRuleServiceImpl implements CustomerCityProperRuleService {

	@Autowired
	private CustomerCityProperRuleDao customerCityProperRuleDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageCustomerCityProperRule(Paging paging, List<Filter> filters, int company) throws FLException {

		List<CustomerCityProperRulePO> customerCityProperRulePOs = customerCityProperRuleDao.pageCustomerCityProperRule(paging, filters, company);

		List<CustomerCityProperRuleVO> customerCityProperRuleVOs = new ArrayList<CustomerCityProperRuleVO>();

		for (CustomerCityProperRulePO customerCityProperRulePO : customerCityProperRulePOs) {
			customerCityProperRuleVOs.add(customerCityProperRulePO.ptv(new CustomerCityProperRuleVO()));
		}

		paging.setData(customerCityProperRuleVOs);
	}

	@Override
	public List<CustomerCityProperRuleVO> queryCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO, int company) throws FLException {

		// TODO: 实现查询逻辑
		return new ArrayList<CustomerCityProperRuleVO>();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO, String userId, int company) throws FLException {

		CustomerCityProperRulePO customerCityProperRulePO = new CustomerCityProperRulePO();

		BeanUtil.copyProperties(customerCityProperRuleVO, customerCityProperRulePO, Arrays.asList("city", "company", "targetCompany", "department", "user"));

		// 设置城区
		if (customerCityProperRuleVO.getCity() != null && customerCityProperRuleVO.getCity().getCpid() != null) {
			CityProperPO cityProperPO = new CityProperPO();
			cityProperPO.setCpid(customerCityProperRuleVO.getCity().getCpid());
			customerCityProperRulePO.setCity(cityProperPO);
		}

		// 设置公司
		if (customerCityProperRuleVO.getCompany() != null && customerCityProperRuleVO.getCompany().getCid() != null) {

			System.out.println(customerCityProperRuleVO.getCompany().getCid());
			System.out.println(CompanyServiceImpl.decode(customerCityProperRuleVO.getCompany().getCid()));

			CompanyPO companyPO = companyDao.get(CompanyServiceImpl.decode(customerCityProperRuleVO.getCompany().getCid()));
			if (companyPO == null) {
				throw new FLException(310001, "公司不存在");
			}
			customerCityProperRulePO.setCompany(companyPO);
		}

		// 设置目标公司（用于城区→公司规则）
		if (customerCityProperRuleVO.getTargetCompany() != null && customerCityProperRuleVO.getTargetCompany().getCid() != null) {

			System.out.println(customerCityProperRuleVO.getTargetCompany().getCid());
			System.out.println(CompanyServiceImpl.decode(customerCityProperRuleVO.getTargetCompany().getCid()));

			CompanyPO targetCompanyPO = companyDao.get(CompanyServiceImpl.decode(customerCityProperRuleVO.getTargetCompany().getCid()));
			if (targetCompanyPO == null) {
				throw new FLException(310001, "目标公司不存在");
			}
			customerCityProperRulePO.setTargetCompany(targetCompanyPO);
		}

		// 设置部门（用于城区→部门规则）
		if (customerCityProperRuleVO.getDepartment() != null && customerCityProperRuleVO.getDepartment().getDid() != null) {
			DepartmentPO departmentPO = departmentDao.get(customerCityProperRuleVO.getDepartment().getDid());
			if (departmentPO == null) {
				throw new FLException(310001, "部门不存在");
			}
			customerCityProperRulePO.setDepartment(departmentPO);
		}

		// 设置用户（用于城区→设计师规则）
		if (customerCityProperRuleVO.getUser() != null && customerCityProperRuleVO.getUser().getUid() != null) {
			UserPO userPO = userDao.get(customerCityProperRuleVO.getUser().getUid());
			if (userPO == null) {
				throw new FLException(310001, "用户不存在");
			}
			customerCityProperRulePO.setUser(userPO);
		}

		customerCityProperRuleDao.save(customerCityProperRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO) throws FLException {

		CustomerCityProperRulePO customerCityProperRulePO = customerCityProperRuleDao.get(customerCityProperRuleVO.getCcrid());

		if (customerCityProperRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerCityProperRuleDao.delete(customerCityProperRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO) throws FLException {

		CustomerCityProperRulePO customerCityProperRulePO = customerCityProperRuleDao.get(customerCityProperRuleVO.getCcrid());

		if (customerCityProperRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		BeanUtil.copyProperties(customerCityProperRuleVO, customerCityProperRulePO, Arrays.asList("city", "company", "targetCompany", "department", "user", "type", "priority", "status", "comment"));

		// 更新城区
		if (customerCityProperRuleVO.getCity() != null && customerCityProperRuleVO.getCity().getCpid() != null) {
			CityProperPO cityProperPO = new CityProperPO();
			cityProperPO.setCpid(customerCityProperRuleVO.getCity().getCpid());
			customerCityProperRulePO.setCity(cityProperPO);
		}

		// 更新目标公司
		if (customerCityProperRuleVO.getTargetCompany() != null && customerCityProperRuleVO.getTargetCompany().getCid() != null) {

			System.out.println(customerCityProperRuleVO.getTargetCompany().getCid());
			System.out.println(CompanyServiceImpl.decode(customerCityProperRuleVO.getTargetCompany().getCid()));

			CompanyPO targetCompanyPO = companyDao.get(CompanyServiceImpl.decode(customerCityProperRuleVO.getTargetCompany().getCid()));
			if (targetCompanyPO == null) {
				throw new FLException(310001, "目标公司不存在");
			}
			customerCityProperRulePO.setTargetCompany(targetCompanyPO);
		}

		// 更新部门
		if (customerCityProperRuleVO.getDepartment() != null && customerCityProperRuleVO.getDepartment().getDid() != null) {

			DepartmentPO departmentPO = departmentDao.get(customerCityProperRuleVO.getDepartment().getDid());
			if (departmentPO == null) {
				throw new FLException(310001, "部门不存在");
			}
			customerCityProperRulePO.setDepartment(departmentPO);
		}

		// 更新用户
		if (customerCityProperRuleVO.getUser() != null && customerCityProperRuleVO.getUser().getUid() != null) {
			UserPO userPO = userDao.get(customerCityProperRuleVO.getUser().getUid());
			if (userPO == null) {
				throw new FLException(310001, "用户不存在");
			}
			customerCityProperRulePO.setUser(userPO);
		}

		customerCityProperRuleDao.update(customerCityProperRulePO);
	}
}
