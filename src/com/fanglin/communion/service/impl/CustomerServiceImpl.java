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
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.CustomerRecordDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerPhoneVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.fadada.signature.Signature;
import com.fanglin.personel.dao.UserDao;
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
	private CustomerRecordDao customerRecordDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageCustomer(Paging paging, List<Filter> filters, CustomerVO customerVO, Integer company) {

		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();
		List<CustomerPO> customerPOs = customerDao.pageCustomer(paging, filters, company);

		for (CustomerPO customerPO : customerPOs) {

			customerVO = customerPO.ptv(new CustomerVO());

			customerVOs.add(customerVO);
		}

		paging.setData(customerVOs);
	}

	@Override
	public CustomerVO queryCustomerById(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		customerPO.ptv(customerVO);

		customerVO.setAddress(customerPO.getAddress());
		customerVO.setIdentity(customerPO.getIdentity());
		customerVO.setWechat(customerPO.getWechat());
		customerVO.setQq(customerPO.getQq());
		customerVO.setEmail(customerPO.getEmail());

		return customerVO;
	}

	@Override
	public List<CustomerVO> queryCustomerForName(String pinyinName, Integer company) {

		List<CustomerVO> customerVOs = new ArrayList<CustomerVO>();

		List<CustomerPO> customerPOs = customerDao.queryCustomerByPinyin(pinyinName, 10, company);

		for (CustomerPO customerPO : customerPOs) {
			customerVOs.add(customerPO.ptv(new CustomerVO()));
		}

		return customerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CustomerVO queryCustomerForPhone(CustomerPhoneVO customerPhoneVO, String userId) throws FLException {

		CustomerPO customerPO = customerDao.get(customerPhoneVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		CustomerVO customerVO = customerPO.ptv(new CustomerVO());

		if (customerPhoneVO.getCpid() != null) {

			CustomerPhonePO customerPhonePO = customerPhoneDao.get(customerPhoneVO.getCpid());

			customerPhoneVO.setCpid(customerPhonePO.getCpid());
			customerVO.setPhone(customerPhonePO == null ? "" : FormatUtil.decodePhone(customerPhonePO.getPhone()));
		} else {
			customerPhoneVO.setCpid(customerPO.getCid());
			customerVO.setPhone(FormatUtil.decodePhone(customerPO.getPhone()));
		}

		customerRecordDao.save(new CustomerRecordPO(customerPO.getCid(), customerPhoneVO.getCpid(), CustomerRecordPO.TYPE_QUERY_INT, userDao.queryUserByUserId(userId), DateUtil.getDateToTimestamp(new Date())));

		return customerVO;
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
	public int checkCustomerForPhone(CustomerPhoneVO customerPhoneVO, Integer company) throws FLException {

		String phone = FormatUtil.encodePhone(customerPhoneVO.getPhone());

		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByPhone(phone, customerPhoneVO.getStatus(), company);

		if (customerPhonePOs == null || customerPhonePOs.size() == 0) {
			return 0;
		}

		for (CustomerPhonePO customerPhonePO : customerPhonePOs) {

			if (customerPhoneVO.getCid() != null && customerPhonePO.getCid() == customerPhoneVO.getCid()) {
				customerPhoneVO.setCid(customerPhonePO.getCid());
				throw new FLException(130006, "客户电话已存在");
			}

			if (customerPhonePO.getStatus() == CustomerPhonePO.STATUS_ENABLE_INT) {
				customerPhoneVO.setCid(customerPhonePO.getCid());
				throw new FLException(130006, "客户电话已存在");
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomer(CustomerVO customerVO, Integer company) throws FLException {

		String phone = FormatUtil.encodePhone(customerVO.getPhone());

		if (customerPhoneDao.queryCustomerPhoneByPhone(phone, CustomerPhonePO.STATUS_ENABLE_INT, company).size() != 0) {
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

		customerPO.setPhone(phone);

		customerDao.save(customerPO);

		CustomerPhonePO customerPhonePO = new CustomerPhonePO();

		customerPhonePO.setCid(customerPO.getCid());
		customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
		customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

		customerPhonePO.setPhone(phone);

		customerPhoneDao.save(customerPhonePO);

		BeanUtil.copyProperties(customerPO, customerVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int existCustomer(CustomerVO customerVO, Integer company) {

		String phone = FormatUtil.encodePhone(customerVO.getPhone());

		CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhoneForDefault(phone, company);

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
			customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
			customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

			customerPhonePO.setPhone(phone);

			customerPhoneDao.save(customerPhonePO);
		}

		customerVO.setCid(customerPhonePO.getCid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerPhone(CustomerPhoneVO customerPhoneVO, Integer company) throws FLException {

		String phone = FormatUtil.encodePhone(customerPhoneVO.getPhone());

		if (customerPhoneDao.queryCustomerPhoneByPhone(phone, CustomerPhonePO.STATUS_ENABLE_INT, company).size() != 0) {
			throw new FLException(130006, "客户电话已存在");
		}

		CustomerPO customerPO = customerDao.get(customerPhoneVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		CustomerPhonePO customerPhonePO = new CustomerPhonePO();

		customerPhonePO.setCid(customerPhoneVO.getCid());
		customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
		customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

		customerPhonePO.setPhone(phone);

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

		if (customerVO.getPhone() != null) customerPO.setPhone(FormatUtil.encodePhone(customerVO.getPhone()));

		customerDao.update(customerPO);

		BeanUtil.copyProperties(customerPO, customerVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerForBase(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		customerPO.setType(customerVO.getType());
		customerPO.setCompanyNo(customerVO.getCompanyNo());
		customerPO.setCompanyName(customerVO.getCompanyName());
		customerPO.setCompanyAddr(customerVO.getCompanyAddr());
		customerPO.setCompanyPhone(customerVO.getCompanyPhone());
		customerPO.setCompanyBank(customerVO.getCompanyBank());
		customerPO.setCompanyBankno(customerVO.getCompanyBankno());

		customerDao.update(customerPO);

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

		if (!Arrays.asList(CustomerPO.STATUS_INIT_INT, CustomerPO.STATUS_AUTH_INT, CustomerPO.STATUS_AUTHED_INT).contains(customerPO.getStatus())) {
			throw new FLException(130028, "客户状态不可操作");
		}

		if (customerPhonePO.getDefaults() == CustomerPhonePO.DEFAULTS_DISABLE_INT) {

			customerPhoneDao.clearCustomerPhoneForDefault(customerPhonePO.getCid());

			customerPhonePO.setDefaults(customerPhoneVO.getDefaults());
			customerPhoneDao.update(customerPhonePO);

			customerPO.setPhone(FormatUtil.encodePhone(customerPhonePO.getPhone()));

			customerDao.update(customerPO);
		}

		BeanUtil.copyProperties(customerPhonePO, customerPhoneVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int registCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		if (customerPO.getSignno() == null || "".equals(customerPO.getSignno())) {
			customerPO.setSignno(Signature.register(customerPO.getNo()));
		}

		customerDao.update(customerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130028, "客户状态不可操作");
		}

		customerPO.setToken(null);
		customerPO.setSignno(null);

		customerDao.update(customerPO);

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

		if (customerPO.getSignno() == null || "".equals(customerPO.getSignno())) {
			customerPO.setSignno(Signature.register(customerPO.getNo()));
		}

		if (customerPO.getAuthurl() != null && !"".equals(customerPO.getAuthurl())) {
			return customerPO.getAuthurl();
		}

		String authno = customerPO.getIdentity();
		Short type = 0;

		if (customerVO.getPassport() != null) {
			authno = customerPO.getPassport();
			type = 1;
		}

		JSONObject info = Signature.authenticate(customerPO.getSignno(), customerPO.getName(), FormatUtil.decodePhone(customerPO.getPhone()), authno, type);

		String redirect = Signature.decode(info.getString("url"));

		customerPO.setToken(info.getString("transactionNo"));

		customerDao.update(customerPO);

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

		JSONObject info = Signature.person(customerPO.getToken());

		JSONObject person = info.getJSONObject("person");

		customerPO.setName(person.getString("personName"));
		customerPO.setIdentity(person.getString("idCard"));
		customerPO.setAddress(person.getString("address"));

		customerPO.setPhone(FormatUtil.encodePhone(person.getString("mobile")));

		customerPO.setPhotoPath(person.getString("photoUuid"));
		customerPO.setIdentityPathF(person.getString("headPhotoPath"));
		customerPO.setIdentityPathB(person.getString("backgroundIdCardPath"));

		customerPO.setStatus(CustomerPO.STATUS_AUTH_INT);

		customerDao.update(customerPO);

		CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhone(customerPO.getCid(), customerPO.getPhone());

		if (customerPhonePO == null) {

			customerPhoneDao.clearCustomerPhoneForDefault(customerPO.getCid());

			customerPhonePO = new CustomerPhonePO();

			customerPhonePO.setCid(customerPO.getCid());
			customerPhonePO.setPhone(customerPO.getPhone());
			customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
			customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);
		}

		if (customerPhonePO != null && customerPhonePO.getDefaults() != CustomerPhonePO.DEFAULTS_ENABLE_INT) {

			customerPhoneDao.clearCustomerPhoneForDefault(customerPO.getCid());

			customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);
			customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);

			customerPhoneDao.update(customerPhonePO);
		}

		customerVO.setName(customerPO.getName());
		customerVO.setGender(customerPO.getGender());
		customerVO.setPhone(customerPO.getPhone());
		customerVO.setAddress(customerPO.getAddress());
		customerVO.setRelationshipType(customerPO.getRelationshipType());
		customerVO.setIdentity(customerPO.getIdentity());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int signateCustomer(CustomerVO customerVO, String imgbase) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户信息不存在");
		}

		Signature.signature(customerPO.getSignno(), imgbase);

		customerPO.setSignPath(customerVO.getSignPath());

		customerDao.update(customerPO);

		return 0;
	}

}
