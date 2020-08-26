package com.fanglin.payment.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.utils.Paging;

public interface SalesPaymentService {

	public void pageSalesPaymentForInit(Paging paging, List<Filter> filters, int company, String companyType);
	
	public void pageSalesPaymentForNotInit(Paging paging, List<Filter> filters, int company, String companyType);
	
	public void pageSalesPaymentForCollect(Paging paging, List<Filter> filters, int company);
	
	public void pageSalesPaymentForConfirm(Paging paging, List<Filter> filters, int company);
	
	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO);
	
	public List<SalesPaymentVO> querySalesPaymentByOrderId(SalesPaymentVO salesPaymentVO, List<Filter> filters, int company, String companyType);
	
	public List<SalesPaymentVO> querySalesPaymentForNotInitBySrid(SalesReceiptVO salesReceipt);
	
	public int addSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO, String userId, int company) throws FLException;
	
	public int addSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO, String userId, int company) throws FLException;
	
	public int collectSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, List<Long> posids, String userId, Integer company) throws FLException;
	
	public int collectSalesPayments(List<Long> spids, SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, List<Long> posids, String userId, Integer company) throws FLException;
	
	public int refundSalesPayment(SalesPaymentVO salesPaymentVO, SalesReceiptVO salesReceiptVO, String userId, Integer company) throws FLException;

	public int confirmSalesPayment(List<Long> spids, String userId) throws FLException;
	
	public int cancelSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO) throws FLException;
	
	public int cancelSalesPaymentForFullpay(SalesPaymentVO salesPaymentVO) throws FLException;
	
	public int refundSalesPaymentForDeposit(SalesPaymentVO salesPaymentVO, String userId) throws FLException;
	
	public int refundSalesPaymentForCoupon(SalesVO salesVO, String userId) throws FLException;

	public void updateSalesPayment(SalesPaymentVO salesPayment, SalesReceiptVO salesReceipt) throws FLException;

}
