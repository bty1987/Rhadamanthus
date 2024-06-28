package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerUserRuleItemDao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;
import com.fanglin.customer.service.CustomerUserRuleItemService;
import com.fanglin.customer.vo.CustomerUserRuleItemVO;
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

			CustomerUserRuleItemVO customerUserRuleItemVO = new CustomerUserRuleItemVO();

			BeanUtil.copyProperties(customerUserRuleItemPO, customerUserRuleItemVO);

			customerUserRuleItemVOs.add(customerUserRuleItemVO);

		}

		return customerUserRuleItemVOs;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException {

		CustomerUserRuleItemPO customerUserRuleItemPO = new CustomerUserRuleItemPO();

		BeanUtil.copyProperties(customerUserRuleItemVO, customerUserRuleItemPO);

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

}
