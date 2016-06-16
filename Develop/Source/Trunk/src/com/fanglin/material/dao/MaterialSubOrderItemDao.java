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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.po.MaterialSubOrderItemPO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderItemDao extends Dao<MaterialSubOrderItemPO> {
	
	public List<MaterialSubOrderItemPO> pageMaterialSubOrderItemByMsoId(Paging paging, List<FilterVO> filters, long msoId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoIds(List<Long> msoIds);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoId(long msoId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoIdNotRefund(long msoId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMpId(long mpId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByMsoiIds(List<Long> msoiIds);
	
	public MaterialSubOrderItemPO queryMaterialSubOrderItemByMsoiId(long msoiId);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByName(long msoId, String name, int limit);
	
	public List<MaterialSubOrderItemPO> queryMaterialSubOrderItemByNo(long msoId, String msoNo, int limit);
	
	public void deleteMaterialSubOrderItemByMsoId(long msoId);

}
