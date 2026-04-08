package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.service.ApprovalDecorationBelongService;
import com.fanglin.communion.dao.DutyDao;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerProtectRuleDao;
import com.fanglin.customer.po.CustomerProtectRulePO;
import com.fanglin.customer.service.CustomerProtectRuleService;
import com.fanglin.customer.vo.CustomerProtectRuleVO;
import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.impl.DecorationBelongServiceImpl;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Arith;
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
	private DutyDao dutyDao;

	@Autowired
	private DecorationMeasureRuleDao decorationMeasureRuleDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private ApprovalDecorationBelongService approvalDecorationBelongService;

	@Autowired
	private DecorationBelongServiceImpl decorationBelongService;

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
	public CustomerProtectRuleVO checkCustomerProtectRule(CustomerProtectRuleVO customerProtectRuleVO, String userId, int company) throws FLException {

		List<Integer> companys = new ArrayList<Integer>(Arrays.asList(company));

		List<DecorationMeasureRuleItemPO> measures = decorationMeasureRuleDao.queryDecorationMeasureRule(company);

		for (DecorationMeasureRuleItemPO measure : measures) {
			companys.add(measure.getCompany());
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(customerProtectRuleVO.getHid(), companys);

		if (decorationPO == null) {

			List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(customerProtectRuleVO.getCid(), null, companys);

			if (decorationPOs.size() > 0) decorationPO = decorationPOs.get(0);
		}

		if (decorationPO == null) return customerProtectRuleVO;

		customerProtectRuleVO.setOrderId(decorationPO.getOrderId());

		// 标准VO，用于存储当前最大保护天数的规则
		CustomerProtectRuleVO maxRuleVO = new CustomerProtectRuleVO();
		int maxRemainingDays = 0;

		Timestamp now = DateUtil.getDateToTimestamp(new Date());

		// 1. 面积规则检查
		CustomerProtectRulePO areaRule = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_AREA_INT, decorationPO.getHouse().getInnerArea());
		if (areaRule != null && decorationPO.getMeasureTime() != null) {
			long daysPassed = DateUtil.diffDay(decorationPO.getMeasureTime(), now);
			int protectDays = Arith.div(areaRule.getDays(), 10000000);
			if (daysPassed < protectDays) {
				int remaining = (int) (protectDays - daysPassed);
				if (remaining > maxRemainingDays) {
					maxRemainingDays = remaining;
					maxRuleVO = areaRule.ptv(new CustomerProtectRuleVO());
				}
			}
		}

		// 2. 预付款规则检查
		int advanceAmount = paymentDao.amountPayment(decorationPO.getOrderId(), PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, decorationPO.getDepositTime());
		CustomerProtectRulePO advanceRule = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_PAYMENT_ADVANCE_INT, advanceAmount);
		if (advanceRule != null && decorationPO.getDepositTime() != null) {
			long daysPassed = DateUtil.diffDay(decorationPO.getDepositTime(), now);
			int protectDays = Arith.div(advanceRule.getDays(), 1000000);
			if (daysPassed < protectDays) {
				int remaining = (int) (protectDays - daysPassed);
				if (remaining > maxRemainingDays) {
					maxRemainingDays = remaining;
					maxRuleVO = advanceRule.ptv(new CustomerProtectRuleVO());
				}
			}
		}

		// 3. 设计费规则检查
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPayment(decorationPO.getOrderId(), DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR);
		int designAmount = (int) (decorationPaymentPO != null ? decorationPaymentPO.getReferMoney() : 0);
		CustomerProtectRulePO designRule = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_PAYMENT_DESIGN_INT, designAmount);
		if (designRule != null && decorationPO.getDepositTime() != null) {
			long daysPassed = DateUtil.diffDay(decorationPO.getDepositTime(), now);
			int protectDays = Arith.div(designRule.getDays(), 1000000);
			if (daysPassed < protectDays) {
				int remaining = (int) (protectDays - daysPassed);
				if (remaining > maxRemainingDays) {
					maxRemainingDays = remaining;
					maxRuleVO = designRule.ptv(new CustomerProtectRuleVO());
				}
			}
		}

		// 4. 定金规则检查（预付款+设计费）
		int depositAmount = advanceAmount + designAmount;
		CustomerProtectRulePO depositRule = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_DEPOSIT_INT, depositAmount);
		if (depositRule != null && decorationPO.getDepositTime() != null) {
			long daysPassed = DateUtil.diffDay(decorationPO.getDepositTime(), now);
			int protectDays = Arith.div(depositRule.getDays(), 1000000);
			if (daysPassed < protectDays) {
				int remaining = (int) (protectDays - daysPassed);
				if (remaining > maxRemainingDays) {
					maxRemainingDays = remaining;
					maxRuleVO = depositRule.ptv(new CustomerProtectRuleVO());
				}
			}
		}

		// 5. 岗位规则检查
		// 先查询装修单的业务员归属（type = 1）
		List<DecorationBelongPO> salesmanBelongs = decorationBelongDao.queryDecorationBelong(
				decorationPO.getOrderId(),
				DecorationBelongPO.BELONGTYPE_SALESMAN_INT,
				DecorationBelongPO.STATUS_EFFCTIVE_INT);

		if (customerProtectRuleVO.getDuty() != null && customerProtectRuleVO.getDuty().getDid() != null) {
			Long dutyId = customerProtectRuleVO.getDuty().getDid();
			List<CustomerProtectRulePO> dutyRules = customerProtectRuleDao.queryCustomerProtectRuleByDuty(dutyId, company);
			for (CustomerProtectRulePO dutyRule : dutyRules) {
				// 检查业务员归属的岗位是否匹配规则中的岗位
				boolean isSalesmanDutyMatch = false;
				for (DecorationBelongPO belong : salesmanBelongs) {
					if (belong.getBelonger() != null && belong.getBelonger().getDuty() != null) {
						if (belong.getBelonger().getDuty().getDid() == dutyId) {
							// 业务员的岗位匹配规则中的岗位，不触发保护
							isSalesmanDutyMatch = true;
							break;
						}
					}
				}

				if (isSalesmanDutyMatch) {
					// 业务员岗位匹配，返回空 VO（不触发保护）
					return new CustomerProtectRuleVO();
				}

				long daysPassed = DateUtil.diffDay(decorationPO.getCreateTime(), now);
				int protectDays = dutyRule.getDays();
				if (daysPassed < protectDays) {
					int remaining = (int) (protectDays - daysPassed);
					if (remaining > maxRemainingDays) {
						maxRemainingDays = remaining;
						maxRuleVO = dutyRule.ptv(new CustomerProtectRuleVO());
					}
				}
			}
		}

		// 如果有匹配的规则，返回最大天数的规则
		if (maxRemainingDays > 0) {
			return maxRuleVO;
		}

		return customerProtectRuleVO;
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

		BeanUtil.copyProperties(customerProtectRuleVO, customerProtectRulePO, Arrays.asList("creater", "duty"));

		// 处理岗位关联
		if (customerProtectRuleVO.getDuty() != null && customerProtectRuleVO.getDuty().getDid() != null) {
			DutyPO dutyPO = dutyDao.get(customerProtectRuleVO.getDuty().getDid());
			customerProtectRulePO.setDuty(dutyPO);
		}

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

		List<DecorationMeasureRuleItemPO> measures = decorationMeasureRuleDao.queryDecorationMeasureRule(company);

		for (DecorationMeasureRuleItemPO measure : measures) {
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

			customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_AREA_INT, decorationPO.getHouse().getInnerArea());

			if (customerProtectRulePO != null && DateUtil.diffDay(DateUtil.getDateToTimestamp(new Date()), decorationPO.getCreateTime()) < customerProtectRulePO.getDays()) { // 量尺时间-当前时间>保护规则天数
				approvalDecorationBelongService.tranApprovalForDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId, company, null, null);
				return false;
			}
		}

		if (DecorationPO.STATUS_DEPOSIT_INT == decorationPO.getStatus()) {

			int advanceAmount = paymentDao.amountPayment(decorationPO.getOrderId(), PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, decorationPO.getDepositTime()); // QUERY ADVANCEPAYMENT

			customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_PAYMENT_ADVANCE_INT, advanceAmount);

			if (customerProtectRulePO != null && DateUtil.diffDay(DateUtil.getDateToTimestamp(new Date()), decorationPO.getDepositTime()) < customerProtectRulePO.getDays()) {
				approvalDecorationBelongService.tranApprovalForDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId, company, null, null);
				return false;
			}

			DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPayment(decorationPO.getOrderId(), DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR); // QUERY DESIGNPAYMENT

			int designAmount = (int) (decorationPaymentPO != null ? decorationPaymentPO.getReferMoney() : 0);

			customerProtectRulePO = customerProtectRuleDao.queryCustomerProtectRule(CustomerProtectRulePO.TYPE_PAYMENT_DESIGN_INT, designAmount);

			if (customerProtectRulePO != null && DateUtil.diffDay(DateUtil.getDateToTimestamp(new Date()), decorationPO.getDepositTime()) < customerProtectRulePO.getDays()) {
				approvalDecorationBelongService.tranApprovalForDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId, company, null, null);
				return false;
			}
		}

		decorationBelongService.tranDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, userId);

		return false;
	}

}
