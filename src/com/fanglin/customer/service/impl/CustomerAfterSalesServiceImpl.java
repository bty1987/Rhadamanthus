package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerAfterSalesDao;
import com.fanglin.customer.dao.CustomerAfterSalesRecordDao;
import com.fanglin.customer.dao.CustomerAfterSalesRefDao;
import com.fanglin.customer.po.CustomerAfterSalesPO;
import com.fanglin.customer.po.CustomerAfterSalesRecordPO;
import com.fanglin.customer.po.CustomerAfterSalesRefPO;
import com.fanglin.customer.service.CustomerAfterSalesService;
import com.fanglin.customer.vo.CustomerAfterSalesRecordVO;
import com.fanglin.customer.vo.CustomerAfterSalesRefVO;
import com.fanglin.customer.vo.CustomerAfterSalesVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("customerAfterSalesService")
@Transactional(readOnly = true)
public class CustomerAfterSalesServiceImpl implements CustomerAfterSalesService {

	@Autowired
	private CustomerAfterSalesDao customerAfterSalesDao;

	@Autowired
	private CustomerAfterSalesRecordDao customerAfterSalesRecordDao;

	@Autowired
	private CustomerAfterSalesRefDao customerAfterSalesRefDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageCustomerAfterSales(Paging paging, List<Filter> filters, int company) throws FLException {

		List<CustomerAfterSalesPO> customerAfterSalesPOs = customerAfterSalesDao.pageCustomerAfterSales(paging, filters, company);
		List<CustomerAfterSalesVO> customerAfterSalesVOs = new ArrayList<CustomerAfterSalesVO>();

		for (CustomerAfterSalesPO customerAfterSalesPO : customerAfterSalesPOs) {
			customerAfterSalesVOs.add(POtoVO(customerAfterSalesPO));
		}

		paging.setData(customerAfterSalesVOs);
	}

	@Override
	public CustomerAfterSalesVO queryCustomerAfterSalesByAsid(CustomerAfterSalesVO customerAfterSalesVO) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = customerAfterSalesDao.get(customerAfterSalesVO.getAsid());

		if (customerAfterSalesPO == null) {
			throw new FLException(330114, "售后单不存在");
		}

		return POtoVO(customerAfterSalesPO);
	}

	@Override
	public List<CustomerAfterSalesVO> queryCustomerAfterSalesByOrderId(CustomerAfterSalesVO customerAfterSalesVO, int company) {

		List<CustomerAfterSalesPO> customerAfterSalesPOs = customerAfterSalesDao.queryCustomerAfterSalesByOrderId(customerAfterSalesVO.getOrderId(), company);
		List<CustomerAfterSalesVO> customerAfterSalesVOs = new ArrayList<CustomerAfterSalesVO>();

		for (CustomerAfterSalesPO customerAfterSalesPO : customerAfterSalesPOs) {
			customerAfterSalesVOs.add(POtoVO(customerAfterSalesPO));
		}

		return customerAfterSalesVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId, int company) throws FLException {

		UserPO creater = queryUser(userId);
		UserPO owner = queryOwner(customerAfterSalesVO.getOwner(), creater);

		String orderId = customerAfterSalesVO.getOrderId();
		if (orderId != null && !"".equals(orderId)) {
			if (decorationDao.queryDecorationByOrderId(orderId) == null) {
				throw new FLException(140013, "装修单不存在");
			}
		}

		String asNo = makeCustomerAfterSalesNo(company);

		CustomerAfterSalesPO customerAfterSalesPO = new CustomerAfterSalesPO().init(asNo, creater, company);

		BeanUtil.copyProperties(customerAfterSalesVO, customerAfterSalesPO, Arrays.asList("asid", "asNo", "status", "owner", "creater", "createTime", "updateTime", "receiveTime", "handleTime", "finishTime", "closeTime", "company", "comment"));

		if (customerAfterSalesVO.getPhone() != null) {
			customerAfterSalesPO.setPhone(SensitiveDataHelper.encrypt(customerAfterSalesVO.getPhone()));
		}

		customerAfterSalesPO.setOwner(owner);
		customerAfterSalesDao.save(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_CREATE_INT, creater, CustomerAfterSalesPO.STATUS_INIT_INT, CustomerAfterSalesPO.STATUS_INIT_INT, customerAfterSalesVO.getComment());

		customerAfterSalesVO.setAsid(customerAfterSalesPO.getAsid());
		customerAfterSalesVO.setAsNo(customerAfterSalesPO.getAsNo());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = queryPO(customerAfterSalesVO);

		if (customerAfterSalesPO.getStatus() != CustomerAfterSalesPO.STATUS_INIT_INT) {
			throw new FLException(330115, "售后单状态不可操作");
		}

		UserPO operator = queryUser(userId);
		UserPO owner = queryOwner(customerAfterSalesVO.getOwner(), operator);
		Date now = new Date();
		short oldStatus = customerAfterSalesPO.getStatus();

		customerAfterSalesPO.setOwner(owner);
		customerAfterSalesPO.setStatus(CustomerAfterSalesPO.STATUS_RECEIVE_INT);
		customerAfterSalesPO.setReceiveTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesPO.setUpdateTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesDao.update(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_RECEIVE_INT, operator, oldStatus, customerAfterSalesPO.getStatus(), customerAfterSalesVO.getComment());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int handleCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = queryPO(customerAfterSalesVO);

		if (!Arrays.asList(CustomerAfterSalesPO.STATUS_RECEIVE_INT, CustomerAfterSalesPO.STATUS_DISPATCH_INT, CustomerAfterSalesPO.STATUS_HANDLE_INT, CustomerAfterSalesPO.STATUS_UPGRADE_INT, CustomerAfterSalesPO.STATUS_REOPEN_INT).contains(customerAfterSalesPO.getStatus())) {
			throw new FLException(330115, "售后单状态不可操作");
		}

		UserPO operator = queryUser(userId);
		UserPO owner = queryOwner(customerAfterSalesVO.getOwner(), customerAfterSalesPO.getOwner() == null ? operator : customerAfterSalesPO.getOwner());
		Date now = new Date();
		short oldStatus = customerAfterSalesPO.getStatus();

		customerAfterSalesPO.setOwner(owner);
		customerAfterSalesPO.setStatus(CustomerAfterSalesPO.STATUS_HANDLE_INT);
		customerAfterSalesPO.setHandleTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesPO.setUpdateTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesDao.update(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_HANDLE_INT, operator, oldStatus, customerAfterSalesPO.getStatus(), customerAfterSalesVO.getComment());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = queryPO(customerAfterSalesVO);

		if (!Arrays.asList(CustomerAfterSalesPO.STATUS_HANDLE_INT, CustomerAfterSalesPO.STATUS_CONFIRM_INT).contains(customerAfterSalesPO.getStatus())) {
			throw new FLException(330115, "售后单状态不可操作");
		}

		UserPO operator = queryUser(userId);
		Date now = new Date();
		short oldStatus = customerAfterSalesPO.getStatus();

		customerAfterSalesPO.setStatus(CustomerAfterSalesPO.STATUS_FINISH_INT);
		customerAfterSalesPO.setFinishTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesPO.setUpdateTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesDao.update(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_FINISH_INT, operator, oldStatus, customerAfterSalesPO.getStatus(), customerAfterSalesVO.getComment());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int closeCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = queryPO(customerAfterSalesVO);

		if (customerAfterSalesPO.getStatus() != CustomerAfterSalesPO.STATUS_FINISH_INT) {
			throw new FLException(330115, "售后单状态不可操作");
		}

		UserPO operator = queryUser(userId);
		Date now = new Date();
		short oldStatus = customerAfterSalesPO.getStatus();

		customerAfterSalesPO.setStatus(CustomerAfterSalesPO.STATUS_CLOSE_INT);
		customerAfterSalesPO.setCloseTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesPO.setUpdateTime(DateUtil.getDateToTimestamp(now));
		customerAfterSalesDao.update(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_CLOSE_INT, operator, oldStatus, customerAfterSalesPO.getStatus(), customerAfterSalesVO.getComment());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = queryPO(customerAfterSalesVO);

		if (Arrays.asList(CustomerAfterSalesPO.STATUS_FINISH_INT, CustomerAfterSalesPO.STATUS_CLOSE_INT, CustomerAfterSalesPO.STATUS_CANCEL_INT).contains(customerAfterSalesPO.getStatus())) {
			throw new FLException(330115, "售后单状态不可操作");
		}

		UserPO operator = queryUser(userId);
		short oldStatus = customerAfterSalesPO.getStatus();

		customerAfterSalesPO.setStatus(CustomerAfterSalesPO.STATUS_CANCEL_INT);
		customerAfterSalesPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		customerAfterSalesDao.update(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_CANCEL_INT, operator, oldStatus, customerAfterSalesPO.getStatus(), customerAfterSalesVO.getComment());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int reopenCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = queryPO(customerAfterSalesVO);

		if (!Arrays.asList(CustomerAfterSalesPO.STATUS_FINISH_INT, CustomerAfterSalesPO.STATUS_CLOSE_INT).contains(customerAfterSalesPO.getStatus())) {
			throw new FLException(330115, "售后单状态不可操作");
		}

		UserPO operator = queryUser(userId);
		UserPO owner = queryOwner(customerAfterSalesVO.getOwner(), customerAfterSalesPO.getOwner() == null ? operator : customerAfterSalesPO.getOwner());
		short oldStatus = customerAfterSalesPO.getStatus();

		customerAfterSalesPO.setOwner(owner);
		customerAfterSalesPO.setStatus(CustomerAfterSalesPO.STATUS_REOPEN_INT);
		customerAfterSalesPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		customerAfterSalesDao.update(customerAfterSalesPO);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_REOPEN_INT, operator, oldStatus, customerAfterSalesPO.getStatus(), customerAfterSalesVO.getComment());

		return 0;
	}

	@Override
	public List<CustomerAfterSalesRecordVO> queryCustomerAfterSalesRecord(CustomerAfterSalesRecordVO customerAfterSalesRecordVO) {

		List<CustomerAfterSalesRecordPO> customerAfterSalesRecordPOs = customerAfterSalesRecordDao.queryCustomerAfterSalesRecord(customerAfterSalesRecordVO.getCustomerAfterSales().getAsid());
		List<CustomerAfterSalesRecordVO> customerAfterSalesRecordVOs = new ArrayList<CustomerAfterSalesRecordVO>();

		for (CustomerAfterSalesRecordPO customerAfterSalesRecordPO : customerAfterSalesRecordPOs) {
			customerAfterSalesRecordVOs.add(customerAfterSalesRecordPO.ptv(new CustomerAfterSalesRecordVO(new CustomerAfterSalesVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO())));
		}

		return customerAfterSalesRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerAfterSalesRecord(CustomerAfterSalesRecordVO customerAfterSalesRecordVO, String userId) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = customerAfterSalesDao.get(customerAfterSalesRecordVO.getCustomerAfterSales().getAsid());

		if (customerAfterSalesPO == null) {
			throw new FLException(330114, "售后单不存在");
		}

		UserPO operator = queryUser(userId);

		addRecord(customerAfterSalesPO, CustomerAfterSalesRecordPO.TYPE_COMMENT_INT, operator, customerAfterSalesPO.getStatus(), customerAfterSalesPO.getStatus(), customerAfterSalesRecordVO.getComment());

		return 0;
	}

	@Override
	public List<CustomerAfterSalesRefVO> queryCustomerAfterSalesRef(CustomerAfterSalesRefVO customerAfterSalesRefVO) {

		List<CustomerAfterSalesRefPO> customerAfterSalesRefPOs = customerAfterSalesRefDao.queryCustomerAfterSalesRef(customerAfterSalesRefVO.getCustomerAfterSales().getAsid());
		List<CustomerAfterSalesRefVO> customerAfterSalesRefVOs = new ArrayList<CustomerAfterSalesRefVO>();

		for (CustomerAfterSalesRefPO customerAfterSalesRefPO : customerAfterSalesRefPOs) {
			customerAfterSalesRefVOs.add(customerAfterSalesRefPO.ptv(new CustomerAfterSalesRefVO(new CustomerAfterSalesVO(new UserBaseVO(), new UserBaseVO()))));
		}

		return customerAfterSalesRefVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerAfterSalesRef(CustomerAfterSalesRefVO customerAfterSalesRefVO) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = customerAfterSalesDao.get(customerAfterSalesRefVO.getCustomerAfterSales().getAsid());

		if (customerAfterSalesPO == null) {
			throw new FLException(330114, "售后单不存在");
		}

		CustomerAfterSalesRefPO exists = customerAfterSalesRefDao.queryCustomerAfterSalesRef(customerAfterSalesRefVO.getType(), customerAfterSalesRefVO.getRefId());

		if (exists != null) {
			throw new FLException(330117, "售后引用已存在");
		}

		CustomerAfterSalesRefPO customerAfterSalesRefPO = new CustomerAfterSalesRefPO().init(customerAfterSalesPO, customerAfterSalesRefVO.getType(), customerAfterSalesRefVO.getRefId());

		customerAfterSalesRefDao.save(customerAfterSalesRefPO);

		return 0;
	}

	private CustomerAfterSalesPO queryPO(CustomerAfterSalesVO customerAfterSalesVO) throws FLException {

		CustomerAfterSalesPO customerAfterSalesPO = customerAfterSalesDao.get(customerAfterSalesVO.getAsid());

		if (customerAfterSalesPO == null) {
			throw new FLException(330114, "售后单不存在");
		}

		return customerAfterSalesPO;
	}

	private UserPO queryUser(String userId) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		return userPO;
	}

	private UserPO queryOwner(UserBaseVO owner, UserPO defaultOwner) throws FLException {

		if (owner == null || owner.getUserId() == null || "".equals(owner.getUserId())) return defaultOwner;

		return queryUser(owner.getUserId());
	}

	private void addRecord(CustomerAfterSalesPO customerAfterSalesPO, short type, UserPO operator, short oldStatus, short newStatus, String comment) {
		customerAfterSalesRecordDao.save(new CustomerAfterSalesRecordPO().init(customerAfterSalesPO, type, operator, oldStatus, newStatus, comment));
	}

	private String makeCustomerAfterSalesNo(int company) {

		CompanyPO companyPO = companyDao.get(company);
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOMER_AFTERSALES_INT, currentDate, company);
		String prefix = companyPO == null ? "AS" : companyPO.getShortname() + "AS";

		return prefix + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
	}

	private CustomerAfterSalesVO POtoVO(CustomerAfterSalesPO customerAfterSalesPO) {
		return customerAfterSalesPO.ptv(new CustomerAfterSalesVO(new UserBaseVO(), new UserBaseVO()));
	}

}
