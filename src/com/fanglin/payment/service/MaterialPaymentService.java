/**
 * @File Name		: MaterialPaymentService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.MaterialReceiptVO;
import com.fanglin.utils.Paging;

public interface MaterialPaymentService {
	
	public void pageMaterialPaymentForInit(Paging paging, List<Filter> filters);
	
	public void pageMaterialPaymentForCollect(Paging paging, List<Filter> filters);
	
	public void pageMaterialPaymentForConfirm(Paging paging, List<Filter> filters);
	
	public void pageMaterialPaymentForNotInit(Paging paging, List<Filter> filters);
	
	public List<MaterialPaymentVO> queryMaterialPaymentByOrderId(MaterialPaymentVO materialPaymentVO);
	
	public List<MaterialPaymentVO> queryMaterialPaymentByMid(MaterialPaymentVO materialPaymentVO);
	
	public List<MaterialPaymentVO> queryMaterialPaymentForNotInitByMrId(MaterialReceiptVO materialReceiptVO, String userId);
	
	public void checkMaterialPayment(MaterialPaymentVO materialPaymentVO) throws FLException;
	
	public void addMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public int collectMaterialPayment(MaterialPaymentVO materialPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs, String userId) throws FLException;
	
	public int collectMaterialPayments(MaterialVO materialVO, List<MaterialPaymentVO> materialPaymentVOs, MaterialReceiptVO materialReceiptVO, String userId) throws FLException;
	
	public int collectMaterialPaymentForRefund(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public int updateMaterialPayment(MaterialPaymentVO materialPaymentVO,MaterialReceiptVO materialReceiptVO) throws FLException;
	
	public void confirmMaterialPayment(List<Long> mpIds, String userId) throws FLException;
	
	public int cancelMaterialPayment(MaterialPaymentVO materialPaymentVO) throws FLException;
	
	public void refundMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public int refundMaterialPaymentForCoupon(MaterialVO materialVO, String userId) throws FLException;
	
	public int changeMaterialPaymentForTime(MaterialPaymentVO materialPaymentVO, Timestamp dateTime, String userId) throws FLException;

}
