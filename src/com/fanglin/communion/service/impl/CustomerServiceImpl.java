/**
 * Title: CustomerServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fadada.signature.Signature;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerPhoneVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("customerService")
@Transactional(readOnly = true)
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageCustomer(Paging paging, List<Filter> filters, Integer company) {

		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();
		List<CustomerPO> customerPOs;

		HashSet<Long> cids = new HashSet<Long>();

		if (filters != null) {

			for (Filter filter : filters) {
				if ("customerPhone".equals(filter.getField())) {

					List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByPhone(filter.getData(), null, company);

					if (customerPhonePOs.size() == 0) {

						paging.setData(customerVOs);

						return;
					} else {
						for (CustomerPhonePO customerPhonePO : customerPhonePOs) {
							cids.add(customerPhonePO.getCid());
						}

						customerPOs = customerDao.pageCustomer(paging, filters, cids, company);

						for (CustomerPO customerPO : customerPOs) {

							CustomerVO customerVO = new CustomerVO();

							BeanUtil.copyProperties(customerPO, customerVO);

							customerVOs.add(customerVO);
						}
						paging.setData(customerVOs);

						return;
					}
				}
			}
		}

		customerPOs = customerDao.pageCustomer(paging, filters, cids, company);

		for (CustomerPO customerPO : customerPOs) {
			CustomerVO customerVO = new CustomerVO();

			BeanUtil.copyProperties(customerPO, customerVO);

			customerVOs.add(customerVO);
		}

		paging.setData(customerVOs);
	}

	@Override
	public CustomerVO queryCustomerById(CustomerVO customerVO) {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO != null) {
			customerVO = new CustomerVO();

			BeanUtil.copyProperties(customerPO, customerVO);
		}

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(customerVO.getCid(), CustomerPhonePO.STATUS_ENABLE_INT);

		if (!customerPhones.isEmpty()) {

			List<String> phones = new ArrayList<String>();

			for (CustomerPhonePO customerphone : customerPhones) {
				phones.add(customerphone.getPhone());
			}

			customerVO.setPhone(StringUtils.join(phones, ","));
		}

		return customerVO;
	}

	@Override
	public List<CustomerVO> queryCustomerForName(String pinyinName, Integer company) {

		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();

		List<CustomerPO> customerPOs = customerDao.queryCustomerByPinyin(pinyinName, 10, company);

		for (CustomerPO customerPO : customerPOs) {

			CustomerVO customerVO = new CustomerVO();

			BeanUtil.copyProperties(customerPO, customerVO);

			customerVOs.add(customerVO);
		}

		return customerVOs;
	}

	@Override
	public List<CustomerPhoneVO> queryCustomerPhoneByCid(CustomerPhoneVO customerPhone) throws FLException {

		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByCid(customerPhone.getCid(), customerPhone.getStatus());

		List<CustomerPhoneVO> customerPhoneVOs = new ArrayList<CustomerPhoneVO>();

		if (customerPhonePOs.size() == 0) {
			throw new FLException(130002, "客户信息不存在");
		}

		for (CustomerPhonePO customerPhonePO : customerPhonePOs) {

			CustomerPhoneVO customerPhoneVO = new CustomerPhoneVO();

			BeanUtil.copyProperties(customerPhonePO, customerPhoneVO);

			customerPhoneVOs.add(customerPhoneVO);
		}

		return customerPhoneVOs;
	}

	@Override
	public int checkCustomerForPhone(CustomerPhoneVO customerPhone, Integer company) throws FLException {

		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByPhone(customerPhone.getPhone(), customerPhone.getStatus(), company);

		if (customerPhonePOs.size() > 0) {

			for (CustomerPhonePO customerPhonePO : customerPhonePOs) {

				if (customerPhone.getCid() != null && customerPhonePO.getCid() == customerPhone.getCid()) {
					throw new FLException(130006, "客户电话已存在");
				}

				if (customerPhonePO.getStatus() == CustomerPhonePO.STATUS_ENABLE_INT) {
					throw new FLException(130006, "客户电话已存在");
				}
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomer(CustomerVO customerVO, Integer company) throws FLException {

		if (customerPhoneDao.queryCustomerPhoneByPhone(customerVO.getPhone(), CustomerPhonePO.STATUS_ENABLE_INT, company).size() != 0) {
			throw new FLException(130006, "客户电话已存在");
		}

		CustomerPO customerPO = new CustomerPO();

		BeanUtil.copyProperties(customerVO, customerPO);

		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOMER_INT, currentDate, company);

		String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		customerPO.setNo(no);
		customerPO.setPinyinAB(PinYin4Util.getPinYinHeadChar(customerVO.getName()).get(0));
		customerPO.setPinyinAll(PinYin4Util.getPinyin(customerVO.getName()).get(0));
		customerPO.setCompany(company);

		customerDao.save(customerPO);

		CustomerPhonePO customerPhonePO = new CustomerPhonePO();

		customerPhonePO.setCid(customerPO.getCid());
		customerPhonePO.setPhone(customerVO.getPhone());
		customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
		customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

		customerPhoneDao.save(customerPhonePO);

		BeanUtil.copyProperties(customerPO, customerVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int existCustomer(CustomerVO customerVO, Integer company) {

		CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhoneForDefault(customerVO.getPhone(), company);

		if (customerPhonePO == null) {

			CustomerPO customerPO = new CustomerPO();

			BeanUtil.copyProperties(customerVO, customerPO);

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);

			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOMER_INT, currentDate, company);

			String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			customerPO.setNo(no);
			customerPO.setPinyinAB(PinYin4Util.getPinYinHeadChar(customerVO.getName()).get(0));
			customerPO.setPinyinAll(PinYin4Util.getPinyin(customerVO.getName()).get(0));
			customerPO.setCompany(company);

			customerDao.save(customerPO);

			customerPhonePO = new CustomerPhonePO();

			customerPhonePO.setCid(customerPO.getCid());
			customerPhonePO.setPhone(customerVO.getPhone());
			customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
			customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

			customerPhoneDao.save(customerPhonePO);
		}

		customerVO.setCid(customerPhonePO.getCid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerPhone(CustomerPhoneVO customerPhoneVO, Integer company) throws FLException {

		if (customerPhoneDao.queryCustomerPhoneByPhone(customerPhoneVO.getPhone(), CustomerPhonePO.STATUS_ENABLE_INT, company).size() != 0) {
			throw new FLException(130006, "客户电话已存在");
		}

		CustomerPO customerPO = customerDao.get(customerPhoneVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		CustomerPhonePO customerPhonePO = new CustomerPhonePO();

		customerPhonePO.setCid(customerPhoneVO.getCid());
		customerPhonePO.setPhone(customerPhoneVO.getPhone());
		customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
		customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

		customerPhoneDao.clearCustomerPhoneForDefault(customerPhoneVO.getCid());

		customerPhoneDao.save(customerPhonePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		BeanUtil.copyProperties(customerVO, customerPO);

		customerPO.setPinyinAB(PinYin4Util.getPinYinHeadChar(customerVO.getName()).get(0));
		customerPO.setPinyinAll(PinYin4Util.getPinyin(customerVO.getName()).get(0));

		customerDao.update(customerPO);

		BeanUtil.copyProperties(customerPO, customerVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerPhoneForStatus(CustomerPhoneVO customerPhoneVO) throws FLException {

		CustomerPhonePO customerPhonePO = customerPhoneDao.get(customerPhoneVO.getCpid());

		if (customerPhonePO == null) {
			throw new FLException(130021, "客户电话不存在");
		}

		customerPhonePO.setStatus(customerPhoneVO.getStatus());

		customerDao.update(customerPhonePO);

		BeanUtil.copyProperties(customerPhonePO, customerPhoneVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerPhoneForDefault(CustomerPhoneVO customerPhoneVO) throws FLException {

		CustomerPhonePO customerPhonePO = customerPhoneDao.get(customerPhoneVO.getCpid());

		if (customerPhonePO == null) {
			throw new FLException(130021, "客户电话不存在");
		}

		if (customerPhonePO.getDefaults() == CustomerPhonePO.DEFAULTS_ENABLE_INT) {
			throw new FLException(130022, "客户电话已使用");
		}

		if (customerPhonePO.getStatus() == CustomerPhonePO.STATUS_DISABLE_INT) {
			throw new FLException(130023, "客户电话未启用");
		}

		CustomerPO customerPO = customerDao.get(customerPhonePO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		if (customerPhonePO.getDefaults() == CustomerPhonePO.DEFAULTS_DISABLE_INT) {

			customerPhoneDao.clearCustomerPhoneForDefault(customerPhonePO.getCid());

			customerPhonePO.setDefaults(customerPhoneVO.getDefaults());

			customerDao.update(customerPhonePO);
		}

		if (customerPO.getStatus() == CustomerPO.STATUS_INIT_INT) {
			customerPO.setPhone(customerPhonePO.getPhone());

			customerDao.update(customerPO);
		}

		BeanUtil.copyProperties(customerPhonePO, customerPhoneVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int registerCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		Signature.register(customerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String authCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		String redirect = "";

		if (customerPO.getAuthurl() != null && !"".equals(customerPO.getAuthurl())) {
			redirect = customerPO.getAuthurl();
		} else {
			redirect = Signature.authenticate(customerPO);
			customerDao.update(customerPO);
		}

		System.out.println(redirect);

		return redirect;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		Signature.person(customerPO);

		customerDao.update(customerPO);

		customerVO.setName(customerPO.getName());
		customerVO.setGender(customerPO.getGender());
		customerVO.setPhone(customerPO.getPhone());
		customerVO.setAddress(customerPO.getAddress());
		customerVO.setRelationshipType(customerPO.getRelationshipType());
		customerVO.setIdentity(customerPO.getIdentity());

		return 0;
	}

	@Override
	public int signateCustomer(CustomerVO customerVO, String imgbase) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		Signature.signature(customerPO, imgbase);

		return 0;
	}

}
