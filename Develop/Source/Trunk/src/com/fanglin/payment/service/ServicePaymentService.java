package com.fanglin.payment.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.AdvanceReceiptPO;
import com.fanglin.payment.vo.AdvanceReceiptVO;
import com.fanglin.payment.vo.ServicePaymentVO;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.utils.Paging;

public interface ServicePaymentService {
	
	public void pageServicePaymentForCollect(Paging paging, List<Filter> filters);
	
	public void pageServicePaymentForConfirm(Paging paging, List<Filter> filters);
	
	public void pageServicePaymentForNotInit(Paging paging, List<Filter> filters);
	
	public int confirmServicePayment(List<Long> spids,String userId) throws FLException;

	public int collectServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String userId) throws FLException;
	
	public AdvanceReceiptPO addAdvanceReceipt(AdvanceReceiptVO advanceReceiptVO,String userId) throws FLException;
	
	public int addServicePayment(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,AdvanceReceiptVO advanceReceiptVO,String cuid) throws FLException;
	
	public int addServiceCharge(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String cuid) throws FLException;
	
	public int collectServicePaymentForRefund(ServicePaymentVO servicePaymentVO,ServiceReceiptVO serviceReceiptVO,String cuid) throws FLException;
}
