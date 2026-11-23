/**
 * @File Name		: A20261025ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP预签/签约/款项同步服务实现
 */

package com.fanglin.seiya.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
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
import com.fanglin.data.quotation.dao.PresignProduceDao;
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
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.AddReduceService;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesRefundsDao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.seiya.service.A20261025Service;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

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

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private PresignProduceDao presignProduceDao;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesRefundsDao salesRefundsDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private AddReduceService addReduceService;

	/**
	 * NERP凭空预签（原 A20261024Action.syncProsignForNerp, 2026-10-25 合并入本类）
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncProsignForNerp(String orderId, ProtationVO protation, Long qvid, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		if (operater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		// 预签产品挂接校验（>0 时须存在, 防垃圾外键）
		Long ppid = protation.getPpid();

		if (ppid != null && ppid.longValue() > 0 && presignProduceDao.get(ppid.longValue()) == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		// 报价版本挂接校验（>0 时须存在, 防垃圾外键）
		QuotationVersionPO versionPO = null;

		if (qvid != null && qvid.longValue() > 0) {
			versionPO = quotationVersionDao.get(qvid.longValue());

			if (versionPO == null) {
				throw new FLException(200050, "报价版本不存在");
			}
		}

		if (protationDao.queryProtationForDefaultByOrderId(orderId) != null) {
			throw new FLException(400044, "预签单已存在");
		}

		long precontractPrice = protation.getTotalPrice() == null ? 0 : protation.getTotalPrice().longValue();

		if (protation.getName() == null || protation.getName().trim().isEmpty()) {
			protation.setName("预签单");
		}

		if (protation.getQuotePrice() == null) {
			protation.setQuotePrice(protation.getTotalPrice());
		}

		// 凭空创建无明细的锁定预签单（业务字段按VO回填, 未传字段保持PO缺省0; 明细不生成）
		ProtationPO protationPO = new ProtationPO();

		BeanUtil.copyPropertie(protation, protationPO, Arrays.asList("pid", "orderId", "createTime", "creater", "version", "status", "defaults", "decoration"));

		protationPO.setOrderId(orderId);

		if (ppid == null || ppid.longValue() <= 0) {
			protationPO.setPpid(0);
		}

		protationPO.setCreater(operater);
		protationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		protationPO.setStatus(ProtationPO.STATUS_LOCK_INT);
		protationPO.setDefaults(ProtationPO.DEFAULT_DEFAULT_INT);

		if (versionPO != null) {
			protationPO.setVersion(versionPO);
		}

		protationDao.save(protationPO);

		// 更新归属信息的部门和大区, 更新附加信息（同 presignDecorationContract）
		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (decorationAdditionPO != null) {

			decorationAdditionPO.clearDesign();
			decorationAdditionPO.clearSales();

			for (DecorationBelongPO decorationBelongPO : designers) {

				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setDesign(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				decorationBelongDao.update(decorationBelongPO);
			}

			for (DecorationBelongPO decorationBelongPO : salesmans) {

				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setSales(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				decorationBelongDao.update(decorationBelongPO);
			}

			decorationAdditionDao.update(decorationAdditionPO);
		}

		decorationPO.setPrecontractPrice(precontractPrice);
		decorationPO.setPrecontractTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setStatus(DecorationPO.STATUS_PROSIGN_INT); // 预签

		decorationDao.update(decorationPO);

		decorationOperateDao.save(new DecorationOperatePO().prosign(orderId, operater)); // 创建装修单操作信息

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "presignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "presignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", "prosign");
		result.put("orderId", orderId);
		result.put("pid", protationPO.getPid());
		result.put("name", protationPO.getName());
		result.put("precontractPrice", precontractPrice);

		return result;
	}

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
	public Map<String, Object> syncQuotationForNerp(String orderId, String quotationName, Long qvid, Long totalPrice, Integer discount, Long couponCut, Long thingCut, Long factPrice, Long orderTotalPrice, Long quotationPrice, String userId) throws FLException {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {

			// 已签约(3): 幂等跳过返回(2026-11-24 移除 140005 阻断——NERP 重推不被卡, 不重复执行提成挂账/归属回刷/签约消息副作用)
			if (decorationPO.getStatus() == DecorationPO.STATUS_SIGNED_INT) {

				Map<String, Object> exists = new HashMap<String, Object>();

				exists.put("success", true);
				exists.put("operation", "exists");
				exists.put("orderId", orderId);
				exists.put("orderTotalPrice", decorationPO.getOrderTotalPrice());

				return exists;
			}

			throw new FLException(140005, "订单合同不能修改");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		if (operater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		boolean quotationCreated = false;

		if (quotationPO == null) { // 凭空创建: 无明细初始报价单, 不锁单/不推进状态(建法同签约接口)

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

		} else { // 更新默认报价单: 传参字段部分更新(null 不动); 锁定报价单同样放行(NERP 迁移补数据场景, 2026-11-24 移除锁定拦截)

			if (quotationName != null && !quotationName.trim().isEmpty()) {
				quotationPO.setName(quotationName.trim());
			}

			if (qvid != null && qvid.longValue() > 0) {

				QuotationVersionPO versionPO = quotationVersionDao.get(qvid.longValue());

				if (versionPO == null) {
					throw new FLException(200050, "报价版本不存在");
				}

				quotationPO.setVersion(versionPO);
			}

			if (totalPrice != null) {
				quotationPO.setTotalPrice(totalPrice.longValue());
				quotationPO.setUndisPrice(totalPrice.longValue());
				quotationPO.setDisPrice(totalPrice.longValue());
			}

			if (discount != null) {
				quotationPO.setDiscount(discount.intValue());
			}

			quotationPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

			quotationDao.update(quotationPO);

			// 装修单优惠/金额信息同步(传入即写, null 不动): 列语义照原生维护口径——
			// quotationPrice=默认报价总价回写(updateQuotationForAdvance 口径, 连带 discount 由报价单列已有传入支持),
			// couponCut/thingCut=活动项统计值(NERP 场景无 activityitem 行, 由 NERP 侧核算直传),
			// factPrice=成交价(原生口径=orderTotalPrice-couponCut, NERP 直传终值), orderTotalPrice=签约合同额
			if (couponCut != null) decorationPO.setCouponCut(couponCut.longValue());
			if (thingCut != null) decorationPO.setThingCut(thingCut.longValue());
			if (factPrice != null) decorationPO.setFactPrice(factPrice.longValue());
			if (orderTotalPrice != null) decorationPO.setOrderTotalPrice(orderTotalPrice.longValue());
			if (quotationPrice != null) decorationPO.setQuotationPrice(quotationPrice.longValue());
			if (couponCut != null || thingCut != null || factPrice != null || orderTotalPrice != null || quotationPrice != null) {
				decorationDao.update(decorationPO);
			}
		}

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", "syncQuotation");
		result.put("orderId", orderId);
		result.put("qid", quotationPO.getQid());
		result.put("quotationCreated", quotationCreated);
		result.put("name", quotationPO.getName());
		result.put("totalPrice", quotationPO.getTotalPrice());
		result.put("discount", quotationPO.getDiscount());
		result.put("couponCut", decorationPO.getCouponCut());
		result.put("thingCut", decorationPO.getThingCut());
		result.put("factPrice", decorationPO.getFactPrice());
		result.put("orderTotalPrice", decorationPO.getOrderTotalPrice());
		result.put("quotationPrice", decorationPO.getQuotationPrice());

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

		// 款项已付/审批中: 幂等跳过返回(2026-11-24 移除 150001 阻断——NERP 重推不被卡, 已收合同款项行保护不变, 全删重建不执行)
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT };

		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderId(orderId, paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		if (decorationPayments != null && decorationPayments.size() > 0) {

			Map<String, Object> exists = new HashMap<String, Object>();

			exists.put("success", true);
			exists.put("operation", "exists");
			exists.put("orderId", orderId);
			exists.put("count", decorationPayments.size());
			exists.put("money", money);
			exists.put("orderTotalPrice", decorationPO.getOrderTotalPrice());

			return exists;
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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncSalesPaymentForNerp(String orderId, String salesNo, String paymentNo, Short type, Long money, Long bid, String supplierUid, String salesmanUid, String instorerUid, String guiderUid, Long salesAmount, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (salesNo == null || salesNo.trim().isEmpty() || paymentNo == null || paymentNo.trim().isEmpty()) {
			throw new FLException(400046, "NERP单号不能为空");
		}

		if (type == null || (type != SalesPaymentPO.TYPE_DEPOSIT_INT && type != SalesPaymentPO.TYPE_REPLENISHMENT_INT && type != SalesPaymentPO.TYPE_REFUNDS_INT)) {
			throw new FLException(400045, "款项类型无效");
		}

		if (money == null || money.longValue() <= 0) {
			throw new FLException(150100, "款项金额必须大于0");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		if (creater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		String salesKey = "NERP:" + salesNo.trim();

		// 款项幂等: 同销售单(NERP单号锚)+同类型+同金额+待收/待退 精等, NERP 重试命中直接返回既有记录
		for (SalesPaymentPO payment : salesPaymentDao.querySalesPaymentByOrderId(orderId, null)) {

			if (payment.getType() == type && payment.getStatus() == SalesPaymentPO.STATUS_INITIAL_INT && payment.getReferMoney() == money.longValue() && payment.getSales() != null && salesKey.equals(payment.getSales().getComment())) {

				Map<String, Object> exists = new HashMap<String, Object>();

				exists.put("operation", "exists");
				exists.put("sid", payment.getSales().getSid());
				exists.put("no", payment.getSales().getNo());
				exists.put("spid", payment.getSpid());
				if (payment.getSalesRefunds() != null) exists.put("rid", payment.getSalesRefunds().getRid());
				exists.put("orderId", orderId);
				exists.put("type", type);
				exists.put("money", money);

				return exists;
			}
		}

		// 销售单判断补充(补全单据): sales.comment 嵌 NERP 销售单号查重, 命中复用, 未命中凭空创建(照 addSales 口径)
		SalesPO salesPO = null;

		for (SalesPO sales : salesDao.querySalesByOrderId(orderId)) {

			if (salesKey.equals(sales.getComment())) {
				salesPO = sales;
				break;
			}
		}

		String operation;

		if (salesPO == null) {

			if (bid == null || bid.longValue() <= 0) {
				throw new FLException(130077, "品牌不存在");
			}

			BrandPO brandPO = brandDao.get(bid);

			if (brandPO == null) {
				throw new FLException(130077, "品牌不存在");
			}

			UserPO supplier = userDao.queryUserByUserId(supplierUid);
			UserPO salesman = userDao.queryUserByUserId(salesmanUid);
			UserPO instorer = userDao.queryUserByUserId(instorerUid);
			UserPO guider = userDao.queryUserByUserId(guiderUid);

			if (supplier == null || salesman == null || instorer == null || guider == null) {
				throw new FLException(190005, "人员不存在");
			}

			CompanyPO companyPO = companyDao.get(decorationPO.getCompany());

			if (companyPO == null) {
				throw new FLException(230015, "公司不存在");
			}

			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_SALES_INT, DateUtil.current("yyMMdd").toString(), decorationPO.getCompany());

			String no = companyPO.getShortname() + DateUtil.current("yyMMdd") + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

			// amount/total = 销售单商品总额属性(单据维度), 非款项累计; 缺省取首笔 money
			long amount = salesAmount == null || salesAmount.longValue() <= 0 ? money.longValue() : salesAmount.longValue();

			salesPO = new SalesPO();

			salesPO.setNo(no);
			salesPO.setOrderId(orderId);
			salesPO.setSalesman(salesman);
			salesPO.setDept(decorationPO.getDesignDept());
			salesPO.setRegion(decorationPO.getDesignDept() == null ? null : decorationPO.getDesignDept().getFatherDept());
			salesPO.setCreater(creater);
			salesPO.setSupplier(supplier);
			salesPO.setInstorer(instorer);
			salesPO.setGuider(guider);
			salesPO.setGuideDept(guider.getDept());
			salesPO.setHouse(decorationPO.getHouse());
			salesPO.setCustomer(decorationPO.getCustomer());
			salesPO.setBrand(brandPO);
			salesPO.setCategory(brandPO.getCategory().getName());
			salesPO.setAmount(amount);
			salesPO.setTotal(amount);
			salesPO.setMaling(0);
			salesPO.setVenderMaling(0);
			salesPO.setDepositpay(0);
			salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
			salesPO.setFullpay(0);
			salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);
			salesPO.setType((short) 0);
			salesPO.setCompany(decorationPO.getCompany());
			salesPO.setDompany(decorationPO.getCompany());
			salesPO.setPompany(decorationPO.getCompany());
			salesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesPO.setComment(salesKey);

			salesDao.save(salesPO);

			operation = "add";
		} else {
			operation = "update";
		}

		// 款项落行(待收/待退): 补全单据语义, 收款/退款动作在 ERP 走正常流程(collect/refundsSalesPayment 承接状态推进与收据)
		SalesPaymentPO salesPaymentPO = new SalesPaymentPO();

		salesPaymentPO.setSales(salesPO);
		salesPaymentPO.setOrderId(orderId);
		salesPaymentPO.setType(type);
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_INITIAL_INT);
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand() == null ? "" : salesPO.getBrand().getName());
		salesPaymentPO.setCreater(creater);
		salesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPaymentPO.setReferMoney(money);
		salesPaymentPO.setCompany(salesPO.getPompany());

		salesPaymentDao.save(salesPaymentPO);

		Long rid = null;

		// 退款(4): 凭空生成退货单(照审批物化口径, 待退态), spid 回填+关联款项, 退款执行走 ERP refundSalesPayment
		if (type == SalesPaymentPO.TYPE_REFUNDS_INT) {

			SalesRefundsPO salesRefundsPO = new SalesRefundsPO();

			salesRefundsPO.setSales(salesPO);
			salesRefundsPO.setSpid(salesPaymentPO.getSpid());
			salesRefundsPO.setTotal(money);
			salesRefundsPO.setType((short) 0);
			salesRefundsPO.setStatus(SalesRefundsPO.STATUS_TYPE_REFUNDS_INT);
			salesRefundsPO.setIsAffirm(SalesRefundsPO.ISAFFIRM_NONE_INT);
			salesRefundsPO.setCreater(creater);
			salesRefundsPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			salesRefundsPO.setComment("NERP:" + paymentNo.trim());

			salesRefundsDao.save(salesRefundsPO);

			salesPaymentPO.setSalesRefunds(salesRefundsPO);

			salesPaymentDao.update(salesPaymentPO);

			rid = salesRefundsPO.getRid();
		}

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("operation", operation);
		result.put("sid", salesPO.getSid());
		result.put("no", salesPO.getNo());
		result.put("spid", salesPaymentPO.getSpid());
		if (rid != null) result.put("rid", rid);
		result.put("orderId", orderId);
		result.put("type", type);
		result.put("money", money);

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncAddreduceForNerp(String orderId, String arNo, Short type, Long money, String content, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (arNo == null || arNo.trim().isEmpty()) {
			throw new FLException(400046, "NERP单号不能为空");
		}

		if (type == null || (type != AddReducePO.TYPE_ADD_INT && type != AddReducePO.TYPE_REDUCE_INT)) {
			throw new FLException(400045, "销售款项类型无效");
		}

		if (money == null || money.longValue() <= 0) {
			throw new FLException(150100, "款项金额必须大于0");
		}

		if (content == null || content.trim().isEmpty()) {
			throw new FLException(400047, "增减明细不能为空");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		if (creater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		// 幂等锚: content 嵌 NERP 单号前缀, NERP 重试报文一致即精等命中
		String contentKey = "NERP:" + arNo.trim() + " " + content.trim();

		// 增减单判断补充: 命中复用(已提交直接返回), 未命中经 addAddReduce 凭空创建后提交落款
		AddReducePO existed = null;

		for (AddReducePO addReducePO : addReduceDao.queryAddReduceByOrderId(orderId)) {

			if (contentKey.equals(addReducePO.getContent())) {
				existed = addReducePO;
				break;
			}
		}

		long arId;
		long dpId;

		if (existed != null && existed.getDpId() != 0) {

			// 改单防御: 同 NERP 单号重推但类型/金额与首笔不一致, 拒绝处理(款项已落, 不支持改单)
			if (existed.getType() != type || existed.getTotal() != money.longValue()) {
				throw new FLException(200061, "增减单状态不可操作");
			}

			arId = existed.getArId();
			dpId = existed.getDpId();

			Map<String, Object> exists = new HashMap<String, Object>();

			exists.put("operation", "exists");
			exists.put("arId", arId);
			exists.put("dpId", dpId);
			exists.put("orderId", orderId);
			exists.put("type", type);
			exists.put("money", money);
			exists.put("paymentMoney", decorationPaymentDao.get(dpId).getReferMoney());

			return exists;
		}

		if (existed == null) {

			AddReduceVO addReduceVO = new AddReduceVO();

			addReduceVO.setOrderId(orderId);
			addReduceVO.setType(type);
			addReduceVO.setPaytype(AddReducePO.PAYTYPE_PAY_INT);
			addReduceVO.setContent(contentKey);

			addReduceService.addAddReduce(addReduceVO, userId);

			for (AddReducePO addReducePO : addReduceDao.queryAddReduceByOrderId(orderId)) {

				if (contentKey.equals(addReducePO.getContent())) {
					existed = addReducePO;
					break;
				}
			}

			if (existed == null) {
				throw new FLException(200060, "增减单不存在");
			}

			existed.setTotal(money);

			addReduceDao.update(existed);
		}

		arId = existed.getArId();

		// 提交链落装修款项(paymentType=增项款/减项款, twoType=增减款, referMoney 取整千元, dpId 回写, 变更记录埋点)
		AddReduceVO submitVO = new AddReduceVO();

		submitVO.setOrderId(orderId);

		AddReduceVO itemVO = new AddReduceVO();

		itemVO.setArId(arId);

		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		addReduceVOs.add(itemVO);

		addReduceService.submitAddReduce(submitVO, addReduceVOs, userId);

		// 提交后回读 dpId 与实际落库款项金额(原版口径取整千元, 与入参 money 可能存在零头差)
		dpId = addReduceDao.get(arId).getDpId();

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("operation", existed.getDpId() == 0 ? "add" : "update");
		result.put("arId", arId);
		result.put("dpId", dpId);
		result.put("orderId", orderId);
		result.put("type", type);
		result.put("money", money);
		result.put("paymentMoney", decorationPaymentDao.get(dpId).getReferMoney());

		return result;
	}

	private String buildCcidArgs(String orderId) {

		if (orderId == null) return "";

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);

		return customerChancePO != null ? ",\"ccid\":" + customerChancePO.getCcid() : "";
	}

}
