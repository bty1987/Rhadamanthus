/**
 * @File Name		: MaterialSubOrderItemDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.material.po.MaterialSubOrderItemPO;

public interface MaterialSubOrderItemDao extends Dao<MaterialSubOrderItemPO> {
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoIds(List<Long> msoIds);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoId(long msoId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoIdNotRefund(long msoId);
		
	public MaterialSubOrderItemPO queryMaterialSubOrderItemByMsoiId(long msoiId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByName(long msoId, String name, int limit);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByNo(long msoId, String msoNo, int limit);
	
	public void deleteMaterialSubOrderItemByMsoId(long msoId);

}
