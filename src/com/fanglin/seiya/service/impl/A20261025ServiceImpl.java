/**
 * @File Name		: A20261025ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP签约/款项同步服务实现
 */

package com.fanglin.seiya.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerUserRuleItemPO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.data.po.PaymentScaleItemPO;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationAccountStatusPO;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountStatusService;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.seiya.service.A20261025Service;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

@Service("a20261025Service")
@Transactional(readOnly = true)
public class A20261025ServiceImpl implements A20261025Service {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private PaymentScaleItemDao paymentScaleItemDao;

	@Autowired
	private PaymentTypeDao paymentTypeDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private DecorationOperateDao decorationOperateDao;

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DecorationAccountStatusService decorationAccountStatusService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncSignContractForNerp(String orderId, String quotationName, Long qvid, Long totalPrice, Integer discount, String userId) throws FLException {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140005, "订单合同不能修改");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		if (operater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		// 存在未处理审批项校验（同原版）
		if (approvalDao.countApprovalForInitByIdent(orderId) > 0) {
			throw new FLException(140037, "订单存在未处理审批项");
		}

		// 凭空报价: 无默认报价时创建一条无明细报价单（原版此处要求已有报价 140008）
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		boolean quotationCreated = false;

		if (quotationPO == null) {

			quotationCreated = true;

			QuotationVersionPO versionPO = null;

			if (qvid != null && qvid.longValue() > 0) {
				versionPO = quotationVersionDao.get(qvid.longValue());

				if (versionPO == null) {
					throw new FLException(200050, "报价版本不存在");
				}
			} else {
				versionPO = quotationVersionDao.queryQuotationVersionForDefault(decorationPO.getCompany(), decorationPO.getType(), QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT);

				if (versionPO == null) {
					versionPO = quotationVersionDao.queryQuotationVersionForDefault(decorationPO.getCompany(), QuotationVersionPO.TYPE_COMMON_INT, QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT);
				}

				if (versionPO == null) {
					throw new FLException(200050, "报价版本不存在");
				}
			}

			quotationPO = new QuotationPO();

			quotationPO.setOrderId(orderId);
			quotationPO.setName(quotationName == null || quotationName.trim().isEmpty() ? "报价单" : quotationName.trim());
			quotationPO.setCreater(operater);
			quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			quotationPO.setVersion(versionPO);
			quotationPO.setDiscount(discount == null ? 10000 : discount.intValue());

			if (totalPrice != null) {
				quotationPO.setTotalPrice(totalPrice.longValue());
				quotationPO.setUndisPrice(totalPrice.longValue());
				quotationPO.setDisPrice(totalPrice.longValue());
			}

			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
			quotationPO.setStatus(QuotationPO.STATUS_INIT_INT);

			quotationDao.save(quotationPO);
		}

		// 锁定该单全部报价（同原版）
		quotationDao.updateQuotationForStatusByOrderId(orderId, QuotationPO.STATUS_LOCK_INT);

		// 客源提成规则（同原版, busitype/designer 判空守卫）
		DecorationBusitypePO decorationBusitypePO = decorationPO.getBusitype();

		if (decorationBusitypePO != null && decorationPO.getDesigner() != null) {

			CustomerUserRulePO customerUserRulePO = null;

			if (decorationBusitypePO.getIsAward() == DecorationBusitypePO.ISAWARD_AWARD_INT) {

				customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(decorationPO.getDesigner().getUid());

				if (customerUserRulePO == null) {
					customerUserRulePO = new CustomerUserRulePO().init(decorationPO.getDesigner(), operater, decorationPO.getCompany());

					customerUserRuleDao.save(customerUserRulePO);
				}
			}

			if (decorationBusitypePO.getIsAward() == DecorationBusitypePO.ISAWARD_AWARD_DEPT_INT) {

				UserPO manager = decorationPO.getDesigner().getDept() != null ? decorationPO.getDesigner().getDept().getManager() : null;

				if (manager != null) {

					customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(manager.getUid());

					if (customerUserRulePO == null) {
						customerUserRulePO = new CustomerUserRulePO().init(manager, operater, decorationPO.getCompany());

						customerUserRuleDao.save(customerUserRulePO);
					}
				}
			}

			if (customerUserRulePO != null) {
				customerUserRuleDao.save(new CustomerUserRuleItemPO().award(decorationPO.getOrderId(), customerUserRulePO.getCurid(), "工程部", new DepartmentTypePO(DepartmentTypePO.DEPARTMENT_TYPE_CONSTRUCTION_DEPT_INT)));
			}
		}

		boolean resignFlag = DecorationPO.STATUS_RESIGNED_INT == decorationPO.getStatus();
		boolean prosignFlag = DecorationPO.STATUS_PROSIGN_INT == decorationPO.getStatus();

		decorationPO.setStatus(DecorationPO.STATUS_SIGNED_INT);
		decorationPO.setContracter(operater);

		if (totalPrice != null) {
			decorationPO.setOrderTotalPrice(totalPrice.longValue()); // 签单额
		}

		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (decorationPO.getDesignStatus() == DecorationPO.DESIGNSTATUS_INITIA_INT) {
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_CONDUCT_INT);

			if (decorationPO.getDesigner() != null) {
				messageService.sendMessage(decorationPO.getDesigner().getUserId(), null, String.format("装修单: %s , 地址: %s %s , 合同签署完成 , 设计状态已进入设计中 , 请持续关注设计推进 .", orderId, decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber()), MessagePO.TYPE_SEND_PERSONEL_INT, decorationPO.getDesigner().getCompany());
			}
		}

		if (!resignFlag) {
			decorationPO.setContractTime(DateUtil.getDateToTimestamp(new Date()));
		}

		decorationDao.update(decorationPO);

		decorationAccountStatusService.updateDecorationAccountStatus(orderId, DecorationAccountStatusPO.TYPE_SIGN_INT);

		// 工程信息存在则回填初始设计时间（原版要求工程信息存在, 凭空放宽为可缺失）
		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO != null) {
			constructionInfoPO.setInitDesignTime(DateUtil.getDateToTimestamp(new Date()));

			constructionInfoDao.update(constructionInfoPO);
		}

		if (!resignFlag && !prosignFlag) { // 签约

			if (decorationAdditionPO != null) {
				decorationAdditionPO.clearDesign();
				decorationAdditionPO.clearSales();
			}

			if (decorationPO.getDesigner() != null) {
				decorationPO.setDesignDept(decorationPO.getDesigner().getDept());
			}
			if (decorationPO.getSalesman() != null) {
				decorationPO.setSalesDept(decorationPO.getSalesman().getDept());
			}

			// 更新归属信息的部门和大区, 更新附加信息
			for (DecorationBelongPO decorationBelongPO : designers) {

				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				if (decorationAdditionPO != null) {
					decorationAdditionPO.setDesign(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());
				}

				decorationBelongDao.update(decorationBelongPO);

				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_DESIGN_INT, decorationBelongPO.getRate()));
			}

			for (DecorationBelongPO decorationBelongPO : salesmans) {

				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				if (decorationAdditionPO != null) {
					decorationAdditionPO.setSales(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());
				}

				decorationBelongDao.update(decorationBelongPO);

				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_BUSINESS_INT, decorationBelongPO.getRate()));
			}

			if (decorationAdditionPO != null) {
				decorationAdditionDao.update(decorationAdditionPO);
			}

		} else {

			for (DecorationBelongPO decorationBelongPO : designers) {
				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_DESIGN_INT, decorationBelongPO.getRate()));
			}

			for (DecorationBelongPO decorationBelongPO : salesmans) {
				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_BUSINESS_INT, decorationBelongPO.getRate()));
			}
		}

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "signDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_SIGNED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "signDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_SIGNED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", "sign");
		result.put("orderId", orderId);
		result.put("qid", quotationPO.getQid());
		result.put("quotationCreated", quotationCreated);
		result.put("orderTotalPrice", decorationPO.getOrderTotalPrice());

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncDecorationPaymentForNerp(String orderId, Long money, Long cost, Long psid, String userId) throws FLException {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_RESIGNED_INT });

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		if (money == null || money.longValue() <= 0) {
			throw new FLException(150100, "款项金额必须大于0");
		}

		// 款项已付/审批中不可重建（同原版）
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT };

		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderId(orderId, paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		if (decorationPayments != null && decorationPayments.size() > 0) {
			throw new FLException(150001, "款项已付,不可修改");
		}

		// 款项比例方案比例项（同原版）
		List<PaymentScaleItemPO> paymentScaleItems = psid == null ? null : paymentScaleItemDao.queryPaymentScaleItemByPsid(psid.longValue());

		if (paymentScaleItems == null || paymentScaleItems.size() <= 0) {
			throw new FLException(150093, "款项比例不正确");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		if (creater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		int company = decorationPO.getCompany();

		long sumMoney = Arith.mul(Arith.div(money.longValue(), 1000000), 1000000);

		// 凭空无活动物品, 无优惠抵扣: 生成款项金额 = 提交额取整
		long paymentMoney = sumMoney;

		// 重建合同款项计划（同原版）
		decorationPaymentDao.deleteDecorationPaymentForBase(orderId);

		int count = 0;

		if (paymentScaleItems.size() == 1) {

			PaymentScaleItemPO scaleItem = paymentScaleItems.get(0);

			DecorationPaymentPO decorationPayment = new DecorationPaymentPO();

			int all = scaleItem.getScale();

			decorationPayment.setReferMoney(Arith.div(Arith.mul(paymentMoney, all), 100000));
			decorationPayment.setPtid(scaleItem.getPtid());
			decorationPayment.setPaymentType(scaleItem.getName());
			decorationPayment.setSort(scaleItem.getSort());
			decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationPayment.setCreater(creater);
			decorationPayment.setDecoration(decorationPO);
			decorationPayment.setCompany(company);

			decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
			decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
			decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);

			decorationPaymentDao.save(decorationPayment);

			count++;
		} else {

			long totalMoney = 0;

			for (int i = 0; i < paymentScaleItems.size() - 1; i++) {

				PaymentScaleItemPO scaleItem = paymentScaleItems.get(i);

				DecorationPaymentPO decorationPayment = new DecorationPaymentPO();

				int all = scaleItem.getScale();
				long referMoney = Arith.mul(Arith.div(Arith.div(Arith.mul(paymentMoney, all), 100000), 100000000, Arith.ROUND_CEILING), 100000000);

				decorationPayment.setReferMoney(referMoney);
				decorationPayment.setPtid(scaleItem.getPtid());
				decorationPayment.setPaymentType(scaleItem.getName());
				decorationPayment.setSort(scaleItem.getSort());
				decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

				decorationPayment.setCreater(creater);
				decorationPayment.setDecoration(decorationPO);
				decorationPayment.setCompany(company);

				decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
				decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
				decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);

				decorationPaymentDao.save(decorationPayment);

				count++;

				totalMoney = Arith.add(totalMoney, referMoney);
			}

			PaymentScaleItemPO scaleItem = paymentScaleItems.get(Arith.sub(paymentScaleItems.size(), 1));

			DecorationPaymentPO decorationPayment = new DecorationPaymentPO();

			decorationPayment.setReferMoney(Arith.sub(paymentMoney, totalMoney));
			decorationPayment.setPtid(scaleItem.getPtid());
			decorationPayment.setPaymentType(scaleItem.getName());
			decorationPayment.setSort(scaleItem.getSort());
			decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationPayment.setCreater(creater);
			decorationPayment.setDecoration(decorationPO);
			decorationPayment.setCompany(company);

			decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
			decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
			decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);

			decorationPaymentDao.save(decorationPayment);

			count++;
		}

		// 成本利润款项（同原版, cost>0 且公司配置 PAYMENT_TYPE_SUPROFIT_INT 时生成）
		if (cost != null && cost.longValue() > 0) {

			SystemConfigPO ptidConfig = systemConfigDao.querySystemConfig("PAYMENT_TYPE_SUPROFIT_INT", company);

			if (ptidConfig != null) {

				PaymentTypePO paymentType = paymentTypeDao.get(Long.parseLong(ptidConfig.getValue()));

				DecorationPaymentPO decorationPayment = new DecorationPaymentPO();

				decorationPayment.setReferMoney(Arith.mul(Arith.div(cost.longValue(), 1000000), 1000000));
				decorationPayment.setPaymentType(paymentType.getName());
				decorationPayment.setPtid(paymentType.getPtid());
				decorationPayment.setSort((short) 0);
				decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

				decorationPayment.setCreater(creater);
				decorationPayment.setDecoration(decorationPO);
				decorationPayment.setCompany(company);

				decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
				decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
				decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);

				decorationPaymentDao.save(decorationPayment);

				count++;
			}
		}

		// 装修单签单额与实际额（同原版尾部）
		decorationPO.setOrderTotalPrice(sumMoney);
		decorationPO.setFactPrice(paymentMoney);

		decorationDao.update(decorationPO);

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", "payment");
		result.put("orderId", orderId);
		result.put("count", count);
		result.put("money", money);
		result.put("paymentMoney", paymentMoney);
		result.put("orderTotalPrice", sumMoney);

		return result;
	}

	private String buildCcidArgs(String orderId) {

		if (orderId == null) return "";

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);

		return customerChancePO != null ? ",\"ccid\":" + customerChancePO.getCcid() : "";
	}

}
