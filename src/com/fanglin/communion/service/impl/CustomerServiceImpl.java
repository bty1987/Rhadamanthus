/**
 * Title: CustomerServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.service.impl;

import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.enums.ElecsignScene;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.elecsign.service.ElecsignService;
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
import com.fanglin.communion.dao.CustomerAccountDao;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.CustomerRecordDao;
import com.fanglin.communion.po.CustomerAccountPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.communion.service.CustomerService;
import com.fanglin.communion.vo.CustomerPhoneVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.log.context.ActionLogContext;
import com.fanglin.log.service.CustomerLogService;
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
	private ElecsignRouter elecsignRouter;
	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CustomerAccountDao customerAccountDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private CustomerRecordDao customerRecordDao;

	@Autowired
	private CustomerLogService customerLogService;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

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
			throw new FLException(130178, "客户信息不存在");
		}

		customerPO.ptv(customerVO);

		customerVO.setAddress(customerPO.getAddress());
		customerVO.setIdentity(SensitiveDataHelper.decrypt(customerPO.getIdentity()));
		customerVO.setWechat(customerPO.getWechat());
		customerVO.setQq(customerPO.getQq());
		customerVO.setEmail(customerPO.getEmail());

		customerVO.setCompanyAddr(customerPO.getCompanyAddr());
		customerVO.setCompanyBank(customerPO.getCompanyBank());
		customerVO.setCompanyBankno(customerPO.getCompanyBankno());
		customerVO.setCompanyName(customerPO.getCompanyName());
		customerVO.setCompanyNo(customerPO.getCompanyNo());
		customerVO.setCompanyPhone(customerPO.getCompanyPhone());

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
			throw new FLException(130178, "客户信息不存在");
		}

		CustomerVO customerVO = customerPO.ptv(new CustomerVO(), CustomerPO.PRIVACY_OPENESS_INT);

		if (customerPhoneVO.getCpid() != null) {

			CustomerPhonePO customerPhonePO = customerPhoneDao.get(customerPhoneVO.getCpid());

			if (customerPhonePO != null) customerPhonePO.ptv(customerPhoneVO, CustomerPO.PRIVACY_OPENESS_INT);
		} else {
			customerPhoneVO.setCpid(0l);
		}

		customerRecordDao.save(new CustomerRecordPO(customerPO.getCid(), customerPhoneVO.getCpid(), CustomerRecordPO.TYPE_QUERY_INT, userDao.queryUserByUserId(userId), DateUtil.getDateToTimestamp(new Date())));

		// Phase 7: 同时写入 log 模块的统一客户电话查询日志表（双写过渡期）
		// 后续废弃原表后可移除上面那行 customerRecordDao.save
		customerLogService.addCustomerLog(customerPO.getCid(), customerPhoneVO.getCpid(), userId, null);

		return customerVO;
	}

	@Override
	public List<CustomerPhoneVO> queryCustomerPhoneByCid(CustomerPhoneVO customerPhone) throws FLException {

		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByCid(customerPhone.getCid(), customerPhone.getStatus());
		List<CustomerPhoneVO> customerPhoneVOs = new ArrayList<CustomerPhoneVO>();

		if (customerPhonePOs.size() == 0) {
			throw new FLException(130178, "客户信息不存在");
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

		List<String> phones = SensitiveDataHelper.getAllEncryptedForms(customerPhoneVO.getPhone());

		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhone(phones, customerPhoneVO.getStatus(), null, company);

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

		List<String> phones = SensitiveDataHelper.getAllEncryptedForms(customerVO.getPhone());

		if (customerPhoneDao.queryCustomerPhone(phones, CustomerPhonePO.STATUS_ENABLE_INT, null, company).size() != 0) {
			throw new FLException(130006, "客户电话已存在");
		}

		String phone = SensitiveDataHelper.encrypt(customerVO.getPhone());

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
		customerPO.setIdentity(SensitiveDataHelper.encrypt(customerPO.getIdentity()));

		customerDao.save(customerPO);

		CustomerPhonePO customerPhonePO = new CustomerPhonePO();

		customerPhonePO.setCid(customerPO.getCid());
		customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
		customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

		customerPhonePO.setPhone(phone);

		customerPhoneDao.save(customerPhonePO);

		// 生成客户创建事件
		messageQueuingDao.save(new MessageQueuingPO().init(null, "addCustomer", "{\"cid\":" + customerPO.getCid() + ",\"no\":\"" + customerPO.getNo() + "\",\"event\":\"CUSTOMER_CREATED\"}"));

		BeanUtil.copyProperties(customerPO, customerVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int existCustomer(CustomerVO customerVO, Integer company) {

		String phone = SensitiveDataHelper.encrypt(customerVO.getPhone());

		CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhoneForDefault(phone, company);

		if (customerPhonePO == null) {

			CustomerPO customerPO = new CustomerPO();

			BeanUtil.copyProperties(customerVO, customerPO);

			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOMER_INT, currentDate, company);
			String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			customerPO.setNo(no);
			customerPO.setCompany(company);
			customerPO.setPhone(phone);

			if (customerVO.getName() != null && !customerVO.getName().trim().isEmpty()) {
				customerPO.setPinyinAB(PinYin4Util.getPinYinHeadChar(customerVO.getName()).get(0));
				customerPO.setPinyinAll(PinYin4Util.getPinyin(customerVO.getName()).get(0));
			}

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

		List<String> phones = SensitiveDataHelper.getAllEncryptedForms(customerPhoneVO.getPhone());

		if (customerPhoneDao.queryCustomerPhone(phones, CustomerPhonePO.STATUS_ENABLE_INT, null, company).size() != 0) {
			throw new FLException(130006, "客户电话已存在");
		}

		CustomerPO customerPO = customerDao.get(customerPhoneVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		String phone = SensitiveDataHelper.encrypt(customerPhoneVO.getPhone());

		CustomerPhonePO customerPhonePO = new CustomerPhonePO();

		customerPhonePO.setCid(customerPhoneVO.getCid());
		customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
		customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

		customerPhonePO.setPhone(phone);

		customerPhoneDao.clearCustomerPhoneForDefault(customerPhoneVO.getCid());

		customerPhoneDao.save(customerPhonePO);

		customerPO.setPhone(phone);

		customerDao.update(customerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomer(CustomerVO customerVO) throws FLException {

		// P0-1a: 绑定业务上下文，让 actionLog 记录"谁改了哪个客户"
		ActionLogContext.bind("customer", String.valueOf(customerVO.getCid()), "UPDATE");

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130184, "客户状态不可操作");
		}

		BeanUtil.copyProperties(customerVO, customerPO, "phone", "identity");

		if (customerVO.getName() == null || customerVO.getName().trim().isEmpty()) {
			customerPO.setPinyinAB(PinYin4Util.getPinYinHeadChar(customerVO.getName()).get(0));
			customerPO.setPinyinAll(PinYin4Util.getPinyin(customerVO.getName()).get(0));
		}

		if (customerVO.getPhone() != null) {
			customerPO.setPhone(SensitiveDataHelper.encrypt(customerVO.getPhone()));

			customerPhoneDao.clearCustomerPhoneForDefault(customerPO.getCid());

			CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhone(customerPO.getCid(), customerPO.getPhone());

			if (customerPhonePO == null) {

				customerPhonePO = new CustomerPhonePO();

				customerPhonePO.setCid(customerPO.getCid());
				customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
				customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

				customerPhonePO.setPhone(customerPO.getPhone());

				customerPhoneDao.save(customerPhonePO);
			} else {
				customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
				customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

				customerPhoneDao.update(customerPhonePO);
			}
		}

		if (customerVO.getIdentity() != null) {
			customerPO.setIdentity(SensitiveDataHelper.encrypt(customerVO.getIdentity()));
		}

		customerDao.update(customerPO);

		// 生成客户更新事件
		messageQueuingDao.save(new MessageQueuingPO().init(null, "updateCustomer", "{\"cid\":" + customerPO.getCid() + ",\"no\":\"" + customerPO.getNo() + "\",\"event\":\"CUSTOMER_UPDATED\"}"));

		// 生成客户更新消息提示
		messageQueuingDao.save(new MessageCueuingPO().init(null, "updateCustomer", "{\"cid\":" + customerPO.getCid() + ",\"no\":\"" + customerPO.getNo() + "\",\"event\":\"CUSTOMER_UPDATED\"}"));

		// 比对该客户所有 account, 无完全匹配则新建
		matchCustomerAccount(customerPO);

		BeanUtil.copyProperties(customerPO, customerVO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerForBase(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		customerPO.setType(customerVO.getType());
		customerPO.setCompanyNo(customerVO.getCompanyNo());
		customerPO.setCompanyName(customerVO.getCompanyName());
		customerPO.setCompanyAddr(customerVO.getCompanyAddr());
		customerPO.setCompanyPhone(customerVO.getCompanyPhone());
		customerPO.setCompanyBank(customerVO.getCompanyBank());
		customerPO.setCompanyBankno(customerVO.getCompanyBankno());

		customerDao.update(customerPO);

		// 生成客户更新消息提示
		messageQueuingDao.save(new MessageCueuingPO().init(null, "updateCustomerForBase", "{\"cid\":" + customerPO.getCid() + ",\"no\":\"" + customerPO.getNo() + "\",\"event\":\"CUSTOMER_UPDATED\"}"));

		// 比对该客户所有 account, 无完全匹配则新建
		matchCustomerAccount(customerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerPhoneForStatus(CustomerPhoneVO customerPhoneVO) throws FLException {

		CustomerPhonePO customerPhonePO = customerPhoneDao.get(customerPhoneVO.getCpid());

		if (customerPhonePO == null) {
			throw new FLException(130021, "客户电话不存在");
		}

		if (customerPhonePO.getDefaults() == CustomerPhonePO.DEFAULTS_ENABLE_INT && customerPhoneVO.getStatus() == CustomerPhonePO.STATUS_DISABLE_INT) {
			throw new FLException(130176, "默认电话不能禁用，请先设置其他电话为默认");
		}

		customerPhonePO.setStatus(customerPhoneVO.getStatus());

		customerPhoneDao.update(customerPhonePO);

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
			throw new FLException(130178, "客户信息不存在");
		}

		if (!Arrays.asList(CustomerPO.STATUS_INIT_INT, CustomerPO.STATUS_AUTH_INT, CustomerPO.STATUS_AUTHED_INT).contains(customerPO.getStatus())) {
			throw new FLException(130184, "客户状态不可操作");
		}

		if (customerPhonePO.getDefaults() == CustomerPhonePO.DEFAULTS_DISABLE_INT) {

			customerPhoneDao.clearCustomerPhoneForDefault(customerPhonePO.getCid());

			customerPhonePO.setDefaults(customerPhoneVO.getDefaults());
			customerPhoneDao.update(customerPhonePO);

			customerPO.setPhone(customerPhonePO.getPhone());

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
			throw new FLException(130178, "客户信息不存在");
		}

		if (customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130184, "客户状态不可操作");
		}

		if (customerPO.getSignno() == null || "".equals(customerPO.getSignno())) {
			customerPO.setSignno(routeForAuth(customerPO).register(customerPO.getNo()));
		}

		customerDao.update(customerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOMER_INT, currentDate, customerPO.getCompany());
		String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		customerPO.setNo(no);
		customerPO.setToken(null);
		customerPO.setSignno(null);

		customerPO.setStatus(CustomerPO.STATUS_INIT_INT);

		customerDao.update(customerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String authCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		// 定向重实名(厂商命名空间切换): 显式传customer.provider且与现命名空间不同时,
		// 允许跨状态重走该厂商实名(如法大大已实名客户要签e签宝模板合同), 重置命名空间字段
		Short targetProvider = customerVO.getProvider();
		boolean namespaceSwitch = targetProvider != null
				&& customerPO.getStatus() != CustomerPO.STATUS_INIT_INT
				&& (customerPO.getProvider() == null || targetProvider.shortValue() != customerPO.getProvider().shortValue());

		if (!namespaceSwitch && customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130184, "客户状态不可操作");
		}

		if (namespaceSwitch) {
			ElecsignProvider target = ElecsignProvider.of(targetProvider);
			customerPO.setProvider(target.code());
			customerPO.setSignno(elecsignRouter.route(target, customerPO.getCompany()).register(customerPO.getNo()));
			customerPO.setAuthurl(null);
			customerPO.setToken(null);
		}

		if (customerPO.getSignno() == null || "".equals(customerPO.getSignno())) {
			customerPO.setSignno(routeForAuth(customerPO).register(customerPO.getNo()));
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

		JSONObject info = elecsignRouter.route(customerPO.getProvider(), customerPO.getCompany()).authenticate(customerPO.getSignno(), customerPO.getName(), SensitiveDataHelper.decrypt(customerPO.getPhone()), authno, type);

		String redirect = elecsignRouter.route(customerPO.getProvider(), customerPO.getCompany()).decode(info.getString("url"));

		customerPO.setToken(info.getString("transactionNo"));

		customerDao.update(customerPO);

		return redirect;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmCustomer(CustomerVO customerVO) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		// e签宝命名空间放行重实名(定向切换后状态可能为已实名/已签署), 真实门槛=identity-info核验;
		// 法大大路径维持仅初始状态可确认
		boolean esignNamespace = customerPO.getProvider() != null && customerPO.getProvider() == ElecsignProvider.ESIGN.code();

		if (!esignNamespace && customerPO.getStatus() != CustomerPO.STATUS_INIT_INT) {
			throw new FLException(130184, "客户状态不可操作");
		}

		ElecsignService elecsignService = elecsignRouter.route(customerPO.getProvider(), customerPO.getCompany());

		// e签宝分支: identity-info 出于脱敏仅回 psnId/realnameStatus——实名信息源即客户注册录入
		// (authenticate 时传 name/identity/phone 送核), 确认只需 psnId 写回 signno + 状态推进
		// 按 psnAccount=手机号查询; token 存的是 authFlowId 供认证回调反查, 不能当账号标识
		JSONObject info = customerPO.getProvider() != null && customerPO.getProvider() == ElecsignProvider.ESIGN.code()
			? elecsignService.person(SensitiveDataHelper.decrypt(customerPO.getPhone()))
			: elecsignService.person(customerPO.getToken());

		if (customerPO.getProvider() != null && customerPO.getProvider() == ElecsignProvider.ESIGN.code()) {
			Short realnameStatus = info.getShort("realnameStatus");

			if (realnameStatus == null || realnameStatus.shortValue() != 1) {
				throw new FLException(130189, "客户实名认证未完成, 请先发起实名认证");
			}

			customerPO.setSignno(info.getString("psnId"));

			if (customerPO.getStatus() == CustomerPO.STATUS_INIT_INT) {
				customerPO.setStatus(CustomerPO.STATUS_AUTH_INT);
			}

			customerDao.update(customerPO);

			messageQueuingDao.save(new MessageCueuingPO().init(null, "confirmCustomer", "{\"cid\":" + customerPO.getCid() + ",\"no\":\"" + customerPO.getNo() + "\",\"event\":\"CUSTOMER_UPDATED\"}"));

			return 0;
		}

		JSONObject person = info.getJSONObject("person");

		customerPO.setName(person.getString("personName"));
		customerPO.setIdentity(SensitiveDataHelper.encrypt(person.getString("idCard")));
		customerPO.setAddress(person.getString("address"));

		customerPO.setPhone(SensitiveDataHelper.encrypt(person.getString("mobile")));

		customerPO.setPhotoPath(person.getString("photoUuid"));
		customerPO.setIdentityPathF(person.getString("headPhotoPath"));
		customerPO.setIdentityPathB(person.getString("backgroundIdCardPath"));

		customerPO.setStatus(CustomerPO.STATUS_AUTH_INT);

		customerDao.update(customerPO);

		// 生成客户更新消息提示
		messageQueuingDao.save(new MessageCueuingPO().init(null, "confirmCustomer", "{\"cid\":" + customerPO.getCid() + ",\"no\":\"" + customerPO.getNo() + "\",\"event\":\"CUSTOMER_UPDATED\"}"));

		CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhone(customerPO.getCid(), customerPO.getPhone());

		if (customerPhonePO == null) {

			customerPhoneDao.clearCustomerPhoneForDefault(customerPO.getCid());

			customerPhonePO = new CustomerPhonePO();

			customerPhonePO.setCid(customerPO.getCid());
			customerPhonePO.setPhone(customerPO.getPhone());
			customerPhonePO.setStatus(CustomerPhonePO.STATUS_ENABLE_INT);
			customerPhonePO.setDefaults(CustomerPhonePO.DEFAULTS_ENABLE_INT);

			customerPhoneDao.save(customerPhonePO);
		} else if (customerPhonePO.getDefaults() != CustomerPhonePO.DEFAULTS_ENABLE_INT) {

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
		customerVO.setIdentity(SensitiveDataHelper.decrypt(customerPO.getIdentity()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int signateCustomer(CustomerVO customerVO, String imgbase) throws FLException {

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (customerPO == null) {
			throw new FLException(130178, "客户信息不存在");
		}

		elecsignRouter.route(customerPO.getProvider(), customerPO.getCompany()).signature(customerPO.getSignno(), imgbase);

		customerPO.setSignPath(customerVO.getSignPath());

		customerDao.update(customerPO);

		return 0;
	}

	/**
	 * 根据 customer 的 company* 字段计算 hash, 用 cid + contentHash 查询, 存在则跳过, 不存在则新建 account 并设为默认
	 */
	private void matchCustomerAccount(CustomerPO customerPO) {

		String no = customerPO.getCompanyNo();
		String name = customerPO.getCompanyName();
		String address = customerPO.getCompanyAddr();
		String phone = customerPO.getCompanyPhone();
		String bank = customerPO.getCompanyBank();
		String bankno = customerPO.getCompanyBankno();

		// 如果没有银行信息, 不需要创建 account
		if ((bank == null || bank.isEmpty()) && (bankno == null || bankno.isEmpty())) {
			return;
		}

		String contentHash = CustomerAccountPO.computeContentHash(no, name, address, phone, bank, bankno);

		// cid + contentHash 查询, 存在则忽略
		CustomerAccountPO existing = customerAccountDao.queryCustomerAccount(customerPO.getCid(), contentHash);
		if (existing != null) {
			return;
		}

		// 不存在, 新建 account
		CustomerAccountPO newAccount = new CustomerAccountPO();
		newAccount.setCid(customerPO.getCid());
		newAccount.setType(CustomerAccountPO.TYPE_PUBLIC);
		newAccount.setNo(no);
		newAccount.setName(name);
		newAccount.setAddress(address);
		newAccount.setPhone(phone);
		newAccount.setBank(bank);
		newAccount.setBankno(bankno);
		newAccount.setStatus(CustomerAccountPO.STATUS_ENABLE);
		newAccount.setCreateTime(DateUtil.current());
		newAccount.setUpdateTime(DateUtil.current());
		newAccount.setContentHash(contentHash);

		int count = customerAccountDao.countCustomerAccountByCid(customerPO.getCid());

		if (count == 0) {
			newAccount.setDefaults(CustomerAccountPO.DEFAULTS_YES);
		} else {
			// 清除旧默认
			List<CustomerAccountPO> accounts = customerAccountDao.queryCustomerAccount(customerPO.getCid());
			for (CustomerAccountPO account : accounts) {
				if (account.getDefaults() == CustomerAccountPO.DEFAULTS_YES) {
					account.setDefaults(CustomerAccountPO.DEFAULTS_NO);
					customerAccountDao.update(account);
				}
			}
			newAccount.setDefaults(CustomerAccountPO.DEFAULTS_YES);
		}

		customerAccountDao.save(newAccount);
	}

	/** 电子签路由（实名/印章场景：按PO公司×AUTH场景配置路由，并把厂商记录到 PO provider 字段） */
	private ElecsignService routeForAuth(CustomerPO customerPO) throws FLException {

		ElecsignProvider provider = elecsignRouter.resolveProvider(customerPO.getCompany(), ElecsignScene.AUTH);

		customerPO.setProvider(provider.code());

		return elecsignRouter.route(provider);
	}

}
