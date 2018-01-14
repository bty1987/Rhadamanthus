/**
 * @File Name		: MaterialService.java
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
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.utils.Paging;

public interface MaterialService {
	
	public void pageMaterial(Paging paging, List<Filter> filters);
	
	public void pageMaterialByUserId(Paging paging, List<Filter> filters, String orderId, String userId);
	
	public void pageMaterialByOrderId(Paging paging, List<Filter> filters, String orderId,String userId);
	
	public void pageMaterialForAdvance(Paging paging, List<Filter> filters, String orderId);
	
	public void pageMaterialForPreBalance(Paging paging, List<Filter> filters, String userId, int company);
	
	public void pageMaterialForPostBalance(Paging paging, List<Filter> filters, int company);
	
	public MaterialVO queryMaterialByMid(MaterialVO materialVO);
	
	public MaterialVO queryMaterialByNo(MaterialVO materialVO) throws FLException;
	
	public int addMaterial(MaterialVO materialVO, List<MaterialItemVO> materialItemVOs, String userId, int company) throws FLException;
	
	public void updateMaterialMaling(MaterialVO materialVO);
	
	public void updateMaterialForCoupon(MaterialVO materialVO);
	
	public int changeMaterialForOrderId(String no, String orderId, String userId) throws FLException;
	
	public void passBalanceMaterial(List<Long> mids);
	
	public void preBalanceMaterial(List<Long> mids, String userId, String userName);
	
	public void postBalanceMaterial(MaterialVO materialVO, String userId, String userName) throws FLException;
	
	public int deleteMaterial(long mid) throws FLException;
	
}