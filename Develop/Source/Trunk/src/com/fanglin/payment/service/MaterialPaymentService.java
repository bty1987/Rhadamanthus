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
import java.util.Map;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.MaterialReceiptVO;
import com.fanglin.utils.Paging;

public interface MaterialPaymentService {
	
	public void pageMaterialPaymentBySubOrder(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialPaymentForCollectBySubOrder(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialPaymentForConfirmBySubOrder(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialPaymentForNotInitBySubOrder(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialPayment(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialPaymentByMsoId(Paging paging, List<FilterVO> filters, MaterialPaymentVO materialPaymentVO);
	
	public void pageMaterialPaymentForInitByMsoId(Paging paging, List<FilterVO> filters, MaterialPaymentVO materialPaymentVO);
	
	public void pageMaterialPaymentByMsoIdAll(Paging paging, List<FilterVO> filters, MaterialPaymentVO materialPaymentVO);
	
	public void pageMaterialPaymentByOrderId(Paging paging, List<FilterVO> filters, MaterialPaymentVO materialPaymentVO);
	
	public List<MaterialPaymentVO> queryMaterialPayment(List<FilterVO> filters);
	
	public List<MaterialPaymentVO> queryMaterialPaymentByOrderId(MaterialPaymentVO materialPaymentVO);
	
	public List<MaterialPaymentVO> queryMaterialPaymentForInitByMsoId(MaterialPaymentVO materialPaymentVO);
	
	public List<MaterialPaymentVO> queryMaterialPaymentByMsoId(MaterialPaymentVO materialPaymentVO);
	
	public float queryMaterialPaymentForCouponByMsoId(MaterialPaymentVO materialPaymentVO);
	
	public Map<String, Object> queryMaterialPaymentByMpIds(List<Long> mpIds, String userId);
	
	public Map<String, Object> queryMaterialPaymentForNotInitByMrId(MaterialReceiptVO materialReceiptVO, String userId);
	
	public void addMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public void receMaterialPayment(MaterialPaymentVO materialPaymentVO);
	
	public int collectMaterialPayment(MaterialPaymentVO materialPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs, String userId) throws FLException;
	
	public int collectMaterialPayments(MaterialSubOrderVO materialSubOrderVO, List<MaterialPaymentVO> materialPaymentVOs, MaterialReceiptVO materialReceiptVO, String userId) throws FLException;
	
	public int collectMaterialRefundPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public int updateMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public void confirmMaterialPayment(List<Long> mpIds, String userId) throws FLException;
	
	public int cancelMaterialPayment(MaterialPaymentVO materialPaymentVO) throws FLException;
	
	public void refundMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException;
	
	public int refundMaterialPaymentForCoupon(MaterialSubOrderVO materialSubOrderVO, String userId, String userName) throws FLException;
	
	public int changeMaterialPaymentForTime(MaterialPaymentVO materialPaymentVO, Timestamp dateTime, String userId) throws FLException;

}
