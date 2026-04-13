package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerBankDao;
import com.fanglin.communion.po.CustomerBankPO;
import com.fanglin.communion.service.CustomerBankService;
import com.fanglin.communion.vo.CustomerBankVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("customerBankService")
@Transactional(readOnly = true)
public class CustomerBankServiceImpl implements CustomerBankService {

	@Autowired
	private CustomerBankDao customerBankDao;

	@Override
	public List<CustomerBankVO> queryCustomerBank(CustomerBankVO customerBankVO) {

		List<CustomerBankPO> customerBankPOs = customerBankDao.queryCustomerBankByCid(customerBankVO.getCid());
		List<CustomerBankVO> customerBankVOs = new ArrayList<CustomerBankVO>();

		for (CustomerBankPO customerBankPO : customerBankPOs) {
			customerBankVOs.add(customerBankPO.ptv(new CustomerBankVO()));
		}

		return customerBankVOs;
	}

	@Override
	public CustomerBankVO queryDefaultCustomerBank(CustomerBankVO customerBankVO) {

		CustomerBankPO customerBankPO = customerBankDao.queryDefaultCustomerBank(customerBankVO.getCid());

		if (customerBankPO == null) return null;

		return customerBankPO.ptv(new CustomerBankVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerBank(CustomerBankVO customerBankVO) throws FLException {

		long cid = customerBankVO.getCid();

		CustomerBankPO customerBankPO = new CustomerBankPO();

		BeanUtil.copyPropertie(customerBankVO, customerBankPO);

		customerBankPO.setCid(cid);
		customerBankPO.setStatus(CustomerBankPO.STATUS_ENABLE);
		customerBankPO.setCreateTime(DateUtil.current());
		customerBankPO.setUpdateTime(DateUtil.current());

		int count = customerBankDao.countCustomerBankByCid(cid);

		if (count == 0) {
			customerBankPO.setDefaults(CustomerBankPO.DEFAULTS_YES);
		} else {
			customerBankPO.setDefaults(CustomerBankPO.DEFAULTS_NO);
		}

		customerBankDao.save(customerBankPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerBank(CustomerBankVO customerBankVO) throws FLException {

		CustomerBankPO customerBankPO = customerBankDao.get(customerBankVO.getCbid());

		if (customerBankPO == null) {
			throw new FLException(230001, "客户银行账户不存在");
		}

		BeanUtil.copyPropertie(customerBankVO, customerBankPO, "cid", "defaults", "status", "createTime");

		customerBankPO.setUpdateTime(DateUtil.current());

		customerBankDao.update(customerBankPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCustomerBank(CustomerBankVO customerBankVO) throws FLException {

		CustomerBankPO customerBankPO = customerBankDao.get(customerBankVO.getCbid());

		if (customerBankPO == null) {
			throw new FLException(230001, "客户银行账户不存在");
		}

		long cid = customerBankPO.getCid();
		short wasDefault = customerBankPO.getDefaults();

		customerBankPO.setStatus(CustomerBankPO.STATUS_DISABLE);
		customerBankPO.setDefaults(CustomerBankPO.DEFAULTS_NO);
		customerBankPO.setUpdateTime(DateUtil.current());

		customerBankDao.update(customerBankPO);

		// 如果删除的是默认账户，将同客户下第一个可用账户设为默认
		if (wasDefault == CustomerBankPO.DEFAULTS_YES) {
			List<CustomerBankPO> remaining = customerBankDao.queryCustomerBankByCid(customerBankPO.getCid());
			if (remaining != null && remaining.size() > 0) {
				remaining.get(0).setDefaults(CustomerBankPO.DEFAULTS_YES);
				customerBankDao.update(remaining.get(0));
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int setDefaultCustomerBank(CustomerBankVO customerBankVO) throws FLException {

		CustomerBankPO customerBankPO = customerBankDao.get(customerBankVO.getCbid());

		if (customerBankPO == null) {
			throw new FLException(230001, "客户银行账户不存在");
		}

		if (customerBankPO.getStatus() == CustomerBankPO.STATUS_DISABLE) {
			throw new FLException(230002, "已停用的账户不能设为默认");
		}

		long cid = customerBankPO.getCid();

		// 先清除该客户所有默认
		List<CustomerBankPO> allBanks = customerBankDao.queryCustomerBankByCid(cid);
		for (CustomerBankPO bank : allBanks) {
			if (bank.getDefaults() == CustomerBankPO.DEFAULTS_YES) {
				bank.setDefaults(CustomerBankPO.DEFAULTS_NO);
				customerBankDao.update(bank);
			}
		}

		// 设置新的默认
		customerBankPO.setDefaults(CustomerBankPO.DEFAULTS_YES);
		customerBankPO.setUpdateTime(DateUtil.current());
		customerBankDao.update(customerBankPO);

		return 0;
	}

}
