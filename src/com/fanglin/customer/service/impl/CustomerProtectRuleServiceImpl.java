package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerProtectRuleDao;
import com.fanglin.customer.po.CustomerProtectRulePO;
import com.fanglin.customer.service.CustomerProtectRuleService;
import com.fanglin.customer.vo.CustomerProtectRuleVO;
import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.po.DecorationMeasureItemPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("customerProtectRuleService")
@Transactional(readOnly = true)
public class CustomerProtectRuleServiceImpl implements CustomerProtectRuleService {

	@Autowired
	private CustomerProtectRuleDao customerProtectRuleDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationMeasureRuleDao decorationMeasureRuleDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private ApprovalDecorationBelongService approvalDecorationBelongService;

	@Autowired
	private DecorationBelongService decorationBelongService;

	@Override
	public void pageCustomerProtectRule(Paging paging, List<Filter> filters, int company) {

		List<CustomerProtectRulePO> customerProtectRulePOs = customerProtectRuleDao.pageCustomerProtectRule(paging, filters, company);
		List<CustomerProtectRuleVO> customerProtectRuleVOs = new ArrayList<CustomerProtectRuleVO>();

		for (CustomerProtectRulePO customerProtectRulePO : customerProtectRulePOs) {

			CustomerProtectRuleVO customerProtectRuleVO = new CustomerProtectRuleVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			customerProtectRuleVOs.add(customerProtectRulePO.ptv(customerProtectRuleVO));
		}

		paging.setData(customerProtectRuleVOs);
	}

	@Override
	public List<CustomerProtectRuleVO> queryCustomerProtectRule(CustomerProtectRuleVO customerProtectRule) {

		List<CustomerProtectRulePO> customerProtectRulePOs = customerProtectRuleDao.queryCustomerProtectRule(customerProtectRule.getType(), customerProtectRule.getUppval(), customerProtectRule.getLowval(), customerProtectRule.getDays());
		List<CustomerProtectRuleVO> customerProtectRuleVOs = new ArrayList<CustomerProtectRuleVO>();

		for (CustomerProtectRulePO customerProtectRulePO : customerProtectRulePOs) {

			CustomerProtectRuleVO customerProtectRuleVO = new CustomerProtectRuleVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			customerProtectRuleVOs.add(customerProtectRulePO.ptv(customerProtectRuleVO));
		}

		return customerProtectRuleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerProtectRule(CustomerProtectRuleVO customerProtectRuleVO, String userId, int company) throws FLException {

		List<CustomerProtectRulePO> customerProtectRulePOs = customerProtectRuleDao.queryCustomerProtectRule(customerProtectRuleVO.getType(), customerProtectRuleVO.getUppval(), customerProtectRuleVO.getLowval());

		if (customerProtectRulePOs.size() > 0) {
			throw new FLException(330080, "规则已存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		CustomerProtectRulePO customerProtectRulePO = new CustomerProtectRulePO(creater);

		BeanUtil.copyProperties(customerProtectRuleVO, customerProtectRulePO, Arrays.asList("creater"));

		customerProtectRulePO.setCompany(company);

		customerProtectRuleDao.save(customerProtectRulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCustomerProtectRule(CustomerProtectRuleVO customerProtectRule) throws FLException {

		CustomerProtectRulePO customerProtectRulePO = customerProtectRuleDao.get(customerProtectRule.getCprid());

		if (customerProtectRulePO == null) {
			throw new FLException(330081, "无匹配规则");
		}

		customerProtectRuleDao.delete(customerProtectRulePO);
	}

	public boolean protect(long cid, long hid, String userId, int company) throws FLException {

		List<Integer> companys = new ArrayList<Integer>(Arrays.asList(company));

		List<DecorationMeasureItemPO> measures = decorationMeasureRuleDao.queryDecorationMeasureRule(company);

		for (DecorationMeasureItemPO measure : measures) {
			companys.add(measure.getCompany());
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(hid, companys);

		if (decorationPO == null) {

			List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(cid, null, companys);

			if (decorationPOs.size() > 0) decorationPO = decorationPOs.get(0);
		}

		if (decorationPO == null) return true;

		if (Arrays.asList(DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_RESIGNED_INT, DecorationPO.STATUS_COMPLETED_INT).contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		if (Arrays.asList(DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_FINAL_INT).contains(decorationPO.getStatus()) || DecorationPO.BALANCESTATUS_CONDUCT_INT == decorationPO.getBalanceStatus()) return true;

		CustomerProtectRulePO customerProtectRulePO = null;

		if (DecorationPO.STATUS_INIT_INT == decorationPO.getStatus()) {

			customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_AREA_INT, (long) decorationPO.getHouse().getInnerArea());

			if (customerProtectRulePO != null && DateUtil.diffDay(DateUtil.getDateToTimestamp(new Date()), decorationPO.getMeasureTime()) > customerProtectRulePO.getDays()) { // 量尺时间-当前时间>保护规则天数
				approvalDecorationBelongService.tranApprovalForDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId, company, null, null);
				return false;
			}
		}

		if (DecorationPO.STATUS_DEPOSIT_INT == decorationPO.getStatus()) {

			Short[] status = { PaymentPO.PAYMENT_STATUS_PAID_INT, PaymentPO.PAYMENT_STATUS_CONFIRMED_INT };

			long advanceAmount = paymentDao.amountPayment(decorationPO.getOrderId(), PaymentPO.PAYMENT_TYPE_COLLECTION_INT, PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, status); // QUERY ADVANCEPAYMENT

			customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_PAYMENT_ADVANCE_INT, advanceAmount);

			if (customerProtectRulePO != null && DateUtil.diffDay(DateUtil.getDateToTimestamp(new Date()), decorationPO.getDepositTime()) > customerProtectRulePO.getDays()) {
				approvalDecorationBelongService.tranApprovalForDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId, company, null, null);
				return false;
			}

			DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPayment(decorationPO.getOrderId(), DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR); // QUERY DESIGNPAYMENT

			long designAmount = decorationPaymentPO != null ? decorationPaymentPO.getReferMoney() : 0;

			customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_PAYMENT_DESIGN_INT, designAmount);

			if (customerProtectRulePO != null && DateUtil.diffDay(DateUtil.getDateToTimestamp(new Date()), decorationPO.getDepositTime()) > customerProtectRulePO.getDays()) {
				approvalDecorationBelongService.tranApprovalForDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId, company, null, null);
				return false;
			}
		}

		decorationBelongService.tranDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId);

		return false;
	}
}
