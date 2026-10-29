package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface SalesPaymentService {

	public void pageSalesPayment(Paging paging, List<Filter> filters, SalesPaymentVO salesPaymentVO, int company, String companyType) throws FLException;

	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO);

	public List<SalesPaymentVO> querySalesPaymentByOrderId(SalesPaymentVO salesPaymentVO, List<Filter> filters, int company, String companyType) throws FLException;

	public List<SalesPaymentVO> querySalesPaymentForNotInitBySrid(SalesReceiptVO salesReceipt);

	public SalesPaymentVO querySalesPaymentBySpid(SalesPaymentVO salesPayment);

	public long amountSalesPayment(SalesPaymentVO salesPayment);

	public int addSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO, String userId, int company) throws FLException;

	public int addSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO, String userId, int company) throws FLException;

	public int addSalesPaymentForRefunds(SalesPaymentVO salesPaymentVO, String userId) throws FLException;

	public int collectSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, List<Long> ptids, String userId, Integer company) throws FLException;

	public int settleSalesPayment(SalesPaymentVO salesPaymentVO, String userId, Integer company) throws FLException;

	public int collectSalesPayments(List<Long> spids, SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, List<Long> ptids, String userId, Integer company) throws FLException;

	public int refundSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, String userId, Integer company) throws FLException;

	public int withdrawSalesPayment(SalesPaymentVO salesPaymentVO, String userId, Integer company) throws FLException;

	/**
	 * 销售撤款直执行(去审批): 按单内款项类型分派——
	 * type=8不可退定金已确认 → 定金不退撤单(建type=7退款行+销售单废单+定金清零+预结算对冲);
	 * type=3补款已确认 → 对冲撤款(建type=5补款退款行+退款收据+退回主材预付款余额, 前置活动积分校验);
	 * 两类皆无 → 150036无可撤款项。
	 */
	public int cancelSalesPayment(SalesPaymentVO salesPaymentVO, String userId, Integer company) throws FLException;

	public int confirmSalesPayment(List<Long> spids, String userId) throws FLException;

	public int affirmSalesPayment(SalesPaymentVO salesPayment, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;

	public int cancelSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO) throws FLException;

	public int cancelSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO) throws FLException;

	public int refundSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO, String userId) throws FLException;

	public int refundSalesPaymentForCoupon(SalesVO salesVO, String userId) throws FLException;

	public void updateSalesPayment(SalesPaymentVO salesPayment, SalesReceiptVO salesReceipt) throws FLException;

	public void sendSalesPayment(SalesPaymentVO salesPayment) throws FLException;

	public void pushSalesPayment(SalesPaymentVO salesPayment) throws FLException;

}
