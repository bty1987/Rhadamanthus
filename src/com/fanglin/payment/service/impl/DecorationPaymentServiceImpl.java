/**
 * @File Name		: DecorationPaymentServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.po.PaymentScaleItemPO;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.DecorationReceiptVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("decorationPaymentService")
@Transactional(readOnly = true)
public class DecorationPaymentServiceImpl implements DecorationPaymentService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private DecorationReceiptDao decorationReceiptDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvancePaymentService advancePaymentService;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private NormtionService normtionService;

	@Autowired
	private ServiceRecordDao serviceRecordDao;

	@Autowired
	private PaymentScaleItemDao paymentScaleitemDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private PaytranService paytranService;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private PaymentTypeDao paymentTypeDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Autowired
	private DingTalkMessageService messageDDService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Override
	public void pageDecorationPayment(Paging paging, List<Filter> filters, DecorationPaymentVO decorationPaymentVO, Integer company) throws FLException {

		if (filters.size() == 0) return;

		filters.add(new Filter("company", String.valueOf(company), "eq"));

		if (decorationPaymentVO != null) decorationPaymentVO.filter(filters);

		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.pageDecorationPayment(paging, filters);

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			decorationPaymentVOs.add(decorationPaymentPO.ptv(new DecorationPaymentVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		paging.setData(decorationPaymentVOs);
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderId(DecorationPaymentVO decorationPaymentVO, List<Filter> filters, Integer company) throws FLException {

		String orderId = decorationPaymentVO.getDecoration().getOrderId();
		Short oneType = decorationPaymentVO.getOneType();
		Short paymentStatus = decorationPaymentVO.getPaymentStatus();

		if (orderId == "") return null;

		if (orderId != null && orderId != "") {
			filters.add(new Filter("decoration.orderId", orderId, "eq"));
		}

		if (oneType != null) {
			filters.add(new Filter("oneType", String.valueOf(oneType), "eq"));
		}

		if (paymentStatus != null) {
			filters.add(new Filter("paymentStatus", String.valueOf(paymentStatus), "eq"));
		}

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(filters);
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			decorationPaymentVOs.add(decorationPaymentPO.ptv(new DecorationPaymentVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return decorationPaymentVOs;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForContractByOrderId(DecorationPaymentVO decorationPaymentVO) {

		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPaymentVO.getDecoration().getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			decorationPaymentVOs.add(decorationPaymentPO.ptv(new DecorationPaymentVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return decorationPaymentVOs;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForNotInitByDrId(DecorationReceiptVO decorationReceiptVO) {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForNotInit(decorationReceiptVO.getDrId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			decorationPaymentVOs.add(decorationPaymentPO.ptv(new DecorationPaymentVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return decorationPaymentVOs;
	}

	@Override
	public DecorationPaymentVO queryDecorationPaymentByDpid(DecorationPaymentVO decorationPaymentVO) {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		return decorationPaymentPO.ptv(new DecorationPaymentVO());
	}

	@Override
	public void checkDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException {

		DecorationPaymentPO decorationPayment = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPayment.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(150008, "款项不能进行收款");
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationPaymentVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<String> paymentTypes = Arrays.asList(DecorationPaymentPO.PAYMENTTYPE_ADD_STR, DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR, DecorationPaymentPO.PAYMENTTYPE_ADVANCE_STR, DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR, DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);

		PaymentTypePO paymentTypePO = paymentTypeDao.get(decorationPaymentVO.getPtid());

		if (paymentTypePO == null) {
			throw new FLException(130091, "款项类型不存在");
		}

		if (paymentTypes.contains(paymentTypePO.getName())) {
			throw new FLException(150034, "款项类型不可用");
		}

		// 设计费金额验证
		if (DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(paymentTypePO.getName())) {
			SystemConfigPO designFeeLimitConfig = systemConfigDao.querySystemConfig("PAYMENT_DESIGN_FEE_LIMIT", decorationPO.getCompany());
			if (designFeeLimitConfig != null && designFeeLimitConfig.getValue() != null) {
				try {
					// 配置金额单位为元，转换为厘进行比较（1元 = 1000厘）
					long limitAmount = Arith.mul(Long.parseLong(designFeeLimitConfig.getValue()), 1000);
					if (decorationPaymentVO.getReferMoney() > limitAmount) {
						throw new FLException(150040, String.format("设计费金额不能超过%s元", designFeeLimitConfig.getValue()));
					}
				} catch (NumberFormatException e) {
					throw new FLException(150091, "设计费金额配置格式错误");
				}
			}
		}

		DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();
		UserPO creater = userDao.queryUserByUserId(userId);

		decorationPaymentPO.setCreater(creater);
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
		decorationPaymentPO.setPtid(decorationPaymentVO.getPtid());
		decorationPaymentPO.setPaymentType(paymentTypePO.getName());
		decorationPaymentPO.setOneType(paymentTypePO.getPaytype());
		decorationPaymentPO.setTwoType(paymentTypePO.getAtttype());
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
		decorationPaymentPO.setDecoration(decorationPO);
		decorationPaymentPO.setCompany(decorationPO.getCompany());

		decorationPaymentDao.save(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationPayment(DecorationPO decorationPO, long money, long cost, long psid, String createUserId) throws FLException {

		String orderId = decorationPO.getOrderId();
		long sumMoney = Arith.mul(Arith.div(money, 1000000), 1000000);

		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT };

		int company = decorationPO.getCompany();

		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		if (decorationPayments != null && decorationPayments.size() > 0) {
			throw new FLException(150001, "款项已付,不可修改");
		}

		List<PaymentScaleItemPO> paymentScaleItems = paymentScaleitemDao.queryPaymentScaleItemByPsid(psid);

		if (paymentScaleItems.size() <= 0) {
			throw new FLException(150093, "款项比例不正确");
		}

		UserPO creater = userDao.queryUserByUserId(createUserId);

		// 校验:atttype=1(线上)物品必须恰好1件
		if (decorationActivityItemDao.countDecorationActivityItem(orderId, DecorationActivityItemPO.ATTTYPE_ONLINE_INT) > 1) {
			throw new FLException(140103, "活动物品数量超限");
		}

		// 自动核销:atttype=1(线上)未核销的物品,签约时强制核销
		decorationActivityItemDao.banchDecorationActivityItem(orderId, DecorationActivityItemPO.ATTTYPE_ONLINE_INT, DecorationActivityItemPO.STATUS_VERIFY_INT, Arrays.asList(DecorationActivityItemPO.STATUS_VERIFY_INT), creater.getUid());

		// 刷新Session:确保原生SQL的UPDATE落库并清空一级缓存中可能存在的旧状态,避免后续amount统计读不到或被脏缓存覆盖
		decorationActivityItemDao.flush();

		// 获取当前订单的活动项的总额
		long couponCut = decorationActivityItemDao.amountDecorationActivityItem(orderId, DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		// 生成款项金额 = 提交额 - 优惠额 , 装修单签单额 = 提交额
		long paymentMoney = Arith.sub(sumMoney, couponCut);

		decorationPaymentDao.deleteDecorationPaymentForBase(orderId);

		if (paymentScaleItems.size() == 1) {

			PaymentScaleItemPO scaleItem = paymentScaleItems.get(0);

			DecorationPaymentPO decorationPayment = new DecorationPaymentPO();

			int all = scaleItem.getScale();

			decorationPayment.setReferMoney(Arith.div(Arith.mul(paymentMoney, all), 100000));
			decorationPayment.setPtid(paymentScaleItems.get(0).getPtid());
			decorationPayment.setPaymentType(paymentScaleItems.get(0).getName());
			decorationPayment.setSort(scaleItem.getSort());
			decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationPayment.setCreater(creater);
			decorationPayment.setDecoration(decorationPO);
			decorationPayment.setCompany(company);

			decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
			decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
			decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);

			decorationPaymentDao.save(decorationPayment);
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
		}

		SystemConfigPO ptid = systemConfigDao.querySystemConfig("PAYMENT_TYPE_SUPROFIT_INT", company);

		if (cost > 0 && ptid != null) {
			DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
			PaymentTypePO paymentType = paymentTypeDao.get(Long.parseLong(ptid.getValue()));

			decorationPayment.setReferMoney(Arith.mul(Arith.div(cost, 1000000), 1000000));
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
		}

		decorationPO.setOrderTotalPrice(sumMoney);
		decorationPO.setFactPrice(paymentMoney);

		decorationDao.update(decorationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeDecorationPaymentForTime(DecorationPaymentVO decorationPaymentVO, Timestamp dateTime, String userId) throws FLException {

		Timestamp oldDateTime = null;
		Timestamp oldConfirmTime = null;

		String orderId = decorationPaymentVO.getDecoration().getOrderId();
		String paymentType = decorationPaymentVO.getPaymentType();

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPayment(orderId, paymentType);
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if (decorationPaymentPO != null && (DecorationPaymentPO.PAYMENTSTATUS_PAY_INT == (decorationPaymentPO.getPaymentStatus()) || DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT == (decorationPaymentPO.getPaymentStatus()))) {
			oldDateTime = decorationReceiptPO.getCollectTime();

			decorationReceiptPO.setCollectTime(dateTime);

			if (decorationReceiptPO.getConfirmTime() == null) {
				throw new FLException(150036, "款项状态不可操作");
			}

			if (decorationReceiptPO.getConfirmTime().before(dateTime)) {
				oldConfirmTime = decorationReceiptPO.getConfirmTime();

				decorationReceiptPO.setConfirmTime(dateTime);
			}

			decorationReceiptDao.update(decorationReceiptPO);
			decorationPaymentDao.update(decorationPaymentPO);

			String info = String.format("订单编号:%s,修改款项类型:%s,原收款时间:%s,修改时间为:%s", orderId, paymentType, oldDateTime.toString(), dateTime);

			if (oldConfirmTime != null) {
				info = String.format("%s,原确认时间:%s", info, oldConfirmTime.toString());
			}

			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_CHANGE_PAYMENT_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(info);

			serviceRecordDao.save(serviceRecordPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int settleDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId, Integer company) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		decorationPaymentVO.setReferMoney(decorationPaymentPO.getReferMoney());
		decorationPaymentVO.setAdvance(decorationPaymentPO.getReferMoney());

		collectDecorationPayment(decorationPaymentVO, null, userId, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectDecorationPayment(DecorationPaymentVO decorationPaymentVO, List<Long> ptids, String userId, Integer company) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		String orderId = decorationPaymentPO.getDecoration().getOrderId();
		short sort = decorationPaymentPO.getSort();

		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

		if (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT != decorationPaymentPO.getPaymentStatus()) {
			throw new FLException(150036, "款项状态不可操作");
		}

		// 装修款收款过程利用排序字段控制收款顺序
		if (sort > 1) {

			DecorationPaymentPO prevDecorationPaymentPO = decorationPaymentDao.queryDecorationPayment(orderId, (short) (sort - 1));

			if (prevDecorationPaymentPO != null && prevDecorationPaymentPO.getPaymentStatus() == (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT)) {
				throw new FLException(150009, "前置款项未处理");
			}
		}

		DecorationPO decorationPO = decorationPaymentPO.getDecoration();

		PaymentTypePO paymentTypePO = paymentTypeDao.get(decorationPaymentPO.getPtid());

		if (paymentTypePO != null) {
			if (decorationPO.getPaySacle() < paymentTypePO.getPayScale()) {
				throw new FLException(120018, "装修款比例不足");
			}

			if (decorationPO.getSaleScale() < paymentTypePO.getSaleScale()) {
				throw new FLException(120033, "销售比例不足");
			}
		}

		// int count1 = decorationPaymentDao.countDecorationPayment(orderId, Arrays.asList(DecorationPaymentPO.ONETYPE_ADD_INT), Arrays.asList(DecorationPaymentPO.TWOTYPE_DEAL_INT), Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT));
		// int count2 = decorationPaymentDao.countDecorationPayment(orderId, new ArrayList<Short>(), Arrays.asList(DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT), Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT));
		//
		// if (decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_DEAL_INT && count1 == 1 && count2 > 0) {
		// throw new FLException(140098, "增减款状态不可操作");
		// } 验证尾款交款过程以及增项款是否已交款

		if (decorationPO.getStatus() == DecorationPO.STATUS_INIT_INT) {
			decorationPO.setStatus(DecorationPO.STATUS_DEPOSIT_INT);
			decorationPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
			// 生成消息提示数据
			messageQueuingDao.save(new MessageCueuingPO().init(orderId, "collectDecorationPayment", "{\"orderId\":\"" + orderId + "\",\"dpid\":" + decorationPaymentVO.getDpid() + ",\"userId\":\"" + userId + ",\"event\":\"PAYMENT_COLLECTED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		}

		String paymentType = decorationPaymentPO.getPaymentType();

		// 设计费收款时生成消息提示数据
		if (paymentType.equals(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR)) {
			messageQueuingDao.save(new MessageCueuingPO().init(orderId, "collectDecorationPayment", "{\"orderId\":\"" + orderId + "\",\"dpid\":" + decorationPaymentVO.getDpid() + ",\"userId\":\"" + userId + ",\"event\":\"PAYMENT_COLLECTED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		}

		if (paymentType.contains(DecorationPaymentPO.PAYMENTTYPE_REFUND_STR) || paymentType.equals(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR)) {
			decorationReceiptPO.setType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);
		} else {
			decorationReceiptPO.setType(DecorationReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}

		long amount = decorationReceiptPO.fillup(decorationPaymentVO);

		if (decorationPaymentPO.getReferMoney() != amount) {
			throw new FLException(150008, "款项不能进行收款");
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		UserPO collecter = userDao.queryUserByUserId(userId);

		decorationReceiptPO.setCollecter(collecter);
		decorationReceiptPO.setCollecterName(collecter.getCurrentName());
		decorationReceiptPO.setComment(decorationPaymentVO.getComment());

		decorationReceiptDao.save(decorationReceiptPO);

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);
		decorationPaymentPO.setCompany(company);

		decorationPaymentDao.update(decorationPaymentPO);
		decorationPaymentDao.flush();

		// 更新装修单上的付款比例
		if (decorationPaymentPO.getOneType() == DecorationPaymentPO.ONETYPE_ADD_INT && decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_DEAL_INT) {
			decorationAdditionService.updateDecorationForPayScale(new DecorationVO(decorationPO.getOrderId()));
		}

		Long advance = decorationPaymentVO.getAdvance();

		if (advance != null && advance != 0) {

			int advanceType = decorationPaymentVO.getAdvanceType();
			long customerAdvance = 0;
			Short _paymentType = 0;

			CustomerPO customerPO = decorationPO.getCustomer();

			if (customerPO == null) {
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

			if (advancePaymentPO == null) {
				throw new FLException(150010, "预付款余额不足");
			}

			if (advanceType == DecorationPaymentPO.ADVANCETYPE_TYPE_BALANCE_INT) {
				customerAdvance = advancePaymentPO.getBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_BALANCE_INT;
			} else if (advanceType == DecorationPaymentPO.ADVANCETYPE_TYPE_PROJECT_INT) {
				customerAdvance = advancePaymentPO.getProjectBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_PROJECT_INT;
			}

			PaymentVO paymentVO = new PaymentVO();

			paymentVO = PaymentServiceImpl.advancePaymentBalance(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR, advance, _paymentType, customerAdvance, userId, decorationPaymentPO.getDecoration().getCustomer().getCid(), advancePaymentPO, decorationPO.getOrderId());

			paymentVO.setUniqueid("D" + decorationPaymentPO.getDpid());

			advancePaymentService.updateAdvancePayment(paymentVO, decorationPO.getCompany());
		}

		if (DecorationPaymentPO.TWOTYPE_ADD_REDUCE_INT == decorationPaymentPO.getTwoType()) {

			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

			if (quotationPO == null) {
				throw new FLException(200003, "报价不存在");
			}

			List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(decorationPaymentPO.getDpid());

			StringBuffer arids = new StringBuffer();

			for (AddReducePO addReducePO : addReducePOs) {

				arids.append(addReducePO.getArId()).append(",");

				addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);
				addReducePO.setSendTime(DateUtil.getDateToTimestamp(new Date()));

				addReduceDao.update(addReducePO);

				normtionService.makeNormtion(new NormtionVO(orderId, quotationPO.getQid()), new AddReduceVO(addReducePO.getArId()), addReducePO.getSchedule(), userId);
			}

			// 增项款发送群通知
			SystemConfigPO key = systemConfigDao.querySystemConfig("MESSAGE_DING_GROUP_ADDREDUCE", company);

			if (key != null) {
				messageDDService.sendMessage(key.getValue(), String.format("装修单:%s, 地址:%s %s, 完成增减项收款.", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber())));
			}

			decorationService.sendMessage(orderId, "装修单", "请您及时查收点确认增减项, 如未付款请付款。", String.format("pages/quotation/addReduce/addReduce?orderId=%s&arids=%s", orderId, arids));
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());

		// 更新销售点信息
		if (ptids != null && ptids.size() > 0) {
			paytranService.updatePaytran(ptids, decorationReceiptPO.getDrId(), PaytranPO.STATUS_USED_INT, PaytranPO.TYPE_DECORATION_INT);
		}

		if (decorationPO.getSupervisor() != null) {
			messageService.sendMessage(decorationPO.getSupervisor().getUserId(), "", String.format("订单:%s,地址:%s %s,款项金额:%.3f,%s完成收款", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()), Arith.div(decorationPaymentPO.getReferMoney(), 1000.0), decorationPaymentPO.getPaymentType()), MessagePO.TYPE_PAYMENT_INT, decorationPO.getCompany());
		}

		decorationService.sendMessage(decorationPaymentPO.getDecoration().getOrderId(), "装修单", String.format("装修交款金额%.3f元", Arith.div(decorationPaymentPO.getReferMoney(), 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=1", decorationPaymentPO.getDecoration().getOrderId(), decorationReceiptPO.getDrId()));

		// 生成消息队列数据
		// messageQueuingDao.save(new MessageQueuingPO().init(orderId, "collectDecorationPayment", "{\"orderId\":\"" + orderId + "\",\"dpid\":" + decorationPaymentVO.getDpid() + ",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId, Integer company) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		DecorationPO decorationPO = decorationPaymentPO.getDecoration();

		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

		if (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT != decorationPaymentPO.getPaymentStatus()) {
			throw new FLException(150012, "款项不能进行退款");
		}

		long amount = decorationReceiptPO.fillup(decorationPaymentVO);

		if (!(Math.abs(Arith.sub(decorationPaymentPO.getReferMoney(), amount)) < 0.00000001)) {
			throw new FLException(150013, "款项实收金额不等于应收金额");
		}

		UserPO collecter = userDao.queryUserByUserId(userId);

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		decorationReceiptPO.setCollecter(collecter);
		decorationReceiptPO.setCollecterName(collecter.getCurrentName());
		decorationReceiptPO.setComment(decorationPaymentVO.getComment());
		decorationReceiptPO.setType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);
		decorationPaymentPO.setCompany(company);

		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);

		Long advance = decorationPaymentVO.getAdvance();

		// 生成预付款数据
		if (advance != null && advance != 0) {
			paymentService.returnPayment(new PaymentVO().trans(decorationPaymentPO.getDecoration().getOrderId(), PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, decorationReceiptPO.getAdvance(), String.format("D%sR", decorationPaymentPO.getDpid()), String.format("装修单号:%s,装修预付款", decorationPaymentPO.getDecoration().getOrderId())), userId);
		}

		if (DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(decorationPaymentPO.getPaymentType())) {

			List<AddReducePO> addReducePOs = addReduceDao.queryAddReduce(decorationPaymentPO.getDpid());

			StringBuffer arids = new StringBuffer();

			for (AddReducePO addReducePO : addReducePOs) {

				arids.append(addReducePO.getArId()).append(",");

				addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);
				addReducePO.setSendTime(DateUtil.getDateToTimestamp(new Date()));

				addReduceDao.update(addReducePO);
			}

			// 减项款发送群通知
			SystemConfigPO key = systemConfigDao.querySystemConfig("MESSAGE_DING_GROUP_ADDREDUCE", company);

			if (key != null) {
				messageDDService.sendMessage(key.getValue(), String.format("装修单:%s, 地址:%s %s, 完成增减项收款.", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber())));
			}

			decorationService.sendMessage(decorationPO.getOrderId(), "装修单", "请您及时查收点确认增减项, 如未付款请付款。", String.format("pages/quotation/addReduce/addReduce?orderId=%s&arids=%s", decorationPO.getOrderId(), arids));
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());

		// 更新装修单上的付款比例
		decorationAdditionService.updateDecorationForPayScale(new DecorationVO(decorationPaymentPO.getDecoration().getOrderId()));

		decorationService.sendMessage(decorationPaymentPO.getDecoration().getOrderId(), "装修单", String.format("装修退款金额%.3f元", Arith.div(decorationPaymentPO.getReferMoney(), 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=1", decorationPaymentPO.getDecoration().getOrderId(), decorationReceiptPO.getDrId()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int withdrawDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId, Integer company) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		decorationPaymentVO.setReferMoney(decorationPaymentPO.getReferMoney());
		decorationPaymentVO.setAdvance(decorationPaymentPO.getReferMoney());

		refundDecorationPayment(decorationPaymentVO, userId, company);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundDecorationPaymentForDesign(DecorationPaymentVO decorationPaymentVO, String userId, int company) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (decorationPaymentPO.getPaymentStatus() == DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(150012, "款项不能进行退款");
		}

		String paymentTypeStr = decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_REFUND_STR;

		PaymentTypePO refundPaymentType = paymentTypeDao.queryPaymentTypeByName(paymentTypeStr, company);

		if (refundPaymentType == null) {
			throw new FLException(130091, "款项类型不存在");
		}

		UserPO collecter = userDao.queryUserByUserId(userId);
		Timestamp time = DateUtil.getDateToTimestamp(new Date());

		// 生成设计费退款收据
		DecorationReceiptPO decorationReceiptRO = new DecorationReceiptPO();

		decorationReceiptRO.setAdvance(decorationPaymentPO.getReferMoney());
		decorationReceiptRO.setAdvanceType(DecorationPaymentPO.ADVANCETYPE_TYPE_BALANCE_INT);
		decorationReceiptRO.setCollectTime(time);
		decorationReceiptRO.setCollecter(collecter);
		decorationReceiptRO.setCollecterName(collecter.getCurrentName());
		decorationReceiptRO.setType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);

		decorationReceiptDao.save(decorationReceiptRO);

		// 生成设计费退款款项数据
		DecorationPaymentPO decorationPaymentRO = new DecorationPaymentPO();

		decorationPaymentRO.setDecoration(decorationPaymentPO.getDecoration());
		decorationPaymentRO.setDecorationReceipt(decorationReceiptRO);
		decorationPaymentRO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
		decorationPaymentRO.setTwoType(decorationPaymentPO.getTwoType());
		decorationPaymentRO.setPtid(refundPaymentType.getPtid());
		decorationPaymentRO.setPaymentType(paymentTypeStr);
		decorationPaymentRO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
		decorationPaymentRO.setCreater(collecter);
		decorationPaymentRO.setCreateTime(time);
		decorationPaymentRO.setReferMoney(decorationPaymentPO.getReferMoney());
		decorationPaymentRO.setCompany(company);

		decorationPaymentDao.save(decorationPaymentRO);

		// 原设计费变成设计费历史
		decorationPaymentPO.setPaymentType(decorationPaymentPO.getPaymentType() + DecorationPaymentPO.PAYMENTTYPE_HISTORY_STR);
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_HISTORY_INT);
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_HISTORY_INT);

		decorationPaymentDao.update(decorationPaymentPO);

		// 生成预付款数据
		paymentService.returnPayment(new PaymentVO().trans(decorationPaymentRO.getDecoration().getOrderId(), PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT, decorationReceiptRO.getAdvance(), String.format("D%s", decorationReceiptRO.getDrId()), String.format("装修单号:%s,装修预付款", decorationPaymentRO.getDecoration().getOrderId())), userId);

		// 更新装修单上的付款比例
		decorationAdditionService.updateDecorationForPayScale(new DecorationVO(decorationPaymentPO.getDecoration().getOrderId()));

		decorationService.sendMessage(decorationPaymentRO.getDecoration().getOrderId(), "装修单", String.format("装修退款金额%.3f元", Arith.div(decorationPaymentRO.getReferMoney(), 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=1", decorationPaymentRO.getDecoration().getOrderId(), decorationReceiptRO.getDrId()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmDecorationPayment(List<Long> ids, String confirmUserId) throws FLException {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByDpids(ids);

		UserPO confirmer = userDao.queryUserByUserId(confirmUserId);

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {

			if (DecorationPaymentPO.PAYMENTSTATUS_PAY_INT != decorationPaymentPO.getPaymentStatus()) continue;

			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

			decorationReceiptPO.setConfirmer(confirmer);
			decorationReceiptPO.setCollecterName(confirmer.getCurrentName());
			decorationReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

			if (decorationReceiptPO.getStatus() != DecorationReceiptPO.STATUS_CONFIRM_INT) {
				decorationReceiptPO.setStatus(DecorationReceiptPO.STATUS_CONFIRM_INT);
			}

			decorationReceiptDao.update(decorationReceiptPO);

			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT);

			decorationPaymentDao.update(decorationPaymentPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmDecorationPayment(DecorationPaymentVO decorationPaymentVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationPaymentVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (decorationPaymentVO.getDecoration().getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			decorationPaymentVO.getDecoration().getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (decorationPaymentVO.getDecoration().getCustomer().getPhone() != null && !SensitiveDataHelper.decrypt(decorationPO.getCustomer().getPhone()).equals(decorationPaymentVO.getDecoration().getCustomer().getPhone())) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationPaymentVO.getDecoration().getCustomer().getNo());

		if (decorationPaymentVO.getDecoration().getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		decorationPaymentPO.setIsAffirm(DecorationPaymentPO.ISAFFIRM_CONFIRM_SHORT);
		decorationPaymentPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

		decorationPaymentDao.update(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if (DecorationPaymentPO.PAYMENTSTATUS_PAY_INT != decorationPaymentPO.getPaymentStatus()) {
			throw new FLException(150036, "款项状态不可操作");
		}

		long amount = decorationReceiptPO.fillup(decorationPaymentVO);

		if (decorationPaymentPO.getReferMoney() != amount) {
			throw new FLException(150025, "款项金额不正确");
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());

		decorationReceiptDao.update(decorationReceiptPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (decorationPaymentPO.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		decorationReceiptDao.delete(decorationPaymentPO);

		return 0;
	}

	@Override
	public void sendDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		String orderId = decorationPaymentPO.getDecoration().getOrderId();

		short sort = decorationPaymentPO.getSort();

		// 装修款收款过程利用排序字段控制收款顺序
		if (sort > 1) {
			DecorationPaymentPO prevDecorationPaymentPO = decorationPaymentDao.queryDecorationPayment(orderId, (short) (sort - 1));

			if (prevDecorationPaymentPO != null) {
				if (prevDecorationPaymentPO.getPaymentStatus() == (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT)) {
					throw new FLException(150009, "前置款项未处理");
				}
			}
		}

		decorationService.sendMessage(orderId, "装修收款", String.format("装修待付款金额%.3f元", Arith.div(decorationPaymentPO.getReferMoney(), 1000.0)), String.format("pages/payment/redirect/redirect?orderId=%s&pid=%s&paymentType=1&atttype=0", orderId, decorationPaymentPO.getDpid()));
	}

	@Override
	public void pushDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		String orderId = decorationPaymentPO.getDecoration().getOrderId();

		decorationService.sendMessage(orderId, "装修收款", String.format("装修待付款金额%.3f元", Arith.div(decorationPaymentPO.getReferMoney(), 1000.0)), String.format("pages/payment/confirm/confirm?orderId=%s&pid=%s&paymentType=1", orderId, decorationPaymentPO.getDpid()));
	}

}
