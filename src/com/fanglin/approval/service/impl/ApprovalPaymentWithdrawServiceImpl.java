package com.fanglin.approval.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalPaymentWithdrawDao;
import com.fanglin.approval.po.ApprovalPaymentWithdrawPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalPaymentWithdrawService;
import com.fanglin.approval.vo.ApprovalPaymentWithdrawVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.dingding.service.DingTalkApprovalService;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.impl.AdvancePaymentServiceImpl;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

@Service("approvalPaymentWithdrawService")
@Transactional(readOnly = true)
public class ApprovalPaymentWithdrawServiceImpl implements ApprovalPaymentWithdrawService {

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private ApprovalPaymentWithdrawDao approvalPaymentWithdrawDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvanceReceiptDao advanceReceiptDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Autowired
	private MessageService messageService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DingTalkApprovalService approvalService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForPaymentWithdraw(ApprovalVO approvalVO, ApprovalPaymentWithdrawVO approvalPaymentWithdrawVO, String userId, int company, String code, String forms) throws FLException {

		String orderId = approvalPaymentWithdrawVO.getOrderId();
		short paymentType = approvalPaymentWithdrawVO.getPaymentType();
		long amount = approvalPaymentWithdrawVO.getAmount();

		// 1. 防重校验: 同一订单存在审批中的预付款提现,不可重复提交
		List<Short> status = Arrays.asList(ApprovalPO.APPROVAL_STATUS_INIT_INT, ApprovalPO.APPROVAL_STATUS_APPROVE_INT, ApprovalPO.APPROVAL_STATUS_CONFIRM_INT, ApprovalPO.APPROVAL_STATUS_CONFIRMED_INT, ApprovalPO.APPROVAL_STATUS_REJECT_INT);
		ApprovalPO existApproval = approvalDao.queryApprovalByChange(status, ApprovalPO.APPROVAL_TYPE_PAYMENT_WITHDRAW_INT, orderId);
		if (existApproval != null) {
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}

		// 2. 校验装修订单
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		// 3. 查询预付款记录
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);
		if (advancePaymentPO == null) {
			throw new FLException(150010, "预付款余额不足");
		}

		// 4. 获取对应类型余额并校验
		long balance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);
		if (balance < amount) {
			throw new FLException(150010, "预付款余额不足");
		}

		// 5. 预扣余额(冻结)
		long overBalance = Arith.sub(balance, amount);
		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, overBalance);
		advancePaymentDao.update(advancePaymentPO);

		// 6. 构造审批内容描述
		String typeName = getPaymentTypeName(paymentType);
		String content = String.format("装修单号:%s,提现类型:%s,金额:%.3f", orderId, typeName, Arith.div(amount, 1000.0));

		// 7. 创建审批主记录
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		ApprovalPO approvalPO = new ApprovalPO().init(sender, receiver, orderId, orderId, ApprovalPO.APPROVAL_TYPE_PAYMENT_WITHDRAW_INT, content, approvalVO.getComment(), company);
		approvalDao.save(approvalPO);

		// 8. 创建审批子记录
		ApprovalPaymentWithdrawPO approvalPaymentWithdrawPO = new ApprovalPaymentWithdrawPO();
		approvalPaymentWithdrawPO.setAid(approvalPO.getAid());
		approvalPaymentWithdrawPO.setOrderId(orderId);
		approvalPaymentWithdrawPO.setPaymentType(paymentType);
		approvalPaymentWithdrawPO.setAmount(amount);
		approvalPaymentWithdrawPO.setComment(approvalPaymentWithdrawVO.getComment());

		approvalPaymentWithdrawDao.save(approvalPaymentWithdrawPO);

		// 9. 发送站内通知
		messageService.sendMessage(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), approvalPO.getContents(), MessagePO.TYPE_SEND_APPROVAL_INT, company);

		// 10. 钉钉审批集成
		if (code != null && !"".equals(code)) {
			String piid = approvalService.initiateApproval(code, userId, null, null, null, JSONArray.parseArray(forms), company);
			approvalPO.setPiid(piid);
			approvalDao.update(approvalPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approveForPaymentWithdraw(ApprovalPO approvalPO) throws FLException {

		// 1. 查询审批子记录
		ApprovalPaymentWithdrawPO approvalPaymentWithdrawPO = approvalPaymentWithdrawDao.queryApprovalPaymentWithdrawByAId(approvalPO.getAid());
		if (approvalPaymentWithdrawPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		String orderId = approvalPaymentWithdrawPO.getOrderId();
		short paymentType = approvalPaymentWithdrawPO.getPaymentType();
		long amount = approvalPaymentWithdrawPO.getAmount();

		// 2. 校验订单和客户
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		long customerId = decorationPO.getCustomer().getCid();
		CustomerPO customerPO = customerDao.get(customerId);
		if (customerPO == null) {
			throw new FLException(230001, "客户信息不存在");
		}

		// 3. 查询当前余额(提交时已预扣,此处获取的是扣除后的余额)
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);
		if (advancePaymentPO == null) {
			throw new FLException(150010, "预付款余额不足");
		}

		long currentBalance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);

		// 4. 创建预付款收据
		AdvanceReceiptPO advanceReceiptPO = new AdvanceReceiptPO();
		advanceReceiptPO.setCollecter(approvalPO.getSender());
		advanceReceiptPO.setCollecterName(approvalPO.getSender().getUserName());
		advanceReceiptPO.setConfirmerName("");
		advanceReceiptPO.setRealMoney(amount);
		advanceReceiptPO.setType(AdvanceReceiptPO.STATUS_RECEIPTTYPE_INT);
		advanceReceiptPO.setStatus(AdvanceReceiptPO.STATUS_COLLRCT_INT);
		advanceReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		advanceReceiptPO.setTransfer(amount);
		advanceReceiptPO.setComment(approvalPaymentWithdrawPO.getComment());

		advanceReceiptDao.save(advanceReceiptPO);

		// 5. 创建支付记录
		PaymentPO paymentPO = new PaymentPO();
		paymentPO.setCustomer(customerPO);
		paymentPO.setAdvanceReceipt(advanceReceiptPO);
		paymentPO.setOrderId(orderId);
		paymentPO.setBalance(currentBalance);
		paymentPO.setRecharge(amount);
		paymentPO.setType(PaymentPO.PAYMENT_TYPE_EXTRACT_INT);
		paymentPO.setPaymentType(paymentType);
		paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
		paymentPO.setCompany(decorationPO.getCompany());
		paymentPO.setCreater(approvalPO.getSender());
		paymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		paymentDao.save(paymentPO);

		// 6. 主材预付款提现,更新装修单销售比例
		if (paymentType == PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_INT) {
			decorationAdditionService.updateDecorationForSaleScale(new DecorationVO(orderId));
		}

		// 7. 发送通知
		String typeName = getPaymentTypeName(paymentType);
		decorationService.sendMessage(orderId, typeName, String.format("%s退款金额%.3f元", typeName, Arith.div(amount, 1000.0)), String.format("pages/payment/receipt/receipt?orderId=%s&rid=%s&paymentType=0", orderId, paymentPO.getPid()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refuseForPaymentWithdraw(ApprovalPO approvalPO) throws FLException {

		// 1. 查询审批子记录
		ApprovalPaymentWithdrawPO approvalPaymentWithdrawPO = approvalPaymentWithdrawDao.queryApprovalPaymentWithdrawByAId(approvalPO.getAid());
		if (approvalPaymentWithdrawPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		String orderId = approvalPaymentWithdrawPO.getOrderId();
		short paymentType = approvalPaymentWithdrawPO.getPaymentType();
		long amount = approvalPaymentWithdrawPO.getAmount();

		// 2. 查询预付款记录
		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);
		if (advancePaymentPO == null) {
			throw new FLException(150010, "预付款余额不存在");
		}

		// 3. 回退预扣余额: 当前余额 + 提现金额
		long currentBalance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, paymentType);
		long revertBalance = Arith.add(currentBalance, amount);
		AdvancePaymentServiceImpl.setCustomerBalanceByType(advancePaymentPO, paymentType, revertBalance);

		// 4. 更新预付款记录
		advancePaymentDao.update(advancePaymentPO);

		return 0;
	}

	private String getPaymentTypeName(short paymentType) {
		switch ((int) paymentType) {
		case 0:
			return "合同预付款";
		case 1:
			return "工程预付款";
		case 2:
			return "主材预付款";
		case 3:
			return "正林预付款";
		default:
			return "预付款";
		}
	}

}
