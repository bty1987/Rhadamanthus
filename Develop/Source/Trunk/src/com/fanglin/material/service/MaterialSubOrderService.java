/**
 * @File Name		: MaterialSubOrderService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderService {
	
	public void pageMaterialSubOrder(Paging paging, List<Filter> filters);
	
	public void pageMaterialSubOrderByUserId(Paging paging, List<Filter> filters, String orderId, String userId);
	
	public void pageMaterialSubOrderByOrderId(Paging paging, List<Filter> filters, String orderId);
	
	public void pageMaterialSubOrderByOrderIdADeptId(Paging paging, List<Filter> filters, String orderId, String userId);
	
	public void pageMaterialSubOrderByOrderIdInstoreId(Paging paging, List<Filter> filters, String orderId, String userId);
	
	public void pageMaterialSubOrderForPreBalance(Paging paging, List<Filter> filters, String userId);
	
	public void pageMaterialSubOrderForPostBalance(Paging paging, List<Filter> filters);
	
	public MaterialSubOrderVO queryMaterialSubOrderByMsoId(MaterialSubOrderVO materialSubOrderVO);
	
	public int addMaterialSubOrder(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs, String userId) throws FLException;
	
	public void updateMaterialSubOrderForPreBalancePT(MaterialSubOrderVO materialSubOrderVO, int caclType);
	
	public void updateMaterialSubOrderMaling(MaterialSubOrderVO materialSubOrderVO);
	
	public void updateMaterialSubOrderForCoupon(MaterialSubOrderVO materialSubOrderVO);
	
	public void deliverMaterialSubOrder(MaterialSubOrderVO materialSubOrderVO, String userId) throws FLException ;
	
	public int changeMaterialSubOrderForOrderId(String msoNo, String orderId, String userId) throws FLException;
	
	public void passBalanceMaterialSubOrder(List<Long> msoIds);
	
	public void preBalanceMaterialSubOrder(List<Long> msoIds, String userId, String userName);
	
	public void postBalanceMaterialSubOrder(MaterialSubOrderVO materialSubOrderVO, String userId, String userName) throws FLException;
	
	public int deleteMaterialSubOrder(long msoId) throws FLException;

}