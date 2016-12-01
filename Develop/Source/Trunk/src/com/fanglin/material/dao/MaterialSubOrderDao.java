/**
 * @File Name		: MaterialSubOrderDao.java
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
import com.fanglin.core.vo.Filter;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderDao extends Dao<MaterialSubOrderPO> {
	
	public List<MaterialSubOrderPO> pageMaterialSubOrder(Paging paging, List<Filter> filters);
	
	public List<MaterialSubOrderPO> pageMaterialSubOrderByOrderId(Paging paging, List<Filter> filters, String orderId);
	
	public List<MaterialSubOrderPO> pageMaterialSubOrderPreBalance(Paging paging, List<Filter> filters);
	
	public List<MaterialSubOrderPO> pageMaterialSubOrderPostBalance(Paging paging, List<Filter> filters);
	
	public List<MaterialSubOrderPO> queryMaterialSubOrder(List<Filter> filters);
	
	public List<MaterialSubOrderPO> queryMaterialSubOrderByMsoId(List<Long> msoIds);
	
	public List<MaterialSubOrderPO> queryMaterialSubOrderByOrderId(String orderId);
	
	public MaterialSubOrderPO queryMaterialSubOrderByMsoNo(String msoNo);
	
}
