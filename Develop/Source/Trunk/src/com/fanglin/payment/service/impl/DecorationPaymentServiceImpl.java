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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.PaymentScaleItemPO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
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
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationPaymentService")
@Transactional(readOnly = true)
public class DecorationPaymentServiceImpl implements DecorationPaymentService {

	@Autowired
	private DecorationOrderDao decorationOrderDao;

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

	@Override
	public void pageDecorationPaymentForCommit(Paging paging, List<Filter> filters){

		if(filters.size() == 0) return;

		filters.add(new Filter("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR, "eq"));

		pageDecorationPayment(paging, filters);
	}

	@Override
	public void pageDecorationPaymentForCollect(Paging paging, List<Filter> filters){

		if(filters.size() == 0) return;

		filters.add(new Filter("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_PAY_STR, "eq"));

		pageDecorationPayment(paging, filters);
	}

	@Override
	public void pageDecorationPaymentForConfirm(Paging paging, List<Filter> filters){

		if(filters.size() == 0) return;

		filters.add(new Filter("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR, "eq"));

		pageDecorationPayment(paging, filters);
	}

	@Override
	public void pageDecorationPaymentForHistory(Paging paging, List<Filter> filters){

		if(filters.size() == 0) return;

		filters.add(new Filter("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR, "ne"));

		pageDecorationPayment(paging, filters);
	}

	@Override
	public DecorationPaymentVO queryDecorationPaymentById(long autoId){
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(autoId);
		DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();

		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

		BeanUtil.copyProperties(decorationPaymentPO, decorationPaymentVO);
		decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
		decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

		decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
		decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
		decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());

		decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
		decorationPaymentVO.setContractTime(decorationOrderPO.getContractTime());

		return decorationPaymentVO;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderId(DecorationPaymentVO decorationPaymentVO) {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPaymentVO.getOrderId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for(DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = changePOToVO(decorationPaymentPO);

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}

	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForNotInitByDrId(DecorationReceiptVO decorationReceiptVO) {

		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentForNotInitByDrId(decorationReceiptVO.getDrId());

		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO);

			DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();

			_decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
			_decorationPaymentVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			_decorationPaymentVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			_decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());

			_decorationPaymentVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_decorationPaymentVO.setOrderStatus(decorationOrderPO.getStatus());

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}
	
	@Override
	public List<DecorationPaymentVO> queryDecorationPaymentForContractByOrderId(DecorationPaymentVO decorationPaymentVO) {
		
		String[] paymentStatus = new String[]{DecorationPaymentPO.PAYMENTSTATUS_PAY_STR,DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR};

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPaymentVO.getOrderId(),paymentStatus,DecorationPaymentPO.ONETYPE_ADD_INT,DecorationPaymentPO.TWOTYPE_DEAL_INT);
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		for(DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = changePOToVO(decorationPaymentPO);

			decorationPaymentVOs.add(_decorationPaymentVO);
		}

		return decorationPaymentVOs;
	}
	
	@Override
	public void checkDecorationPayment(long autoId) throws FLException{

		DecorationPaymentPO decorationPayment = decorationPaymentDao.get(autoId);
		
		//判断当前款项是否为:未收款  状态
		if(!decorationPayment.getPaymentStatus().equals(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR)){
			throw new FLException(150008, "款项不能进行收款");
		}

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId) throws FLException {

		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationPaymentVO.getOrderId());

		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}

		List<String> status = Arrays.asList(DecorationPaymentPO.PAYMENTTYPE_ADD_STR, 
				DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR, DecorationPaymentPO.PAYMENTTYPE_ADVANCE_STR, 
				DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR, DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
		
		if(status.contains(decorationPaymentVO.getPaymentType())){
			throw new FLException(150034, "款项类型不可用");
		}

		DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();

		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		UserPO user = userDao.queryUserByUserId(userId);
		decorationPaymentPO.setCreateUserPO(user);
		decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
		decorationPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
		decorationPaymentPO.setTwoType(decorationPaymentVO.getTwoType());
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
		decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);

		decorationPaymentDao.save(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int makeDecorationPayment(DecorationPaymentVO decorationPaymentVO, String createUserId) throws FLException{

		String orderId = decorationPaymentVO.getOrderId();
		float sumMoney = decorationPaymentVO.getReferMoney();

		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR});
		String[] paymentStatus = new String[]{DecorationPaymentPO.PAYMENTSTATUS_PAY_STR,DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR,DecorationPaymentPO.PAYMENTSTATUS_APPLY_STR};

		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);

		String decorationOrderStatus = decorationOrderPO.getStatus();

		if(status.contains(decorationOrderStatus)){

			List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationOrderPO.getOrderId(),paymentStatus,DecorationPaymentPO.ONETYPE_ADD_INT,DecorationPaymentPO.TWOTYPE_DEAL_INT);

			if(decorationPayments != null && decorationPayments.size() > 0){
				throw new FLException(150001, "款项已付,不可修改");
			}

			List<PaymentScaleItemPO>  paymentScaleItems = paymentScaleitemDao.queryPaymentScaleItemByPsid(decorationPaymentVO.getPsId());

			if(paymentScaleItems.size() <= DecorationPaymentPO.CHARSCALE_COUNT_INT){				
				throw new FLException(150037, "款项比例不正确");				
			}else{

				decorationPaymentDao.deleteDecorationPaymentForBase(orderId);

				if(paymentScaleItems.size() == 1){
					DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
					float all = Float.valueOf(paymentScaleItems.get(0).getScale());
					decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					UserPO user = userDao.queryUserByUserId(createUserId);
					decorationPayment.setCreateUserPO(user);
					decorationPayment.setReferMoney((float) (Math.ceil((sumMoney * (all / 100)) / 100) * 100));
					decorationPayment.setPaymentType(paymentScaleItems.get(0).getName());
					decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
					decorationPayment.setDecorationOrderPO(decorationOrderPO);
					decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
					decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
					decorationPaymentDao.save(decorationPayment);
				}else{
					float totalMoney = 0;
					for(int i=0 ; i<paymentScaleItems.size()-1; i++){
						DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
						float all = Float.valueOf(paymentScaleItems.get(i).getScale());
						decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
						UserPO user = userDao.queryUserByUserId(createUserId);
						decorationPayment.setCreateUserPO(user);
						float referMoney = (float) (Math.ceil((sumMoney * (all / 100)) / 100) * 100);
						decorationPayment.setReferMoney(referMoney);
						decorationPayment.setPaymentType(paymentScaleItems.get(i).getName());
						decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
						decorationPayment.setDecorationOrderPO(decorationOrderPO);
						decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
						decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
						decorationPaymentDao.save(decorationPayment);
						totalMoney += referMoney;
					}

					DecorationPaymentPO decorationPayment = new DecorationPaymentPO();
					decorationPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					UserPO user = userDao.queryUserByUserId(createUserId);
					decorationPayment.setCreateUserPO(user);
					decorationPayment.setReferMoney(sumMoney-totalMoney);
					decorationPayment.setPaymentType(paymentScaleItems.get(paymentScaleItems.size()-1).getName());
					decorationPayment.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
					decorationPayment.setDecorationOrderPO(decorationOrderPO);
					decorationPayment.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
					decorationPayment.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
					decorationPaymentDao.save(decorationPayment);
				}
			}

			decorationOrderPO.setOrderTotalPrice(sumMoney);
			decorationOrderDao.saveOrUpdate(decorationOrderPO);

			return 0;
		} else {
			throw new FLException(150002, "合同已签订不可修改");
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException{

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());

		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if(!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150008, "款项不能进行收款");
		}

		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float accounts = decorationPaymentVO.getAccounts();
		Float installment = decorationPaymentVO.getInstallment();
		Float coupon = decorationPaymentVO.getCoupon();

		if(cash != null && cash.floatValue() != 0f){
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
		}else{
			decorationReceiptPO.setCash(0f);
			decorationReceiptPO.setCashInfo("");
		}
		if(bank != null && bank.floatValue() != 0f){
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
		}else{
			decorationReceiptPO.setBank(0f);
			decorationReceiptPO.setBankInfo("");
		}
		if(checkv != null && checkv.floatValue() != 0f){
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBankName(decorationPaymentVO.getCheckvBankName());
		}else{
			decorationReceiptPO.setCheckv(0f);
			decorationReceiptPO.setCheckvBankName("");
		}
		if(accounts != null && accounts.floatValue() != 0f){
			decorationReceiptPO.setAccounts(accounts);
			decorationReceiptPO.setAccountsBankName(decorationPaymentVO.getAccountsBankName());
		}else{
			decorationReceiptPO.setAccounts(0f);
			decorationReceiptPO.setAccountsBankName("");
		}
		if(installment != null && installment.floatValue() != 0f){
			decorationReceiptPO.setInstallment(installment);
			decorationReceiptPO.setInstallmentBankName(decorationPaymentVO.getInstallmentBankName());
		}else{
			decorationReceiptPO.setInstallment(0f);
			decorationReceiptPO.setInstallmentBankName("");
		}
		if(coupon != null && coupon.floatValue() != 0f){
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
		}else{
			decorationReceiptPO.setCoupon(0f);
			decorationReceiptPO.setCouponInfo("");
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		UserPO user = userDao.queryUserByUserId(decorationPaymentVO.getCollectUserId());
		decorationReceiptPO.setCollectUserPO(user);
		decorationReceiptPO.setDes(decorationPaymentVO.getDes());

		decorationReceiptDao.update(decorationReceiptPO);
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationPaymentForTime(DecorationPaymentVO decorationPaymentVO, Timestamp dateTime, String userId){

		Timestamp oldDateTime = null;
		Timestamp oldConfirmTime = null;

		String orderId = decorationPaymentVO.getOrderId();
		String paymentType = decorationPaymentVO.getPaymentType();

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, paymentType);
		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if(decorationPaymentPO != null && (DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus()) || DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPO.getPaymentStatus()))){
			oldDateTime = decorationReceiptPO.getCollectTime();

			decorationReceiptPO.setCollectTime(dateTime);

			if(decorationReceiptPO.getConfirmTime().before(dateTime)){
				oldConfirmTime = decorationReceiptPO.getConfirmTime();

				decorationReceiptPO.setConfirmTime(dateTime);
			}

			decorationReceiptDao.update(decorationReceiptPO);
			decorationPaymentDao.update(decorationPaymentPO);

			String info = String.format("订单编号:%s,修改款项类型:%s,原收款时间:%s,修改时间为:%s", orderId, paymentType, oldDateTime.toString(), dateTime);

			if(oldConfirmTime != null){
				info = String.format("%s,原确认时间:%s", info, oldConfirmTime.toString());
			}

			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONPAYMENT_TIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(info);

			serviceRecordDao.save(serviceRecordPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectDecorationPayment(DecorationPaymentVO decorationPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs) throws FLException{

		float realMoney = 0;

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());

		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

		if(!DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150008, "款项不能进行收款");
		}

		//设置装修订单状态
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationPaymentPO.getDecorationOrderPO().getOrderId());

		String paymentType = decorationPaymentPO.getPaymentType();

		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_QUOTATION_STR});
		if(status.contains(decorationOrderPO.getStatus())){
			decorationOrderPO.setStatus(DecorationOrderPO.STATUS_DEPOSIT_STR);
			decorationOrderPO.setDepositTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if(paymentType.contains(DecorationPaymentPO.PAYMENTTYPE_REFUND_STR) || paymentType.equals(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR)){
			decorationReceiptPO.setReceiptType(DecorationReceiptPO.RECEIPT_TYPE_REFUND_INT);
		}else{
			decorationReceiptPO.setReceiptType(DecorationReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}

		Float advance = decorationPaymentVO.getAdvance();

		if(advance != null && advance != 0){

			int advanceType = decorationPaymentVO.getAdvanceType();
			float customerAdvance = 0f;
			String _paymentType = "";

			CustomerPO customerPO = decorationOrderPO.getCustomerPO();

			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCustomerId(),decorationOrderPO.getCompany());

			if(advancePaymentPO == null){
				throw new FLException(150010, "预付款余额不足");
			}

			if(advanceType == DecorationPaymentPO.ADVANCETYPE_TYPE_BALANCE_INT){
				customerAdvance = advancePaymentPO.getBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_BALANCE_STR;
			}else if(advanceType == DecorationPaymentPO.ADVANCETYPE_TYPE_PROJECT_INT){
				customerAdvance = advancePaymentPO.getProjectBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_PROJECT_STR;
			}

			PaymentVO paymentVO  = new PaymentVO();

			paymentVO = PaymentServiceImpl.advancePaymentBalance(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR,advance, _paymentType, customerAdvance, decorationPaymentVO.getCollectUserId(), decorationPaymentPO.getDecorationOrderPO().getCustomerPO().getId(), advancePaymentPO, decorationOrderPO.getOrderId());

			advancePaymentService.updateAdvancePayment(paymentVO,decorationOrderPO.getCompany());

			decorationReceiptPO.setAdvance(decorationPaymentVO.getAdvance());
		}


		Float coupon = decorationPaymentVO.getCoupon();

		if(coupon != null && coupon.floatValue() != 0f){

			//			float _coupon = 0f;
			//			StringBuffer couponInfo = new StringBuffer("#");
			//			
			//			String _couponInfo = "%s:%d:%d#";
			//			
			//			for(DecorationActivityItemVO decorationActivityItemVO: decorationActivityItemVOs){
			//				DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
			//				
			//				if(decorationActivityItemPO == null){
			//					throw new FLException(140030, "订单活动物品不存在");
			//				}
			//				
			//				if(decorationActivityItemPO.getNum() < decorationActivityItemVO.getNum()){
			//					throw new FLException(150023, "券数量不足");
			//				}
			//				
			//				decorationActivityItemPO.setNum((int) Arith.sub(decorationActivityItemPO.getNum(), decorationActivityItemVO.getNum()));
			//				
			//				_coupon = Arith.add(_coupon, Arith.mul(decorationActivityItemVO.getNum(), decorationActivityItemPO.getMoney()));
			//				
			//				couponInfo.append(String.format(_couponInfo, decorationActivityItemPO.getActivityItemName(), decorationActivityItemVO.getNum(), decorationActivityItemVO.getDaiId()));
			//				
			//				decorationActivityItemDao.update(decorationActivityItemPO);
			//			}
			//			
			//			if(_coupon != coupon){
			//				throw new FLException(150024, "券总金额与券统计金额不等");
			//			}
			//			
			//			decorationPaymentPO.setCoupon(_coupon);
			//			decorationPaymentPO.setCouponInfo(couponInfo.toString());
			//			
			//			realMoney = Arith.add(_coupon, realMoney);

			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
		}

		decorationOrderDao.update(decorationOrderPO);

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);

		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float accounts = decorationPaymentVO.getAccounts();
		Float installment = decorationPaymentVO.getInstallment();

		if(cash != null && cash.floatValue() != 0f){
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}
		if(bank != null && bank.floatValue() != 0f){
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		}
		if(checkv != null && checkv.floatValue() != 0f){
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBankName(decorationPaymentVO.getCheckvBankName());
			realMoney = Arith.add(checkv, realMoney);
		}
		if(accounts != null && accounts.floatValue() != 0f){
			decorationReceiptPO.setAccounts(accounts);
			decorationReceiptPO.setAccountsBankName(decorationPaymentVO.getAccountsBankName());
			realMoney = Arith.add(accounts, realMoney);
		}
		if(installment != null && installment.floatValue() != 0f){
			decorationReceiptPO.setInstallment(installment);
			decorationReceiptPO.setInstallmentBankName(decorationPaymentVO.getInstallmentBankName());
			realMoney = Arith.add(installment, realMoney);
		}
		if(advance != null && advance.floatValue() != 0f){
			decorationReceiptPO.setAdvance(advance);
			decorationReceiptPO.setAdvanceType(decorationPaymentVO.getAdvanceType());
			realMoney = Arith.add(advance, realMoney);
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		UserPO user = userDao.queryUserByUserId(decorationPaymentVO.getCollectUserId());
		decorationReceiptPO.setCollectUserPO(user);
		decorationReceiptPO.setDes(decorationPaymentVO.getDes());

		decorationPaymentPO.setRealMoney(realMoney);
		decorationPaymentPO.setPaymentBlance(realMoney);
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);

		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);

		if(DecorationPaymentPO.PAYMENTTYPE_ADD_STR.equals(paymentType)){
			AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(decorationPaymentPO.getAutoId());
			addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);

			addReduceDao.update(addReducePO);
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());
		if(decorationOrderPO.getSupervisorPO() != null){
			short num = MessagePO.MESSAGE_TYPE_PAYMENT_STR;
			messageService.sendMessage(decorationOrderPO.getSupervisorPO().getUserId(), "", String.format("订单:%s,地址:%s %s,款项金额:%s,%s完成收款", decorationOrderPO.getOrderId(), decorationOrderPO.getVillagePO().getVillageName(), decorationOrderPO.getHouseNumber(), decorationPaymentPO.getReferMoney(),decorationPaymentPO.getPaymentType()),num,decorationOrderPO.getCompany());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectDecorationPaymentForRefund(DecorationPaymentVO decorationPaymentVO) throws FLException{

		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(decorationPaymentVO.getAutoId());

		if(decorationPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

		if(!DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR.equals(decorationPaymentPO.getPaymentStatus())){
			throw new FLException(150012, "款项不能进行退款");
		}

		float real = 0f;

		Float cash = decorationPaymentVO.getCash();
		Float bank = decorationPaymentVO.getBank();
		Float checkv = decorationPaymentVO.getCheckv();
		Float accounts = decorationPaymentVO.getAccounts();
		Float installment = decorationPaymentVO.getInstallment();
		Float coupon = decorationPaymentVO.getCoupon();
		
		if(cash != null && cash.floatValue() != 0f){
			decorationReceiptPO.setCash(cash);
			decorationReceiptPO.setCashInfo(decorationPaymentVO.getCashInfo());
			real = Arith.add(real, cash);
		}
		if(bank != null && bank.floatValue() != 0f){
			decorationReceiptPO.setBank(bank);
			decorationReceiptPO.setBankInfo(decorationPaymentVO.getBankInfo());
			real = Arith.add(real, bank);
		}
		if(checkv != null && checkv.floatValue() != 0f){
			decorationReceiptPO.setCheckv(checkv);
			decorationReceiptPO.setCheckvBankName(decorationPaymentVO.getCheckvBankName());
			real = Arith.add(real, checkv);
		}
		if(accounts != null && accounts.floatValue() != 0f){
			decorationReceiptPO.setAccounts(accounts);
			decorationReceiptPO.setAccountsBankName(decorationPaymentVO.getAccountsBankName());
			real = Arith.add(real, accounts);
		}
		if(installment != null && installment.floatValue() != 0f){
			decorationReceiptPO.setInstallment(installment);
			decorationReceiptPO.setInstallmentBankName(decorationPaymentVO.getInstallmentBankName());
			real = Arith.add(real, installment);
		}		
		if(coupon != null && coupon.floatValue() != 0f){
			decorationReceiptPO.setCoupon(coupon);
			decorationReceiptPO.setCouponInfo(decorationPaymentVO.getCouponInfo());
			real = Arith.add(real, coupon);
		}

		if(!(Math.abs(Arith.sub(decorationPaymentPO.getReferMoney(), real)) < 0.00000001)){
			throw new FLException(150013, "款项实收金额不等于应收金额");
		}

		decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		UserPO user = userDao.queryUserByUserId(decorationPaymentVO.getCollectUserId());
		decorationReceiptPO.setCollectUserPO(user);
		decorationReceiptPO.setDes(decorationPaymentVO.getDes());

		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);
		decorationPaymentPO.setPaymentBlance(real);
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
		decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);

		decorationReceiptDao.save(decorationReceiptPO);
		decorationPaymentDao.update(decorationPaymentPO);

		if(DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR.equals(decorationPaymentPO.getPaymentType())){
			AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(decorationPaymentPO.getAutoId());
			addReducePO.setStatus(AddReducePO.STATUS_PAYED_INT);

			addReduceDao.update(addReducePO);
		}

		decorationPaymentVO.setDrId(decorationReceiptPO.getDrId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int confirmDecorationPayment(List<Long> ids, String confirmUserId) throws FLException{

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByIds(ids);

		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			if(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus())){

				DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

				decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR);
				decorationReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				UserPO user = userDao.queryUserByUserId(confirmUserId);
				decorationReceiptPO.setConfirmUserPO(user);

				if(decorationReceiptPO.getStatus() != DecorationReceiptPO.STATUS_CONFIRM_INT){
					decorationReceiptPO.setStatus((short) DecorationReceiptPO.STATUS_CONFIRM_INT);
				}

				decorationReceiptDao.save(decorationReceiptPO);
				decorationPaymentDao.save(decorationPaymentPO);
			}
		}

		return 0;
	}

	@Override
	public int deleteDecorationPaymentById(DecorationPaymentVO payment){
		return 0;
	}

	private DecorationPaymentVO changePOToVO(DecorationPaymentPO decorationPaymentPO){
		DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();
		BeanUtil.copyProperties(decorationPaymentPO, decorationPaymentVO);

		DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();

		if(decorationReceiptPO != null){
			BeanUtil.copyProperties(decorationReceiptPO, decorationPaymentVO);

			if(decorationReceiptPO.getCollectUserPO() != null){
				UserPO collectUser = decorationReceiptPO.getCollectUserPO();

				decorationPaymentVO.setCollectUserId(collectUser.getUserId());
				decorationPaymentVO.setCollectUser(collectUser.getCurrentName());
			}else{
				decorationPaymentVO.setCollectUserId("");
				decorationPaymentVO.setCollectUser("");
			}

			if(decorationReceiptPO.getConfirmUserPO() != null){
				UserPO confirmUser = decorationReceiptPO.getConfirmUserPO();

				decorationPaymentVO.setConfirmUserId(confirmUser.getUserId());
				decorationPaymentVO.setConfirmUser(confirmUser.getCurrentName());
			}else{
				decorationPaymentVO.setConfirmUserId("");
				decorationPaymentVO.setConfirmUser("");
			}
		}

		DecorationOrderPO decorationOrderPO = decorationPaymentPO.getDecorationOrderPO();
		CustomerPO customerPO = decorationOrderPO.getCustomerPO();
		VillagePO villagePO = decorationOrderPO.getVillagePO();
		UserPO designer = decorationOrderPO.getDesignerPO();
		UserPO salesman = decorationOrderPO.getSalesmanPO();

		decorationPaymentVO.setOrderId(decorationOrderPO.getOrderId());
		decorationPaymentVO.setCustomerId(customerPO.getCustomerId());
		decorationPaymentVO.setCustomer(customerPO.getCustomerName());
		decorationPaymentVO.setVillage(villagePO.getVillageName());
		decorationPaymentVO.setHouseNumber(decorationOrderPO.getHouseNumber());
		decorationPaymentVO.setDesigner(designer.getCurrentName());
		decorationPaymentVO.setDesignerDepartment(designer.getDept().getDeptName());
		decorationPaymentVO.setSalesman(salesman.getCurrentName());
		decorationPaymentVO.setOrderTotalPrice(decorationPaymentPO.getDecorationOrderPO().getOrderTotalPrice());
		decorationPaymentVO.setOrderStatus(decorationPaymentPO.getDecorationOrderPO().getStatus());

		return decorationPaymentVO;
	}

	private void pageDecorationPayment(Paging paging, List<Filter> filters){

		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();
		List<DecorationPaymentPO> decorationPaymentPOs = null;

		decorationPaymentPOs = decorationPaymentDao.pageDecorationPaymentForCollect(paging, filters);

		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationPaymentVO decorationPaymentVO = changePOToVO(decorationPaymentPO);
			decorationPaymentVOs.add(decorationPaymentVO);
		}

		paging.setData(decorationPaymentVOs);
	}

}
