package com.fanglin.payment.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
//import com.fanglin.inventory.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface SalesPaymentService {

	public void pageSalesPaymentForInit(Paging paging, List<Filter> filters);
	
	public void pageSalesPaymentForCollect(Paging paging, List<Filter> filters);
	
	public void pageSalesPaymentForConfirm(Paging paging, List<Filter> filters);
	
	public void pageSalesPaymentForNotInit(Paging paging, List<Filter> filters);
	
	public List<SalesPaymentVO> querySalesPaymentBySid(SalesPaymentVO salesPaymentVO);
	
	public List<SalesPaymentVO> querySalesPaymentForNotInitBySrid(SalesReceiptVO salesReceipt);
	
	public int addSalesPayment(SalesPaymentVO salesPaymentVO,String cuid) throws FLException;
	
	public int collectSalesPayment(SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException;
	
	public int collectSalesPayments(List<Long> spids,SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException;

	public int confirmSalesPayment(List<Long> spids,String userId) throws FLException;
	
	public int cancelSalesPayment(SalesPaymentVO salesPaymentVO) throws FLException;
	
	public int refundSalesPayment(SalesPaymentVO salesPaymentVO,String cuid) throws FLException;
	
	public int collectSalesPaymentForRefund(SalesPaymentVO salesPaymentVO,SalesReceiptVO salesReceiptVO,String userId) throws FLException;
	
}
