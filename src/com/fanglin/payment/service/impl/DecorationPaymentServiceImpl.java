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
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.po.PaymentScaleItemPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.DecorationReceiptVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

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
	private AddReduceDao addReduceDao;

	@Autowired
	private ServiceRecordDao serviceRecordDao;

	@Autowired
	private PaymentScaleItemDao paymentScaleitemDao;

	@Autowired
	private MessageService messageService;
	
	@Autowired
	private DecorationService decorationService;

	@Override
	public void pageDecorationPaymentForCommit(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0)
			return;

		filters.add(new Filter("paymentStatus", String.valueOf(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT), "eq"));

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		pageDecorationPayment(paging, filters);
	}

	@Override
	public void pageDecorationPaymentForHistory(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0)
			return;

		filters.add(new Filter("paymentStatus", String.valueOf(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT), "ne"));

		if (SystemConfig.getInt("multicompany", 0) != 0) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		pageDecorationPayment(paging, filters);
	}

	@Override
	public void pageDecorationPaymentForCollect(Paging paging, List<Filter> filters, Integer company) {

		if (filters.size() == 0)
			return;

		filters.add(new Filter("paymentStatus", String.valueOf(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT), "eq"));
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		pageDecorationPayment(paging, filters);
	}

	@Override
	public void pageDecorationPaymentForConfirm(Paging paging, List<Filter> filters, Integer company) {

		if (filters.size() == 0)
			return;

		filters.add(new Filter("paymentStatus", String.valueOf(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT), "eq"));
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		pageDecorationPayment(paging, filters);
	}

	@Override
	public DecorationPaymentVO queryDecorationPaymentById(DecorationPaymentVO decorationPaymentVO) {
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());
		DecorationPaymentVO decorationPayment = new DecorationPaymentVO(new DecorationVO());

		BeanUtil.copyProperties(decorationPaymentPO, decorationPayment, Arrays.asList("decoration", "creater", "collecter", "confirmer"));
		decorationPaymentPO.getDecoration().ptvcascade(decorationPayment.getDecoration());

		return decorationPaymentVO;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderId(DecorationPaymentVO decorationPaymentVO) {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPaymentVO.getDecoration().getOrderId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			DecorationPaymentVO _decorationPaymentVO = changePOToVO(decorationPaymentPO);

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForContractByOrderId(DecorationPaymentVO decorationPaymentVO) {

		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPaymentVO.getDecoration().getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			DecorationPaymentVO _decorationPaymentVO = changePOToVO(decorationPaymentPO);

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForNotInitByDrId(DecorationReceiptVO decorationReceiptVO) {

		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForNotInitByDrId(decorationReceiptVO.getDrId());

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO(new DecorationVO());
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO, Arrays.asList("decoration", "creater", "collecter", "confirmer"));
			decorationPaymentPO.getDecoration().ptvcascade(_decorationPaymentVO.getDecoration());
			DecorationReceiptPO decorationReceipt = decorationPaymentPO.getDecorationReceipt();
			if (decorationReceipt != null) {
				_decorationPaymentVO.setCollecter(new UserBaseVO());
				BeanUtil.copyProperties(decorationReceipt.getCollecter(), _decorationPaymentVO.getCollecter(), Arrays.asList("dept", "duty"));
			}

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
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
			throw new FLException(140013, "订单不存在");
		}

		List<String> status = Arrays.asList(DecorationPaymentPO.PAYMENTTYPE_ADD_STR, DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR, DecorationPaymentPO.PAYMENTTYPE_ADVANCE_STR, DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR, DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);

		if (status.contains(decorationPaymentVO.getPaymentType())) {
			throw new FLException(150034, "款项类型不可用");
		}

		DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();

		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		UserPO user = userDao.queryUserByUserId(userId);
		decorationPaymentPO.setCreater(user);
		decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
		decorationPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
		decorationPaymentPO.setOneType(decorationPaymentVO.getOneType());
		decorationPaymentPO.setTwoType(decorationPaymentVO.getTwoType());
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
		decorationPaymentPO.setDecoration(decorationPO);
		decorationPaymentPO.setCompany(decorationPO.getCompany());

		decorationPaymentDao.save(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationPayment(DecorationPaymentVO decorationPaymentVO, String createUserId) throws FLException {

		String orderId = decorationPaymentVO.getDecoration().getOrderId();
		float sumMoney = decorationPaymentVO.getReferMoney();

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_RESIGNED_INT });
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT};

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		short decorationStatus = decorationPO.getStatus();
		int company = decorationPO.getCompany();

		if (status.contains(decorationStatus)) {

			List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

			if (decorationPayments != null && decorationPayments.size() > 0) {
				throw new FLException(150001, "款项已付,不可修改");
			}

			List<PaymentScaleItemPO> paymentScaleItems = paymentScaleitemDao.queryPaymentScaleItemByPsid(decorationPaymentVO.getPsId());

			if (paymentScaleItems.size() <= DecorationPaymentPO.CHARSCALE_COUNT_INT) {
				throw new FLException(150037, "款项比例不正确");
			} else {

				decorationPaymentDao.deleteDecorationPaymentForBase(orderId);

				if (paymentScaleItems.size() == 1) {
					DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
					float all = Float.valueOf(paymentScaleItems.get(0).getScale());
					decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					UserPO user = userDao.queryUserByUserId(createUserId);
					decorationPayment.setCreater(user);
					decorationPayment.setReferMoney((float) (Math.floor(sumMoney * (all / 100))));
					decorationPayment.setPaymentType(paymentScaleItems.get(0).getName());
					decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
					decorationPayment.setDecoration(decorationPO);
					decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
					decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
					decorationPayment.setCompany(company);
					decorationPayment.setSort(paymentScaleItems.get(0).getSort());

					decorationPaymentDao.save(decorationPayment);
				} else {
					float totalMoney = 0;
					for (int i = 0; i < paymentScaleItems.size() - 1; i++) {

						DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
						float all = Float.valueOf(paymentScaleItems.get(i).getScale());
						decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
						UserPO user = userDao.queryUserByUserId(createUserId);
						decorationPayment.setCreater(user);
						float referMoney = (float) (Math.ceil((sumMoney * (all / 100)) / 100) * 100);
						decorationPayment.setReferMoney(referMoney);
						decorationPayment.setPaymentType(paymentScaleItems.get(i).getName());
						decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
						decorationPayment.setDecoration(decorationPO);
						decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
						decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
						decorationPayment.setCompany(company);
						decorationPayment.setSort(paymentScaleItems.get(i).getSort());

						decorationPaymentDao.save(decorationPayment);
						
						totalMoney += referMoney;
					}

					DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
					decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					UserPO user = userDao.queryUserByUserId(createUserId);
					decorationPayment.setCreater(user);
					decorationPayment.setReferMoney(sumMoney - totalMoney);
					decorationPayment.setPaymentType(paymentScaleItems.get(paymentScaleItems.size() - 1).getName());
					decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
					decorationPayment.setDecoration(decorationPO);
					decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
					decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
					decorationPayment.setCompany(company);
					decorationPayment.setSort(paymentScaleItems.get(paymentScaleItems.size() - 1).getSort());
					
					decorationPaymentDao.save(decorationPayment);
				}
			}

			decorationPO.setOrderTotalPrice(sumMoney);
			decorationDao.saveOrUpdate(decorationPO);

			return 0;
		} else {
			throw new FLException(150002, "合同已签订不可修改");
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeDecorationPaymentForTime(DecorationPaymentVO decorationPaymentVO, Timestamp dateTime, String userId) {

		Timestamp oldDateTime = null;
		Timestamp oldConfirmTime = null;

		String orderId = decorationPaymentVO.getDecoration().getOrderId();
		String paymentType = decorationPaymentVO.getPaymentType();

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, paymentType);
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if (decorationPaymentPO != null && (DecorationPaymentPO.PAYMENTSTATUS_PAY_INT == (decorationPaymentPO.getPaymentStatus()) || DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT == (decorationPaymentPO.getPaymentStatus()))) {
			oldDateTime = decorationReceiptPO.getCollectTime();

			decorationReceiptPO.setCollectTime(dateTime);

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
	public int collectDecorationPayment(DecorationPaymentVO decorationPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs, String userId, Integer company) throws FLException {

		//这里的realMoney保留是想用作之后的判断
		float realMoney = 0;
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());
		
		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}
		
		String orderId = decorationPaymentPO.getDecoration().getOrderId();
		short sort = decorationPaymentPO.getSort();
		float referMoney = decorationPaymentPO.getReferMoney();

		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

		if (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT != decorationPaymentPO.getPaymentStatus()) {
			throw new FLException(150036, "款项状态不可操作");
		}
		
		//装修款收款过程利用排序字段控制收款顺序
		if(sort > 1){
			DecorationPaymentPO prevDecorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAndSort(orderId, (short) (sort-1));
			
			if(prevDecorationPaymentPO != null){
				if(prevDecorationPaymentPO.getPaymentStatus() == (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT)){
					throw new FLException(150009, "前置款项未处理");
				}
			}
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		String paymentType = decorationPaymentPO.getPaymentType();

		if (decorationPO.getStatus() == DecorationPO.STATUS_INIT_INT) {
			decorationPO.setStatus(DecorationPO.STATUS_DEPOSIT_INT);
			decorationPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (paymentType.contains(DecorationPaymentPO.PAYMENTTYPE_REFUND_STR) || paymentType.equals(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR)) {
			decorationReceiptPO.setType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);
		} else {
			decorationReceiptPO.setType(DecorationReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}

		Float advance = decorationPaymentVO.getAdvance();

		if (advance != null && advance != 0) {
			decorationReceiptPO.setAdvance(decorationPaymentVO.getAdvance());
		}

		Float coupon = decorationPaymentVO.getCoupon();

		if (coupon != null && coupon.floatValue() != 0f) {
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
			realMoney = Arith.add(coupon, realMoney);
		}

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);

		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();

		if (cash != null && cash.floatValue() != 0f) {
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}
		if (bank != null && bank.floatValue() != 0f) {
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		}
		if (checkv != null && checkv.floatValue() != 0f) {
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBank(decorationPaymentVO.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		}
		if (advance != null && advance.floatValue() != 0f) {
			decorationReceiptPO.setAdvance(advance);
			decorationReceiptPO.setAdvanceType(decorationPaymentVO.getAdvanceType());
			realMoney = Arith.add(advance, realMoney);
		}

		if (decorationPaymentPO.getReferMoney() != realMoney) {
			throw new FLException(150008, "款项不能进行收款");
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		UserPO user = userDao.queryUserByUserId(userId);

		decorationReceiptPO.setCollecter(user);
		decorationReceiptPO.setCollecterName(user.getCurrentName());
		decorationReceiptPO.setComment(decorationPaymentVO.getComment());

		if (decorationPaymentPO.getOneType() == DecorationPaymentPO.ONETYPE_ADD_INT && decorationPaymentPO.getTwoType() == DecorationPaymentPO.TWOTYPE_DEAL_INT) {

			short decorationPayScale = Short.valueOf(String.format("%.0f", Arith.add(referMoney / decorationPO.getOrderTotalPrice() * 100, decorationPO.getPaySacle())));
			
			if(decorationPayScale < 100){
				decorationPO.setPaySacle(decorationPayScale);
			}else if(decorationPayScale >= 100){
				decorationPO.setPaySacle((short) 100);
			}
			
			decorationDao.update(decorationPO);
		}

		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);
		decorationPaymentPO.setCompany(company);

		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);

		if (advance != null && advance != 0) {

			int advanceType = decorationPaymentVO.getAdvanceType();
			float customerAdvance = 0f;
			Short _paymentType = 0;

			CustomerPO customerPO = decorationPO.getCustomer();

			if (customerPO == null) {
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCid(), decorationPO.getCompany());

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

			paymentVO.setUniqueid("D" + decorationReceiptPO.getDrId());

			advancePaymentService.updateAdvancePayment(paymentVO, decorationPO.getCompany());
		}

		if (DecorationPaymentPO.PAYMENTTYPE_ADD_STR.equals(paymentType)) {
			AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(decorationPaymentPO.getDpid());
			addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);

			addReduceDao.update(addReducePO);
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());

		if (decorationPO.getSupervisor() != null) {
			short num = MessagePO.MESSAGE_TYPE_PAYMENT_STR;
			messageService.sendMessage(decorationPO.getSupervisor().getUserId(), "", String.format("订单:%s,地址:%s %s,款项金额:%s,%s完成收款", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber(), decorationPaymentPO.getReferMoney(), decorationPaymentPO.getPaymentType()), num, decorationPO.getCompany());
		}
		
		decorationService.sendMessage(decorationPaymentPO.getDecoration().getOrderId(), "装修单", String.format("装修交款金额%s元", decorationPaymentPO.getReferMoney()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId, Integer company) throws FLException {

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

		if (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT != decorationPaymentPO.getPaymentStatus()) {
			throw new FLException(150012, "款项不能进行退款");
		}

		float real = 0f;

		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float coupon = decorationPaymentVO.getCoupon();

		if (cash != null && cash.floatValue() != 0f) {
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			real = Arith.add(real, cash);
		}
		if (bank != null && bank.floatValue() != 0f) {
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			real = Arith.add(real, bank);
		}
		if (checkv != null && checkv.floatValue() != 0f) {
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBank(decorationPaymentVO.getCheckvBank());
			real = Arith.add(real, checkv);
		}
		if (coupon != null && coupon.floatValue() != 0f) {
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
			real = Arith.add(real, coupon);
		}

		if (!(Math.abs(Arith.sub(decorationPaymentPO.getReferMoney(), real)) < 0.00000001)) {
			throw new FLException(150013, "款项实收金额不等于应收金额");
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		UserPO user = userDao.queryUserByUserId(userId);
		decorationReceiptPO.setCollecter(user);
		decorationReceiptPO.setCollecterName(user.getCurrentName());
		decorationReceiptPO.setComment(decorationPaymentVO.getComment());
		decorationReceiptPO.setType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);
		decorationPaymentPO.setCompany(company);

		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);

		if (DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(decorationPaymentPO.getPaymentType())) {
			AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(decorationPaymentPO.getDpid());
			addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);

			addReduceDao.update(addReducePO);
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());
		
		decorationService.sendMessage(decorationPaymentPO.getDecoration().getOrderId(), "装修单", String.format("装修退款金额%s元", decorationPaymentPO.getReferMoney()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmDecorationPayment(List<Long> ids, String confirmUserId) throws FLException {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByDpids(ids);

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			if (DecorationPaymentPO.PAYMENTSTATUS_PAY_INT == decorationPaymentPO.getPaymentStatus()) {

				DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

				decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT);
				decorationReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				UserPO user = userDao.queryUserByUserId(confirmUserId);
				decorationReceiptPO.setConfirmer(user);
				decorationReceiptPO.setCollecterName(user.getCurrentName());

				if (decorationReceiptPO.getStatus() != DecorationReceiptPO.STATUS_CONFIRM_INT) {
					decorationReceiptPO.setStatus((short) DecorationReceiptPO.STATUS_CONFIRM_INT);
				}

				decorationReceiptDao.update(decorationReceiptPO);
				decorationPaymentDao.update(decorationPaymentPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException {

		float realMoney = 0;

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getDpid());

		if (decorationPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if (DecorationPaymentPO.PAYMENTSTATUS_PAY_INT != decorationPaymentPO.getPaymentStatus()) {
			throw new FLException(150036, "款项状态不可操作");
		}

		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float coupon = decorationPaymentVO.getCoupon();
		Float advance = decorationPaymentVO.getAdvance();

		if (cash != null && cash.floatValue() != 0f) {
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		} else {
			decorationReceiptPO.setCash(0f);
			decorationReceiptPO.setCashInfo("");
		}
		if (bank != null && bank.floatValue() != 0f) {
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		} else {
			decorationReceiptPO.setBank(0f);
			decorationReceiptPO.setBankInfo("");
		}
		if (checkv != null && checkv.floatValue() != 0f) {
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBank(decorationPaymentVO.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		} else {
			decorationReceiptPO.setCheckv(0f);
			decorationReceiptPO.setCheckvBank("");
		}
		if (coupon != null && coupon.floatValue() != 0f) {
			realMoney = Arith.add(coupon, realMoney);
		}
		if (advance != null && advance.floatValue() != 0f) {
			realMoney = Arith.add(advance, realMoney);
		}

		if (decorationPaymentPO.getReferMoney() != realMoney) {
			throw new FLException(150025, "款项金额不正确");
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());

		decorationReceiptDao.update(decorationReceiptPO);

		return 0;
	}

	@Override
	public int deleteDecorationPaymentById(DecorationPaymentVO payment) {
		return 0;
	}

	private DecorationPaymentVO changePOToVO(DecorationPaymentPO decorationPaymentPO) {
		DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO(new DecorationVO());
		BeanUtil.copyProperties(decorationPaymentPO, decorationPaymentVO, Arrays.asList("decoration", "decorationReceipt", "creater"));

		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if (decorationReceiptPO != null) {
			BeanUtil.copyProperties(decorationReceiptPO, decorationPaymentVO, Arrays.asList("collecter", "confirmer", "creater"));

			if (decorationReceiptPO.getCollecter() != null) {
				decorationPaymentVO.setCollecter(new UserBaseVO());
				BeanUtil.copyProperties(decorationReceiptPO.getCollecter(), decorationPaymentVO.getCollecter(), Arrays.asList("duty", "dept"));
			}

			if (decorationReceiptPO.getConfirmer() != null) {
				decorationPaymentVO.setConfirmer(new UserBaseVO());
				BeanUtil.copyProperties(decorationReceiptPO.getConfirmer(), decorationPaymentVO.getConfirmer(), Arrays.asList("duty", "dept"));
			}
		}

		BeanUtil.copyProperties(decorationPaymentPO, decorationPaymentVO, Arrays.asList("decoration", "creater", "collecter", "confirmer"));
		decorationPaymentPO.getDecoration().ptvcascade(decorationPaymentVO.getDecoration());

		return decorationPaymentVO;
	}

	private void pageDecorationPayment(Paging paging, List<Filter> filters) {

		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = null;

		decorationPaymentPOs = decorationPaymentDao.pageDecorationPaymentForCollect(paging, filters);

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			DecorationPaymentVO decorationPaymentVO = changePOToVO(decorationPaymentPO);
			decorationPaymentVOs.add(decorationPaymentVO);
		}

		paging.setData(decorationPaymentVOs);
	}

}
