package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerUserRuleItemDao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;
import com.fanglin.customer.service.CustomerUserRuleItemService;
import com.fanglin.customer.vo.CustomerUserRuleItemVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("customerUserRuleItemService")
@Transactional(readOnly = true)
public class CustomerUserRuleItemServiceImpl implements CustomerUserRuleItemService {

	@Autowired
	private CustomerUserRuleItemDao customerUserRuleItemDao;

	@Override
	public List<CustomerUserRuleItemVO> queryCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItem) {

		List<CustomerUserRuleItemPO> customerUserRuleItemPOs = customerUserRuleItemDao.queryCustomerUserRuleItem(customerUserRuleItem.getCurid());
		List<CustomerUserRuleItemVO> customerUserRuleItemVOs = new ArrayList<CustomerUserRuleItemVO>();

		for (CustomerUserRuleItemPO customerUserRuleItemPO : customerUserRuleItemPOs) {

			CustomerUserRuleItemVO customerUserRuleItemVO = new CustomerUserRuleItemVO(new DepartmentTypeVO(), new DepartmentVO());

			BeanUtil.copyProperties(customerUserRuleItemPO, customerUserRuleItemVO, Arrays.asList("departmentType", "department"));

			BeanUtil.copyProperties(customerUserRuleItemPO.getDepartment(), customerUserRuleItemVO.getDepartment());
			BeanUtil.copyProperties(customerUserRuleItemPO.getDepartmentType(), customerUserRuleItemVO.getDepartmentType());

			customerUserRuleItemVOs.add(customerUserRuleItemVO);
		}

		return customerUserRuleItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException {

		CustomerUserRuleItemPO customerUserRuleItemPO = new CustomerUserRuleItemPO();

		BeanUtil.copyProperties(customerUserRuleItemVO, customerUserRuleItemPO, Arrays.asList("departmentType", "department"));

		if (customerUserRuleItemVO.getDepartment() != null && customerUserRuleItemVO.getDepartment().getDid() != null) {
			customerUserRuleItemPO.setDepartment(new DepartmentPO(customerUserRuleItemVO.getDepartment().getDid()));
		}

		if (customerUserRuleItemVO.getDepartmentType() != null && customerUserRuleItemVO.getDepartmentType().getDtid() != null) {
			customerUserRuleItemPO.setDepartmentType(new DepartmentTypePO(customerUserRuleItemVO.getDepartmentType().getDtid()));
		}

		customerUserRuleItemDao.save(customerUserRuleItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException {

		CustomerUserRuleItemPO customerUserRuleItemPO = customerUserRuleItemDao.get(customerUserRuleItemVO.getCuriid());

		if (customerUserRuleItemPO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerUserRuleItemDao.delete(customerUserRuleItemPO);
	}

	@Override
	public List<CustomerUserRuleItemVO> queryCustomerUserRuleItemByPinyin(String pinyinName) {

		List<Object[]> results = customerUserRuleItemDao.queryCustomerUserRuleItemByPinyin(pinyinName);
		List<CustomerUserRuleItemVO> customerUserRuleItemVOs = new ArrayList<CustomerUserRuleItemVO>();

		for (Object[] result : results) {
			CustomerUserRuleItemPO itemPO = (CustomerUserRuleItemPO) result[0];
			UserPO userPO = (UserPO) result[1];

			CustomerUserRuleItemVO itemVO = new CustomerUserRuleItemVO(new DepartmentTypeVO(), new DepartmentVO());

			// 复制基本属性
			BeanUtil.copyProperties(itemPO, itemVO, Arrays.asList("departmentType", "department", "cityProper"));

			// 复制关联对象
			if (itemPO.getDepartment() != null) {
				BeanUtil.copyProperties(itemPO.getDepartment(), itemVO.getDepartment());
			}
			if (itemPO.getDepartmentType() != null) {
				BeanUtil.copyProperties(itemPO.getDepartmentType(), itemVO.getDepartmentType());
			}

			// 设置用户信息
			if (userPO != null) {
				UserBaseVO userVO = new UserBaseVO();
				userVO.ptv(userPO, null);
				itemVO.setUser(userVO);
			}

			customerUserRuleItemVOs.add(itemVO);
		}

		return customerUserRuleItemVOs;
	}

}
