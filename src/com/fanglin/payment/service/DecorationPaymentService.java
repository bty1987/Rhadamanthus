/**
 * @File Name		: DecorationPaymentService
 * @Package   	: com.fanglin.service.decoration;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.DecorationReceiptVO;
import com.fanglin.utils.Paging;

public interface DecorationPaymentService {
	
	public void pageDecorationPaymentForCommit(Paging paging, List<Filter> filters, int company);
	
	public void pageDecorationPaymentForHistory(Paging paging, List<Filter> filters, int company);

	public void pageDecorationPaymentForCollect(Paging paging, List<Filter> filters, Integer company);
	
	public void pageDecorationPaymentForConfirm(Paging paging, List<Filter> filters, Integer company);
	
	public List<DecorationPaymentVO> queryDecorationPayment(List<Filter> filters, Integer company);

	public DecorationPaymentVO queryDecorationPaymentById(DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderId(DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> queryDecorationPaymentForContractByOrderId(DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> queryDecorationPaymentForNotInitByDrId(DecorationReceiptVO decorationReceiptVO);
	
	public void checkDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int addDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId) throws FLException;
	
	public int makeDecorationPayment(DecorationPO decorationPO, long money, long psid, String createUserId) throws FLException;
	
	public int changeDecorationPaymentForTime(DecorationPaymentVO decorationPaymentVO, Timestamp dateTime, String userId) throws FLException;
	
	public int collectDecorationPayment(DecorationPaymentVO decorationPaymentVO, List<Long> posids, String userId, Integer company) throws FLException;
	
	public int refundDecorationPayment(DecorationPaymentVO decorationPaymentVO, String userId, Integer company) throws FLException;

	public int confirmDecorationPayment(List<Long> paymentIds, String userId) throws FLException;
	
	public int updateDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int deleteDecorationPaymentById(DecorationPaymentVO decorationPaymentVO);

}
