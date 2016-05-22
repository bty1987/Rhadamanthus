/**
 * @File Name		: DecorationPaymentService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.DecorationReceiptVO;
import com.fanglin.utils.Paging;

public interface DecorationPaymentService {
	
	public void pageDecorationPaymentsForBaseByOrderId(Paging paging, DecorationPaymentVO decorationPaymentVO);
	
	public void pageDecorationPaymentForOtherByOrderId(Paging paging, DecorationPaymentVO decorationPaymentVO);

	public void pageDecorationPaymentForCommit(Paging paging, List<FilterVO> filters);

	public void pageDecorationPaymentForCollect(Paging paging, List<FilterVO> filters);
	
	public void pageDecorationPaymentForConfirm(Paging paging, List<FilterVO> filters);

	public void pageDecorationPaymentForHistory(Paging paging, List<FilterVO> filters);
	
	public void pageDecorationPaymentForChange(Paging paging, List<FilterVO> filters);
	
	public List<DecorationPaymentVO> queryDecorationPayments(List<FilterVO> filters);

	public DecorationPaymentVO queryDecorationPaymentById(long autoId);
	
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderId(DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> queryDecorationPaymentForBaseByOrderId(DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> queryDecorationPaymentByOrderIdAIds(List<Long> paymentIds, DecorationPaymentVO decorationPaymentVO, String userId);
	
	public List<DecorationPaymentVO> queryDecorationPaymentForBaseAConfirmByOrderId(DecorationPaymentVO decorationPaymentVO);
	
	public List<DecorationPaymentVO> queryDecorationPaymentForNotInitByDrId(DecorationReceiptVO decorationReceiptVO);
	
	public int addDecorationPaymentForOther(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int updateDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int updateDecorationPaymentForReferMoney(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int changeDecorationPaymentForStatus(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int changeDecorationPaymentForTime(DecorationPaymentVO decorationPaymentVO, Timestamp dateTime, String userId);
	
	public int convertDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int collectDecorationPayment(DecorationPaymentVO decorationPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs) throws FLException;

	public int confirmDecorationPayment(List<Long> paymentIds, String confirmUserId) throws FLException;
	
	public int makeDecorationPayment(DecorationPaymentVO decorationPaymentVO, String createUserId) throws FLException;

	public int refundDecorationPayment(DecorationPaymentVO decorationPaymentVO) throws FLException;
	
	public int refundDecorationPaymentForManage(DecorationPaymentVO decorationPaymentVO, String userId) throws FLException;
	
	public int deleteDecorationPaymentById(DecorationPaymentVO decorationPaymentVO);
	
}
