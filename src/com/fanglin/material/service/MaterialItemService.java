/**
 * @File Name		: MaterialItemService.java
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
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.material.vo.MaterialVO;

public interface MaterialItemService {
	
	public List<MaterialItemVO> queryMaterialItemByOrderId(String orderId);
	
	public List<MaterialItemVO> queryMaterialItemByMid(MaterialItemVO materialItemVO);
	
	public Float queryMaterialItemByTotal(MaterialItemVO materialItem);
	
	public MaterialItemVO queryMaterialItemForSaleByMiid(MaterialItemVO materialItemVO);
	
	public List<MaterialItemVO> queryMaterialItemForNameByName(MaterialItemVO materialItemVO);
	
	public List<MaterialItemVO> queryMaterialItemForNameByNo(MaterialItemVO materialItemVO);
	
	public int addMaterialItem(MaterialVO materialVO, List<MaterialItemVO> materialItemVOs) throws FLException;
	
	public void updateMaterialItemForModel(MaterialVO materialVO, MaterialItemVO materialItemVO) throws FLException;
	
	public void updateMaterialItemForPackage(MaterialVO materialVO, List<MaterialItemVO> materialItemVOs) throws FLException;
	
	public void updateMaterialItemForPrePT(List<Long> miids, MaterialItemVO materialItemVO);
	
	public int changeMaterialItemForCaclType(MaterialItemVO materialItemVO, String userId) throws FLException;
	
	public int deleteMaterialItem(List<Long> miids, long mid) throws FLException;
	


}
