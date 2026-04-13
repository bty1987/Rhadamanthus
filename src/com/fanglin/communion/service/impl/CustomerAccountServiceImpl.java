package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerAccountDao;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerAccountPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.service.CustomerAccountService;
import com.fanglin.communion.vo.CustomerAccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("customerAccountService")
@Transactional(readOnly = true)
public class CustomerAccountServiceImpl implements CustomerAccountService {

	@Autowired
	private CustomerAccountDao customerAccountDao;

	@Autowired
	private CustomerDao customerDao;

	@Override
	public List<CustomerAccountVO> queryCustomerAccount(CustomerAccountVO customerAccountVO) {

		List<CustomerAccountPO> customerAccountPOs = customerAccountDao.queryCustomerAccountByCid(customerAccountVO.getCid());
		List<CustomerAccountVO> customerAccountVOs = new ArrayList<CustomerAccountVO>();

		for (CustomerAccountPO customerAccountPO : customerAccountPOs) {
			customerAccountVOs.add(customerAccountPO.ptv(new CustomerAccountVO()));
		}

		return customerAccountVOs;
	}

	@Override
	public CustomerAccountVO queryDefaultCustomerAccount(CustomerAccountVO customerAccountVO) {

		CustomerAccountPO customerAccountPO = customerAccountDao.queryDefaultCustomerAccount(customerAccountVO.getCid());

		if (customerAccountPO == null) return null;

		return customerAccountPO.ptv(new CustomerAccountVO());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException {

		long cid = customerAccountVO.getCid();

		CustomerAccountPO customerAccountPO = new CustomerAccountPO();

		BeanUtil.copyPropertie(customerAccountVO, customerAccountPO);

		customerAccountPO.setCid(cid);
		customerAccountPO.setStatus(CustomerAccountPO.STATUS_ENABLE);
		customerAccountPO.setCreateTime(DateUtil.current());
		customerAccountPO.setUpdateTime(DateUtil.current());

		int count = customerAccountDao.countCustomerAccountByCid(cid);

		if (count == 0) {
			customerAccountPO.setDefaults(CustomerAccountPO.DEFAULTS_YES);
		} else {
			customerAccountPO.setDefaults(CustomerAccountPO.DEFAULTS_NO);
		}

		customerAccountDao.save(customerAccountPO);

		// 如果是默认账户, 同步数据到 customer.company* 字段
		if (customerAccountPO.getDefaults() == CustomerAccountPO.DEFAULTS_YES) {
			CustomerPO customerPO = customerDao.get(cid);
			if (customerPO != null) {
				customerPO.setCompanyNo(customerAccountPO.getNo());
				customerPO.setCompanyName(customerAccountPO.getName());
				customerPO.setCompanyAddr(customerAccountPO.getAddress());
				customerPO.setCompanyPhone(customerAccountPO.getPhone());
				customerPO.setCompanyBank(customerAccountPO.getBank());
				customerPO.setCompanyBankno(customerAccountPO.getBankno());
				customerDao.update(customerPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException {

		CustomerAccountPO customerAccountPO = customerAccountDao.get(customerAccountVO.getCaid());

		if (customerAccountPO == null) {
			throw new FLException(230001, "客户银行账户不存在");
		}

		BeanUtil.copyPropertie(customerAccountVO, customerAccountPO, "cid", "defaults", "status", "createTime");

		customerAccountPO.setUpdateTime(DateUtil.current());

		customerAccountDao.update(customerAccountPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException {

		CustomerAccountPO customerAccountPO = customerAccountDao.get(customerAccountVO.getCaid());

		if (customerAccountPO == null) {
			throw new FLException(230001, "客户银行账户不存在");
		}

		long cid = customerAccountPO.getCid();
		short wasDefault = customerAccountPO.getDefaults();

		customerAccountPO.setStatus(CustomerAccountPO.STATUS_DISABLE);
		customerAccountPO.setDefaults(CustomerAccountPO.DEFAULTS_NO);
		customerAccountPO.setUpdateTime(DateUtil.current());

		customerAccountDao.update(customerAccountPO);

		// 如果删除的是默认账户，将同客户下第一个可用账户设为默认
		if (wasDefault == CustomerAccountPO.DEFAULTS_YES) {
			List<CustomerAccountPO> remaining = customerAccountDao.queryCustomerAccountByCid(customerAccountPO.getCid());
			if (remaining != null && remaining.size() > 0) {
				remaining.get(0).setDefaults(CustomerAccountPO.DEFAULTS_YES);
				customerAccountDao.update(remaining.get(0));
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int setDefaultCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException {

		CustomerAccountPO customerAccountPO = customerAccountDao.get(customerAccountVO.getCaid());

		if (customerAccountPO == null) {
			throw new FLException(230001, "客户银行账户不存在");
		}

		if (customerAccountPO.getStatus() == CustomerAccountPO.STATUS_DISABLE) {
			throw new FLException(230002, "已停用的账户不能设为默认");
		}

		long cid = customerAccountPO.getCid();

		// 先清除该客户所有默认
		List<CustomerAccountPO> allBanks = customerAccountDao.queryCustomerAccountByCid(cid);
		for (CustomerAccountPO bank : allBanks) {
			if (bank.getDefaults() == CustomerAccountPO.DEFAULTS_YES) {
				bank.setDefaults(CustomerAccountPO.DEFAULTS_NO);
				customerAccountDao.update(bank);
			}
		}

		// 设置新的默认
		customerAccountPO.setDefaults(CustomerAccountPO.DEFAULTS_YES);
		customerAccountPO.setUpdateTime(DateUtil.current());
		customerAccountDao.update(customerAccountPO);

		// 同步默认账户数据到 customer.company* 字段
		CustomerPO customerPO = customerDao.get(cid);
		if (customerPO != null) {
			customerPO.setCompanyNo(customerAccountPO.getNo());
			customerPO.setCompanyName(customerAccountPO.getName());
			customerPO.setCompanyAddr(customerAccountPO.getAddress());
			customerPO.setCompanyPhone(customerAccountPO.getPhone());
			customerPO.setCompanyBank(customerAccountPO.getBank());
			customerPO.setCompanyBankno(customerAccountPO.getBankno());
			customerDao.update(customerPO);
		}

		return 0;
	}

}
