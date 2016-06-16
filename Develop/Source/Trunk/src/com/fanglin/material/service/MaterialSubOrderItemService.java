/**
 * @File Name		: MaterialSubOrderItemService.java
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderItemService {
	
	public void pageMaterialSubOrderItemByMsoId(Paging paging, List<FilterVO> filters, long msoId);
	
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByOrderId(String orderId);
	
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByMsoId(long msoId);
	
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByMsoiIds(List<Long> msoiIds);
	
	public MaterialSubOrderItemVO queryMaterialSubOrderItemForSaleByMsoiId(MaterialSubOrderItemVO materialSubOrderItemVO);
	
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemForNoPackageByMsoiId(List<Long> msoiIds);
	
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemForNameByName(MaterialSubOrderItemVO materialSubOrderItemVO);
	
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemForNameByNo(MaterialSubOrderItemVO materialSubOrderItemVO);
	
	public int addMaterialSubOrderItem(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs) throws FLException;
	
	public void updateMaterialSubOrderItemForModel(MaterialSubOrderVO materialSubOrderVO, MaterialSubOrderItemVO materialSubOrderItemVO) throws FLException;
	
	public void updateMaterialSubOrderItemForPackage(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs) throws FLException;
	
	public void updateMaterialSubOrderItemForPrePT(List<Long> msoiIds, MaterialSubOrderItemVO materialSubOrderItemVO);
	
	public void updateMaterialSubOrderItemForPostPT(List<Long> msoiIds, MaterialSubOrderItemVO materialSubOrderItemVO);
	
	public int refundMaterialSubOrderItemForModel(MaterialSubOrderVO materialSubOrderVO, MaterialSubOrderItemVO materialSubOrderItemVO, long msoId, String userId, String userName);
	
	public int refundMaterialSubOrderItemForPackage(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs, long msoId, String userId, String userName);
	
	public int changeMaterialSubOrderItemForCaclType(MaterialSubOrderItemVO materialSubOrderItemVO, String userId) throws FLException;
	
	public int deleteMaterialSubOrderItem(List<Long> msoiIds, long msoId) throws FLException;

}
